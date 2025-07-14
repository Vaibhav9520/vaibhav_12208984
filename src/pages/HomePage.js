import React, { useState } from 'react';
import UrlShortener from '../components/UrlShortener';
import { logger } from '../components/LoggingMiddleware';

function HomePage() {
  const [urls, setUrls] = useState([]);

  const handleUrlAdded = (newUrl) => {
    logger.log('URL_ADDED', { shortCode: newUrl.shortCode });
    setUrls([...urls, newUrl]);
  };

  return (
    <div style={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <h1>URL Shortener</h1>
      <p>Shorten up to 5 URLs at once</p>
      <UrlShortener onUrlAdded={handleUrlAdded} existingUrls={urls} />
    </div>
  );
}

export default HomePage;