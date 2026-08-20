"""Read-only MCP collector for registered server projects."""

import argparse
import json
import logging
import os
import re
import shutil
import socket
import subprocess
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Literal
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastmcp import FastMCP


LOGGER = logging.getLogger("workspace-ops")
SAFE_ID = re.compile(r"^[A-Za-z0-9_-]{1,64}$")
REDACTIONS = [
    re.compile(r"(?i)(authorization|cookie|set-cookie|password|passwd|token|api[-_]?key)\s*[:=]\s*[^\s,;]+"),
    re.compile(r"(?i)bearer\s+[A-Za-z0-9._~+/=-]+"),
]
STATUS_RANK = {"HEALTHY": 0, "ATTENTION": 1, "UNKNOWN": 2, "FAULT": 3}
MAX_LOG_LINES = 20
MAX_LOG_CHARS = 500

mcp = FastMCP("workspace-ops")


def _registry_path() -> Path:
    configured = os.environ.get("WORKSPACE_OPS_TARGETS_FILE")
    return Path(configured) if configured else Path(__file__).with_name("workspace-ops-targets.json")


def _load_registry() -> dict[str, Any]:
    with _registry_path().open("r", encoding="utf-8") as handle:
        registry = json.load(handle)
    if not isinstance(registry.get("targets"), list):
        raise RuntimeError("operations target registry is invalid")
    return registry


def _authorized_target(workspace_id: str, target_id: str | None = None) -> dict[str, Any]:
    if not SAFE_ID.fullmatch(workspace_id or ""):
        raise ValueError("business validation: invalid workspace_id")
    for target in _load_registry()["targets"]:
        if not target.get("enabled", False) or workspace_id not in target.get("workspaceIds", []):
            continue
        if target_id is None or target.get("targetId") == target_id:
            return target
    raise ValueError("business validation: target is not available to this workspace")


def _run(arguments: list[str], timeout: int = 8) -> tuple[int, str, str]:
    try:
        result = subprocess.run(arguments, capture_output=True, text=True, timeout=timeout, check=False)
        return result.returncode, result.stdout.strip(), result.stderr.strip()
    except (OSError, subprocess.TimeoutExpired) as error:
        return 127, "", str(error)


def _redact(value: str) -> str:
    clean = value.replace("\x00", " ")
    for pattern in REDACTIONS:
        clean = pattern.sub(lambda match: match.group(1) + "=[REDACTED]" if match.lastindex else "[REDACTED]", clean)
    return clean[:MAX_LOG_CHARS]


class SnapshotBuilder:
    def __init__(self) -> None:
        self.sequence = 0
        self.expected = 0
        self.collected = 0

    def evidence(self, category: str, name: str, status: str, observed: Any = None,
                 error: str | None = None) -> dict[str, Any]:
        self.sequence += 1
        self.expected += 1
        if error is None:
            self.collected += 1
        return {
            "evidenceId": f"EV-{self.sequence:04d}",
            "category": category,
            "name": name,
            "status": status,
            "observedValue": observed,
            "error": _redact(error) if error else None,
        }

    @property
    def completeness(self) -> float:
        return round(self.collected / self.expected, 3) if self.expected else 0.0


def _worst_status(checks: list[dict[str, Any]]) -> str:
    statuses = [str(check.get("status", "UNKNOWN")) for check in checks]
    return max(statuses, key=lambda value: STATUS_RANK.get(value, STATUS_RANK["UNKNOWN"]), default="UNKNOWN")


def _cpu_percent() -> float | None:
    def sample() -> tuple[int, int]:
        fields = Path("/proc/stat").read_text(encoding="ascii").splitlines()[0].split()[1:]
        numbers = [int(value) for value in fields]
        idle = numbers[3] + (numbers[4] if len(numbers) > 4 else 0)
        return sum(numbers), idle

    try:
        total_a, idle_a = sample()
        time.sleep(0.15)
        total_b, idle_b = sample()
        delta = total_b - total_a
        return round(100 * (1 - (idle_b - idle_a) / delta), 1) if delta > 0 else None
    except (OSError, ValueError, IndexError):
        return None


def _memory() -> dict[str, float] | None:
    try:
        values: dict[str, int] = {}
        for line in Path("/proc/meminfo").read_text(encoding="ascii").splitlines():
            key, raw = line.split(":", 1)
            values[key] = int(raw.strip().split()[0])
        total = values["MemTotal"]
        available = values["MemAvailable"]
        swap_total = values.get("SwapTotal", 0)
        swap_free = values.get("SwapFree", 0)
        return {
            "totalMiB": round(total / 1024, 1),
            "availableMiB": round(available / 1024, 1),
            "usedPercent": round(100 * (total - available) / total, 1),
            "swapUsedMiB": round((swap_total - swap_free) / 1024, 1),
            "swapTotalMiB": round(swap_total / 1024, 1),
        }
    except (OSError, ValueError, KeyError):
        return None


