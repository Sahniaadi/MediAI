import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, role, fullName, phone } = body;

    // Login
    if (action === 'login') {
      const user = db.getUsers().find(
        (u) => (u.email.toLowerCase() === email?.toLowerCase() || u.phone === email)
      );

      if (!user) {
        // Create demo user if not found for seamless testing
        const newUser = db.createUser({
          id: `user-${Date.now()}`,
          email: email || 'aditya@example.com',
          phone: phone || '+1 (555) 234-5678',
          role: role || 'patient',
          fullName: fullName || 'Aditya Sharma',
          createdAt: new Date().toISOString(),
          status: 'active'
        });
        return NextResponse.json({
          success: true,
          user: newUser,
          token: 'jwt-demo-token-' + Date.now(),
          profile: db.getPatientProfile()
        });
      }

      return NextResponse.json({
        success: true,
        user,
        token: 'jwt-demo-token-' + user.id,
        profile: user.role === 'patient' ? db.getPatientProfile() : null
      });
    }

    // Biometric Login (Face ID / Fingerprint)
    if (action === 'biometric_login') {
      const profile = db.getPatientProfile();
      const user = db.getUserById(profile.userId) || db.getUsers()[0];
      db.logAudit({
        userId: user.id,
        userRole: user.role,
        action: 'BIOMETRIC_AUTH',
        resource: '/auth',
        details: 'Biometric credential verified successfully'
      });
      return NextResponse.json({
        success: true,
        user,
        token: 'jwt-biometric-' + Date.now(),
        profile
      });
    }

    // OTP Request / Verification
    if (action === 'request_otp') {
      return NextResponse.json({
        success: true,
        message: 'OTP sent to mobile phone and registered email.',
        demoOtp: '849201'
      });
    }

    if (action === 'verify_otp') {
      const user = db.getUsers()[0];
      return NextResponse.json({
        success: true,
        user,
        token: 'jwt-otp-' + Date.now(),
        profile: db.getPatientProfile()
      });
    }

    // Registration
    if (action === 'register') {
      const newUser = db.createUser({
        id: `user-${Date.now()}`,
        email,
        phone: phone || '+1 (555) 000-0000',
        role: role || 'patient',
        fullName,
        createdAt: new Date().toISOString(),
        status: 'active'
      });
      return NextResponse.json({
        success: true,
        user: newUser,
        token: 'jwt-reg-' + newUser.id
      });
    }

    return NextResponse.json({ error: 'Invalid auth action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const users = db.getUsers();
  return NextResponse.json({ users });
}
