// The exploded view is driven by model3d.js, which groups the glTF meshes into
// these same ids by height band. x/y are the fallback label placement used
// before the model reports where each group projects to; `anchor` keys into
// model3d's ANCHORS table.
export const structureParts = [
  {
    id: "roof",
    labelKey: "structure.labels.roof",
    anchor: "roof",
    x: 49,
    y: 18,
  },
  {
    id: "frontWall",
    labelKey: "structure.labels.frontWall",
    anchor: "window",
    x: 38,
    y: 45,
  },
  {
    id: "sideWalls",
    labelKey: "structure.labels.sideWalls",
    anchor: "wall",
    x: 68,
    y: 47,
  },
  {
    id: "floor",
    labelKey: "structure.labels.floor",
    anchor: "deck",
    x: 51,
    y: 64,
  },
  {
    id: "foundation",
    labelKey: "structure.labels.foundation",
    anchor: "raisedFloor",
    x: 54,
    y: 78,
  },
];
