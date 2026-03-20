import { useState, useEffect } from "react";
import { completeSession, updateNotes, createSession, createPatient } from "../services/api";

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
    machineId: "",

    // ✅ CREATE PATIENT
    name: "",
    age: "",
    gender: "",
    dryWeight: "",

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

      // ✅ CREATE SESSION
      if (mode === "create") {
        if (!form.patientId) return alert("Select patient");
        if (!form.sessionDate) return alert("Select date");
        if (!form.machineId) return alert("Enter machine ID");

        await createSession({
          patientId: form.patientId,
          unit: form.unit,
          preWeight: Number(form.preWeight),
          preSystolicBP: Number(form.preSystolicBP),
          preDiastolicBP: Number(form.preDiastolicBP),
          machineId: form.machineId,
          notes: form.notes,
          sessionDate: form.sessionDate
        });
      }

      // ✅ COMPLETE SESSION
      if (mode === "complete") {
        await completeSession(session._id, {
          postWeight: Number(form.postWeight),
          postSystolicBP: Number(form.postSystolicBP),
          postDiastolicBP: Number(form.postDiastolicBP),
          duration: Number(form.duration),
          notes: form.notes
        });
      }

      // ✅ NOTES
      if (mode === "notes") {
        await updateNotes(session._id, form.notes);
      }

      // ✅ CREATE PATIENT
      if (mode === "createPatient") {
        if (!form.name || !form.age || !form.gender || !form.dryWeight || !form.unit) {
          return alert("All fields required");
        }

        await createPatient({
          name: form.name.trim(),
          age: Number(form.age),
          gender: form.gender,
          dryWeight: Number(form.dryWeight),
          unit: form.unit.toUpperCase()
        });
      }

      onSuccess();

    } catch (err) {
      if (err.response?.status === 409) {
        alert("Session already exists");
      } else if (err.response?.status === 400) {
        alert("Invalid data");
      } else {
        console.error(err);
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box space-y-4">

        <h2 className="text-xl font-bold">
          {mode === "create" && "Create Session"}
          {mode === "complete" && "Complete Session"}
          {mode === "notes" && "Edit Notes"}
          {mode === "view" && "Session Summary"}
          {mode === "createPatient" && "Create Patient"}
        </h2>

        {/* ✅ CREATE SESSION */}
        {mode === "create" && (
          <div className="space-y-3">

            <select name="patientId" className="select w-full" value={form.patientId} onChange={handleChange}>
              <option value="">Select Patient</option>
              {patients.map((p, i) => (
                <option key={p._id || i} value={p._id}>
                  {p.name} ({p.unit})
                </option>
              ))}
            </select>

            <input type="date" name="sessionDate" className="input w-full" onChange={handleChange} />

            <input name="machineId" placeholder="Machine ID" className="input w-full" onChange={handleChange} />

            <input type="number" name="preWeight" placeholder="Pre Weight" className="input w-full" onChange={handleChange} />

            <input type="number" name="preSystolicBP" placeholder="Systolic BP" className="input w-full" onChange={handleChange} />

            <input type="number" name="preDiastolicBP" placeholder="Diastolic BP" className="input w-full" onChange={handleChange} />

            <textarea name="notes" placeholder="Notes" className="textarea w-full" onChange={handleChange} />
          </div>
        )}

        {/* ✅ CREATE PATIENT */}
        {mode === "createPatient" && (
  <div className="space-y-3">

    <input
      name="name"
      placeholder="Name"
      className="input w-full"
      value={form.name}
      onChange={handleChange}
    />

    <input
      type="number"
      name="age"
      placeholder="Age"
      className="input w-full"
      value={form.age}
      onChange={handleChange}
    />

    <select
      name="gender"
      className="select w-full"
      value={form.gender}
      onChange={handleChange}
    >
      <option value="">Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>

    <input
      type="number"
      name="dryWeight"
      placeholder="Dry Weight"
      className="input w-full"
      value={form.dryWeight}
      onChange={handleChange}
    />

    {/* ✅ FIXED UNIT */}
    <select
      name="unit"
      className="select w-full"
      value={form.unit}
      onChange={handleChange}
    >
      <option value="">Select Unit</option>
      <option value="CLINIC A">CLINIC A</option>
      <option value="CLINIC B">CLINIC B</option>
      <option value="CLINIC C">CLINIC C</option>
       <option value="CLINIC D">CLINIC D</option>
      <option value="CLINIC E">CLINIC E</option>
      <option value="CLINIC F">CLINIC F</option>
    </select>

  </div>
)}

        {/* ✅ COMPLETE */}
        {mode === "complete" && (
          <div className="space-y-3">
            <input type="number" name="postWeight" placeholder="Post Weight" className="input w-full" onChange={handleChange} />
            <input type="number" name="postSystolicBP" placeholder="Systolic BP" className="input w-full" onChange={handleChange} />
            <input type="number" name="postDiastolicBP" placeholder="Diastolic BP" className="input w-full" onChange={handleChange} />
            <input type="number" name="duration" placeholder="Duration" className="input w-full" onChange={handleChange} />
          </div>
        )}

        {/* ✅ VIEW SUMMARY */}
        {mode === "view" && (
          <div className="space-y-2 text-sm">
            <p><b>{session.patient?.name}</b></p>
            <p>Status: {session.status}</p>
            <p>Machine: {session.machineId || "--"}</p> {/* ✅ ADDED */}
            <p>Pre: {session.preWeight} kg</p>
            <p>Post: {session.postWeight ?? "--"} kg</p>
            <p>Duration: {session.duration || "--"} mins</p>
            <p>Notes: {session.notes || "No notes"}</p>
          </div>
        )}

        {(mode === "notes" || mode === "complete") && (
          <textarea
            name="notes"
            className="textarea w-full"
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