'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  FileText,
  RotateCcw,
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';
import { Medicine, Order, OrderItem } from '@/lib/db/types';
import { playChimeSound } from '@/lib/utils/audio';

export const MedicineOrdering: React.FC = () => {
  const {
    patientProfile,
    cart,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    cartCount,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'cart' | 'my_orders'>('catalog');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Checkout form states
  const [deliveryMode, setDeliveryMode] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet' | 'cod'>('card');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  const categories = ['All', 'Diabetes Care', 'Cardiac & Cholesterol', 'Pain Relief & Fever', 'Antibiotics', 'Respiratory & Allergy', 'Vitamins & Supplements'];

  const loadData = async () => {
    try {
      const [medRes, ordRes] = await Promise.all([
        fetch(`/api/medicines?q=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}`).then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json())
      ]);
      if (medRes.medicines) setMedicines(medRes.medicines);
      if (ordRes.orders) {
        setOrders(ordRes.orders);
        if (ordRes.orders.length > 0 && !activeTrackingOrder) {
          setActiveTrackingOrder(ordRes.orders[0]);
        }
      }
    } catch (e) {
      console.error('Error fetching pharmacy data:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCategory]);

  const subtotal = cart.reduce((sum, item) => sum + item.totalAmount, 0);
  const deliveryFee = deliveryMode === 'express' ? 4.99 : subtotal > 30 || subtotal === 0 ? 0 : 2.99;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'apply_coupon', couponCode, subtotal })
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({ code: couponCode.toUpperCase(), discount: data.discount });
        playChimeSound('dose_taken');
        showToast(`Coupon ${couponCode.toUpperCase()} applied! Saved $${data.discount}`, 'success');
      } else {
        showToast(data.message || 'Invalid coupon', 'error');
      }
    } catch (e) {
      showToast('Error applying coupon', 'error');
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'place_order',
          cartItems: cart,
          deliveryMode,
          paymentMethod,
          couponCode: appliedCoupon?.code,
          address: patientProfile?.address || '742 Evergreen Terrace, Springfield'
        })
      });
      const data = await res.json();
      if (data.success) {
        playChimeSound('dose_taken');
        clearCart();
        setAppliedCoupon(null);
        setActiveTrackingOrder(data.order);
        setActiveTab('my_orders');
        showToast(`Order #${data.order.orderNumber} placed successfully!`, 'success');
        loadData();
      }
    } catch (e) {
      showToast('Error placing order', 'error');
    }
  };

  const handleDownloadInvoice = (order: Order) => {
    const invoiceText = `========================================
            MEDIAI PHARMACY INVOICE
========================================
Order ID: #${order.orderNumber}
Date: ${new Date(order.createdAt).toLocaleDateString()}
Customer: ${order.customerName}
Delivery Address: ${order.address}

ITEMS ORDERED:
${order.items.map((it) => `- ${it.medicineName} x ${it.quantity} = $${it.totalAmount.toFixed(2)}`).join('\n')}

Subtotal: $${order.subtotal.toFixed(2)}
Discount: -$${order.discount.toFixed(2)}
Delivery: $${order.deliveryFee.toFixed(2)}
----------------------------------------
TOTAL PAID: $${order.total.toFixed(2)}
Payment Method: ${order.paymentMethod.toUpperCase()} (VERIFIED)
========================================
Thank you for trusting MediAI Pharmacy!`;

    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.orderNumber}.txt`;
    a.click();
    showToast('Invoice downloaded successfully', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header & Tab Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 'clamp(1.15rem, 4vw, 1.5rem)', fontWeight: 800, color: 'var(--text-main)' }}>
            MediAI Pharmacy Store
          </h2>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            100% Genuine prescription drugs, generic alternatives, and express 2-hour doorstep delivery.
          </p>
        </div>

        {/* Tabs: Catalog | Cart | My Orders */}
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
          <button
            onClick={() => setActiveTab('catalog')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              background: activeTab === 'catalog' ? 'var(--primary-light)' : 'transparent',
              color: activeTab === 'catalog' ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            Catalog
          </button>

          <button
            onClick={() => setActiveTab('cart')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              background: activeTab === 'cart' ? 'var(--primary-light)' : 'transparent',
              color: activeTab === 'cart' ? 'var(--primary)' : 'var(--text-secondary)',
              position: 'relative'
            }}
          >
            Cart ({cartCount})
          </button>

          <button
            onClick={() => setActiveTab('my_orders')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              background: activeTab === 'my_orders' ? 'var(--primary-light)' : 'transparent',
              color: activeTab === 'my_orders' ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            My Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* TAB 1: MEDICINE CATALOG */}
      {activeTab === 'catalog' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Search & Category Pills */}
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search by brand, composition, or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-control"
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          {/* Categories Horizontal Scroll */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-xs)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background: selectedCategory === cat ? 'var(--primary)' : 'var(--surface-card)',
                  color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Medicines Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '1rem' }}>
            {medicines.map((med) => (
              <div
                key={med.id}
                className="med-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.8rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="badge badge-info">{med.category}</span>
                    {med.requiresPrescription ? (
                      <span className="badge badge-danger">Rx Required</span>
                    ) : (
                      <span className="badge badge-success">OTC</span>
                    )}
                  </div>

                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-main)' }}>
                    {med.name}
                  </h3>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {med.packSize} • {med.manufacturer}
                  </div>

                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', margin: '0.5rem 0', lineHeight: 1.4 }}>
                    {med.uses}
                  </p>

                  {/* Generic Alternative Available */}
                  {med.genericAlternativeAvailable && (
                    <div
                      style={{
                        padding: '0.35rem 0.6rem',
                        borderRadius: 'var(--radius-xs)',
                        background: 'var(--success-light)',
                        color: '#065f46',
                        fontSize: '11px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        marginBottom: '0.6rem'
                      }}
                    >
                      <Sparkles size={12} />
                      <span>{med.genericAlternativeName} ($ {med.genericAlternativePrice?.toFixed(2)})</span>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.8rem'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--primary)' }}>
                      ${med.price.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>In Stock ({med.stockQuantity})</div>
                  </div>

                  <button
                    onClick={() =>
                      addToCart({
                        id: `item-${Date.now()}-${med.id}`,
                        medicineId: med.id,
                        medicineName: med.name,
                        quantity: 1,
                        unitPrice: med.price,
                        totalAmount: med.price,
                        requiresPrescription: med.requiresPrescription
                      })
                    }
                    className="btn btn-primary btn-sm"
                    style={{ gap: '0.35rem' }}
                  >
                    <Plus size={14} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SHOPPING CART & CHECKOUT */}
      {activeTab === 'cart' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1.5rem' }}>
          {/* Cart Items List */}
          <div className="med-card">
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800, marginBottom: '1rem' }}>
              Your Pharmacy Cart ({cartCount} items)
            </h3>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                <ShoppingBag size={40} style={{ margin: '0 auto 0.8rem auto', opacity: 0.5 }} />
                <p>Your cart is empty.</p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: '0.8rem' }}
                >
                  Browse Medicines
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {cart.map((item) => (
                  <div
                    key={item.medicineId}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--surface-hover)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>
                        {item.medicineName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        ${item.unitPrice.toFixed(2)} each {item.requiresPrescription && '• Rx Verified'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          onClick={() => updateCartQty(item.medicineId, -1)}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            background: 'var(--surface-card)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontWeight: 700, fontSize: 'var(--font-sm)', minWidth: '18px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.medicineId, 1)}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            background: 'var(--surface-card)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div style={{ fontWeight: 800, fontSize: 'var(--font-sm)', minWidth: '60px', textAlign: 'right' }}>
                        ${item.totalAmount.toFixed(2)}
                      </div>

                      <button onClick={() => removeFromCart(item.medicineId)} style={{ color: 'var(--emergency-red)' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Breakdown & Directives */}
          {cart.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Delivery Speed Selector */}
              <div className="med-card">
                <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 800, marginBottom: '0.6rem' }}>
                  Delivery Option
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <button
                    onClick={() => setDeliveryMode('standard')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: deliveryMode === 'standard' ? 'var(--primary-light)' : 'var(--surface-hover)',
                      border: deliveryMode === 'standard' ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>Standard Delivery</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tomorrow • Free over $30</div>
                  </button>

                  <button
                    onClick={() => setDeliveryMode('express')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: deliveryMode === 'express' ? 'var(--primary-light)' : 'var(--surface-hover)',
                      border: deliveryMode === 'express' ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)', color: '#0284c7' }}>Express 2-Hour</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Doorstep Delivery (+$4.99)</div>
                  </button>
                </div>
              </div>

              {/* Coupon Code Input */}
              <div className="med-card">
                <label style={{ fontSize: 'var(--font-xs)', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                  Apply Coupon Promo Code
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Try HEALTH20 or MEDIFIRST"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="input-control"
                    style={{ textTransform: 'uppercase' }}
                  />
                  <button onClick={handleApplyCoupon} className="btn btn-secondary" style={{ flexShrink: 0 }}>
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, marginTop: '0.4rem' }}>
                    ✓ Promo {appliedCoupon.code} applied (-${appliedCoupon.discount})
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="med-card">
                <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 800, marginBottom: '0.8rem' }}>
                  Order Summary
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: 'var(--font-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Items Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 700 }}>
                      <span>Coupon Discount:</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Delivery Fee:</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 800,
                      fontSize: 'var(--font-lg)',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '0.6rem',
                      marginTop: '0.4rem',
                      color: 'var(--primary)'
                    }}
                  >
                    <span>Total Amount:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '1.25rem', gap: '0.5rem' }}
                >
                  <ShieldCheck size={18} />
                  <span>Confirm & Place Order (${totalAmount.toFixed(2)})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY ORDERS & LIVE TRACKING */}
      {activeTab === 'my_orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Active Live Tracking Stepper */}
          {activeTrackingOrder && (
            <div
              className="med-card"
              style={{
                border: '1.5px solid var(--primary)',
                background: 'linear-gradient(135deg, var(--surface-card) 0%, rgba(13, 148, 136, 0.05) 100%)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-primary">LIVE ORDER TRACKING</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      #{activeTrackingOrder.orderNumber}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800, marginTop: '0.3rem' }}>
                    Status: <span style={{ textTransform: 'capitalize', color: 'var(--primary)' }}>{activeTrackingOrder.status.replace(/_/g, ' ')}</span>
                  </h3>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                    Estimated Delivery: {activeTrackingOrder.estimatedDelivery} • {activeTrackingOrder.deliveryMode.toUpperCase()}
                  </p>
                </div>

                <button
                  onClick={() => handleDownloadInvoice(activeTrackingOrder)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.3rem' }}
                >
                  <Download size={13} />
                  <span>Invoice</span>
                </button>
              </div>

              {/* 5-Step Order Progress Stepper */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '0.5rem',
                  textAlign: 'center',
                  margin: '1.5rem 0 1rem 0'
                }}
              >
                {[
                  { step: 1, label: 'Placed' },
                  { step: 2, label: 'Confirmed' },
                  { step: 3, label: 'Preparing' },
                  { step: 4, label: 'On Route' },
                  { step: 5, label: 'Delivered' }
                ].map((s) => {
                  const isDone = activeTrackingOrder.trackingStep >= s.step;
                  const isCurrent = activeTrackingOrder.trackingStep === s.step;

                  return (
                    <div key={s.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: isDone ? 'var(--primary)' : 'var(--surface-hover)',
                          color: isDone ? 'white' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '12px',
                          boxShadow: isCurrent ? '0 0 14px var(--primary-glow)' : 'none',
                          border: isCurrent ? '2px solid var(--text-main)' : 'none'
                        }}
                      >
                        {isDone ? '✓' : s.step}
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: isCurrent ? 800 : 500,
                          color: isDone ? 'var(--text-main)' : 'var(--text-muted)'
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Simulated Live Delivery Map */}
              <div
                style={{
                  height: '140px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <div style={{ textAlign: 'center', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <Truck size={22} color="#06b6d4" className="anim-heartbeat" />
                    <span style={{ fontWeight: 800, fontSize: 'var(--font-sm)' }}>
                      CarePlus Express Courier In Transit
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>
                    Rider: Michael Ross (Bike #IL-992) • Approx 12 mins to your doorstep
                  </div>
                </div>

                {/* Simulated radar circles */}
                <div
                  className="anim-ripple"
                  style={{
                    position: 'absolute',
                    width: '220px',
                    height: '220px',
                    borderRadius: '50%',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>
          )}

          {/* Past Orders List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800 }}>Order History</h3>
            {orders.map((order) => (
              <div
                key={order.id}
                className="med-card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.8rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>#{order.orderNumber}</span>
                    <span className="badge badge-primary">{order.status}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items • ${order.total.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {order.items.map((i) => `${i.medicineName} (x${i.quantity})`).join(', ')}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setActiveTrackingOrder(order)}
                    className="btn btn-secondary btn-sm"
                  >
                    Track Status
                  </button>
                  <button
                    onClick={() => handleDownloadInvoice(order)}
                    className="btn btn-outline btn-sm"
                  >
                    Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
