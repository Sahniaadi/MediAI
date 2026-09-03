import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const medicines = db.getMedicines();
  const orders = db.getOrders();
  const labBookings = db.getLabBookings();
  const labTests = db.getLabTests();

  return NextResponse.json({
    inventory: medicines,
    orders,
    labBookings,
    labTests,
    stats: {
      pendingPrescriptionVerifications: orders.filter((o) => !o.prescriptionVerified).length,
      ordersToDispatch: orders.filter((o) => o.status === 'confirmed' || o.status === 'preparing').length,
      pendingSampleCollections: labBookings.filter((b) => b.status === 'booked').length,
      totalOrdersProcessed: orders.length
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, orderId, bookingId, status, step, medicineUpdates } = body;

    // Verify order prescription
    if (action === 'verify_prescription') {
      const order = db.getOrderById(orderId);
      if (order) {
        order.prescriptionVerified = true;
        order.status = 'preparing';
        order.trackingStep = 3;
        return NextResponse.json({ success: true, order });
      }
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order delivery step
    if (action === 'update_order_status') {
      const updated = db.updateOrderStatus(orderId, status, step);
      return NextResponse.json({ success: true, order: updated });
    }

    // Update Lab sample status
    if (action === 'update_sample_status') {
      const booking = db.getLabBookings().find((b) => b.id === bookingId);
      if (booking) {
        booking.status = status;
        return NextResponse.json({ success: true, booking });
      }
      return NextResponse.json({ error: 'Lab booking not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
