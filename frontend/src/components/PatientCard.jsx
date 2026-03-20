const statusConfig = {
  scheduled: { label: 'Scheduled', class: 'bg-slate-800 text-slate-400 border-slate-700' },
  'in-progress': { label: 'In Progress', class: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 ring-1 ring-indigo-500/20' },
  completed: { label: 'Completed', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
};

export default function PatientCard({ session, onStart, onComplete, onEditNotes, onView }) {
  const { 
    patient, status, preWeight, postWeight, preSystolicBP, preDiastolicBP, 
    postSystolicBP, postDiastolicBP, duration, anomalies, notes, machineId 
  } = session || {};

  const currentStatus = statusConfig[status] || { label: status, class: 'bg-slate-800' };
  const hasAnomalies = anomalies?.length > 0;

  return (
    <div className={`group relative flex flex-col h-full overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-slate-900 ${
      hasAnomalies ? 'border-rose-500/40 shadow-rose-950/20' : 'border-slate-800 hover:border-slate-700'
    }`}>
      
      {hasAnomalies && <div className="absolute top-0 left-0 h-1.5 w-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]" />}

      <div className="p-5 flex flex-col h-full">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-white">
              {patient?.name}
            </h2>

            <div className="flex items-center gap-3 text-[10px] uppercase">
              <span className="text-slate-400">
                Machine: <span className="text-indigo-300">{machineId || "--"}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">
                Duration: <span className="text-slate-300">{duration ? `${duration}m` : '--'}</span>
              </span>
            </div>
          </div>

          <span className={`text-[10px] font-bold px-2 py-1 rounded border ${currentStatus.class}`}>
            {currentStatus.label}
          </span>
        </div>

        {/* PRE / POST */}
        <div className="grid grid-cols-2 gap-3 mb-4">

  {/* PRE */}
  <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
    <p className="text-xs text-slate-400 mb-2 font-semibold">Pre-Dialysis</p>

    <div className="space-y-1">
      <p className="text-sm text-slate-300">
        <span className="text-slate-500">Weight:</span>{" "}
        <span className="font-bold">{preWeight ?? "--"} kg</span>
      </p>

      <p className="text-sm text-slate-300">
        <span className="text-slate-500">BP:</span>{" "}
        <span className="font-mono font-bold">
          {preSystolicBP ?? "--"}/{preDiastolicBP ?? "--"}
        </span>
      </p>
    </div>
  </div>

  {/* POST */}
  <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
    <p className="text-xs text-indigo-400 mb-2 font-semibold">Post-Dialysis</p>

    <div className="space-y-1">
      <p className="text-sm text-slate-300">
        <span className="text-slate-500">Weight:</span>{" "}
        <span className="font-bold">{postWeight ?? "--"} kg</span>
      </p>

      <p className="text-sm text-slate-300">
        <span className="text-slate-500">BP:</span>{" "}
        <span className="font-mono font-bold">
          {postSystolicBP ?? "--"}/{postDiastolicBP ?? "--"}
        </span>
      </p>
    </div>
  </div>

</div>

        {/* ANOMALIES */}
        {hasAnomalies && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {anomalies.map((a, i) => (
              <span key={i} className="text-[9px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded">
                {a.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}

        {/* NOTES ADDED */}
        {notes && (
          <div className="mb-4 p-3 bg-slate-800/40 border border-slate-800 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">Notes</p>
            <p className="text-sm text-slate-300 italic line-clamp-2">
              {notes}
            </p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-auto flex gap-2">

          {status === "scheduled" && (
            <button className="flex-1 bg-indigo-600 text-white text-xs py-2 rounded" onClick={onStart}>
              START
            </button>
          )}

          {status === "in-progress" && (
            <>
              <button className="px-3 bg-slate-800 text-xs py-2 rounded" onClick={onEditNotes}>
                NOTES
              </button>
              <button className="flex-1 bg-emerald-600 text-white text-xs py-2 rounded" onClick={onComplete}>
                COMPLETE
              </button>
            </>
          )}

          {status === "completed" && (
            <button className="flex-1 bg-slate-800 text-xs py-2 rounded" onClick={onView}>
              VIEW SUMMARY
            </button>
          )}

        </div>

      </div>
    </div>
  );
}