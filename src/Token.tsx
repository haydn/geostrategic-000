import Icon from "./Icon";

const Token = ({
  x,
  y,
  width,
  height,
  icon,
  color,
  owner,
  selected,
  onClick,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  icon: string | undefined;
  color: number | undefined;
  owner: boolean;
  selected: boolean;
  onClick: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
}) => {
  const fill =
    color === undefined
      ? "hsl(1 0% 50%)"
      : `hsl(${color} ${owner ? "100%" : "20%"} 50%)`;
  return (
    <g
      transform={`translate(${x + width / 2},${y + height / 2})`}
      onClick={onClick}
    >
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        fill={fill}
        rx={5}
      />
      {selected ? (
        <>
          <polyline
            stroke="black"
            fill="none"
            points={[
              `${-width / 2 - 5},${-height / 2}`,
              `${-width / 2 - 5},${-height / 2 - 5}`,
              `${-width / 2},${-height / 2 - 5}`,
            ].join(" ")}
          />
          <polyline
            stroke="black"
            fill="none"
            points={[
              `${width / 2 + 5},${-height / 2}`,
              `${width / 2 + 5},${-height / 2 - 5}`,
              `${width / 2},${-height / 2 - 5}`,
            ].join(" ")}
          />
          <polyline
            stroke="black"
            fill="none"
            points={[
              `${width / 2 + 5},${height / 2}`,
              `${width / 2 + 5},${height / 2 + 5}`,
              `${width / 2},${height / 2 + 5}`,
            ].join(" ")}
          />
          <polyline
            stroke="black"
            fill="none"
            points={[
              `${-width / 2 - 5},${height / 2}`,
              `${-width / 2 - 5},${height / 2 + 5}`,
              `${-width / 2},${height / 2 + 5}`,
            ].join(" ")}
          />
        </>
      ) : null}
      {width > 32 && height > 32 ? <Icon value={icon} /> : null}
    </g>
  );
};

export default Token;
