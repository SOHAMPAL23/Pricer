import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Forward the request to Flask backend
    const response = await fetch('http://localhost:5000/api/price-swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: data.error }, { status: response.status });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error pricing swap:', error);
    return NextResponse.json({ error: 'Failed to price swap' }, { status: 500 });
  }
}