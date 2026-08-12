export const airflowStages = [
  {
    id: "entry",
    key: "airflow.stages.0.title",
  },
  {
    id: "cross",
    key: "airflow.stages.1.title",
  },
  {
    id: "release",
    key: "airflow.stages.2.title",
  },
];

export function getAirflowStage(step) {
  return airflowStages[Math.abs(step) % airflowStages.length];
}

export function renderAirParticles(count = 24) {
  return Array.from({ length: count }, (_, index) => {
    const path = index % 3;
    const delay = ((index % 8) * 0.28).toFixed(2);
    const size = 4 + (index % 4);
    return `<span class="air-particle path-${path}" style="--delay:${delay}s;--size:${size}px"></span>`;
  }).join("");
}
