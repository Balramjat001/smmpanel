import { Router } from 'express';
import { prisma } from '../db.js';
const router = Router();
router.get('/', async (_req, res, next) => { try { const services = await prisma.service.findMany({ where: { active: true }, include: { category: true }, orderBy: { serviceId: 'asc' } }); res.json({ success: true, data: services }); } catch (e) { next(e); } });
router.get('/categories', async (_req, res, next) => { try { res.json({ success: true, data: await prisma.category.findMany({ include: { services: { where: { active: true }, orderBy: { serviceId: 'asc' } } }, orderBy: { name: 'asc' } }) }); } catch (e) { next(e); } });
export default router;
