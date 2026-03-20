import { useState, useEffect } from 'react';
import { usePatients } from '../hooks/usePatients';
import { createSession, updateNotes, completeSession } from '../services/api';

export default function SessionForm({ session, onClose, onSuccess }) {
  const { patients, loading: patientsLoading } = usePatients();
  const [formData, setFormData] = useState({
    patientId: '',
    machineId: '',
    preWeight: '',
    preSystolicBP: '',
    preDiastolicBP: '',
    postWeight: '',
    postSystolicBP: '',
    postDiastolicBP: '',
    duration: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mode = session?.mode || 'create'; // 'create', 'notes', 'complete'

  // Pre-fill data when editing/complete
  useEffect(() => {
    if (session && session._id) {
      setFormData({
        patientId: session.patientId,
        machineId: session.machineId,
        preWeight: session.preWeight,
        preSystolicBP: session.preSystolicBP,
        preDiastolicBP: session.preDiastolicBP,
        postWeight: session.postWeight || '',
        postSystolicBP: session.postSystolicBP || '',
        postDiastolicBP: session.postDiastolicBP || '',
        duration: session.duration || '',
        notes: session.notes || '',
      });
    }
  }, [session]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'create') {
        await createSession(formData);
      } else if (mode === 'notes') {
        await updateNotes(session._id, { notes: formData.notes });
      } else if (mode === 'complete') {
        const payload = {
          postWeight: formData.postWeight,
          postSystolicBP: formData.postSystolicBP,
          postDiastolicBP: formData.postDiastolicBP,
          duration: formData.duration,
        };
        await completeSession(session._id, payload);
      }
      onSuccess(); // refresh session list
      onClose();   // close modal
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderFields = () => {
    if (mode === 'notes') {
      return (
        <div className="form-control">
          <label className="label">Notes</label>
          <textarea
            name="notes"
            className="textarea textarea-bordered"
            value={formData.notes}
            onChange={handleChange}
            maxLength={300}
            rows={3}
          />
        </div>
      );
    }
    if (mode === 'complete') {
      return (
        <>
          <div className="form-control">
            <label className="label">Post Weight (kg)</label>
            <input
              type="number"
              name="postWeight"
              className="input input-bordered"
              value={formData.postWeight}
              onChange={handleChange}
              step="0.1"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">Post Systolic BP</label>
              <input
                type="number"
                name="postSystolicBP"
                className="input input-bordered"
                value={formData.postSystolicBP}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">Post Diastolic BP</label>
              <input
                type="number"
                name="postDiastolicBP"
                className="input input-bordered"
                value={formData.postDiastolicBP}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              className="input input-bordered"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>
        </>
      );
    }
    // create mode
    return (
      <>
        <div className="form-control">
          <label className="label">Patient</label>
          <select
            name="patientId"
            className="select select-bordered"
            value={formData.patientId}
            onChange={handleChange}
            required
          >
            <option value="">Select patient</option>
            {patients.map(p => (
              <option key={p._id} value={p._id}>{p.name} ({p.unit})</option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="label">Machine ID</label>
          <input
            type="text"
            name="machineId"
            className="input input-bordered"
            value={formData.machineId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">Pre Weight (kg)</label>
          <input
            type="number"
            name="preWeight"
            className="input input-bordered"
            value={formData.preWeight}
            onChange={handleChange}
            step="0.1"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">Pre Systolic BP</label>
            <input
              type="number"
              name="preSystolicBP"
              className="input input-bordered"
              value={formData.preSystolicBP}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">Pre Diastolic BP</label>
            <input
              type="number"
              name="preDiastolicBP"
              className="input input-bordered"
              value={formData.preDiastolicBP}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-control">
          <label className="label">Notes (optional)</label>
          <textarea
            name="notes"
            className="textarea textarea-bordered"
            value={formData.notes}
            onChange={handleChange}
            maxLength={300}
            rows={2}
          />
        </div>
      </>
    );
  };

  if (patientsLoading && mode === 'create') {
    return <div className="p-4">Loading patients...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="modal-box relative max-w-md w-full">
        <h3 className="font-bold text-lg mb-4">
          {mode === 'create' && 'New Session'}
          {mode === 'notes' && 'Edit Notes'}
          {mode === 'complete' && 'Complete Session'}
        </h3>
        <form onSubmit={handleSubmit}>
          {renderFields()}
          {error && <div className="alert alert-error mt-4">{error}</div>}
          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}