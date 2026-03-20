const anomalyConfig = {
  EXCESS_WEIGHT_GAIN: { label: 'Excess Weight Gain', color: 'warning' },
  INADEQUATE_FLUID_REMOVAL: { label: 'Inadequate Fluid Removal', color: 'warning' },
  HIGH_BP: { label: 'High BP', color: 'error' },
  SHORT_SESSION: { label: 'Short Session', color: 'info' },
  LONG_SESSION: { label: 'Long Session', color: 'info' },
};

export default function SessionCard({ session, onEditNotes, onComplete }) {
  const {
    patientName,
    status,
    preWeight,
    postWeight,
    preSystolicBP,
    preDiastolicBP,
    postSystolicBP,
    postDiastolicBP,
    duration,
    anomalies,
    notes,
  } = session;

  // Status styling
  const statusColor = {
    scheduled: 'badge-ghost',
    'in-progress': 'badge-primary',
    completed: 'badge-success',
  }[status] || 'badge-ghost';

  const statusText = {
    scheduled: 'Not Started',
    'in-progress': 'In Progress',
    completed: 'Completed',
  }[status] || status;

  return (
    <div className="card bg-base-100 shadow-xl p-4 border border-base-200">
      <div className="card-body p-0">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="card-title">
            {patientName || 'Unknown Patient'}
          </h2>
          <div className={`badge ${statusColor} badge-lg`}>
            {statusText}
          </div>
        </div>

        {/* Vitals */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <p className="font-semibold">Pre-dialysis</p>
            <p>Weight: {preWeight ?? 'N/A'} kg</p>
           <p>
  Pre: {preWeight ?? 'N/A'} kg | BP {
    session.preBP
      ? session.preBP
      : `${session.preSystolicBP ?? '-'} / ${session.preDiastolicBP ?? '-'}`
  }
</p>
          </div>

          <div>
            <p className="font-semibold">Post-dialysis</p>
         {postWeight ? (
  <p>
    Post: {postWeight} kg | BP {
      session.postBP
        ? session.postBP
        : `${session.postSystolicBP ?? '-'} / ${session.postDiastolicBP ?? '-'}`
    }
  </p>
) : (
  <p className="text-gray-400">Not yet recorded</p>
)}
          </div>
        </div>

        {/* Duration */}
        {duration && (
          <p className="mt-1">Duration: {duration} minutes</p>
        )}

        {/* Notes */}
        {notes && (
          <div className="mt-2 p-2 bg-base-200 rounded">
            <p className="italic">📝 {notes}</p>
          </div>
        )}

        {/* Anomalies */}
        {anomalies?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {anomalies.map(code => (
              <div
                key={code}
                className={`badge badge-${
                  anomalyConfig[code]?.color || 'ghost'
                }`}
              >
                {anomalyConfig[code]?.label || code}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="card-actions justify-end mt-4">
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => onEditNotes(session)}
          >
            Edit Notes
          </button>

          {status !== 'completed' && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onComplete(session)}
            >
              Complete
            </button>
          )}
        </div>

      </div>
    </div>
  );
}