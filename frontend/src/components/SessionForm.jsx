import { useState, useEffect } from "react";
import { completeSession, updateNotes, createSession, createPatient } from "../services/api";

const InputField = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <input 
      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-600"
      {...props} 
    />
  </div>
);

const SelectField = ({ label, children, ...props }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <select 
      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
      {...props}
    >
      {children}
    </select>
  </div>
);

export default function SessionForm({ session, mode, onClose, onSuccess, patients = [] }) {
  const [form, setForm] = useState({
    patientId: "", unit: "", preWeight: "", preSystolicBP: "", preDiastolicBP: "",
    sessionDate: "", machineId: "", name: "", age: "", gender: "", dryWeight: "",
    postWeight: "", postSystolicBP: "", postDiastolicBP: "", duration: "", notes: ""
  });

  useEffect(() => {
    if (session && mode === "notes") {
      setForm((prev) => ({ ...prev, notes: session.notes || "" }));
    }
  }, [session, mode]);

  const handleChange = (e) => {
    if (e.target.name === "patientId") {
      const selected = patients.find(p => p._id === e.target.value);
      setForm(prev => ({ ...prev, patientId: selected?._id || "", unit: selected?.unit || "" }));
      return;
    }
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      if (mode === "create") {
        if (!form.patientId || !form.sessionDate || !form.machineId) return alert("Required fields missing");
        await createSession({
          patientId: form.patientId, unit: form.unit, preWeight: Number(form.preWeight),
          preSystolicBP: Number(form.preSystolicBP), preDiastolicBP: Number(form.preDiastolicBP),
          machineId: form.machineId, notes: form.notes, sessionDate: form.sessionDate
        });
      }
      if (mode === "complete") {
        await completeSession(session._id, {
          postWeight: Number(form.postWeight), postSystolicBP: Number(form.postSystolicBP),
          postDiastolicBP: Number(form.postDiastolicBP), duration: Number(form.duration), notes: form.notes
        });
      }
      if (mode === "notes") await updateNotes(session._id, form.notes);
      if (mode === "createPatient") {
        if (!form.name || !form.age || !form.gender || !form.dryWeight || !form.unit) return alert("All fields required");
        await createPatient({
          name: form.name.trim(), age: Number(form.age), gender: form.gender,
          dryWeight: Number(form.dryWeight), unit: form.unit.toUpperCase()
        });
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.status === 409 ? "Session already exists" : "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">
              {mode === "create" && "Create Treatment Session"}
              {mode === "complete" && "Complete Session Data"}
              {mode === "notes" && "Clinical Notes"}
              {mode === "view" && "Treatment Report"}
              {mode === "createPatient" && "Register New Patient"}
            </h2>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Ref: {session?._id?.slice(-8) || 'NEW_RECORD'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-8 py-6 overflow-y-auto custom-scrollbar space-y-6">
          
          {mode === "create" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <SelectField label="Select Patient" name="patientId" value={form.patientId} onChange={handleChange}>
                  <option value="">Select a registered patient...</option>
                  {patients.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.unit})</option>)}
                </SelectField>
              </div>
              <InputField label="Session Date" type="date" name="sessionDate" onChange={handleChange} />
              <InputField label="Machine ID" name="machineId" placeholder="e.g. MAC-001" onChange={handleChange} />
              <InputField label="Pre-Weight (kg)" type="number" name="preWeight" placeholder="0.0" onChange={handleChange} />
              <div className="flex gap-2">
                <InputField label="BP (Systolic)" type="number" name="preSystolicBP" placeholder="120" onChange={handleChange} />
                <InputField label="BP (Diastolic)" type="number" name="preDiastolicBP" placeholder="80" onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Initial Notes</label>
                <textarea name="notes" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm min-h-[80px]" onChange={handleChange} />
              </div>
            </div>
          )}

          {mode === "createPatient" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><InputField label="Full Name" name="name" onChange={handleChange} /></div>
              <InputField label="Age" type="number" name="age" onChange={handleChange} />
              <SelectField label="Gender" name="gender" onChange={handleChange}>
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </SelectField>
              <InputField label="Dry Weight (kg)" type="number" name="dryWeight" onChange={handleChange} />
              <SelectField label="Assigned Unit" name="unit" onChange={handleChange}>
                <option value="">Select Unit...</option>
                {["CLINIC A", "CLINIC B", "CLINIC C", "CLINIC D", "CLINIC E"].map(u => <option key={u} value={u}>{u}</option>)}
              </SelectField>
            </div>
          )}

          {mode === "complete" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Post-Weight (kg)" type="number" name="postWeight" onChange={handleChange} />
              <InputField label="Session Duration (mins)" type="number" name="duration" onChange={handleChange} />
              <div className="flex gap-2">
                <InputField label="Post BP (Systolic)" type="number" name="postSystolicBP" onChange={handleChange} />
                <InputField label="Post BP (Diastolic)" type="number" name="postDiastolicBP" onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Final Treatment Notes</label>
                <textarea name="notes" value={form.notes} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm min-h-[100px]" onChange={handleChange} />
              </div>
            </div>
          )}

          {mode === "view" && (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">{session.patient?.name}</h3>
                  <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Machine: {session.machineId || "N/A"}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-widest block">Duration</span>
                  <span className="text-lg font-mono font-bold text-indigo-300">{session.duration ? `${session.duration}m` : "N/A"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Pre-Treatment</h4>
                  <p className="text-sm font-semibold mb-1">Weight: <span className="text-slate-200">{session.preWeight}kg</span></p>
                  <p className="text-sm font-semibold">BP: <span className="text-slate-200">{session.preSystolicBP}/{session.preDiastolicBP}</span></p>
                </div>
                <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                  <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">Post-Treatment</h4>
                  <p className="text-sm font-semibold mb-1">Weight: <span className="text-emerald-200">{session.postWeight ?? "N/A"}kg</span></p>
                  <p className="text-sm font-semibold">BP: <span className="text-emerald-200">{session.postSystolicBP || "-"}/{session.postDiastolicBP || "-"}</span></p>
                </div>
              </div>

              {session.anomalies?.length > 0 && (
                <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                  <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Detected Anomalies</h4>
                  <div className="flex flex-wrap gap-2">
                    {session.anomalies.map((a, i) => <span key={i} className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">{a}</span>)}
                  </div>
                </div>
              )}

              <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Clinical Notes</h4>
                <p className="text-sm text-slate-300 italic">"{session.notes || "No clinical notes recorded for this session."}"</p>
              </div>
            </div>
          )}

          {mode === "notes" && (
            <textarea name="notes" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm min-h-[200px] focus:ring-2 focus:ring-indigo-500/40 focus:outline-none" value={form.notes} onChange={handleChange} placeholder="Enter observations..." />
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-white transition-colors">
            {mode === "view" ? "CLOSE" : "CANCEL"}
          </button>
          {mode !== "view" && (
            <button onClick={handleSubmit} className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-950/40">
              SAVE CHANGES
            </button>
          )}
        </div>
      </div>
    </div>
  );
}