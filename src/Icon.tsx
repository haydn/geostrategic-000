import { useMemo } from "react";
// @ts-ignore
import PNGImage from "pnglib-es6";

const Icon = ({ value }: { value: string | undefined }) => {
  const iconDataUrl = useMemo<string | undefined>(() => {
    if (!value) return undefined;

    const image = new PNGImage(32, 32, 2, "transparent");
    const black = image.createColor(0, 0, 0, 255);

    for (let i = 0; i < 32; i++) {
      const pixels = parseInt(value.slice(2 + i * 8, 2 + i * 8 + 8), 16)
        .toString(2)
        .padStart(32, "0")
        .split("");
      for (let j = 0; j < 32; j++) {
        if (pixels[j] === "1") {
          const index = i * 32 + j;
          image.setPixel(index % 32, Math.floor(index / 32), black);
        }
      }
    }

    return image.getDataURL();
  }, [value]);

  return iconDataUrl ? (
    <image href={iconDataUrl} x={-16} y={-16} height={32} width={32} />
  ) : null;
};

export default Icon;
