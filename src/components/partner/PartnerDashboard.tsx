'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Building2,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  AlertCircle,
  Plus,
  ShieldCheck,
  TrendingUp,
  Search
} from 'lucide-react';
import { Medicine, Order, LabBooking } from '@/lib/db/types';

export const PartnerDashboard: React.FC = () => {
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'labs'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<Medicine[]>([]);
  const [labBookings, setLabBookings] = useState<LabBooking[]>([]);

  const loadPartnerData = async () => {
    try {
      const res = await fetch('/api/partner');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
      if (data.inventory) setInventory(data.inventory);
      if (data.labBookings) setLabBookings(data.labBookings);
    } catch (e) {
      console.error('Error loading partner dashboard:', e);
    }
  };

  useEffect(() => {
    loadPartnerData();
  }, []);

  const handleVerifyPrescription = async (orderId: string) => {
    try {
      const res = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_prescription', orderId })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Prescription verified by pharmacist. Order moved to Preparing stage.', 'success');
        loadPartnerData();
      }
    } catch (e) {
      showToast('Error verifying prescription', 'error');
    }
  };

  const handleAdvanceOrderStatus = async (orderId: string, status: Order['status'], step: number) => {
    try {
      await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_order_status', orderId, status, step })
      });
      showToast(`Order status updated to ${status}`, 'success');
      loadPartnerData();
    } catch (e) {
      showToast('Error updating status', 'error');
    }
  };

  const handleUpdateLabStatus = async (bookingId: string, status: LabBooking['status']) => {
    try {
      await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_sample_status', bookingId, status })
      });
      showToast(`Sample status updated to ${status}`, 'success');
      loadPartnerData();
    } catch (e) {
      showToast('Error updating lab status', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Partner Header */}
      <div
        style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(13, 148, 136, 0.08) 100%)',
          border: '1px solid rgba(2, 132, 199, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Building2 size={32} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>CarePlus Pharmacy & Diagnostics</h2>
              <span className="badge badge-success">Licensed Partner #PH-88910</span>
            </div>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
              Integrated E-Commerce Dispensary & Clinical Sample Laboratory
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ padding: '0.5rem 0.8rem', background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Orders to Dispatch</div>
            <div style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--primary)' }}>
              {orders.filter((o) => o.status !== 'delivered').length} Active
            </div>
          </div>

          <div style={{ padding: '0.5rem 0.8rem', background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Pending Rx Check</div>
            <div style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#f59e0b' }}>
              {orders.filter((o) => !o.prescriptionVerified).length} Orders
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div
        style={{
          display: 'flex',
          gap: '0.4rem',
          background: 'var(--surface-card)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {[
          { id: 'orders', label: 'Order Fulfillment & Rx Verification' },
          { id: 'inventory', label: 'Pharmacy Stock & Inventory' },
          { id: 'labs', label: 'Diagnostic Samples & Reports' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              background: activeTab === tab.id ? 'var(--primary-light)' : 'transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ORDER FULFILLMENT & RX VERIFICATION */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="med-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, fontSize: 'var(--font-md)' }}>#{order.orderNumber}</span>
                    <span className="badge badge-primary">{order.status}</span>
                    {order.prescriptionVerified ? (
                      <span className="badge badge-success">Rx Verified</span>
                    ) : (
                      <span className="badge badge-danger">Pharmacist Review Required</span>
                    )}
                  </div>

                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                    Customer: {order.customerName} • {order.address} • Delivery: {order.deliveryMode.toUpperCase()}
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Items: {order.items.map((i) => `${i.medicineName} (x${i.quantity})`).join(', ')} • Total: ${order.total.toFixed(2)}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {!order.prescriptionVerified && (
                    <button
                      onClick={() => handleVerifyPrescription(order.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--primary)', fontWeight: 700 }}
                    >
                      <ShieldCheck size={14} />
                      <span>Approve Prescription</span>
                    </button>
                  )}

                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => handleAdvanceOrderStatus(order.id, 'preparing', 3)}
                      className="btn btn-primary btn-sm"
                    >
                      Mark as Preparing
                    </button>
                  )}

                  {order.status === 'preparing' && (
                    <button
                      onClick={() => handleAdvanceOrderStatus(order.id, 'out_for_delivery', 4)}
                      className="btn btn-primary btn-sm"
                    >
                      Hand to Courier
                    </button>
                  )}

                  {order.status === 'out_for_delivery' && (
                    <button
                      onClick={() => handleAdvanceOrderStatus(order.id, 'delivered', 5)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#10b981' }}
                    >
                      Confirm Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: INVENTORY & PRICING */}
      {activeTab === 'inventory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="med-card">
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, marginBottom: '0.8rem' }}>
              Dispensary Stock & Catalog ({inventory.length} SKUs)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {inventory.map((m) => (
                <div
                  key={m.id}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--surface-hover)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 'var(--font-xs)'
                  }}
                >
                  <div>
                    <strong>{m.name}</strong> ({m.strength}) • {m.packSize}
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Category: {m.category} • {m.requiresPrescription ? 'Prescription Required' : 'OTC'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary)' }}>${m.price.toFixed(2)}</div>
                    <span className={`badge ${m.stockQuantity < 50 ? 'badge-warning' : 'badge-success'}`}>
                      {m.stockQuantity} in stock
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DIAGNOSTIC SAMPLE LOG */}
      {activeTab === 'labs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {labBookings.map((b) => (
            <div key={b.id} className="med-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: 'var(--font-sm)' }}>{b.testNames.join(', ')}</h4>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Patient: {b.patientName} • Date: {b.bookingDate} at {b.timeSlot} • Mode: {b.mode}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {b.status === 'booked' && (
                    <button onClick={() => handleUpdateLabStatus(b.id, 'sample_collected')} className="btn btn-primary btn-sm">
                      Mark Sample Collected
                    </button>
                  )}
                  {b.status === 'sample_collected' && (
                    <button onClick={() => handleUpdateLabStatus(b.id, 'processing')} className="btn btn-primary btn-sm">
                      Start Lab Processing
                    </button>
                  )}
                  {b.status === 'processing' && (
                    <button onClick={() => handleUpdateLabStatus(b.id, 'report_ready')} className="btn btn-secondary btn-sm" style={{ color: '#10b981' }}>
                      Publish Final Report
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
