import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
export const env = (key: string, fallback = '') => process.env[key] || fallback;
export const hashToken = (value: string) => crypto.createHash('sha256').update(value).digest('hex');
export const makeToken = (user: { id: string; role: string }) => jwt.sign({ sub: user.id, role: user.role }, env('JWT_SECRET', 'development-secret-change-me'), { expiresIn: '7d' });
export const randomCode = () => String(Math.floor(100000 + Math.random() * 900000));
export const ok = (data: unknown) => ({ success: true, data });
