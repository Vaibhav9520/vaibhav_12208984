import React from 'react';
import { logger } from './LoggingMiddleware';

function UrlTable({ stats }) {
  const handleRowClick = (shortCode) => {
    logger.log('STATS_ROW_CLICK', { shortCode });
  };

  return (
    <div className="stats-table">
      <table>
        <thead>
          <tr>
            <th>Short URL</th>
            <th>Original URL</th>
            <th>Created</th>
            <th>Expires</th>
            <th>Total Clicks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => (
            <tr key={stat.shortCode} onClick={() => handleRowClick(stat.shortCode)}>
              <td>
                <a href={`/${stat.shortCode}`} target="_blank" rel="noopener noreferrer">
                  {stat.shortCode}
                </a>
              </td>
              <td className="original-url">{stat.longUrl}</td>
              <td>{new Date(stat.created).toLocaleString()}</td>
              <td>{new Date(stat.expiry).toLocaleString()}</td>
              <td>{stat.clicks.length}</td>
              <td>
                <button onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(`${window.location.host}/${stat.shortCode}`);
                  logger.log('COPY_SHORT_URL', { shortCode: stat.shortCode });
                }}>
                  Copy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UrlTable;