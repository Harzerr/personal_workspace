"""MCP server that exposes configurable Tavily web and news search."""

import os
import sys
from typing import Any, Literal

from fastmcp import FastMCP
from tavily import TavilyClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app.core.config import settings
from app.utils.logger import setup_logger

logger = setup_logger(__name__)
mcp = FastMCP("search")


@mcp.tool()
def search(
    query: str,
    topic: Literal["general", "news"] = "general",
    days: int | None = None,
    max_results: int = 10,
) -> dict[str, Any]:
    """Search the web or recent news and return structured source metadata."""
    query = (query or "").strip()
    if not query:
        raise ValueError("business validation: query cannot be empty")
    if len(query) > 500:
        raise ValueError("business validation: query is too long")
    if days is not None and not 1 <= days <= 30:
        raise ValueError("business validation: days must be between 1 and 30")
    if not 1 <= max_results <= 30:
        raise ValueError("business validation: max_results must be between 1 and 30")

    arguments: dict[str, Any] = {
        "query": query,
        "topic": topic,
        "max_results": max_results,
    }
    if topic == "news" and days is not None:
        arguments["days"] = days

    logger.info("Searching topic=%s days=%s max_results=%s", topic, days, max_results)
    return TavilyClient(api_key=settings.TAVILY_API_KEY).search(**arguments)


def run_server(
    host: str = "127.0.0.1",
    port: int = 7861,
    transport: Literal["stdio", "sse", "streamable-http"] = "sse",
) -> None:
    logger.info("Starting search MCP server on %s:%s with %s transport", host, port, transport)
    mcp.run(transport=transport, host=host, port=port)


if __name__ == "__main__":
    run_server()
