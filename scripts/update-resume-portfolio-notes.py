"""Update verified resume facts in the existing PDF without rebuilding its layout.

Run with the bundled Python (PyMuPDF required). Only explicitly selected regions
are edited; this is not a complete Markdown-to-PDF resume generator.
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
    "2025.07.01 - 재직 중": "2025.07.01 - 재직 중",
    "2024.11": "2024.11.25 - 2025.05.23",
}
status_text = "사업자등록 완료·공개 운영 중 · UI 보완 중으로 일반 주문은 아직 불가"
blocks = [
    {
        "rect": (61, 96, 539, 124),
        "expected": ("총 1년 7개월", "제약·공공기관 업무 시스템을 경험한"),
        "text": "제약·공공기관 업무 시스템을 경험한 Java/Spring 개발자입니다. 메일 시스템의 개발·배포·운영 오류 대응을 단독으로 맡고 있습니다. 고운맘은 설계부터 개발·AWS 배포까지 1인 수행했으며, 사업자등록 후 공개 운영하고 있습니다.",
        "size": 8.4,
        "lineheight": 1.3,
    },
    {
        "rect": (49, 180, 547, 208),
        "expected": ("사내 메일 시스템을 단독 담당", "메일 시스템 1인 담당"),
        "text": "- 메일 시스템 1인 담당: 첨부 오류 수정 후 정상·동시 사용 확인, 수정 배포 이후 동일 오류 미재발\n- 인사·노무 3인 팀: 10개 과업 중 5개 개별·1개 공동 완료, 연가 스케줄러·OZ Report PDF 구현",
        "size": 7.8,
        "lineheight": 1.4,
    },
]


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
    status_matches = [span for span in page_spans if span["text"].startswith(("공개 배포·가오픈", "사업자등록 완료·공개 운영 중"))]
    if len(status_matches) != 1:
        raise RuntimeError("The project status note could not be identified safely.")
    replacements[status_matches[0]["text"]] = status_text
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

    for block in blocks:
        block_text = page.get_textbox(pymupdf.Rect(block["rect"]))
        if not any(expected in block_text for expected in block["expected"]):
            raise RuntimeError("A resume section moved; the original PDF was not changed.")
    changed_regions = [rect for _, rect, _ in patches] + [pymupdf.Rect(block["rect"]) for block in blocks]

    def untouched_text(pdf_page):
        return sorted(
            (span["text"], tuple(round(v, 2) for v in span["bbox"]))
            for span in spans(pdf_page)
            if not any(pymupdf.Rect(span["bbox"]).intersects(rect) for rect in changed_regions)
        )

    baseline = untouched_text(page)
    for rect in changed_regions:
        page.add_redact_annot(rect, fill=None, cross_out=False)
    page.apply_redactions(images=0, graphics=0)
    for span, _, replacement in patches:
        color = span["color"]
        rgb = ((color >> 16 & 255) / 255, (color >> 8 & 255) / 255, (color & 255) / 255)
        page.insert_text(
            span["origin"], replacement, fontsize=span["size"],
            fontname="PortfolioNoteKorean", fontfile=str(font_path), color=rgb,
        )
    for block in blocks:
        remaining = page.insert_textbox(
            pymupdf.Rect(block["rect"]), block["text"], fontsize=block["size"],
            lineheight=block["lineheight"], fontname="PortfolioNoteKorean",
            fontfile=str(font_path), color=(0.17, 0.19, 0.18),
        )
        if remaining < 0:
            raise RuntimeError("Updated career copy would overflow; the original PDF was not changed.")
    candidate = Path(temporary) / "updated-resume.pdf"
    original.subset_fonts()
    original.save(candidate, garbage=4, deflate=True)
    original.close()
    with pymupdf.open(candidate) as check:
        assert untouched_text(check[0]) == baseline, "Text outside the selected resume regions changed."
        text = check[0].get_text()
        for stale in ("113개", "총 1년 7개월", "1년 1개월", "공개 배포·가오픈"):
            assert stale not in text, f"Outdated text remains: {stale}"
        assert all(replacement in text for replacement in replacements.values())
        normalized_text = "".join(text.split())
        assert all("".join(block["text"].split()) in normalized_text for block in blocks)
    shutil.copyfile(candidate, pdf_path)
print("Updated verified resume facts; all text outside the selected regions is unchanged.")
