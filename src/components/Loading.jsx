import React from 'react';

/**
 * Reusable Loading Spinner Component
 * @param {object} props
 * @param {string} [props.message="Loading..."]
 * @param {boolean} [props.small=false]
 */
export default function Loading({ message = 'Loading...', small = false }) {
  if (small) {
    return <span className="spinner spinner-sm" aria-label="Loading" />;
  }

  return (
    <div className="spinner-container" role="status">
      <div className="spinner" />
      {message && <p>{message}</p>}
    </div>
  );
}
