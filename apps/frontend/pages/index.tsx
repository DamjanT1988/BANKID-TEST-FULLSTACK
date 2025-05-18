// pages/index.tsx
import Image from 'next/image';
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
    const resp = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/initiate`,
      { personalNumber }
    );
    set({
      orderRef: resp.data.orderRef,
      qrCodeUrl: resp.data.qrCodeUrl,
      status: 'pending',
      timeLeft: 300,
    });
  },
  cancelAuth: async () => {
    const { orderRef } = get();
    if (orderRef) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/cancel`,
        { orderRef }
      );
      set({
        orderRef: null,
        qrCodeUrl: null,
        status: 'pending',
        hintCode: null,
      });
    }
  },
}));

export default function Home() {
  const {
    orderRef,
    qrCodeUrl,
    status,
    hintCode,
    timeLeft,
    startAuth,
    cancelAuth,
  } = useAuthStore();
  const [personalNumber, setPersonalNumber] = useState('YYYYMMDDXXXX');

  // Polling för status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (orderRef && status !== 'complete') {
      interval = setInterval(async () => {
        const resp = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/status`,
          { params: { orderRef } }
        );
        const { status: newStatus, hintCode: newHintCode } = resp.data;
        useAuthStore.setState({ status: newStatus, hintCode: newHintCode });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [orderRef, status]);

  // Timer-nedräkning
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {/* Header med logo */}
        <header className="mb-6">
          <Image
            src="/patientme-logo.svg"
            alt="PatientMe"
            width={120}
            height={32}
            className="mx-auto"
          />
          <p className="text-gray-500 text-sm mt-2">
            Din hälsa är vår prioritet.
          </p>
        </header>

        {/* Titel och beskrivning */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Välkommen till PatientMe
        </h1>
        <p className="text-gray-600 mb-6">
          Lås upp din hälsoresa med säker åtkomst till din medicinska
          information.
        </p>

        {/* --- KONDITIONALT INNEHÅLL --- */}
        {!orderRef ? (
          /* Steg 1: Starta BankID-flow */
          <>
            <button
              onClick={() => startAuth(personalNumber)}
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              <Image
                src="/bankid-logo.svg"
                alt="BankID"
                width={24}
                height={24}
                className="mr-2"
              />
              Logga in med BankID
            </button>

            {/* Separator */}
            <div className="flex items-center my-6">
              <span className="flex-grow border-t border-gray-300"></span>
              <span className="mx-2 text-gray-500">Eller</span>
              <span className="flex-grow border-t border-gray-300"></span>
            </div>

            {/* Alternativa inloggmetoder */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition">
                <Image
                  src="/google-logo.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Google
              </button>
              <button className="flex items-center justify-center border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition">
                <Image
                  src="/apple-logo.svg"
                  alt="Apple"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Apple
              </button>
            </div>

            {/* Villkorstext */}
            <p className="text-xs text-gray-400 mt-6">
              Genom att logga in bekräftar och godkänner du våra{' '}
              <a href="/terms" className="underline">
                Användarvillkor
              </a>{' '}
              och{' '}
              <a href="/privacy" className="underline">
                Integritetspolicy
              </a>
              .
            </p>
          </>
        ) : status === 'pending' && qrCodeUrl ? (
          /* Steg 2: Visa QR-kod + timer */
          <div role="status" className="space-y-4">
            <img
              src={qrCodeUrl}
              alt="BankID QR code"
              className="mx-auto w-64 h-64"
            />
            <div className="text-gray-700">Tid kvar: {timeLeft} sekunder</div>
            <div className="flex justify-center space-x-4">
              {timeLeft < 30 && (
                <button
                  onClick={() => startAuth(personalNumber)}
                  className="underline text-blue-600"
                >
                  Starta om
                </button>
              )}
              <button
                onClick={cancelAuth}
                className="underline text-gray-600"
              >
                Avbryt
              </button>
            </div>
          </div>
        ) : status === 'userSign' ? (
          /* Steg 3: Vänta på användarsignering */
          <div role="alert" className="text-blue-600 font-medium">
            Öppna BankID-appen och signera
          </div>
        ) : status === 'complete' ? (
          /* Steg 4: Klar */
          <div role="alert" className="text-green-600 font-bold">
            Inloggad!
          </div>
        ) : (
          /* Felhantering */
          <div role="alert" className="text-red-600">
            Fel uppstod.{' '}
            <button
              onClick={() => startAuth(personalNumber)}
              className="underline"
            >
              Försök igen
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8">
          <p className="text-xs text-gray-400">Powered by Giddir</p>
        </footer>
      </div>
    </div>
  );
}
