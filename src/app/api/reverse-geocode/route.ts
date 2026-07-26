import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&limit=1&appid=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch location data' }, { status: res.status });
    }
    const data = await res.json();
    if (data && data.length > 0) {
      const item = data[0];
      return NextResponse.json({
        name: item.name,
        country: item.country || '',
        state: item.state || '',
      });
    }
    return NextResponse.json({ error: 'No location found' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