def _host_snapshot(builder: SnapshotBuilder, target: dict[str, Any]) -> dict[str, Any]:
    thresholds = target.get("thresholds", {})
    checks: list[dict[str, Any]] = []
    cpu = _cpu_percent()
    if cpu is None:
        checks.append(builder.evidence("host", "CPU", "UNKNOWN", None, "unable to read /proc/stat"))
    else:
        cpu_status = "FAULT" if cpu >= thresholds.get("cpuFaultPercent", 95) else (
            "ATTENTION" if cpu >= thresholds.get("cpuAttentionPercent", 80) else "HEALTHY")
        checks.append(builder.evidence("host", "CPU", cpu_status, cpu))
    memory = _memory()
    if memory is None:
        checks.append(builder.evidence("host", "memory", "UNKNOWN", None, "unable to read /proc/meminfo"))
    else:
        used = memory["usedPercent"]
        status = "FAULT" if used >= thresholds.get("memoryFaultPercent", 95) else (
            "ATTENTION" if used >= thresholds.get("memoryAttentionPercent", 85) else "HEALTHY")
        checks.append(builder.evidence("host", "memory", status, memory))
    try:
        disk = shutil.disk_usage("/")
        used_percent = round(100 * disk.used / disk.total, 1)
        disk_value = {"usedPercent": used_percent, "freeGiB": round(disk.free / 1024 ** 3, 2)}
        disk_status = "FAULT" if used_percent >= thresholds.get("diskFaultPercent", 92) else (
            "ATTENTION" if used_percent >= thresholds.get("diskAttentionPercent", 80) else "HEALTHY")
        checks.append(builder.evidence("host", "root filesystem", disk_status, disk_value))
    except OSError as error:
        checks.append(builder.evidence("host", "root filesystem", "UNKNOWN", None, str(error)))
    try:
        load = Path("/proc/loadavg").read_text(encoding="ascii").split()[:3]
        checks.append(builder.evidence("host", "load average", "HEALTHY", [float(value) for value in load]))
    except (OSError, ValueError):
        checks.append(builder.evidence("host", "load average", "UNKNOWN", None, "unable to read /proc/loadavg"))
    code, output, error = _run(["systemctl", "--failed", "--no-legend", "--plain"])
    if code in (0, 1):
        units = [line.split()[0] for line in output.splitlines() if line.strip()][:30]
        checks.append(builder.evidence("host", "failed systemd units", "FAULT" if units else "HEALTHY", units))
    else:
        checks.append(builder.evidence("host", "failed systemd units", "UNKNOWN", None, error))
    return {"status": _worst_status(checks), "checks": checks}


def _service_check(builder: SnapshotBuilder, unit: str) -> dict[str, Any]:
    code, output, error = _run(["systemctl", "show", unit, "--no-pager",
                                "--property=ActiveState,SubState,NRestarts,ExecMainStatus"])
    if code != 0:
        return builder.evidence("service", unit, "UNKNOWN", None, error or output)
    values = dict(line.split("=", 1) for line in output.splitlines() if "=" in line)
    active = values.get("ActiveState") == "active"
    return builder.evidence("service", unit, "HEALTHY" if active else "FAULT", values)


def _container_check(builder: SnapshotBuilder, name: str) -> dict[str, Any]:
    arguments = ["docker", "inspect", "--format",
                 "{\"state\":{{json .State}},\"restartCount\":{{.RestartCount}}}", name]
    code, output, error = _run(arguments)
    if code != 0:
        code, output, error = _run(["sudo", "-n", *arguments])
    if code != 0:
        return builder.evidence("container", name, "UNKNOWN", None, error or output)
    try:
        details = json.loads(output)
        state = details["state"]
        running = bool(state.get("Running"))
        health = (state.get("Health") or {}).get("Status")
        status = "HEALTHY" if running and health in (None, "healthy") else "FAULT"
        observed = {"running": running, "status": state.get("Status"), "health": health,
                    "restartCount": details.get("restartCount", 0)}
        return builder.evidence("container", name, status, observed)
    except json.JSONDecodeError as parse_error:
        return builder.evidence("container", name, "UNKNOWN", None, str(parse_error))


def _http_check(builder: SnapshotBuilder, category: str, check: dict[str, Any]) -> dict[str, Any]:
    started = time.monotonic()
    request = Request(check["url"], headers={"User-Agent": "workspace-ops/1.0"})
    try:
        with urlopen(request, timeout=5) as response:
            status_code = response.status
        latency = round((time.monotonic() - started) * 1000)
        expected = check.get("expectedStatuses", [200])
        status = "HEALTHY" if status_code in expected else "FAULT"
        return builder.evidence(category, check["name"], status,
                                {"statusCode": status_code, "latencyMs": latency})
    except HTTPError as error:
        expected = check.get("expectedStatuses", [200])
        status = "HEALTHY" if error.code in expected else "FAULT"
        return builder.evidence(category, check["name"], status,
                                {"statusCode": error.code, "latencyMs": round((time.monotonic() - started) * 1000)})
    except (URLError, OSError, TimeoutError) as error:
        return builder.evidence(category, check["name"], "FAULT", None, str(error))


