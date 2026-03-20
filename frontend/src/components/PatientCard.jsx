const anomalyConfig = {
  EXCESS_WEIGHT_GAIN: { label: 'Excess Weight Gain', color: 'badge-warning', bg: 'bg-warning/10 text-warning' },
  INADEQUATE_FLUID_REMOVAL: { label: 'Inadequate Fluid Removal', color: 'badge-warning', bg: 'bg-warning/10 text-warning' },
  HIGH_BP: { label: 'High BP', color: 'badge-error', bg: 'bg-error/10 text-error' },
  SHORT_SESSION: { label: 'Short Session', color: 'badge-info', bg: 'bg-info/10 text-info' },
  LONG_SESSION: { label: 'Long Session', color: 'badge-info', bg: 'bg-info/10 text-info' },
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
  onEditNotes
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
  } = session;

  const currentStatus = statusConfig[status] || { label: status, class: 'bg-slate-700' };
  const hasAnomalies = anomalies?.length > 0;

  return (
    <div className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
      hasAnomalies 
        ? 'bg-slate-900 border-error/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
    }`}>
      
      {/* Top Accent Bar for Anomalies */}
      {hasAnomalies && <div className="absolute top-0 left-0 w-full h-1 bg-error shadow-[0_0_10px_rgba(239,68,68,0.5)]" />}

      <div className="p-5">
        {/* Header: Name and Status */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
              {patient?.name || 'Unknown Patient'}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Duration</span>
              <span className="text-sm font-medium text-slate-300">{duration ? `${duration}m` : '--'}</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${currentStatus.class}`}>
            {status === 'in-progress' && <span className="inline-block w-2 h-2 mr-2 bg-info rounded-full animate-pulse"></span>}
            {currentStatus.label}
          </div>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Pre-Dialysis Section */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.15em] mb-2">Pre-Dialysis</h4>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">Weight</span>
              <span className="text-lg font-semibold text-white leading-none">
                {preWeight ?? '--'} <small className="text-xs font-normal text-slate-500">kg</small>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">Blood Pressure</span>
              <span className="text-lg font-semibold text-white leading-none tracking-tight">
                {preSystolicBP && preDiastolicBP ? `${preSystolicBP}/${preDiastolicBP}` : '--'}
              </span>
            </div>
          </div>

          {/* Post-Dialysis Section */}
          <div className={`space-y-3 rounded-lg transition-colors ${postWeight ? '' : 'opacity-40'}`}>
            <h4 className="text-[11px] font-black uppercase text-blue-400 tracking-[0.15em] mb-2">Post-Dialysis</h4>
            {postWeight != null ? (
              <>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-slate-500">Weight</span>
                  <span className="text-lg font-semibold text-blue-100 leading-none">
                    {postWeight} <small className="text-xs font-normal text-slate-500">kg</small>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-slate-500">Blood Pressure</span>
                  <span className="text-lg font-semibold text-blue-100 leading-none tracking-tight">
                    {postSystolicBP && postDiastolicBP ? `${postSystolicBP}/${postDiastolicBP}` : '--'}
                  </span>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center italic text-xs text-slate-600 border-l border-slate-800 pl-4">
                Awaiting results...
              </div>
            )}
          </div>
        </div>

        {/* Alerts / Anomalies */}
        {hasAnomalies && (
          <div className="mb-6 flex flex-wrap gap-2">
            {anomalies.map((code, i) => (
              <div key={code + i} className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-tight ${anomalyConfig[code]?.bg || 'bg-slate-800 text-slate-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {anomalyConfig[code]?.label || code}
              </div>
            ))}
          </div>
        )}

        {/* Notes Section */}
        {notes && (
          <div className="mb-6 p-3 bg-slate-950/50 rounded-lg border border-slate-800">
            <p className="text-xs leading-relaxed text-slate-400 italic">
              <span className="not-italic mr-1 text-slate-600 font-bold">NOTE:</span> "{notes}"
            </p>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center gap-2 mt-2 pt-4 border-t border-slate-800/50">
          {status === 'scheduled' && (
            <button
              className="btn btn-primary btn-sm flex-1 bg-indigo-600 hover:bg-indigo-500 border-none text-white font-bold transition-all shadow-lg shadow-indigo-900/20"
              onClick={onStart}
            >
              START SESSION
            </button>
          )}

          {status === 'in-progress' && (
            <>
              <button
                className="btn btn-ghost btn-sm text-slate-400 hover:text-white hover:bg-slate-800 px-4"
                onClick={onEditNotes}
              >
                NOTES
              </button>
              <button
                className="btn btn-success btn-sm flex-1 bg-emerald-600 hover:bg-emerald-500 border-none text-white font-bold shadow-lg shadow-emerald-900/20"
                onClick={onComplete}
              >
                COMPLETE
              </button>
            </>
          )}

          {status === 'completed' && (
            <button
              className="btn btn-outline btn-sm w-full border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
              onClick={onEditNotes}
            >
              VIEW SUMMARY
            </button>
          )}
        </div>
      </div>
    </div>
  );
}