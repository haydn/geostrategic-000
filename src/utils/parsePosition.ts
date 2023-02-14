import { Box } from "../Game";

/**
 * Parses a position string into a box. The position string is formatted like
 * this: ((x1, y1), (x2, y2)). The order of the points in the position string is
 * not important. In the result the points are ordered such that the first point
 * is the top left corner and the second point is the bottom right corner.
 * @param position The position string to parse.
 * @returns The parsed box.
 */
const parsePosition = (position: string): Box => {
  const [x1, y1, x2, y2] = position
    .replaceAll(/[()]/g, "")
    .split(",")
    .map((n) => parseInt(n, 10));
  return [
    { x: Math.min(x1, x2), y: Math.min(y1, y2) },
    { x: Math.max(x1, x2), y: Math.max(y1, y2) },
  ];
};

export default parsePosition;
