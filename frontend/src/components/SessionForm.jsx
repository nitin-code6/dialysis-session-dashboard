import { useState, useEffect } from "react";
import { completeSession, updateNotes, createSession } from "../services/api";

export default function SessionForm({
  session,
  mode,
  onClose,
  onSuccess,
  patients = []
}) {
  const [form, setForm] = useState({
    patientId: "",
    unit: "",
    preWeight: "",
    preSystolicBP: "",
    preDiastolicBP: "",
    sessionDate: "",
    machineId: "", // ✅ ADDED
    postWeight: "",
    postSystolicBP: "",
    postDiastolicBP: "",
    duration: "",
    notes: ""
  });

  useEffect(() => {
    if (session && mode === "notes") {
      setForm((prev) => ({
        ...prev,
        notes: session.notes || ""
      }));
    }
  }, [session, mode]);

  const handleChange = (e) => {
    if (e.target.name === "patientId") {
      const selected = patients.find(p => p._id === e.target.value);

      setForm(prev => ({
        ...prev,
        patientId: selected?._id || "",
        unit: selected?.unit || ""
      }));
      return;
    }

    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (mode === "create") {

        if (!form.patientId) {
          alert("Please select a patient");
          return;
        }

        if (!form.sessionDate) {
          alert("Please select a date");
          return;
        }

        if (!form.machineId) {
          alert("Please enter machine ID");
          return;
        }

        console.log("FINAL DATA SENT:", form);

        await createSession({
          patientId: form.patientId,
          unit: form.unit,
          preWeight: Number(form.preWeight),
          preSystolicBP: Number(form.preSystolicBP),
          preDiastolicBP: Number(form.preDiastolicBP),
          machineId: form.machineId,   // ✅ IMPORTANT
          notes: form.notes,
          sessionDate: form.sessionDate   // ✅ STRING (correct)
        });
      }

      if (mode === "complete") {
        await completeSession(session._id, {
          postWeight: Number(form.postWeight),
          postSystolicBP: Number(form.postSystolicBP),
          postDiastolicBP: Number(form.postDiastolicBP),
          duration: Number(form.duration),
          notes: form.notes
        });
      }

      if (mode === "notes") {
        await updateNotes(session._id, form.notes);
      }

      onSuccess();

    } catch (err) {
      if (err.response?.status === 409) {
        alert("Session already exists for this patient on this date");
      } else if (err.response?.status === 400) {
        alert("Invalid data. Please check inputs.");
      } else {
        console.error("❌ Submit failed:", err);
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box space-y-4">

        <h2 className="text-xl font-bold">
          {mode === "create"
            ? "Create Session"
            : mode === "complete"
            ? "Complete Session"
            : mode === "notes"
            ? "Edit Notes"
            : "Session Summary"}
        </h2>

        {/* CREATE */}
        {mode === "create" && (
          <div className="space-y-3">

            <select
              name="patientId"
              className="select select-bordered w-full"
              value={form.patientId}
              onChange={handleChange}
            >
              <option value="">Select Patient</option>
              {patients.map((p, index) => (
                <option key={p._id || index} value={p._id}>
                  {p.name} ({p.unit})
                </option>
              ))}
            </select>

            <input
              type="date"
              name="sessionDate"
              className="input input-bordered w-full"
              onChange={handleChange}
            />

            {/* ✅ MACHINE ID */}
            <input
              type="text"
              name="machineId"
              placeholder="Machine ID (e.g. MACH-01)"
              className="input input-bordered w-full"
              onChange={handleChange}
            />

            <input
              type="number"
              name="preWeight"
              placeholder="Pre Weight"
              className="input input-bordered w-full"
              onChange={handleChange}
            />

            <input
              type="number"
              name="preSystolicBP"
              placeholder="Systolic BP"
              className="input input-bordered w-full"
              onChange={handleChange}
            />

            <input
              type="number"
              name="preDiastolicBP"
              placeholder="Diastolic BP"
              className="input input-bordered w-full"
              onChange={handleChange}
            />

            <textarea
              name="notes"
              placeholder="Notes"
              className="textarea textarea-bordered w-full"
              onChange={handleChange}
            />
          </div>
        )}

        {/* COMPLETE */}
        {mode === "complete" && (
          <div className="space-y-3">
            <input type="number" name="postWeight" placeholder="Post Weight" className="input input-bordered w-full" onChange={handleChange} />
            <input type="number" name="postSystolicBP" placeholder="Systolic BP" className="input input-bordered w-full" onChange={handleChange} />
            <input type="number" name="postDiastolicBP" placeholder="Diastolic BP" className="input input-bordered w-full" onChange={handleChange} />
            <input type="number" name="duration" placeholder="Duration" className="input input-bordered w-full" onChange={handleChange} />
          </div>
        )}

        {/* VIEW */}
        {mode === "view" && (
          <div className="space-y-4 text-sm">
            <p><b>{session.patient?.name}</b></p>
            <p>Status: {session.status}</p>
            <p>Pre: {session.preWeight} kg</p>
            <p>Post: {session.postWeight ?? "--"} kg</p>
            <p>Duration: {session.duration || "--"} mins</p>
            <p>Notes: {session.notes || "No notes"}</p>
          </div>
        )}

        {(mode === "notes" || mode === "complete") && (
          <textarea
            name="notes"
            className="textarea textarea-bordered w-full"
            value={form.notes}
            onChange={handleChange}
          />
        )}

        <div className="modal-action">
          <button className="btn" onClick={onClose}>Cancel</button>
          {mode !== "view" && (
            <button className="btn btn-primary" onClick={handleSubmit}>
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}