// x/y are the fallback placement used until the 3D model reports where its
// anchor actually projects to on screen; `anchor` keys into model3d's ANCHORS.
export const discoverHotspots = [
  {
    id: "window",
    anchor: "window",
    x: 62,
    y: 43,
  },
  {
    id: "raisedFloor",
    anchor: "raisedFloor",
    x: 46,
    y: 67,
  },
  {
    id: "roof",
    anchor: "roof",
    x: 52,
    y: 25,
  },
];

export const hotspotModeTarget = {
  window: "air",
  raisedFloor: "structure",
  roof: "climate",
};
