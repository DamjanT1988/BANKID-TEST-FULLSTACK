// apps/frontend/pages/callback.tsx

// Next.js router for extracting query params
import { useRouter } from 'next/router'
// React hooks for lifecycle and state
import { useEffect, useState } from 'react'
// Axios for HTTP requests
import axios from 'axios'
// Translation hook
import { useTranslation } from 'next-i18next'
// SSR translation loader
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

// Callback page shown after BankID app flow
export default function Callback() {
  // Translation function
  const { t } = useTranslation('common')
  // Next.js router to read URL params
  const router = useRouter()
  // autostarttoken param used as orderRef
  const { autostarttoken } = router.query

  // Local state for session status and hint codes
  const [status, setStatus] = useState<'pending'|'userSign'|'complete'|'failed'>('pending')
  const [hint, setHint] = useState<string|null>(null)

  // Poll backend endpoint to get status updates
  useEffect(() => {
    // Only start polling once we have a token
    if (!autostarttoken) return

    const interval = setInterval(async () => {
      try {
        // GET /auth/status with orderRef param
        const resp = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/status`,
          { params: { orderRef: autostarttoken } }
        )
        // Update state based on response
        setStatus(resp.data.status)
        setHint(resp.data.hintCode)
        // Stop polling once complete or failed
        if (resp.data.status === 'complete' || resp.data.status === 'failed') {
          clearInterval(interval)
        }
      } catch {
        // On error, mark as failed and clear interval
        setStatus('failed')
        clearInterval(interval)
      }
    }, 1000)

    // Cleanup interval on unmount or token change
    return () => clearInterval(interval)
  }, [autostarttoken])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
        {/* Show countdown if pending */}
        {status === 'pending' && <p>{t('timeoutLabel', { count: 0 })}</p>}

        {/* Show hint during user signing step */}
        {status === 'userSign' && (
          <p>
            {t('openApp')}<br /><strong>{hint}</strong>
          </p>
        )}

        {/* Success message when complete */}
        {status === 'complete' && (
          <p className="text-green-600 font-bold">{t('loggedIn')}</p>
        )}

        {/* Failure message on error */}
        {status === 'failed' && (
          <p className="text-red-600 font-bold">
            {t('errorOccurred', { action: t('login') })}
          </p>
        )}
      </div>
    </div>
  )
}

// Load translations server-side for SSR
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  }
}
