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

  // ✅ Prefill notes
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

  // ✅ Submit
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
        console.log("Updating notes:", session._id, form.notes);
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
          {mode === "complete"
            ? "Complete Session"
            : mode === "notes"
            ? "Edit Notes"
            : "Session Summary"}
        </h2>

        {/* ✅ COMPLETE FORM */}
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

        {/* ✅ VIEW SUMMARY (READ-ONLY) */}
       {mode === "view" && (
  <div className="space-y-4 text-sm">

    {/* Patient */}
    <div>
      <p className="font-semibold text-base">
        {session.patient?.name || "Unknown Patient"}
      </p>
      <p className="text-xs text-gray-400 capitalize">
        Status: {session.status}
      </p>
    </div>

    {/* Pre Dialysis */}
    <div className="p-3 bg-base-200 rounded">
      <p className="font-semibold mb-1">Pre-Dialysis</p>
      <p>Weight: {session.preWeight ?? "--"} kg</p>
      <p>
        BP: {session.preSystolicBP && session.preDiastolicBP
          ? `${session.preSystolicBP}/${session.preDiastolicBP}`
          : "--"}
      </p>
    </div>

    {/* Post Dialysis */}
    <div className="p-3 bg-base-200 rounded">
      <p className="font-semibold mb-1">Post-Dialysis</p>
      <p>Weight: {session.postWeight ?? "--"} kg</p>
      <p>
        BP: {session.postSystolicBP && session.postDiastolicBP
          ? `${session.postSystolicBP}/${session.postDiastolicBP}`
          : "--"}
      </p>
    </div>

    {/* Session Info */}
    <div className="p-3 bg-base-200 rounded">
      <p><strong>Duration:</strong> {session.duration || "--"} mins</p>
      <p><strong>Notes:</strong> {session.notes || "No notes"}</p>
    </div>

    {/* Anomalies */}
    {session.anomalies?.length > 0 && (
      <div className="p-3 bg-red-100 rounded">
        <p className="font-semibold text-red-600 mb-1">Anomalies</p>
        <ul className="list-disc list-inside text-red-600 text-xs">
          {session.anomalies.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>
    )}

  </div>
)} {mode === "view" && (
          <div className="space-y-2 text-sm">

            <p><strong>Post Weight:</strong> {session.postWeight || "--"} kg</p>

            <p>
              <strong>Post BP:</strong>{" "}
              {session.postSystolicBP && session.postDiastolicBP
                ? `${session.postSystolicBP}/${session.postDiastolicBP}`
                : "--"}
            </p>

            <p><strong>Duration:</strong> {session.duration || "--"} mins</p>

            <p><strong>Notes:</strong> {session.notes || "No notes"}</p>

          </div>
        )}

        {/* ✅ NOTES INPUT */}
        {(mode === "notes" || mode === "complete") && (
          <textarea
            name="notes"
            placeholder="Notes"
            className="textarea textarea-bordered w-full"
            value={form.notes}
            onChange={handleChange}
          />
        )}

        {/* ACTIONS */}
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>

          {/* ❌ Hide in view mode */}
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