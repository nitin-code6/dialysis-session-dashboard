const anomalyConfig = {
  EXCESS_WEIGHT_GAIN: { label: 'Excess Weight Gain', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  INADEQUATE_FLUID_REMOVAL: { label: 'Inadequate Fluid Removal', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  HIGH_BP: { label: 'High BP', bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  SHORT_SESSION: { label: 'Short Session', bg: 'bg-sky-500/10 text-sky-500 border-sky-500/20' },
  LONG_SESSION: { label: 'Long Session', bg: 'bg-sky-500/10 text-sky-500 border-sky-500/20' },
};

const statusConfig = {
  scheduled: { label: 'Scheduled', class: 'bg-slate-800 text-slate-400 border-slate-700' },
  'in-progress': { label: 'In Progress', class: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  completed: { label: 'Completed', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
};

export default function PatientCard({ session, onStart, onComplete, onEditNotes, onView }) {
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
    notes,
    machineId   // ✅ ADDED
  } = session || {};

  const currentStatus = statusConfig[status] || { label: status, class: 'bg-slate-800' };
  const hasAnomalies = anomalies?.length > 0;

  return (
    <div className={`group relative overflow-hidden rounded-xl border bg-slate-900 transition-all duration-300 hover:shadow-2xl ${
      hasAnomalies ? 'border-rose-500/50 shadow-rose-500/5' : 'border-slate-800 hover:border-slate-700'
    }`}>
      
      {hasAnomalies && <div className="absolute top-0 left-0 h-1 w-full bg-rose-500" />}

      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-100 tracking-tight leading-none">
              {patient?.name || "Unknown Patient"}
            </h2>

            {/* ✅ MACHINE ID ADDED */}
            <div className="text-[11px] text-slate-500 uppercase tracking-widest">
              Machine: <span className="text-slate-300">{machineId || "--"}</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Duration</span>
              <span className="text-slate-300">{duration ? `${duration} mins` : '--'}</span>
            </div>
          </div>

          <div className={`badge badge-sm border px-3 py-3 font-bold uppercase tracking-wider ${currentStatus.class}`}>
            {status === 'in-progress' && (
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            )}
            {currentStatus.label}
          </div>
        </div>

        {/* Clinical Data */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-800/60">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Pre-Dialysis</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[11px] text-slate-400">Weight</span>
                <span className="text-sm font-semibold text-slate-200">{preWeight ?? '--'} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[11px] text-slate-400">BP</span>
                <span className="text-sm font-mono text-slate-200">
                  {preSystolicBP && preDiastolicBP ? `${preSystolicBP}/${preDiastolicBP}` : '--'}
                </span>
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-3 border ${
            postWeight ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-slate-800/20 border-slate-800/40 border-dashed'
          }`}>
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Post-Dialysis</h4>
            {postWeight != null ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[11px] text-indigo-300/60">Weight</span>
                  <span className="text-sm font-semibold text-indigo-100">{postWeight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-indigo-300/60">BP</span>
                  <span className="text-sm font-mono text-indigo-100">
                    {postSystolicBP}/{postDiastolicBP}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex h-10 items-center justify-center">
                <span className="text-[11px] text-slate-600 italic">No data yet</span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className="mb-6 p-3 bg-slate-950/50 rounded-lg border-l-2 border-indigo-500/50">
            <p className="text-xs text-slate-400 italic line-clamp-2">
              {notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-800/50">
          {status === "scheduled" && (
            <button className="btn btn-primary btn-sm w-full" onClick={onStart}>
              Start Session
            </button>
          )}

          {status === "in-progress" && (
            <>
              <button className="btn btn-ghost btn-sm" onClick={onEditNotes}>
                Add Notes
              </button>
              <button className="btn btn-success btn-sm flex-1" onClick={onComplete}>
                Complete
              </button>
            </>
          )}

          {status === "completed" && (
            <button className="btn btn-outline btn-sm w-full" onClick={onView}>
              View Full Summary
            </button>
          )}
        </div>
      </div>
    </div>
  );
}