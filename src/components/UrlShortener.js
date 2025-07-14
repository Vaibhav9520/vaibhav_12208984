import React, { useState } from 'react';
import { validateUrl, validateShortCode, validateExpiry } from '../utils/validators';
import { logger } from './LoggingMiddleware';
import { shortenUrl } from '../utils/api';

function UrlShortener({ onUrlAdded, existingUrls }) {
  const [urlInputs, setUrlInputs] = useState([{ longUrl: '', shortCode: '', validity: '' }]);
  const [errors, setErrors] = useState([]);
  const [results, setResults] = useState([]);

  const handleInputChange = (index, field, value) => {
    const newInputs = [...urlInputs];
    newInputs[index][field] = value;
    setUrlInputs(newInputs);
  };

  const addUrlField = () => {
    if (urlInputs.length < 5) {
      setUrlInputs([...urlInputs, { longUrl: '', shortCode: '', validity: '' }]);
    }
  };

  const removeUrlField = (index) => {
    if (urlInputs.length > 1) {
      const newInputs = urlInputs.filter((_, i) => i !== index);
      setUrlInputs(newInputs);
    }
  };

  const validateInputs = () => {
    const newErrors = [];
    
    urlInputs.forEach((input, index) => {
      if (!input.longUrl) {
        newErrors.push({ index, field: 'longUrl', message: 'URL is required' });
        return;
      }
      
      if (!validateUrl(input.longUrl)) {
        newErrors.push({ index, field: 'longUrl', message: 'Invalid URL format' });
      }
      
      if (input.shortCode && !validateShortCode(input.shortCode)) {
        newErrors.push({ index, field: 'shortCode', message: 'Shortcode must be alphanumeric and 4-20 characters' });
      }
      
      if (input.validity && !validateExpiry(input.validity)) {
        newErrors.push({ index, field: 'validity', message: 'Validity must be a positive number' });
      }
    });
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      logger.log('VALIDATION_FAILED', { errors });
      return;
    }
    
    try {
      const promises = urlInputs.map(input => {
        const validity = input.validity ? parseInt(input.validity) : 30;
        return shortenUrl(input.longUrl, input.shortCode, validity, existingUrls);
      });
      
      const results = await Promise.all(promises);
      setResults(results);
      results.forEach(result => onUrlAdded(result));
      
      logger.log('URLS_SHORTENED', { count: results.length });
    } catch (error) {
      logger.log('SHORTEN_ERROR', { error: error.message });
      alert('An error occurred while shortening URLs');
    }
  };

  return (
    <div className="url-shortener">
      <form onSubmit={handleSubmit}>
        {urlInputs.map((input, index) => (
          <div key={index} className="url-input-group">
            <div className="input-row">
              <label>
                Long URL:
                <input
                  type="text"
                  value={input.longUrl}
                  onChange={(e) => handleInputChange(index, 'longUrl', e.target.value)}
                  placeholder="https://example.com"
                />
                {errors.find(e => e.index === index && e.field === 'longUrl') && (
                  <span className="error">{errors.find(e => e.index === index && e.field === 'longUrl').message}</span>
                )}
              </label>
            </div>
            
            <div className="input-row">
              <label>
                Custom Shortcode (optional):
                <input
                  type="text"
                  value={input.shortCode}
                  onChange={(e) => handleInputChange(index, 'shortCode', e.target.value)}
                  placeholder="my-custom-code"
                />
                {errors.find(e => e.index === index && e.field === 'shortCode') && (
                  <span className="error">{errors.find(e => e.index === index && e.field === 'shortCode').message}</span>
                )}
              </label>
            </div>
            
            <div className="input-row">
              <label>
                Validity in minutes (optional, default 30):
                <input
                  type="number"
                  value={input.validity}
                  onChange={(e) => handleInputChange(index, 'validity', e.target.value)}
                  placeholder="30"
                />
                {errors.find(e => e.index === index && e.field === 'validity') && (
                  <span className="error">{errors.find(e => e.index === index && e.field === 'validity').message}</span>
                )}
              </label>
            </div>
            
            {urlInputs.length > 1 && (
              <button type="button" onClick={() => removeUrlField(index)} className="remove-btn">
                Remove
              </button>
            )}
          </div>
        ))}
        
        <div className="actions">
          {urlInputs.length < 5 && (
            <button type="button" onClick={addUrlField} className="add-btn">
              Add Another URL
            </button>
          )}
          <button type="submit" className="submit-btn">
            Shorten URLs
          </button>
        </div>
      </form>
      
      {results.length > 0 && (
        <div className="results">
          <h3>Shortened URLs</h3>
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                <div>Original: {result.longUrl}</div>
                <div>Shortened: <a href={`/${result.shortCode}`} target="_blank" rel="noopener noreferrer">{window.location.host}/{result.shortCode}</a></div>
                <div>Expires: {new Date(result.expiry).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UrlShortener;