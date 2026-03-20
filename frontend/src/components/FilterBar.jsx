export default function FilterBar({ selectedUnit, onUnitChange, showOnlyAnomalies, onAnomalyFilterChange, units }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-base-200 rounded-lg">
      <div className="form-control w-full max-w-xs">
        <label className="label">Filter by Unit</label>
        <select
          className="select select-bordered"
          value={selectedUnit}
          onChange={(e) => onUnitChange(e.target.value)}
        >
          <option value="">All Units</option>
          {units.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>

      <div className="form-control">
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
    </div>
  );
}