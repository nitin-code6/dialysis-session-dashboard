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

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const { sessions, loading, error, refetch } = useSessions(
    new Date().toISOString().split('T')[0],
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

  const handleStartSession = async (sessionId) => {
    try {
      if (!sessionId) return;
      await startSession(sessionId);
      refetch();
    } catch (err) {
      console.error('❌ Failed to start session:', err);
    }
  };

  const openNotesModal = (session) => setModal({ open: true, session, mode: 'notes' });
  const openViewModal = (session) => setModal({ open: true, session, mode: 'view' });
  const openCompleteModal = (session) => setModal({ open: true, session, mode: 'complete' });
  const openCreatePatientModal = () => setModal({ open: true, session: null, mode: 'createPatient' });
  const closeModal = () => setModal({ open: false, session: null, mode: 'create' });
  const onModalSuccess = () => { refetch(); closeModal(); };

  if (loading && sessions.length === 0) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xl">D</span>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white">DialysisCenter</h1>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold leading-none">Clinical Dashboard</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-300">{today}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Actions & Filters Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <FilterBar
                selectedUnit={selectedUnit}
                onUnitChange={setSelectedUnit}
                showOnlyAnomalies={showOnlyAnomalies}
                onAnomalyFilterChange={setShowOnlyAnomalies}
                units={units}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700"
                onClick={openCreatePatientModal}
              >
                + Add Patient
              </button>
              <button
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                onClick={() => setModal({ open: true, session: null, mode: 'create' })}
              >
                + New Session
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-300">No sessions scheduled</h3>
            <p className="text-slate-500">Refine your filters or create a new session to begin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session, index) => {
              const preBPParts = session.preBP ? session.preBP.split("/") : [];
              const postBPParts = session.postBP ? session.postBP.split("/") : [];

              const mappedSession = {
                patient: { name: session.patientName || "Unknown Patient" },
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
                machineId: session.machineId,
                _id: session._id
              };

              return (
                <PatientCard
                  key={session._id || index}
                  session={mappedSession}
                  onStart={() => handleStartSession(session._id)}
                  onComplete={() => openCompleteModal(mappedSession)}
                  onEditNotes={() => openNotesModal(mappedSession)}
                  onView={() => openViewModal(mappedSession)}
                />
              );
            })}
          </div>
        )}
      </main>

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