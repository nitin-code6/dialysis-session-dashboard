const anomalyConfig = {
  EXCESS_WEIGHT_GAIN: { label: 'Excess Weight Gain', color: 'warning' },
  INADEQUATE_FLUID_REMOVAL: { label: 'Inadequate Fluid Removal', color: 'warning' },
  HIGH_BP: { label: 'High BP', color: 'error' },
  SHORT_SESSION: { label: 'Short Session', color: 'info' },
  LONG_SESSION: { label: 'Long Session', color: 'info' },
};

export default function SessionCard({ session, onEditNotes, onComplete, onStart }) {
  const { patient, status, preWeight, postWeight, preSystolicBP, preDiastolicBP, postSystolicBP, postDiastolicBP, duration, anomalies, notes } = session;

  const statusConfig = {
    scheduled: { label: 'Not Started', badge: 'badge-ghost', btn: 'primary' },
    'in-progress': { label: 'In Progress', badge: 'badge-primary', btn: 'success' },
    completed: { label: 'Completed', badge: 'badge-success', btn: null },
  };
  const { label: statusLabel, badge: statusBadge } = statusConfig[status] || { label: status, badge: 'badge-ghost' };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title">{patient?.name || 'Unknown Patient'}</h2>
          <div className={`badge ${statusBadge} badge-lg`}>{statusLabel}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <p className="font-semibold">Pre-dialysis</p>
            <p>Weight: {preWeight} kg</p>
            <p>BP: {preSystolicBP}/{preDiastolicBP}</p>
          </div>
          <div>
            <p className="font-semibold">Post-dialysis</p>
            {postWeight ? (
              <>
                <p>Weight: {postWeight} kg</p>
                <p>BP: {postSystolicBP}/{postDiastolicBP}</p>
              </>
            ) : (
              <p className="text-gray-400">Not recorded</p>
            )}
          </div>
        </div>

        {duration && <p>Duration: {duration} minutes</p>}

        {notes && (
          <div className="mt-2 p-2 bg-base-200 rounded">
            <p className="italic">📝 {notes}</p>
          </div>
        )}

        {anomalies?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {anomalies.map(code => (
              <div key={code} className={`badge badge-${anomalyConfig[code]?.color || 'ghost'} gap-1`}>
                {anomalyConfig[code]?.label || code}
              </div>
            ))}
          </div>
        )}

        <div className="card-actions justify-end mt-4">
          <button className="btn btn-sm btn-ghost" onClick={onEditNotes}>Edit Notes</button>
          {status === 'scheduled' && (
            <button className="btn btn-sm btn-primary" onClick={onStart}>Start</button>
          )}
          {status === 'in-progress' && (
            <button className="btn btn-sm btn-success" onClick={onComplete}>Complete</button>
          )}
        </div>
      </div>
    </div>
  );
}