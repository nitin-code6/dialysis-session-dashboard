export default function AnomalyBadge({ type }) {
  const map = {
    HIGH_BP: "badge-error",
    HIGH_WEIGHT_GAIN: "badge-warning",
    ABNORMAL_DURATION: "badge-accent",
  };

  return (
    <span className={`badge ${map[type] || "badge-neutral"}`}>
      {type.replaceAll("_", " ")}
    </span>
  );
}