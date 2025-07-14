import { logger } from '../components/LoggingMiddleware';

let urlDatabase = [];
let clickStats = {};

export const shortenUrl = async (longUrl, shortCode, validity, existingUrls) => {
  const finalShortCode = shortCode || generateRandomCode();
  
  if (existingUrls.some(url => url.shortCode === finalShortCode)) {
    const error = new Error('Short code already exists');
    logger.log('SHORTCODE_COLLISION', { shortCode: finalShortCode });
    throw error;
  }
  
  const now = new Date();
  const expiry = new Date(now.getTime() + validity * 60000);
  
  const newUrl = {
    longUrl,
    shortCode: finalShortCode,
    created: now.toISOString(),
    expiry: expiry.toISOString(),
    clicks: []
  };
  
  urlDatabase.push(newUrl);
  clickStats[finalShortCode] = [];
  
  logger.log('URL_SHORTENED', { shortCode: finalShortCode });
  return newUrl;
};

export const getUrlStats = async () => {
  return urlDatabase.map(url => ({
    ...url,
    clicks: clickStats[url.shortCode] || []
  }));
};

export const handleRedirect = async (shortCode) => {
  const urlEntry = urlDatabase.find(url => url.shortCode === shortCode);
  
  if (!urlEntry) {
    logger.log('REDIRECT_FAILED', { shortCode, reason: 'not_found' });
    throw new Error('URL not found');
  }
  
  if (new Date(urlEntry.expiry) < new Date()) {
    logger.log('REDIRECT_FAILED', { shortCode, reason: 'expired' });
    throw new Error('URL has expired');
  }
  
  const clickData = {
    timestamp: new Date().toISOString(),
    source: document.referrer || 'direct',
    location: 'Unknown' 
  };
  
  clickStats[shortCode].push(clickData);
  logger.log('REDIRECT_SUCCESS', { shortCode });
  
  return urlEntry.longUrl;
};

function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}