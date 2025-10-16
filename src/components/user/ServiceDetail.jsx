import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ServiceDetail({ service, onClose }) {
  if (!service) return null;

  const { title, price, currency = 'LKR', desc, features = [], image } = service;

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5000,
        padding: '1rem',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 12,
          padding: '1.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
          width: 'min(92vw, 1000px)',
          maxHeight: '80vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Close (X) button */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: '#f3f4f6',
              color: '#111827',
              border: 0,
              borderRadius: 8,
              padding: '0.35rem 0.6rem',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        )}

        {image && (
          <img
            src={image}
            alt={title}
            style={{
              width: '100%',
              maxHeight: 260,
              objectFit: 'cover',
              borderRadius: 12,
              marginBottom: '1rem',
            }}
          />
        )}
        <h2 style={{ color: '#2563EB', marginBottom: '0.25rem' }}>{title}</h2>
        {price && (
          <p style={{ color: '#16a34a', fontWeight: 600 }}>
            Starting from {currency} {price}
          </p>
        )}
        {desc && (
          <p style={{ color: '#374151', lineHeight: 1.6 }}>{desc}</p>
        )}
        {features.length > 0 && (
          <ul style={{ margin: '1rem 0 0', paddingLeft: '1.25rem', color: '#4b5563' }}>
            {features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        )}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <a
            href="/booking"
            style={{
              background: '#FF8C42',
              color: '#1A1D23',
              padding: '0.6rem 1rem',
              borderRadius: 8,
              textDecoration: 'none',
            }}
          >
            Book Now
          </a>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: '#e5e7eb',
                color: '#111827',
                padding: '0.6rem 1rem',
                border: 0,
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}