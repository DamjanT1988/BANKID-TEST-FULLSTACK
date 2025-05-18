
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Callback() {
  const router = useRouter();
  const { autostarttoken } = router.query;
  const [status, setStatus] = useState<'pending'|'userSign'|'complete'|'failed'>('pending');
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    if (!autostarttoken) return;
    const interval = setInterval(async () => {
      try {
        const resp = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/status`, {
          params: { orderRef: autostarttoken }
        });
        setStatus(resp.data.status);
        setHint(resp.data.hintCode);
        if (resp.data.status === 'complete' || resp.data.status === 'failed') {
          clearInterval(interval);
        }
      } catch {
        setStatus('failed');
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [autostarttoken]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
        {status === 'pending' && <p>Väntar på signering...</p>}
        {status === 'userSign' && <p>Öppna BankID-appen och signera. <br/><strong>{hint}</strong></p>}
        {status === 'complete' && <p className="text-green-600 font-bold">Inloggad!</p>}
        {status === 'failed' && <p className="text-red-600 font-bold">Fel uppstod. Försök igen.</p>}
      </div>
    </div>
  );
}
