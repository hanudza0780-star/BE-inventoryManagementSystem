// ============================================
// utils/logger.js
// Simple logger helper untuk console output yang konsisten.
// Di production bisa diganti dengan winston atau pino.
// ============================================

const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
};

/**
 * Format timestamp untuk log
 */
const timestamp = () => new Date().toISOString();

/**
 * Log info (operasi normal)
 */
const info = (message, data = null) => {
  const log = `[${timestamp()}] [${LOG_LEVELS.INFO}] ${message}`;
  if (data) {
    console.log(log, data);
  } else {
    console.log(log);
  }
};

/**
 * Log warning (sesuatu yang perlu diperhatikan)
 */
const warn = (message, data = null) => {
  const log = `[${timestamp()}] [${LOG_LEVELS.WARN}] ⚠️  ${message}`;
  if (data) {
    console.warn(log, data);
  } else {
    console.warn(log);
  }
};

/**
 * Log error (terjadi kesalahan)
 */
const error = (message, err = null) => {
  const log = `[${timestamp()}] [${LOG_LEVELS.ERROR}] 🔴 ${message}`;
  if (err) {
    console.error(log, err.stack || err);
  } else {
    console.error(log);
  }
};

/**
 * Log debug (hanya tampil di development)
 */
const debug = (message, data = null) => {
  if (process.env.NODE_ENV !== 'development') return;
  const log = `[${timestamp()}] [${LOG_LEVELS.DEBUG}] 🔍 ${message}`;
  if (data) {
    console.log(log, data);
  } else {
    console.log(log);
  }
};

module.exports = { info, warn, error, debug };
