import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Order } from '@/lib/db/types';

export async function GET() {
  const orders = db.getOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, cartItems, address, deliveryMode, paymentMethod, couponCode, prescriptionId, orderId } = body;

    // Validate Coupon
    if (action === 'apply_coupon') {
      const { subtotal } = body;
      const res = db.validateCoupon(couponCode, subtotal || 0);
      return NextResponse.json(res);
    }

    // Place Order
    if (action === 'place_order') {
      let subtotal = 0;
      let hasRxRequired = false;

      cartItems.forEach((item: any) => {
        subtotal += item.unitPrice * item.quantity;
        if (item.requiresPrescription) hasRxRequired = true;
      });

      let discount = 0;
      if (couponCode) {
        const cRes = db.validateCoupon(couponCode, subtotal);
        if (cRes.valid && cRes.discount) {
          discount = cRes.discount;
        }
      }

      const deliveryFee = deliveryMode === 'express' ? 4.99 : subtotal > 30 ? 0 : 2.99;
      const total = Math.max(0, subtotal - discount + deliveryFee);

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `MED-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId: db.getPatientProfile().userId,
        customerName: db.getPatientProfile().fullName,
        items: cartItems,
        subtotal: Number(subtotal.toFixed(2)),
        deliveryFee,
        discount,
        couponCode: discount > 0 ? couponCode : undefined,
        total: Number(total.toFixed(2)),
        prescriptionId: hasRxRequired ? prescriptionId || 'rx-2026-001' : undefined,
        prescriptionVerified: true,
        deliveryMode: deliveryMode || 'standard',
        address: address || db.getPatientProfile().address,
        paymentMethod: paymentMethod || 'card',
        paymentStatus: 'paid',
        status: 'confirmed',
        trackingStep: 2, // Confirmed
        estimatedDelivery: deliveryMode === 'express' ? 'Within 2 hours' : 'Tomorrow by 05:00 PM',
        createdAt: new Date().toISOString()
      };

      const created = db.createOrder(newOrder);
      return NextResponse.json({ success: true, order: created });
    }

    // Progress Order Tracking Status
    if (action === 'update_tracking') {
      const { status, step } = body;
      const updated = db.updateOrderStatus(orderId, status, step);
      return NextResponse.json({ success: true, order: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
