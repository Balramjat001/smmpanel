export type ProviderOrder = { providerOrderId: string; status: 'PENDING' | 'PROCESSING' };
export interface Provider { createOrder(serviceId: string, link: string, quantity: number): Promise<ProviderOrder>; }
export class DemoProvider implements Provider { async createOrder(serviceId: string, _link: string, _quantity: number) { return { providerOrderId: `DEMO-${Date.now()}-${serviceId}`, status: 'PROCESSING' as const }; } }
export const provider = new DemoProvider();
