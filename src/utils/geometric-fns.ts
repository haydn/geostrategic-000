export type Point = { type: "point"; x: number; y: number };
export type Box = { type: "box"; points: [Point, Point] };
export type Shape = Point | Box;

const area = (shape: Box) => {
  const [p1, p2] = shape.points;
  return Math.abs(p1.x - p2.x) * Math.abs(p1.y - p2.y);
};

const bottom = (shape: Shape) =>
  toPoints(shape).reduce(
    (result, point) => Math.max(result, point.y),
    -Infinity
  );

const contains = (box: Box, shape: Shape) =>
  left(shape) >= left(box) &&
  right(shape) <= right(box) &&
  top(shape) >= top(box) &&
  bottom(shape) <= bottom(box);

const createBox = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
}: Partial<{
  x: number;
  y: number;
  width: number;
  height: number;
}>): Box => ({
  type: "box",
  points: [createPoint({ x, y }), createPoint({ x: x + width, y: y + height })],
});

const createPoint = ({ x = 0, y = 0 }: Partial<Point>): Point => ({
  type: "point",
  x,
  y,
});

const left = (shape: Shape) =>
  toPoints(shape).reduce(
    (result, point) => Math.min(result, point.x),
    Infinity
  );

const right = (shape: Shape) =>
  toPoints(shape).reduce(
    (result, point) => Math.max(result, point.x),
    -Infinity
  );

const top = (shape: Shape) =>
  toPoints(shape).reduce(
    (result, point) => Math.min(result, point.y),
    Infinity
  );

const toPoints = (shape: Shape): Point[] => {
  switch (shape.type) {
    case "point":
      return [shape];
    case "box":
      return shape.points;
  }
};

export {
  area,
  bottom,
  contains,
  createBox,
  createPoint,
  left,
  right,
  top,
  toPoints,
};
