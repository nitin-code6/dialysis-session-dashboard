import { useState, useEffect } from "react";
import { completeSession, updateNotes } from "../services/api";

export default function SessionForm({ session, mode, onClose, onSuccess }) {
  const [form, setForm] = useState({ postWeight: "", postSystolicBP: "", postDiastolicBP: "", duration: "", notes: "" });

  useEffect(() => {
    if (session && mode === "notes") setForm((prev) => ({ ...prev, notes: session.notes || "" }));
  }, [session, mode]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (!session?._id) return;
      if (mode === "complete") {
        await completeSession(session._id, {
          postWeight: Number(form.postWeight),
          postSystolicBP: Number(form.postSystolicBP),
          postDiastolicBP: Number(form.postDiastolicBP),
          duration: Number(form.duration),
          notes: form.notes
        });
      }
      if (mode === "notes") await updateNotes(session._id, form.notes);
      onSuccess();
    } catch (err) { console.error("❌ Submit failed:", err); }
  };

  return (
    <div className="modal modal-open backdrop-blur-sm">
      <div className="modal-box bg-slate-900 border border-slate-800 max-w-md p-0 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-slate-800/50 p-6 pb-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            {mode === "complete" ? "Finalize Session" : mode === "notes" ? "Session Notes" : "Medical Summary"}
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-tighter">
            Patient: {session?.patient?.name}
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* COMPLETE MODE */}
          {mode === "complete" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control col-span-2 sm:col-span-1">
                <label className="label text-[10px] font-bold uppercase text-slate-500">Post Weight (kg)</label>
                <input type="number" name="postWeight" className="input input-bordered bg-slate-950 border-slate-700 focus:border-indigo-500" onChange={handleChange} />
              </div>
              <div className="form-control col-span-2 sm:col-span-1">
                <label className="label text-[10px] font-bold uppercase text-slate-500">Duration (mins)</label>
                <input type="number" name="duration" className="input input-bordered bg-slate-950 border-slate-700 focus:border-indigo-500" onChange={handleChange} />
              </div>
              <div className="form-control">
                <label className="label text-[10px] font-bold uppercase text-slate-500">Systolic BP</label>
                <input type="number" name="postSystolicBP" className="input input-bordered bg-slate-950 border-slate-700" onChange={handleChange} />
              </div>
              <div className="form-control">
                <label className="label text-[10px] font-bold uppercase text-slate-500">Diastolic BP</label>
                <input type="number" name="postDiastolicBP" className="input input-bordered bg-slate-950 border-slate-700" onChange={handleChange} />
              </div>
            </div>
          )}

          {/* VIEW SUMMARY MODE */}
          {mode === "view" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-px bg-slate-800 border border-slate-800 rounded-lg overflow-hidden">
                <div className="bg-slate-900 p-3">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Pre-Dialysis</p>
                  <p className="text-sm font-semibold text-slate-200">{session.preWeight || '--'} kg</p>
                  <p className="text-sm text-slate-400 font-mono">{session.preSystolicBP}/{session.preDiastolicBP}</p>
                </div>
                <div className="bg-slate-900 p-3">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase mb-2">Post-Dialysis</p>
                  <p className="text-sm font-semibold text-slate-200">{session.postWeight || '--'} kg</p>
                  <p className="text-sm text-slate-400 font-mono">{session.postSystolicBP}/{session.postDiastolicBP}</p>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Session Insights</p>
                <p className="text-sm text-slate-300">Duration: <b>{session.duration || '--'} mins</b></p>
              </div>

              {session.anomalies?.length > 0 && (
                <div className="p-3 bg-red-500/5 border border-red-500/20 rounded">
                  <p className="text-[10px] font-bold text-red-500 uppercase mb-2">Clinical Alerts</p>
                  <ul className="space-y-1">
                    {session.anomalies.map((a, i) => (
                      <li key={i} className="text-xs text-red-400 flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* NOTES INPUT (Used in Complete or Notes mode) */}
          {(mode === "notes" || mode === "complete") && (
            <div className="form-control">
              <label className="label text-[10px] font-bold uppercase text-slate-500">Session Observations</label>
              <textarea name="notes" placeholder="Enter clinical notes..." className="textarea textarea-bordered bg-slate-950 border-slate-700 h-24" value={form.notes} onChange={handleChange} />
            </div>
          )}

          {/* VIEW NOTES (Summary mode only) */}
          {mode === "view" && session.notes && (
            <div className="p-3 bg-slate-900 border-l-2 border-indigo-500 italic">
               <p className="text-xs text-slate-400">"{session.notes}"</p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-6 pt-0 flex gap-3">
          <button className="btn btn-ghost flex-1 text-slate-400 hover:bg-slate-800" onClick={onClose}>
            {mode === 'view' ? 'Close' : 'Cancel'}
          </button>
          {mode !== "view" && (
            <button className="btn btn-primary flex-1 shadow-lg shadow-indigo-500/20" onClick={handleSubmit}>
              {mode === "complete" ? "Finalize" : "Save Notes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}