const anomalyConfig = {
  EXCESS_WEIGHT_GAIN: { label: 'Excess Weight Gain', bg: 'bg-warning/10 text-warning' },
  INADEQUATE_FLUID_REMOVAL: { label: 'Inadequate Fluid Removal', bg: 'bg-warning/10 text-warning' },
  HIGH_BP: { label: 'High BP', bg: 'bg-error/10 text-error' },
  SHORT_SESSION: { label: 'Short Session', bg: 'bg-info/10 text-info' },
  LONG_SESSION: { label: 'Long Session', bg: 'bg-info/10 text-info' },
};

const statusConfig = {
  scheduled: { label: 'Scheduled', class: 'bg-slate-700 text-slate-300' },
  'in-progress': { label: 'In Progress', class: 'bg-info/20 text-info border border-info/50' },
  completed: { label: 'Completed', class: 'bg-success/20 text-success border border-success/50' },
};

export default function PatientCard({
  session,
  onStart,
  onComplete,
  onEditNotes,
  onView // ✅ IMPORTANT
}) {
  const {
    patient,
    status,
    preWeight,
    postWeight,
    preSystolicBP,
    preDiastolicBP,
    postSystolicBP,
    postDiastolicBP,
    duration,
    anomalies,
    notes
  } = session || {};

  const currentStatus = statusConfig[status] || { label: status, class: 'bg-slate-700' };
  const hasAnomalies = anomalies?.length > 0;

  return (
    <div className={`rounded-xl border p-4 bg-base-100 shadow-md ${
      hasAnomalies ? 'border-error' : 'border-base-300'
    }`}>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-lg">
          {patient?.name || "Unknown Patient"}
        </h2>

        <span className={`badge ${currentStatus.class}`}>
          {currentStatus.label}
        </span>
      </div>

      {/* PRE / POST DATA */}
      <div className="grid grid-cols-2 gap-4 text-sm">

        {/* PRE */}
        <div>
          <p className="font-semibold text-gray-500">Pre</p>
          <p>Weight: {preWeight ?? "--"} kg</p>
          <p>
            BP: {preSystolicBP && preDiastolicBP
              ? `${preSystolicBP}/${preDiastolicBP}`
              : "--"}
          </p>
        </div>

        {/* POST */}
        <div>
          <p className="font-semibold text-gray-500">Post</p>
          {postWeight != null ? (
            <>
              <p>Weight: {postWeight} kg</p>
              <p>
                BP: {postSystolicBP && postDiastolicBP
                  ? `${postSystolicBP}/${postDiastolicBP}`
                  : "--"}
              </p>
            </>
          ) : (
            <p className="text-gray-400 italic">Not completed</p>
          )}
        </div>
      </div>

      {/* DURATION */}
      <p className="mt-2 text-sm">
        Duration: {duration !== null && duration !== undefined
  ? `${duration} mins`
  : "--"}
      </p>

      {/* ANOMALIES */}
      {hasAnomalies && (
        <div className="flex flex-wrap gap-2 mt-2">
          {anomalies.map((code, i) => (
            <span
              key={code + i}
              className={`badge ${anomalyConfig[code]?.bg || "badge-ghost"}`}
            >
              {anomalyConfig[code]?.label || code}
            </span>
          ))}
        </div>
      )}

      {/* NOTES */}
      {notes && (
        <div className="mt-3 p-2 bg-base-200 rounded text-sm italic">
          {notes}
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 mt-4">

        {status === "scheduled" && (
          <button
            className="btn btn-primary btn-sm w-full"
            onClick={onStart}
          >
            Start
          </button>
        )}

        {status === "in-progress" && (
          <>
            <button
              className="btn btn-outline btn-sm"
              onClick={onEditNotes}
            >
             Notes
            </button>

            <button
              className="btn btn-success btn-sm flex-1"
              onClick={onComplete}
            >
              Complete
            </button>
          </>
        )}

        {status === "completed" && (
          <button
            className="btn btn-outline btn-sm w-full"
            onClick={onView}
          >
            View Summary
          </button>
        )}
      </div>
    </div>
  );
}