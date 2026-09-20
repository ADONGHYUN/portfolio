"""Update two portfolio notes in the existing PDF without rebuilding its layout.

Run with the bundled Python (PyMuPDF required). This does not synchronize the
company career section or generate a complete resume from Markdown.
"""

from pathlib import Path
from tempfile import TemporaryDirectory
import shutil

import pymupdf


pdf_path = Path(__file__).resolve().parents[1] / "assets/lim-donghyun-backend-resume.pdf"
font_path = Path("C:/Windows/Fonts/malgun.ttf")
if not font_path.is_file():
    raise RuntimeError("The Korean font is unavailable; the original PDF was not changed.")

replacements = {
    "주문 스냅샷·결제 원장·재고 상태": "주문 스냅샷·결제 원장·재고 상태를 분리해 모델링했습니다.",
    "개발·테스트 재현 사례": "개발·테스트 재현 사례 · 환경별 검증 범위는 포트폴리오 참고 · 실제 PG/AWS 장애·부하 테스트와 구분",
}


def spans(page):
    return [
        span
        for block in page.get_text("dict")["blocks"]
        for line in block.get("lines", [])
        for span in line["spans"]
    ]


with TemporaryDirectory(prefix="gowoonmom-resume-notes-") as temporary:
    original = pymupdf.open(pdf_path)
    if len(original) != 1:
        raise RuntimeError("Unexpected resume layout; the original PDF was not changed.")
    page = original[0]
    page_spans = spans(page)
    patches = []
    for prefix, replacement in replacements.items():
        matches = [span for span in page_spans if span["text"].startswith(prefix)]
        if len(matches) != 1:
            raise RuntimeError(f"Expected one note starting with {prefix!r}.")
        span = matches[0]
        rect = pymupdf.Rect(span["bbox"])
        rect.x1 = page.rect.width - 40
        rect.y0 -= 1
        rect.y1 += 1
        font = pymupdf.Font(fontfile=str(font_path))
        if font.text_length(replacement, fontsize=span["size"]) > rect.width:
            raise RuntimeError("Replacement note would overflow; the original PDF was not changed.")
        patches.append((span, rect, replacement))

    def untouched_text(pdf_page):
        return sorted(
            (span["text"], tuple(round(v, 2) for v in span["bbox"]))
            for span in spans(pdf_page)
            if not any(pymupdf.Rect(span["bbox"]).intersects(rect) for _, rect, _ in patches)
        )

    baseline = untouched_text(page)
    for _, rect, _ in patches:
        page.add_redact_annot(rect, fill=(1, 1, 1))
    page.apply_redactions(images=0, graphics=0)
    for span, _, replacement in patches:
        color = span["color"]
        rgb = ((color >> 16 & 255) / 255, (color >> 8 & 255) / 255, (color & 255) / 255)
        page.insert_text(
            span["origin"], replacement, fontsize=span["size"],
            fontname="PortfolioNoteKorean", fontfile=str(font_path), color=rgb,
        )
    candidate = Path(temporary) / "updated-resume.pdf"
    original.subset_fonts()
    original.save(candidate, garbage=4, deflate=True)
    original.close()
    with pymupdf.open(candidate) as check:
        assert untouched_text(check[0]) == baseline, "Text outside the two notes changed."
        text = check[0].get_text()
        assert "113개" not in text
        assert all(replacement in text for replacement in replacements.values())
    shutil.copyfile(candidate, pdf_path)
print("Updated the two portfolio notes; all other text and positions are unchanged.")
