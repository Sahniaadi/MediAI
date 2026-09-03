'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Sun, Moon, Eye, Globe, Type } from 'lucide-react';

export const AccessibilityBar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    contrast,
    toggleContrast,
    fontSize,
    setFontSize,
    language,
    setLanguage
  } = useApp();

  return (
    <div
      style={{
        background: 'var(--surface-card)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.35rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: 'var(--font-xs)',
        color: 'var(--text-muted)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
        {/* Font Scaler */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Type size={13} />
          <span>Font:</span>
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              style={{
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                background: fontSize === size ? 'var(--primary-light)' : 'var(--surface-hover)',
                color: fontSize === size ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: fontSize === size ? 700 : 500,
                fontSize: size === 'sm' ? '11px' : size === 'md' ? '13px' : '15px'
              }}
              title={`Font size ${size.toUpperCase()}`}
            >
              {size === 'sm' ? 'A-' : size === 'md' ? 'A' : 'A+'}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '14px', background: 'var(--border-subtle)' }} />

        {/* Contrast Toggle */}
        <button
          onClick={toggleContrast}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-xs)',
            background: contrast === 'high' ? 'var(--primary-light)' : 'transparent',
            color: contrast === 'high' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600
          }}
          title="High-Contrast Mode"
        >
          <Eye size={13} />
          <span>High Contrast: {contrast === 'high' ? 'ON' : 'OFF'}</span>
        </button>

        <div style={{ width: '1px', height: '14px', background: 'var(--border-subtle)' }} />

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-xs)',
            fontWeight: 600
          }}
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Moon size={13} color="var(--primary)" /> : <Sun size={13} color="#f59e0b" />}
          <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </div>

      {/* Multi-Language Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Globe size={13} />
        <span>Language:</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            background: 'var(--surface-hover)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            padding: '0.2rem 0.5rem',
            color: 'var(--text-main)',
            fontSize: 'var(--font-xs)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <option value="English">English</option>
          <option value="Spanish">Español</option>
          <option value="Hindi">हिन्दी</option>
          <option value="French">Français</option>
          <option value="Arabic">العربية</option>
        </select>
      </div>
    </div>
  );
};
