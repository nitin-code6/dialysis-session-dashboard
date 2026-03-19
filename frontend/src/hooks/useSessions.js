import { useState, useEffect, useCallback } from 'react';
import { fetchSessions } from '../services/api';

export const useSessions = (date, unit, showOnlyAnomalies) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = { date };
      if (unit) params.unit = unit;

      const res = await fetchSessions(params);
      let data = res.data;

      if (showOnlyAnomalies) {
        data = data.filter(s => s?.anomalies?.length > 0);
      }

      setSessions(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [date, unit, showOnlyAnomalies]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return { sessions, loading, error, refetch: loadSessions };
};