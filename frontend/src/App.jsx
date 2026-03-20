import { useState, useEffect } from 'react';
import { useSessions } from './hooks/useSessions';
import { fetchPatients, startSession } from './services/api';

import FilterBar from './components/FilterBar';
import PatientCard from './components/PatientCard';
import SessionForm from './components/SessionForm';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorAlert from './components/ErrorAlert';

function App() {
  const [selectedUnit, setSelectedUnit] = useState('');
  const [showOnlyAnomalies, setShowOnlyAnomalies] = useState(false);
  const [units, setUnits] = useState([]);
  const [patients, setPatients] = useState([]);
  const [modal, setModal] = useState({
    open: false,
    session: null,
    mode: 'create'
  });

  const today = new Date().toISOString().split('T')[0];

  const { sessions, loading, error, refetch } = useSessions(
    today,
    selectedUnit,
    showOnlyAnomalies
  );

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const res = await fetchPatients();

        setPatients(res.data);

        const allUnits = [...new Set(res.data.map(p => p.unit))];
        setUnits(allUnits);
      } catch (err) {
        console.error('Failed to load patients', err);
      }
    };
    loadPatients();
  }, []);

  // ✅ START SESSION
  const handleStartSession = async (sessionId) => {
    try {
      if (!sessionId) return;
      await startSession(sessionId);
      refetch();
    } catch (err) {
      console.error('❌ Failed to start session:', err);
    }
  };

  // ✅ MODALS
  const openNotesModal = (session) =>
    setModal({ open: true, session, mode: 'notes' });

  const openViewModal = (session) =>
    setModal({ open: true, session, mode: 'view' });

  const openCompleteModal = (session) =>
    setModal({ open: true, session, mode: 'complete' });

  const openCreatePatientModal = () =>
    setModal({ open: true, session: null, mode: 'createPatient' });

  const closeModal = () =>
    setModal({ open: false, session: null, mode: 'create' });

  const onModalSuccess = () => {
    refetch();
    closeModal();
  };

  if (loading && sessions.length === 0) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="bg-base-100 rounded-box shadow-xl p-6">

          {/* Header */}
          <h1 className="text-3xl font-bold mb-2">
            Dialysis Dashboard
          </h1>
          <p className="text-gray-500 mb-6">{today}</p>

          {/* 🔥 ACTION BUTTONS */}
          <div className="flex justify-between mb-4">
            <button
              className="btn btn-secondary btn-sm"
              onClick={openCreatePatientModal}
            >
              + Add Patient
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => setModal({ open: true, session: null, mode: 'create' })}
            >
              + Add Session
            </button>
          </div>

          {/* Filters */}
          <FilterBar
            selectedUnit={selectedUnit}
            onUnitChange={setSelectedUnit}
            showOnlyAnomalies={showOnlyAnomalies}
            onAnomalyFilterChange={setShowOnlyAnomalies}
            units={units}
          />

          {/* Content */}
          {sessions.length === 0 ? (
            <div className="alert alert-info shadow-lg mt-4">
              <span>No sessions scheduled for today.</span>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {sessions.map((session, index) => {

                const sessionId = session._id;

                const preBPParts = session.preBP ? session.preBP.split("/") : [];
                const postBPParts = session.postBP ? session.postBP.split("/") : [];

                const mappedSession = {
                  patient: {
                    name: session.patientName || "Unknown Patient",
                  },
                  status: session.status,
                  preWeight: session.preWeight,
                  postWeight: session.postWeight,
                  preSystolicBP: preBPParts[0] || null,
                  preDiastolicBP: preBPParts[1] || null,
                  postSystolicBP: postBPParts[0] || null,
                  postDiastolicBP: postBPParts[1] || null,
                  duration: session.duration,
                  anomalies: session.anomalies || [],
                  notes: session.notes,
                  machineId: session.machineId, // ✅ FIXED
                  _id: sessionId
                };

                return (
                  <PatientCard
                    key={sessionId || index}
                    session={mappedSession}
                    onStart={() => handleStartSession(sessionId)}
                    onComplete={() => openCompleteModal(mappedSession)}
                    onEditNotes={() => openNotesModal(mappedSession)}
                    onView={() => openViewModal(mappedSession)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <SessionForm
          session={modal.session}
          mode={modal.mode}
          onClose={closeModal}
          onSuccess={onModalSuccess}
          patients={patients}
        />
      )}
    </div>
  );
}

export default App;