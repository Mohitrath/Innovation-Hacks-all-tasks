import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { ok, err } from '@/lib/api';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const email = body.email.toLowerCase();

    let user = await prisma.user.findUnique({ where: { email } });

    // The login page advertises these demo credentials. Create/update the
    // demo account on first use so a fresh database can be used immediately.
    if (
      email === 'demo@flowpilot.dev' &&
      body.password === 'password123'
    ) {
      const password = await bcrypt.hash('password123', 12);
      user = await prisma.user.upsert({
        where: { email },
        update: { password },
        create: {
          name: 'Demo User',
          email,
          password,
        },
      });
    }

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      return err('Invalid email or password', 401);
    }

    const res = ok({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

    res.cookies.set('session', await signToken(user.id), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 604800,
      path: '/',
    });

    return res;
  } catch (e) {
    console.error('LOGIN_ERROR', e);

    const message =
      e instanceof Error && /prisma|database|postgres|connection/i.test(e.message)
        ? 'Database is not configured or unreachable. Set DATABASE_URL in Vercel.'
        : 'Invalid request';

    return err(message, 500);
  }
}
