import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
const services = [
  ['TELEGRAM SERVICES', 'Telegram Members [Non Drop]'], ['TELEGRAM SERVICES', 'Telegram Members [Country Targeted]'], ['TELEGRAM SERVICES', 'Telegram Post Views'], ['TELEGRAM SERVICES', 'Telegram Reactions'],
  ['INSTAGRAM SERVICES', 'Instagram Followers'], ['INSTAGRAM SERVICES', 'Instagram Likes'], ['INSTAGRAM SERVICES', 'Instagram Reels Views'], ['INSTAGRAM SERVICES', 'Instagram Story Views'],
  ['FACEBOOK SERVICES', 'Facebook Page Likes'], ['FACEBOOK SERVICES', 'Facebook Post Likes'], ['FACEBOOK SERVICES', 'Facebook Video Views'], ['YOUTUBE SERVICES', 'YouTube Subscribers'], ['YOUTUBE SERVICES', 'YouTube Views'], ['YOUTUBE SERVICES', 'YouTube Shorts Views']
];
async function main() {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
  await prisma.user.upsert({ where: { username: process.env.ADMIN_USERNAME || 'admin' }, update: { passwordHash, role: Role.ADMIN }, create: { username: process.env.ADMIN_USERNAME || 'admin', email: process.env.ADMIN_EMAIL || 'admin@socialboost.local', passwordHash, role: Role.ADMIN, emailVerified: true, referralCode: 'SBADMIN' } });
  for (const [index, [categoryName, name]] of services.entries()) { const category = await prisma.category.upsert({ where: { name: categoryName }, update: {}, create: { name: categoryName } }); const existing = await prisma.service.findFirst({ where: { name, categoryId: category.id } }); if (!existing) await prisma.service.create({ data: { serviceId: 1000 + index, name, categoryId: category.id, rate: 1.22, minQuantity: 10, maxQuantity: 100000, averageTime: '0-24 hours', providerName: 'DEMO', description: 'Compliant provider fulfillment placeholder for local testing.' } }); }
  const settings = { siteName: 'SocialBoost Panel', whatsappNumber: process.env.WHATSAPP_NUMBER || '8502002001', minDeposit: '100', maxDeposit: '20000', upiId: 'socialboost@upi', receiverName: 'SocialBoost Panel', paymentInstructions: 'Pay via UPI and submit the UTR. An admin will verify it.' };
  for (const [key, value] of Object.entries(settings)) await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  const faq = [['What is an SMM Panel?', 'A dashboard for managing compliant social media marketing services from approved providers.'], ['How does adding funds work?', 'Submit a UPI payment reference and an admin verifies it before crediting your wallet.'], ['How long do orders take?', 'Completion depends on the selected service and provider availability.']];
  for (const [question, answer] of faq) await prisma.fAQ.upsert({ where: { id: question }, update: {}, create: { id: question, question, answer } });
}
main().finally(() => prisma.$disconnect());
