import { useEffect, useState } from 'react';
import create from 'zustand';
import axios from 'axios';

interface AuthState {
  orderRef: string | null;
  qrCodeUrl: string | null;
  status: 'pending' | 'userSign' | 'complete' | 'failed';
  hintCode: string | null;
  timeLeft: number;
  startAuth: (personalNumber: string) => void;
  cancelAuth: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  orderRef: null,
  qrCodeUrl: null,
  status: 'pending',
  hintCode: null,
  timeLeft: 300,
  startAuth: async (personalNumber) => {
    const resp = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/initiate`, { personalNumber });
    set({ orderRef: resp.data.orderRef, qrCodeUrl: resp.data.qrCodeUrl, status: 'pending', timeLeft: 300 });
  },
  cancelAuth: async () => {
    const { orderRef } = get();
    if (orderRef) {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/cancel`, { orderRef });
      set({ orderRef: null, qrCodeUrl: null, status: 'pending', hintCode: null });
    }
  },
}));

export default function Home() {
  const { orderRef, qrCodeUrl, status, hintCode, timeLeft, startAuth, cancelAuth } = useAuthStore();
  const [personalNumber, setPersonalNumber] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (orderRef && status !== 'complete') {
      interval = setInterval(async () => {
        const resp = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/status`, { params: { orderRef } });
        const { status: newStatus, hintCode: newHintCode } = resp.data;
        useAuthStore.setState({ status: newStatus, hintCode: newHintCode });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [orderRef, status]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (orderRef && timeLeft > 0) {
      timer = setTimeout(() => {
        useAuthStore.setState({ timeLeft: timeLeft - 1 });
      }, 1000);
    }
    return () => clearTimeout(timer!);
  }, [orderRef, timeLeft]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {!orderRef ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            startAuth(personalNumber);
          }}
          aria-label="Start BankID authentication"
        >
          <label htmlFor="personalNumber" className="sr-only">
            Personnummer
          </label>
          <input
            id="personalNumber"
            type="text"
            value={personalNumber}
            onChange={(e) => setPersonalNumber(e.target.value)}
            placeholder="YYYYMMDDXXXX"
            aria-required="true"
            className="border p-2 rounded"
          />
          <button type="submit" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">
            Logga in
          </button>
        </form>
      ) : status === 'pending' && qrCodeUrl ? (
        <div className="text-center" role="status">
          <img src={qrCodeUrl} alt="BankID QR code" className="mx-auto" />
          <div>Tid kvar: {timeLeft} sekunder</div>
          {timeLeft < 30 && (
            <button onClick={() => startAuth(personalNumber)} className="mt-2 underline">
              Starta om tiden
            </button>
          )}
          <button onClick={cancelAuth} className="mt-2 ml-4 underline">
            Avbryt
          </button>
        </div>
      ) : status === 'userSign' ? (
        <div role="alert">Öppna BankID-appen och signera</div>
      ) : status === 'complete' ? (
        <div role="alert">Inloggad!</div>
      ) : (
        <div role="alert">
          Fel uppstod. <button onClick={() => startAuth(personalNumber)}>Försök igen</button>
        </div>
      )}
    </div>
  );
}
