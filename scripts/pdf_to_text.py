#!/usr/bin/env python3
"""Extract plain text from a PDF (requires: pip install pypdf)."""

from __future__ import annotations

import argparse
import sys


def main() -> int:
    parser = argparse.ArgumentParser(description="PDF → UTF-8 text (pypdf)")
    parser.add_argument("input_pdf", help="Path to .pdf")
    parser.add_argument(
        "output_txt",
        nargs="?",
        help="Output .txt (default: same basename + -extracted.txt)",
    )
    args = parser.parse_args()

    try:
        from pypdf import PdfReader
    except ImportError:
        print("Install pypdf: pip3 install --user pypdf", file=sys.stderr)
        return 1

    inp = args.input_pdf
    out = args.output_txt
    if not out:
        out = inp.rsplit(".", 1)[0] + "-extracted.txt"

    reader = PdfReader(inp)
    parts: list[str] = []
    for i, page in enumerate(reader.pages):
        t = page.extract_text() or ""
        parts.append(f"\n--- page {i + 1} ---\n{t}")

    with open(out, "w", encoding="utf-8") as f:
        f.write("".join(parts))

    print(f"pages: {len(reader.pages)} → {out}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
