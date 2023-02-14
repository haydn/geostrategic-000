import { Box } from "./geometric-fns";

/**
 * Parses a position string into a box. The position string is formatted like
 * this: ((x1, y1), (x2, y2)). The order of the points in the position string is
 * not important.
 * @param position The position string to parse.
 * @returns The parsed box.
 */
const parsePosition = (position: string): Box => {
  const [x1, y1, x2, y2] = position
    .replaceAll(/[()]/g, "")
    .split(",")
    .map((n) => parseInt(n, 10));
  return {
    type: "box",
    points: [
      { type: "point", x: x1, y: y1 },
      { type: "point", x: x2, y: y2 },
    ],
  };
};

export default parsePosition;
