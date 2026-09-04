'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  HeartPulse,
  MapPin,
  Search,
  Bell,
  User,
  Users,
  Shield,
  Stethoscope,
  Building2,
  SlidersHorizontal,
  ChevronDown,
  LogOut,
  Sparkles,
  Check
} from 'lucide-react';
import { UserRole } from '@/lib/db/types';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    activeTab,
    setActiveTab,
    patientProfile,
    familyMembers,
    activeFamilyMember,
    setActiveFamilyMember,
    setIsNotificationsOpen,
    setIsProfileModalOpen,
    setIsSettingsOpen,
    t
  } = useApp();

  const [isFamilyDropdownOpen, setIsFamilyDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState('Springfield, IL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'doctor') setActiveTab('doctor_queue');
    else if (role === 'partner') setActiveTab('partner_orders');
    else if (role === 'admin') setActiveTab('admin_metrics');
    else setActiveTab('home');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Route query to AI assistant or appropriate tab
    setActiveTab('ai');
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        {/* Top Role Switcher Bar */}
        <div
          style={{
            background: 'linear-gradient(90deg, #0d9488 0%, #0284c7 100%)',
            padding: '0.4rem 0.75rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 'var(--font-xs)',
            fontWeight: 600,
            overflowX: 'auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            <span style={{ opacity: 0.9, whiteSpace: 'nowrap' }} className="role-label-full">Switch View:</span>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {(
                [
                  { id: 'patient', label: 'Patient', shortLabel: 'Patient', icon: User },
                  { id: 'doctor', label: 'Doctor', shortLabel: 'Doctor', icon: Stethoscope },
                  { id: 'partner', label: 'Partner', shortLabel: 'Partner', icon: Building2 },
                  { id: 'admin', label: 'Admin', shortLabel: 'Admin', icon: Shield }
                ] as const
              ).map((roleItem) => {
                const Icon = roleItem.icon;
                const isSelected = currentRole === roleItem.id;
                return (
                  <button
                    key={roleItem.id}
                    onClick={() => handleRoleChange(roleItem.id)}
                    title={roleItem.label}
                    style={{
                      background: isSelected ? 'rgba(255, 255, 255, 0.28)' : 'rgba(0, 0, 0, 0.15)',
                      color: 'white',
                      padding: '0.25rem 0.55rem',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      border: isSelected ? '1px solid rgba(255, 255, 255, 0.6)' : '1px solid transparent',
                      fontWeight: isSelected ? 700 : 500,
                      transition: 'all 0.15s ease',
                      minHeight: '30px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Icon size={13} />
                    <span className="role-btn-label">{roleItem.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          {/* Logo & Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              onClick={() => setActiveTab('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--primary) 0%, #0284c7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 12px var(--primary-glow)'
                }}
              >
                <HeartPulse size={22} className="anim-heartbeat" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontSize: 'var(--font-xl)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--primary)' }}>
                    Medi
                  </span>
                  <span style={{ fontSize: 'var(--font-xl)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                    AI
                  </span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '-3px' }}>
                  Smart Medical Assistant
                </div>
              </div>
            </div>

            {/* Location Pill - hidden on very small screens */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="location-pill"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.65rem',
                background: 'var(--surface-hover)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                fontSize: 'var(--font-xs)',
                color: 'var(--text-secondary)',
                minHeight: '36px'
              }}
            >
              <MapPin size={13} color="var(--primary)" />
              <span style={{ fontWeight: 600 }} className="location-text">{currentCity}</span>
              <ChevronDown size={12} />
            </button>
          </div>

          {/* Search Bar (Medicines, Doctors, Symptoms) */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              flex: 1,
              maxWidth: '440px',
              position: 'relative',
              display: 'none'
            }}
            className="md-search-form"
          >
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              placeholder="Search medicines, doctors, symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-control"
              style={{
                paddingLeft: '2.5rem',
                paddingRight: '1rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--surface-muted)'
              }}
            />
          </form>

          {/* Right Action Icons & Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* Family Switcher Dropdown */}
            {currentRole === 'patient' && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsFamilyDropdownOpen(!isFamilyDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.8rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--surface-card)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: 'var(--font-xs)',
                    fontWeight: 600
                  }}
                >
                  <Users size={14} color="var(--primary)" />
                  <span>{activeFamilyMember?.name || 'Self'}</span>
                  <ChevronDown size={12} />
                </button>

                {isFamilyDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: 'var(--surface-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      minWidth: '200px',
                      maxWidth: 'min(220px, 90vw)',
                      zIndex: 200,
                      overflow: 'hidden',
                      animation: 'fadeIn 0.15s ease'
                    }}
                  >
                    <div style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid var(--border-subtle)', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
                      MANAGE FAMILY PROFILES
                    </div>
                    {familyMembers.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => {
                          setActiveFamilyMember(member);
                          setIsFamilyDropdownOpen(false);
                        }}
                        style={{
                          padding: '0.6rem 0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          background: activeFamilyMember?.id === member.id ? 'var(--primary-light)' : 'transparent',
                          color: activeFamilyMember?.id === member.id ? 'var(--primary)' : 'var(--text-main)'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{member.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {member.relation} • {member.bloodGroup}
                          </div>
                        </div>
                        {activeFamilyMember?.id === member.id && <Check size={14} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              style={{
                position: 'relative',
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--surface-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}
              title="Notifications"
            >
              <Bell size={18} />
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: 'var(--emergency-red)',
                  boxShadow: '0 0 0 2px var(--surface-card)'
                }}
              />
            </button>

            {/* Profile Avatar / Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.3rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '13px'
                  }}
                >
                  {currentRole === 'doctor' ? 'DR' : currentRole === 'admin' ? 'AD' : currentRole === 'partner' ? 'PH' : 'AS'}
                </div>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {isProfileMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: 'var(--surface-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    minWidth: '200px',
                    maxWidth: 'min(220px, 90vw)',
                    zIndex: 200,
                    overflow: 'hidden',
                    animation: 'fadeIn 0.15s ease'
                  }}
                >
                  <div style={{ padding: '0.8rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>
                      {currentRole === 'doctor'
                        ? 'Dr. Sophia Patel'
                        : currentRole === 'admin'
                        ? 'Chief Administrator'
                        : currentRole === 'partner'
                        ? 'CarePlus Partner'
                        : patientProfile?.fullName || 'Aditya Sharma'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Role: <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{currentRole}</span>
                    </div>
                  </div>

                  <div style={{ padding: '0.4rem' }}>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.6rem 0.8rem',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: 'var(--font-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                      }}
                    >
                      <User size={15} />
                      <span>Medical Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsSettingsOpen(true);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.6rem 0.8rem',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: 'var(--font-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                      }}
                    >
                      <SlidersHorizontal size={15} />
                      <span>Settings & Membership</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Manual Location Dialog */}
      {isLocationModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLocationModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="var(--primary)" />
                <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>Choose Your Location</h3>
              </div>
              <button onClick={() => setIsLocationModalOpen(false)} style={{ fontSize: '18px', color: 'var(--text-muted)' }}>
                ✕
              </button>
            </div>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Used to display nearby hospitals, pharmacies, emergency ER facilities, and calculate delivery times.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                'Springfield, IL (Current Default)',
                'Chicago, IL',
                'New York, NY',
                'Houston, TX',
                'San Francisco, CA'
              ].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setCurrentCity(city.split(' (')[0]);
                    setIsLocationModalOpen(false);
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    borderRadius: 'var(--radius-sm)',
                    background: currentCity === city.split(' (')[0] ? 'var(--primary-light)' : 'var(--surface-hover)',
                    color: currentCity === city.split(' (')[0] ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: 'var(--font-sm)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {city}
                </button>
              ))}

              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      () => {
                        setCurrentCity('GPS: Springfield Coordinates (39.78° N)');
                        setIsLocationModalOpen(false);
                      },
                      () => {
                        setCurrentCity('Springfield, IL (Permission fallback)');
                        setIsLocationModalOpen(false);
                      }
                    );
                  } else {
                    setIsLocationModalOpen(false);
                  }
                }}
                className="btn btn-primary"
                style={{ marginTop: '0.5rem' }}
              >
                <MapPin size={16} />
                Use Precise GPS Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Style for responsive navbar */}
      <style jsx global>{`
        @media (min-width: 768px) {
          .md-search-form {
            display: block !important;
          }
        }
        /* Role label text — hide on very small screens */
        @media (max-width: 400px) {
          .role-btn-label {
            display: none;
          }
          .role-label-full {
            display: none;
          }
        }
        /* Location text — hide on small screens */
        @media (max-width: 480px) {
          .location-text {
            display: none;
          }
        }
        /* Location pill — hidden below 360px */
        @media (max-width: 359px) {
          .location-pill {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
