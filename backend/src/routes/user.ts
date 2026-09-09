import { Router } from 'express';
import { prisma } from '../db.js';
import { auth, AuthedRequest } from '../middleware.js';
const router = Router();
router.use(auth);
router.get('/profile', async (req: AuthedRequest, res, next) => { try { const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.id }, select: { id: true, username: true, email: true, role: true, balance: true, totalSpent: true, referralCode: true, createdAt: true, _count: { select: { orders: true } } } }); res.json({ success: true, data: user }); } catch (e) { next(e); } });
router.get('/transactions', async (req: AuthedRequest, res, next) => { try { res.json({ success: true, data: await prisma.walletTransaction.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' }, take: 50 }) }); } catch (e) { next(e); } });
export default router;
