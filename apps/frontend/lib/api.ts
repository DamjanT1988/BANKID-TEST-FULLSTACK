import axios from 'axios';

export async function initLogin(): Promise<string> {
  const res = await axios.post('/api/auth/login');
  return res.data.orderRef;
}

export async function getStatus(orderRef: string) {
  const res = await axios.get(`/api/auth/status/${orderRef}`);
  return res.data;
}

export async function cancelLogin(orderRef: string) {
  await axios.post(`/api/auth/cancel/${orderRef}`);
}

export async function restartLogin() {
  await axios.post('/api/auth/login');
}
