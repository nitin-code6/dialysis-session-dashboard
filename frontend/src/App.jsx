import { useState, useEffect } from 'react';
import { useSessions } from './hooks/useSessions';
import FilterBar from './components/FilterBar';
import SessionCard from './components/SessionCard'; // ✅ FIXED
import { fetchPatients } from './services/api';

function App() {
  const [selectedUnit, setSelectedUnit] = useState('');
  const [showOnlyAnomalies, setShowOnlyAnomalies] = useState(false);
  const [units, setUnits] = useState([]);

  const today = new Date().toISOString().split('T')[0];

  const { sessions, loading, error, refetch } = useSessions(
    today,
    selectedUnit,
    showOnlyAnomalies
  );

  // Fetch units
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

  // ✅ Handlers
  const handleEditNotes = (session) => {
    console.log('Edit notes for', session._id);
  };

  const handleComplete = async (session) => {
    console.log('Complete session', session._id);
    // later: call API + refetch()
    // await completeSession(session._id);
    // refetch();
  };

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
            <SessionCard
              key={session._id}
              session={session}
              onEditNotes={handleEditNotes}
              onComplete={handleComplete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;