"""Build the two-page public resume from its maintained Markdown source.

Requires reportlab and pypdf, and embeds Windows Malgun Gothic fonts.
Validation happens before replacing the output, preserving an existing PDF
when the source no longer fits the intended layout or a link is missing.
"""

from __future__ import annotations

import argparse
from datetime import date
from html import escape
from pathlib import Path
import re
from tempfile import TemporaryDirectory

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle,
)


SITE_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = SITE_ROOT.parent / "resume/gowoonmom-developer-resume.md"
DEFAULT_OUTPUT = SITE_ROOT / "assets/lim-donghyun-backend-resume.pdf"
INK = colors.HexColor("#242827")
MUTED = colors.HexColor("#626968")
ACCENT = colors.HexColor("#79434c")
RULE = colors.HexColor("#d8dcd9")
LINK = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
INLINE = re.compile(r"(\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*)")


def markup(text: str) -> str:
    """Support only the Markdown inline syntax actually used by this resume."""
    parts = []
    cursor = 0
    for match in INLINE.finditer(text):
        parts.append(escape(text[cursor:match.start()]))
        if match.group(2) is not None:
            url = match.group(3)
            if not url.startswith(("https://", "mailto:")):
                raise ValueError(f"Unsupported public link: {url}")
            parts.append(
                f'<link href="{escape(url, quote=True)}" color="#79434c">'
                f'{escape(match.group(2))}</link>'
            )
        else:
            parts.append(f"<b>{escape(match.group(4))}</b>")
        cursor = match.end()
    parts.append(escape(text[cursor:]))
    return "".join(parts)


def normalized(text: str) -> str:
    return "".join(text.split())


def register_fonts() -> None:
    for name, filename in (("Malgun", "malgun.ttf"), ("MalgunBold", "malgunbd.ttf")):
        path = Path("C:/Windows/Fonts") / filename
        if not path.is_file():
            raise FileNotFoundError(f"Required Korean font not found: {path}")
        pdfmetrics.registerFont(TTFont(name, str(path)))
    pdfmetrics.registerFontFamily("Malgun", normal="Malgun", bold="MalgunBold")


def styles() -> dict[str, ParagraphStyle]:
    body = ParagraphStyle(
        "Body", fontName="Malgun", fontSize=9.5, leading=14.7,
        textColor=INK, wordWrap="LTR", alignment=TA_LEFT,
        spaceAfter=6, splitLongWords=True,
    )
    return {
        "body": body,
        "name": ParagraphStyle(
            "Name", parent=body, fontName="MalgunBold", fontSize=26,
            leading=31, spaceAfter=2,
        ),
        "role": ParagraphStyle(
            "Role", parent=body, fontSize=11, leading=16,
            textColor=MUTED, spaceAfter=10,
        ),
        "contact": ParagraphStyle(
            "Contact", parent=body, fontSize=8.8, leading=13.2, spaceAfter=0,
        ),
        "intro": ParagraphStyle(
            "Intro", parent=body, fontSize=9.7, leading=15,
            spaceBefore=10, spaceAfter=11,
        ),
        "section": ParagraphStyle(
            "Section", parent=body, fontName="MalgunBold", fontSize=12,
            leading=17, textColor=ACCENT, spaceAfter=7, keepWithNext=True,
        ),
        "title": ParagraphStyle(
            "Title", parent=body, fontName="MalgunBold", fontSize=11.8,
            leading=17, spaceBefore=5, spaceAfter=2, keepWithNext=True,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle", parent=body, fontName="MalgunBold", fontSize=10.1,
            leading=15.3, spaceBefore=6, spaceAfter=3, keepWithNext=True,
        ),
        "period": ParagraphStyle(
            "Period", parent=body, fontSize=8.5, leading=12.5,
            textColor=MUTED, spaceAfter=7, keepWithNext=True,
        ),
        "bullet": ParagraphStyle(
            "Bullet", parent=body, leftIndent=8, firstLineIndent=-8,
            spaceAfter=3,
        ),
        "note": ParagraphStyle(
            "Note", parent=body, fontSize=8.4, leading=12.8,
            textColor=MUTED, spaceBefore=5, spaceAfter=0,
        ),
    }


