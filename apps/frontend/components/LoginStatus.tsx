import { useEffect } from 'react';
import useSessionStore from '../stores/sessionStore';
import { useTranslation } from 'react-i18next';

export default function LoginStatus() {
  const { status, clear } = useSessionStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (status?.status === 'complete') {
      setTimeout(() => clear(), 5000);
    }
  }, [status, clear]);

  if (!status) return null;
  if (status.status === 'userSign') return <p>{t('signPrompt')}</p>;
  if (status.status === 'complete') return <p>{t('complete')}</p>;
  if (status.status === 'failed') return <p>{t('error')}</p>;
  return null;
}
