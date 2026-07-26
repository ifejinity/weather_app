import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json([]);
  }

  try {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json([]);
    }
    const data = await res.json();
    const suggestions = data.map((item: { name: string; country?: string; state?: string; lat: number; lon: number }) => ({
      name: item.name,
      country: item.country || '',
      state: item.state || '',
      display: [item.name, item.state, item.country].filter(Boolean).join(', '),
    }));
    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json([]);
  }
}
