"""Crop an original capture without AI edits or inherited image metadata.

Keep original captures outside the public portfolio directory. Review the crop
visually before referencing its output in index.html.
"""

import argparse
from pathlib import Path

from PIL import Image, ImageStat


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--crop", type=int, nargs=4, required=True,
                        metavar=("X", "Y", "WIDTH", "HEIGHT"))
    args = parser.parse_args()
    source = args.source.resolve(strict=True)
    destination = args.destination.resolve()
    if source == destination:
        parser.error("The original capture must not be overwritten.")
    x, y, width, height = args.crop
    with Image.open(source) as original:
        if min(x, y) < 0 or min(width, height) <= 0:
            parser.error("Crop dimensions must be positive and in bounds.")
        if x + width > original.width or y + height > original.height:
            parser.error(f"Crop exceeds the {original.width}x{original.height} original.")
        crop = original.convert("RGB").crop((x, y, x + width, y + height))
    if max(ImageStat.Stat(crop).stddev) < 3:
        parser.error("The crop is blank; no public asset was written.")
    # New pixel-only image: do not carry EXIF, comments, or other source metadata.
    clean = Image.new("RGB", crop.size)
    clean.paste(crop)
    clean.save(destination, format="JPEG", quality=95, subsampling=0)
    print(f"Saved reviewed crop target: {destination.name} ({width}x{height})")


if __name__ == "__main__":
    main()
