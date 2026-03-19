import { useState, useEffect } from 'react';
import { useSessions } from './hooks/useSessions';
import FilterBar from './components/FilterBar';
import { fetchPatients } from './services/api';

function App() {
  const [selectedUnit, setSelectedUnit] = useState('');
  const [showOnlyAnomalies, setShowOnlyAnomalies] = useState(false);
  const [units, setUnits] = useState([]);

  // Get today's date (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  const { sessions, loading, error } = useSessions(
    today,
    selectedUnit,
    showOnlyAnomalies
  );

  // Fetch units from patients
  useEffect(() => {
    const loadUnits = async () => {
      try {
        const res = await fetchPatients();
        const allUnits = [...new Set(res.data.map(p => p.unit))];
        setUnits(allUnits);
      } catch (err) {
        console.error('Failed to load units', err);
      }
    };
    loadUnits();
  }, []);

  // Loading UI
  if (loading && sessions.length === 0) {
    return (
      <div className="flex justify-center p-6">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Dialysis Schedule - {today}
      </h1>

      {/* Filters */}
      <FilterBar
        selectedUnit={selectedUnit}
        onUnitChange={setSelectedUnit}
        showOnlyAnomalies={showOnlyAnomalies}
        onAnomalyFilterChange={setShowOnlyAnomalies}
        units={units}
      />

      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No sessions scheduled for today
          </div>
        ) : (
          sessions.map(session => (
            <div
              key={session._id}
              className="card bg-base-100 shadow-xl p-4 border border-base-200"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="card-title">
                  {session.patientName || 'Unknown'}
                </h2>

                <span
                  className={`badge ${
                    session.status === 'completed'
                      ? 'badge-success'
                      : session.status === 'in-progress'
                      ? 'badge-info'
                      : 'badge-ghost'
                  }`}
                >
                  {session.status}
                </span>
              </div>

              {/* Pre Data */}
             
              <p>
                Pre: {session.preWeight} kg | BP {session.preBP || 'N/A'}
              </p>

              {/* Post Data */}
              {session.postWeight && (
               
           <p>
             Post: {session.preWeight} kg | BP {session.postBP || 'N/A'}
            </p>
              )}

              {/* Duration */}
              {session.duration && (
                <p>Duration: {session.duration} min</p>
              )}

              {/* Notes */}
              {session.notes && <p>Notes: {session.notes}</p>}

              {/* Anomalies */}
              {session.anomalies?.length > 0 && (
                <div className="alert alert-warning mt-2">
                  <span>⚠ {session.anomalies.join(', ')}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;