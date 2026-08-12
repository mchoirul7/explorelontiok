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