def story_from_source(source: str, width: float) -> list:
    sheet = styles()
    story = []
    lines = source.splitlines()
    if not lines or lines[0] != "# 임동현":
        raise ValueError("Expected the named resume heading.")
    story.append(Paragraph(markup(lines[0][2:]), sheet["name"]))
    content = [line.strip() for line in lines[1:] if line.strip()]
    if not content or content[0] != "Java/Spring 백엔드 개발자":
        raise ValueError("Expected the resume role below the name.")
    story.append(Paragraph(markup(content.pop(0)), sheet["role"]))
    contacts = []
    while content and LINK.search(content[0]):
        contacts.append(Paragraph(markup(content.pop(0)), sheet["contact"]))
    if len(contacts) != 4:
        raise ValueError("Expected email, GitHub, portfolio and service links.")
    table = Table([contacts[:2], contacts[2:]], colWidths=[width / 2] * 2)
    table.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(table)
    project_breaks = 0
    for line in content:
        if line == "## 대표 프로젝트":
            story.append(PageBreak())
            project_breaks += 1
        if line.startswith("## "):
            story.append(Spacer(1, 5))
            story.append(HRFlowable(width="100%", thickness=0.6, color=RULE, spaceAfter=6))
            story.append(Paragraph(markup(line[3:]), sheet["section"]))
        elif line.startswith("### "):
            story.append(Paragraph(markup(line[4:]), sheet["title"]))
        elif line.startswith("#### "):
            story.append(Paragraph(markup(line[5:]), sheet["subtitle"]))
        elif line.startswith("**기간:**"):
            story.append(Paragraph(markup(line), sheet["period"]))
        elif line.startswith("**검증 기준:**"):
            story.append(Paragraph(markup(line), sheet["note"]))
        elif line.startswith("> "):
            story.append(Paragraph(markup(line[2:]), sheet["intro"]))
        elif line.startswith("- "):
            story.append(Paragraph("- " + markup(line[2:]), sheet["bullet"]))
        elif line.startswith("#"):
            raise ValueError(f"Unsupported heading: {line}")
        else:
            story.append(Paragraph(markup(line), sheet["body"]))
    if project_breaks != 1:
        raise ValueError("Expected exactly one representative-project section.")
    return story


def page_furniture(canvas, doc, as_of: str) -> None:
    canvas.saveState()
    width, height = A4
    if doc.page > 1:
        canvas.setFont("Malgun", 8)
        canvas.setFillColor(MUTED)
        canvas.drawString(doc.leftMargin + 6, height - 29, "임동현 | Java/Spring 백엔드 개발자")
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.5)
    canvas.line(doc.leftMargin + 6, 32, width - doc.rightMargin - 6, 32)
    canvas.setFillColor(MUTED)
    canvas.setFont("Malgun", 7.5)
    canvas.drawString(doc.leftMargin + 6, 20, f"작성 기준 {as_of}")
    canvas.drawRightString(width - doc.rightMargin - 6, 20, f"{doc.page} / 2")
    canvas.restoreState()


def validate_pdf(candidate: Path, source: str) -> None:
    reader = PdfReader(candidate)
    if len(reader.pages) != 2:
        raise ValueError(f"Resume must fit two pages; generated {len(reader.pages)}. Original output unchanged.")
    text = normalized("\n".join(page.extract_text() or "" for page in reader.pages))
    for line in source.splitlines():
        plain = LINK.sub(r"\1", line).replace("**", "")
        plain = re.sub(r"^(?:#{1,4} |>-? |\- )", "", plain).strip()
        if plain and normalized(plain) not in text:
            raise ValueError(f"PDF text missing or altered: {plain[:70]}")
    expected_urls = {match.group(2) for match in LINK.finditer(source)}
    urls = set()
    for page in reader.pages:
        for reference in page.get("/Annots", []):
            action = reference.get_object().get("/A")
            if action and action.get("/URI"):
                urls.add(str(action["/URI"]))
    if not expected_urls.issubset(urls):
        raise ValueError(f"Missing PDF links: {expected_urls - urls}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--as-of", default=date.today().isoformat())
    args = parser.parse_args()
    date.fromisoformat(args.as_of)
    source = args.source.read_text(encoding="utf-8-sig")
    register_fonts()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with TemporaryDirectory(prefix="resume-build-", dir=args.output.parent) as temporary:
        candidate = Path(temporary) / "resume.pdf"
        doc = SimpleDocTemplate(
            str(candidate), pagesize=A4, leftMargin=42, rightMargin=42,
            topMargin=40, bottomMargin=43,
            title="임동현 - Java/Spring 백엔드 개발자 이력서",
            author="임동현", subject="실무 경력과 고운맘 문제 해결 경험",
            pageCompression=1,
        )
        furniture = lambda canvas, document: page_furniture(canvas, document, args.as_of)
        doc.build(story_from_source(source, doc.width - 12), onFirstPage=furniture, onLaterPages=furniture)
        validate_pdf(candidate, source)
        candidate.replace(args.output)
    print(f"Built and validated two-page resume: {args.output.resolve()}")


if __name__ == "__main__":
    main()
