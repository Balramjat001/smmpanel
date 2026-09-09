import { Router } from 'express';
import { prisma } from '../db.js';
import { auth, adminOnly } from '../middleware.js';
const router = Router();
router.get('/', async (_req, res, next) => { try { const rows = await prisma.siteSetting.findMany(); res.json({ success: true, data: Object.fromEntries(rows.map((row: { key: string; value: string }) => [row.key, row.value])) }); } catch (e) { next(e); } });
router.put('/', auth, adminOnly, async (req, res, next) => { try { const entries = Object.entries(req.body as Record<string, unknown>); await prisma.$transaction(entries.filter(([, value]) => typeof value === 'string').map(([key, value]) => prisma.siteSetting.upsert({ where: { key }, update: { value: value as string }, create: { key, value: value as string } }))); res.json({ success: true, data: req.body }); } catch (e) { next(e); } });
export default router;
