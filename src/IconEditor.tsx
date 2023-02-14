import { useMemo, useState } from "react";
// @ts-ignore
import PNGImage from "pnglib-es6";

const DEFAULT: Array<boolean> = [];

for (let i = 0; i < 32 * 32; i++) {
  DEFAULT[i] = false;
}

const IconEditor = ({
  initialPixels,
}: {
  initialPixels: string | undefined;
}) => {
  const [pixelSize, setPixelSize] = useState<number>(20);
  const [pixels, setPixels] = useState<Array<boolean>>(
    initialPixels
      ? () => {
          const result: Array<boolean> = [];
          for (let i = 0; i < 32; i++) {
            const pixels = parseInt(
              initialPixels.slice(2 + i * 8, 2 + i * 8 + 8),
              16
            )
              .toString(2)
              .padStart(32, "0")
              .split("");
            for (let j = 0; j < 32; j++) {
              result[i * 32 + j] = pixels[j] === "1";
            }
          }
          return result;
        }
      : DEFAULT
  );
  const [showGrid, setShowGrid] = useState<boolean>(true);

  const dataUrl = useMemo<string>(() => {
    const image = new PNGImage(32, 32, 2, "transparent");
    const black = image.createColor(0, 0, 0, 255);

    for (let i = 0; i < 32 * 32; i++) {
      if (pixels[i]) image.setPixel(i % 32, Math.floor(i / 32), black);
    }

    return image.getDataURL();
  }, [pixels]);

  const value = useMemo<string>(() => {
    let result: string = "";

    for (let i = 0; i < 32 * 32; i += 8) {
      let byte = 0;
      for (let j = 0; j < 8; j++) {
        byte = (byte << 1) | (pixels[i + j] ? 1 : 0);
      }
      result += byte.toString(16).padStart(2, "0");
    }

    return result;
  }, [pixels]);

  return (
    <div>
      <div>
        Zoom:
        <input
          type="range"
          min={5}
          max={20}
          value={pixelSize}
          onChange={(event) => {
            setPixelSize(parseInt(event.target.value, 10));
          }}
        />
      </div>
      <div>
        Show grid:
        <input
          type="checkbox"
          checked={showGrid}
          onChange={(event) => {
            setShowGrid(event.target.checked);
          }}
        />
      </div>
      <p>Large:</p>
      <svg
        width={32 * pixelSize}
        height={32 * pixelSize}
        viewBox={`0 0 ${32 * pixelSize} ${32 * pixelSize}`}
        style={{ cursor: "crosshair" }}
      >
        {pixels.map((pixel, index) => (
          <rect
            key={`${index}`}
            x={(index % 32) * pixelSize}
            y={Math.floor(index / 32) * pixelSize}
            width={1 * pixelSize}
            height={1 * pixelSize}
            fill={pixel ? "black" : "white"}
            onClick={() => {
              setPixels((current) =>
                current.map((row, i) => (i === index ? !row : row))
              );
            }}
            stroke={showGrid ? "#eee" : "none"}
            strokeWidth={0.25}
          />
        ))}
        {showGrid ? (
          <>
            {[8, 16, 24].map((x) => (
              <line
                key={x}
                x1={x * pixelSize}
                y1={0}
                x2={x * pixelSize}
                y2={32 * pixelSize}
                stroke="#eee"
                strokeWidth={0.5}
              />
            ))}
            {[8, 16, 24].map((y) => (
              <line
                key={y}
                x1={0}
                y1={y * pixelSize}
                x2={32 * pixelSize}
                y2={y * pixelSize}
                stroke="#eee"
                strokeWidth={0.5}
              />
            ))}
          </>
        ) : null}
      </svg>
      <p>Small:</p>
      <svg width={32} height={32} viewBox="0 0 32 32">
        <rect fill="white" x={0} y={0} height={32} width={32} />
        <image href={dataUrl} x={0} y={0} height={32} width={32} />
      </svg>
      <p>Hex:</p>
      <pre
        style={{
          overflowWrap: "anywhere",
          width: 32 * pixelSize,
          fontFamily: "monospace",
        }}
      >
        {value}
      </pre>
    </div>
  );
};

export default IconEditor;
