import { NextResponse } from 'next/server';

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_API_REQUESTS_PER_WINDOW = 60;

const rateLimitStore = globalThis.__apiRateLimitStore ||= new Map();

function getClientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.ip ||
    'unknown'
  );
}

function createRateLimitResponse({ remaining, resetSeconds }) {
  const body = JSON.stringify({
    message: 'Rate limit exceeded. Try again later.',
  });

  const res = new NextResponse(body, {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': String(resetSeconds),
      'X-RateLimit-Limit': String(MAX_API_REQUESTS_PER_WINDOW),
      'X-RateLimit-Remaining': String(Math.max(0, remaining)),
    },
  });

  return res;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const ip = getClientIp(request);
  const now = Date.now();
  const record = rateLimitStore.get(ip) ?? { count: 0, windowStart: now };
  const windowElapsed = now - record.windowStart;

  if (windowElapsed > RATE_LIMIT_WINDOW_MS) {
    record.count = 0;
    record.windowStart = now;
  }

  record.count += 1;
  rateLimitStore.set(ip, record);

  const remaining = MAX_API_REQUESTS_PER_WINDOW - record.count;
  const resetSeconds = Math.ceil((RATE_LIMIT_WINDOW_MS - windowElapsed) / 1000);

  if (record.count > MAX_API_REQUESTS_PER_WINDOW) {
    return createRateLimitResponse({ remaining, resetSeconds });
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(MAX_API_REQUESTS_PER_WINDOW));
  response.headers.set('X-RateLimit-Remaining', String(Math.max(0, remaining)));
  response.headers.set('X-RateLimit-Reset', String(resetSeconds));

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