def _tcp_check(builder: SnapshotBuilder, check: dict[str, Any]) -> dict[str, Any]:
    started = time.monotonic()
    try:
        with socket.create_connection((check["host"], int(check["port"])), timeout=5):
            pass
        return builder.evidence("dependency", check["name"], "HEALTHY",
                                {"reachable": True, "latencyMs": round((time.monotonic() - started) * 1000)})
    except (OSError, ValueError) as error:
        return builder.evidence("dependency", check["name"], "FAULT", None, str(error))


def _logs(builder: SnapshotBuilder, units: list[str], lookback_minutes: int) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    for unit in units:
        code, output, error = _run(["journalctl", "-u", unit, "--since", f"{lookback_minutes} minutes ago",
                                    "-p", "warning..alert", "--no-pager", "-n", str(MAX_LOG_LINES), "-o", "short-iso"], 10)
        if code != 0:
            results.append(builder.evidence("log", unit, "UNKNOWN", None, error or output))
            continue
        lines = [_redact(line) for line in output.splitlines() if line.strip() and "-- No entries --" not in line]
        results.append(builder.evidence("log", unit, "ATTENTION" if lines else "HEALTHY",
                                        {"warningCount": len(lines), "entries": lines[:MAX_LOG_LINES]}))
    return results


def _project_snapshot(builder: SnapshotBuilder, project: dict[str, Any], lookback_minutes: int,
                      inspection_mode: str, include_logs: bool) -> dict[str, Any]:
    checks = [_service_check(builder, unit) for unit in project.get("serviceUnits", [])]
    checks.extend(_container_check(builder, name) for name in project.get("containerNames", []))
    if inspection_mode != "QUICK":
        checks.extend(_http_check(builder, "endpoint", endpoint) for endpoint in project.get("endpoints", []))
        for dependency in project.get("dependencies", []):
            checks.append(_http_check(builder, "dependency", dependency) if dependency.get("type") == "http"
                          else _tcp_check(builder, dependency))
    if include_logs and inspection_mode in ("STANDARD", "DIAGNOSTIC"):
        checks.extend(_logs(builder, project.get("serviceUnits", []), lookback_minutes))
    return {
        "projectId": project["projectId"],
        "displayName": project["displayName"],
        "status": _worst_status(checks),
        "checks": checks,
    }


@mcp.tool()
def list_targets(workspace_id: str) -> dict[str, Any]:
    """List operations targets and registered projects available to a workspace."""
    _authorized_target(workspace_id)
    targets = []
    for target in _load_registry()["targets"]:
        if target.get("enabled", False) and workspace_id in target.get("workspaceIds", []):
            targets.append({
                "targetId": target["targetId"],
                "displayName": target["displayName"],
                "environment": target.get("environment"),
                "projects": [{"projectId": project["projectId"], "displayName": project["displayName"]}
                             for project in target.get("projects", [])],
            })
    return {"workspaceId": workspace_id, "targets": targets}


@mcp.tool()
def collect_ops_snapshot(
    workspace_id: str,
    target_id: str,
    project_ids: list[str],
    lookback_minutes: int = 60,
    inspection_mode: Literal["QUICK", "STANDARD", "DIAGNOSTIC"] = "STANDARD",
    include_logs: bool = True,
) -> dict[str, Any]:
    """Collect a deterministic, read-only snapshot for registered server projects."""
    if not SAFE_ID.fullmatch(target_id or ""):
        raise ValueError("business validation: invalid target_id")
    if not 15 <= lookback_minutes <= 1440:
        raise ValueError("business validation: lookback_minutes must be between 15 and 1440")
    target = _authorized_target(workspace_id, target_id)
    registered = {project["projectId"]: project for project in target.get("projects", [])}
    selected_ids = list(registered) if not project_ids or "*" in project_ids else list(dict.fromkeys(project_ids))
    if not selected_ids or any(not SAFE_ID.fullmatch(value or "") or value not in registered for value in selected_ids):
        raise ValueError("business validation: project_ids contain an unregistered project")

    LOGGER.info("Collecting target=%s projects=%s mode=%s lookback=%s logs=%s",
                target_id, len(selected_ids), inspection_mode, lookback_minutes, include_logs)
    started = time.monotonic()
    builder = SnapshotBuilder()
    host = _host_snapshot(builder, target)
    projects = [_project_snapshot(builder, registered[project_id], lookback_minutes, inspection_mode, include_logs)
                for project_id in selected_ids]
    overall_status = _worst_status([host, *projects])
    return {
        "schemaVersion": "1.0",
        "snapshotId": str(uuid.uuid4()),
        "collectedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "durationMs": round((time.monotonic() - started) * 1000),
        "workspaceId": workspace_id,
        "targetId": target_id,
        "targetName": target["displayName"],
        "environment": target.get("environment"),
        "inspectionMode": inspection_mode,
        "lookbackMinutes": lookback_minutes,
        "overallStatus": overall_status,
        "completeness": builder.completeness,
        "host": host,
        "projects": projects,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=7862)
    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    _load_registry()
    mcp.run(transport="sse", host=args.host, port=args.port)


if __name__ == "__main__":
    main()
