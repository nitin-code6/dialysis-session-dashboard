import { useEffect, useState } from 'react';
import { fetchSessions } from './services/api';

function App() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        const res = await fetchSessions(); // gets today's sessions
        setSessions(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Today's Sessions</h1>
      <pre>{JSON.stringify(sessions, null, 2)}</pre>
    </div>
  );
}

export default App;