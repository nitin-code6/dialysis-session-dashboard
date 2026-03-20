import { useState, useEffect } from "react";
import { completeSession, updateNotes } from "../services/api";

export default function SessionForm({ session, mode, onClose, onSuccess }) {
  const [form, setForm] = useState({
    postWeight: "",
    postSystolicBP: "",
    postDiastolicBP: "",
    duration: "",
    notes: ""
  });

  // ✅ Prefill notes if editing
  useEffect(() => {
    if (session && mode === "notes") {
      setForm((prev) => ({
        ...prev,
        notes: session.notes || ""
      }));
    }
  }, [session, mode]);

  // ✅ Handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Submit handler
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

      if (mode === "notes") {
        await updateNotes(session._id, form.notes);
      }

      onSuccess();
    } catch (err) {
      console.error("❌ Submit failed:", err);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box space-y-4">
        
        {/* Header */}
        <h2 className="text-xl font-bold">
          {mode === "complete" ? "Complete Session" : "Edit Notes"}
        </h2>

        {/* COMPLETE FORM */}
        {mode === "complete" && (
          <div className="space-y-3">

            <input
              type="number"
              name="postWeight"
              placeholder="Post Weight (kg)"
              className="input input-bordered w-full"
              onChange={handleChange}
            />

            <input
              type="number"
              name="postSystolicBP"
              placeholder="Systolic BP"
              className="input input-bordered w-full"
              onChange={handleChange}
            />

            <input
              type="number"
              name="postDiastolicBP"
              placeholder="Diastolic BP"
              className="input input-bordered w-full"
              onChange={handleChange}
            />

            <input
              type="number"
              name="duration"
              placeholder="Duration (minutes)"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>
        )}

        {/* NOTES FORM */}
        {(mode === "notes" || mode === "complete") && (
          <textarea
            name="notes"
            placeholder="Notes"
            className="textarea textarea-bordered w-full"
            value={form.notes}
            onChange={handleChange}
          />
        )}

        {/* ACTION BUTTONS */}
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>

          <button className="btn btn-primary" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}