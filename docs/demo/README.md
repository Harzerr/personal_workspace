# Product demo

The README demo is recorded against the deployed Personal AI Workspace with a
temporary authenticated Playwright context. Login state and generated session
data are never written to this directory.

Files:

- `personal-workspace-demo.mp4`: 1280x720 H.264 video linked from the README.
- `personal-workspace-demo-poster.png`: README cover linked to the video.

Record a fresh WebM source:

```powershell
node deploy/record-readme-demo.cjs
```

The recorder first creates a real evidence-backed knowledge answer, saves its
session state under the operating-system temporary directory, and then records
the main product flow. Convert the resulting WebM to H.264 with FFmpeg and
extract a representative PNG frame before replacing the checked-in assets.
