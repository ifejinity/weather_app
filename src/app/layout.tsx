import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://jefflonzanida.vercel.app'),
  title: {
    default: 'Weather Dashboard - Real-Time Weather & 5-Day Forecast',
    template: '%s | Weather Dashboard',
  },
  description: 'Get real-time current weather and a 5-day forecast for any city worldwide. Fast, modern weather dashboard built with Next.js.',
  keywords: [
    'weather',
    'weather forecast',
    'current weather',
    '5-day forecast',
    'weather dashboard',
    'real-time weather',
    'Next.js',
    'OpenWeatherMap',
  ],
  authors: [{ name: 'Jeffrey Lonzanida', url: 'https://jefflonzanida.vercel.app' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Weather Dashboard',
    title: 'Weather Dashboard - Real-Time Weather & 5-Day Forecast',
    description: 'Get real-time current weather and a 5-day forecast for any city worldwide.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Weather Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weather Dashboard - Real-Time Weather & 5-Day Forecast',
    description: 'Get real-time current weather and a 5-day forecast for any city worldwide.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  category: 'Weather',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Weather Dashboard',
  description: 'Real-time current weather and 5-day forecast for any city worldwide.',
  applicationCategory: 'WeatherApplication',
  operatingSystem: 'Web',
  url: 'https://jefflonzanida.vercel.app',
  author: {
    '@type': 'Person',
    name: 'Jeffrey Lonzanida',
    url: 'https://jefflonzanida.vercel.app',
  },
  publisher: {
    '@type': 'Person',
    name: 'Jeffrey Lonzanida',
    url: 'https://jefflonzanida.vercel.app',
  },
  uses: {
    '@type': 'Service',
    name: 'OpenWeatherMap',
    url: 'https://openweathermap.org',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
