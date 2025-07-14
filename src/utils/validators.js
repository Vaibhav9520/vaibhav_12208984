export function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateShortCode(code) {
  const regex = /^[a-zA-Z0-9_-]{4,20}$/;
  return regex.test(code);
}

export function validateExpiry(minutes) {
  const num = parseInt(minutes);
  return !isNaN(num) && num > 0;
}