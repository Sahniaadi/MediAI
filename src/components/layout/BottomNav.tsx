'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Home,
  Bot,
  Calendar,
  Pill,
  FileText,
  ShoppingBag,
  User
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, cartCount, setIsProfileModalOpen, t } = useApp();

  if (currentRole !== 'patient') return null;

  const navItems = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'ai', label: t('aiAssistant'), icon: Bot, isSpecial: true },
    { id: 'appointments', label: t('appointments'), icon: Calendar },
    { id: 'medicines', label: t('medicines'), icon: Pill },
    { id: 'orders', label: t('orders'), icon: ShoppingBag, badge: cartCount > 0 ? cartCount : undefined },
    { id: 'records', label: t('records'), icon: FileText }
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 95,
        background: 'var(--surface-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-subtle)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0.4rem 0.25rem'
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.15rem',
                  marginTop: '-1.1rem',
                  background: 'none',
                  padding: '0 0.25rem'
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary) 0%, #0284c7 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 16px var(--primary-glow), 0 0 0 3px var(--surface-card)'
                  }}
                >
                  <Icon size={22} />
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)'
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.15rem',
                position: 'relative',
                padding: '0.3rem 0.4rem',
                borderRadius: 'var(--radius-sm)',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                transition: 'color 0.15s ease',
                minWidth: '44px',
                minHeight: '44px',
                justifyContent: 'center'
              }}
            >
              <div style={{ position: 'relative' }}>
                <Icon size={19} strokeWidth={isActive ? 2.4 : 1.8} />
                {item.badge !== undefined && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-8px',
                      background: 'var(--emergency-red)',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 800,
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '10px', fontWeight: isActive ? 700 : 500, lineHeight: 1 }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
