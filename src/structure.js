export const structureParts = [
  {
    id: "roof",
    labelKey: "structure.labels.roof",
    x: 49,
    y: 18,
    dx: 0,
    dy: -64,
    delay: 0,
  },
  {
    id: "frontWall",
    labelKey: "structure.labels.frontWall",
    x: 38,
    y: 45,
    dx: -36,
    dy: 0,
    delay: 150,
  },
  {
    id: "sideWalls",
    labelKey: "structure.labels.sideWalls",
    x: 68,
    y: 47,
    dx: 48,
    dy: 0,
    delay: 220,
  },
  {
    id: "floor",
    labelKey: "structure.labels.floor",
    x: 51,
    y: 64,
    dx: 0,
    dy: 42,
    delay: 350,
  },
  {
    id: "foundation",
    labelKey: "structure.labels.foundation",
    x: 54,
    y: 78,
    dx: 0,
    dy: 70,
    delay: 430,
  },
];

export function getPartMotion(partId, amount) {
  const part = structureParts.find((item) => item.id === partId);
  if (!part) {
    return "--part-x:0px;--part-y:0px;--part-delay:0ms;";
  }

  return [
    `--part-x:${Math.round(part.dx * amount)}px`,
    `--part-y:${Math.round(part.dy * amount)}px`,
    `--part-delay:${part.delay}ms`,
  ].join(";");
}
