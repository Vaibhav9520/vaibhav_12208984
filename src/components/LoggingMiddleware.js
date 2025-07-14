class LoggingMiddleware {
  constructor() {
    this.logs = [];
  }

  log(action, details = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      action,
      ...details
    };
    
    this.logs.push(logEntry);
    
    
    console.debug('Logged:', logEntry); 
  }

  getLogs() {
    return [...this.logs];
  }
}

export const logger = new LoggingMiddleware();