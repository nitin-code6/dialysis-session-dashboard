export default function FilterBar({
  selectedUnit,
  onUnitChange,
  showOnlyAnomalies,
  onAnomalyFilterChange,
  units
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4 p-4 bg-base-200 rounded-box">

      <select
        className="select select-bordered w-full max-w-xs"
        value={selectedUnit}
        onChange={(e) => onUnitChange(e.target.value)}
        aria-label="Select Unit"
      >
        <option value="">All Units</option>
        {units?.map(unit => (
          <option key={unit} value={unit}>{unit}</option>
        ))}
      </select>

      <label className="label cursor-pointer gap-2">
        <span className="label-text">Only show anomalies</span>
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          checked={showOnlyAnomalies}
          onChange={(e) => onAnomalyFilterChange(e.target.checked)}
        />
      </label>

    </div>
  );
}