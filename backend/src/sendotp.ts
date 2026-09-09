type SendOtpResponse = { ok?: boolean; id?: string; expiresAt?: number };
type VerifyOtpResponse = { valid?: boolean };
const SENDOTP_URL = 'https://api.sendotp.email/v1';

class SendOtpError extends Error {
  constructor(message = 'SendOTP request failed') {
    super(message);
    this.name = 'SendOtpError';
  }
}

const request = async <T>(path: string, body: Record<string, string>): Promise<T> => {
  const apiKey = process.env.SENDOTP_API_KEY;
  if (!apiKey) throw new SendOtpError('Unable to send OTP');
  let response: Response;
  try {
    response = await fetch(`${SENDOTP_URL}${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new SendOtpError('Unable to send OTP');
  }
  let data: T;
  try {
    data = await response.json() as T;
  } catch {
    throw new SendOtpError('Unable to send OTP');
  }
  if (!response.ok) throw new SendOtpError('Unable to send OTP');
  return data;
};

export const sendSignupOtp = async (email: string) => {
  const data = await request<SendOtpResponse>('/send', { email, purpose: 'signup', language: 'en' });
  if (data.ok !== true || !data.id) throw new SendOtpError('Unable to send OTP');
  return { id: data.id, expiresAt: data.expiresAt };
};

export const verifySignupOtp = async (email: string, id: string, code: string) => {
  const data = await request<VerifyOtpResponse>('/verify', { email, purpose: 'signup', id, code });
  return data.valid === true;
};

export { SendOtpError };