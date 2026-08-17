# Third-party components

This repository is a derivative work and does not claim the architecture
foundation as original work.

## AI Agent Station Study v2.2

The original project provides the DDD module structure, agent configuration
model, and core execution pipeline. The upstream project metadata declares
the Apache License, Version 2.0. Attribution is retained in `NOTICE`.

## xfg-wrench design framework

The agent routing code depends on the published Maven artifact:

```text
cn.bugstack.wrench:xfg-wrench-starter-design-framework
```

The dependency coordinate and Java imports are intentionally preserved. They
are required to compile and run the current routing implementation.

## Project-specific work

The custom implementation in this repository is summarized in the
`Custom work in this repository` section of `README.md` and is concentrated
in the Workspace HTTP package, migration utility, deployment configuration,
and workbench frontend integration.
