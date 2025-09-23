import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Dummy authentication logic
  if (username === 'admin' && password === 'password') {
    // Return a dummy token
    return NextResponse.json({ token: 'dummy-token-123' });
  }

  return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}
