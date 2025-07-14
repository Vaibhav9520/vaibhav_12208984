import React, { useState, useEffect } from 'react';
import UrlTable from '../components/UrlTable';
import { logger } from '../components/LoggingMiddleware';
import { getUrlStats } from '../utils/api';

function StatsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        logger.log('FETCH_STATS_ATTEMPT');
        const data = await getUrlStats();
        setStats(data);
        logger.log('FETCH_STATS_SUCCESS', { count: data.length });
      } catch (err) {
        setError('Failed to load statistics');
        logger.log('FETCH_STATS_ERROR', { error: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="page-container">
      <h1>URL Statistics</h1>
      <UrlTable stats={stats} />
    </div>
  );
}

export default StatsPage;