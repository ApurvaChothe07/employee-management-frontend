import React from 'react';

/**
 * Reusable Error Alert Component
 * @param {object} props
 * @param {string} props.message
 * @param {function} [props.onDismiss]
 */
export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="alert alert-danger" role="alert">
      <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>⚠️</span>
      <div style={{ flex: 1 }}>{message}</div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'bold' }}
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      )}
    </div>
  );
}
