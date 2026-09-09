import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from './utils.js';
import { prisma } from './db.js';
export type AuthedRequest = Request & { user?: { id: string; role: 'USER' | 'ADMIN' } };
export async function auth(req: AuthedRequest, res: Response, next: NextFunction) { try { const token = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', ''); if (!token) return res.status(401).json({ success: false, message: 'Authentication required' }); const payload = jwt.verify(token, env('JWT_SECRET', 'development-secret-change-me')) as { sub: string; role: 'USER' | 'ADMIN' }; const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, role: true, disabled: true } }); if (!user || user.disabled) return res.status(401).json({ success: false, message: 'Account unavailable' }); req.user = { id: user.id, role: user.role }; next(); } catch { return res.status(401).json({ success: false, message: 'Invalid session' }); } }
export function adminOnly(req: AuthedRequest, res: Response, next: NextFunction) { if (req.user?.role !== 'ADMIN') return res.status(403).json({ success: false, message: 'Admin access required' }); next(); }
