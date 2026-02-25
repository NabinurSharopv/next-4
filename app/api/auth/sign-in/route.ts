import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📤 Yuborilayotgan ma'lumot:", body);
    
    const response = await fetch('https://admin-crm.onrender.com/api/auth/sign-in', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    
    console.log("📥 Backend javobi:", data);
    
    if (data.data?.token) {
      const token = data.data.token;
      const role = data.data.role || "user";
      
      const nextResponse = NextResponse.json(data, { status: response.status });
      
      nextResponse.cookies.set({
        name: 'token',
        value: token,
        path: '/',
        maxAge: 60 * 60 * 24, // 1 kun
        sameSite: 'lax',
        httpOnly: false, 
      });
      
      nextResponse.cookies.set({
        name: 'role',
        value: role,
        path: '/',
        maxAge: 60 * 60 * 24,
        sameSite: 'lax',
        httpOnly: false,
      });
      
      return nextResponse;
    }
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error("❌ Xatolik:", error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}