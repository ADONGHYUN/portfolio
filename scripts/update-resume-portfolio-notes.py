"""Compatibility entry point for rebuilding the public resume from Markdown.

The previous fixed-position PDF patcher has been replaced by a complete,
validated two-page generator. All command-line arguments are passed through.
"""

from pathlib import Path
import runpy


if __name__ == "__main__":
    runpy.run_path(str(Path(__file__).with_name("build-public-resume.py")), run_name="__main__")
