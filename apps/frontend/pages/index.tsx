import { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import useSessionStore from '../stores/sessionStore';
import { initLogin, getStatus, cancelLogin, restartLogin } from '../lib/api';
import LoginStatus from '../components/LoginStatus';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const { orderRef, setOrderRef, status, setStatus, clear } = useSessionStore();
  const [timer, setTimer] = useState(300);

  useEffect(() => {
    async function start() {
      const ref = await initLogin();
      setOrderRef(ref);
    }
    start();
  }, [setOrderRef]);

  useEffect(() => {
    let interval: any;
    if (orderRef) {
      interval = setInterval(async () => {
        const res = await getStatus(orderRef);
        setStatus(res);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [orderRef, setStatus]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl">{t('login')}</h1>
      {status?.status === 'pending' && orderRef && (
        <QRCode value={orderRef} size={256} />
      )}
      <LoginStatus />
      <div className="mt-4">
        <button onClick={() => cancelLogin(orderRef!)}>{t('cancel')}</button>
        {timer < 30 && <button onClick={() => { clear(); restartLogin(); setTimer(300); }}>{t('restart')}</button>}
      </div>
      <div className="mt-2">{timer}s</div>
    </div>
  );
}
