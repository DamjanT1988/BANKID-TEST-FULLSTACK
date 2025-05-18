// apps/frontend/pages/index.tsx

// React and Next.js imports for component lifecycle and optimized rendering
import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import create from 'zustand' // Zustand for local store
import axios from 'axios' // Axios for HTTP requests
import Image from 'next/image' // Next.js optimized Image component
import { useTranslation } from 'next-i18next' // Translation hook
import { serverSideTranslations } from 'next-i18next/serverSideTranslations' // SSR translation loader

// Define the shape of authentication state managed by Zustand
interface AuthState {
  orderRef: string | null            // Unique order reference from backend
  qrCodeUrl: string | null           // URL pointing to generated QR code image
  status: 'pending' | 'userSign' | 'complete' | 'failed' // BankID session status
  hintCode: string | null            // Hint code returned (e.g., "SKICKA")
  timeLeft: number                    // Countdown until session expiration
  startAuth: (personalNumber: string) => void // Function to initiate BankID session
  cancelAuth: () => void             // Function to cancel the session
}

// Create a global store for auth state
const useAuthStore = create<AuthState>((set, get) => ({
  orderRef: null,
  qrCodeUrl: null,
  status: 'pending',
  hintCode: null,
  timeLeft: 300,

  // Initiate BankID session by calling backend
  startAuth: async (personalNumber: string) => {
    // Send personalNumber to /auth/initiate
    const resp = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/initiate`,
      { personalNumber }
    )
    // Store returned data in Zustand store
    set({
      orderRef: resp.data.orderRef,
      qrCodeUrl: resp.data.qrCodeUrl,
      status: 'pending',
      timeLeft: 300,
    })
  },

  // Cancel the ongoing session
  cancelAuth: async () => {
    const { orderRef } = get()
    if (!orderRef) return
    // Notify backend to cancel
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/cancel`,
      { orderRef }
    )
    // Reset store to initial state
    set({ orderRef: null, qrCodeUrl: null, status: 'pending', hintCode: null })
  },
}))

// Main component for login page
export default function Home() {
  const router = useRouter() // Router to handle locale navigation
  const { t } = useTranslation('common') // t() returns translated string
  const {
    orderRef,
    qrCodeUrl,
    status,
    hintCode,
    timeLeft,
    startAuth,
    cancelAuth,
  } = useAuthStore() // Extract auth state and actions

  // Local state for personal number input
  const [personalNumber, setPersonalNumber] = useState<string>('')

  // Helper to switch language by reloading the page with new locale
  const switchLocale = (lng: string) => {
    router.push(router.asPath, router.asPath, { locale: lng })
  }

  // Poll backend status every second while session is active
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (orderRef && status !== 'complete' && status !== 'failed') {
      interval = setInterval(async () => {
        const resp = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/status`,
          { params: { orderRef } }
        )
        // Update status and hintCode in store
        useAuthStore.setState({ status: resp.data.status, hintCode: resp.data.hintCode })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [orderRef, status])

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (orderRef && timeLeft > 0) {
      timer = setTimeout(() => {
        useAuthStore.setState({ timeLeft: timeLeft - 1 })
      }, 1000)
    }
    return () => clearTimeout(timer!)
  }, [orderRef, timeLeft])

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gray-50">
      {/* Language switcher in top-right */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button onClick={() => switchLocale('sv')} className="text-sm text-gray-600 hover:text-gray-800">
          SV
        </button>
        <button onClick={() => switchLocale('en')} className="text-sm text-gray-600 hover:text-gray-800">
          EN
        </button>
      </div>

      {/* Header with logo and tagline */}
      <header className="py-6">
        <div className="max-w-md mx-auto text-center">
          <Image src="/media/logo.png" alt="PatientMe" width={120} height={40} />
          <p className="text-gray-500 mt-2 text-sm">{t('tagline')}</p>
        </div>
      </header>

      {/* Main login/card area */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Title and description */}
          <h1 className="text-2xl font-bold text-gray-800 text-center">{t('welcomeTitle')}</h1>
          <p className="text-gray-600 text-sm text-center">{t('welcomeText')}</p>

          {/* If no session, show login form and social options */}
          {!orderRef ? (
            <>
              <form
                onSubmit={(e: FormEvent) => {
                  e.preventDefault()
                  startAuth(personalNumber)
                }}
                aria-label={String(t('login'))}
                className="space-y-4"
              >
                {/* Input for personal number */}
                <input
                  type="text"
                  value={personalNumber}
                  onChange={(e) => setPersonalNumber(e.target.value)}
                  placeholder={String(t('personalNumberPlaceholder'))}
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {/* BankID login button */}
                <button type="submit" className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium">
                  <Image src="/media/bankid-icon.png" alt="BankID" width={20} height={20} />
                  <span>{t('login')}</span>
                </button>
              </form>

              {/* Or separator */}
              <div className="flex items-center justify-center space-x-3 text-gray-400 text-sm">
                <span className="block h-px bg-gray-300 flex-1" />
                <span>{t('or')}</span>
                <span className="block h-px bg-gray-300 flex-1" />
              </div>

              {/* Social login buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center space-x-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50">
                  <Image src="/media/google-logo.png" alt="Google" width={20} height={20} />
                  <span className="text-gray-700 text-sm">Google</span>
                </button>
                <button className="flex items-center justify-center space-x-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50">
                  <Image src="/media/apple-logo.png" alt="Apple" width={20} height={20} />
                  <span className="text-gray-700 text-sm">Apple</span>
                </button>
              </div>

              {/* Terms & privacy */}
              <p className="text-xs text-gray-500 text-center">
                {t('termsPrefix')} <a href="#" className="underline">{t('terms')}</a> {t('and')} <a href="#" className="underline">{t('privacy')}</a>.
              </p>
            </>
          ) :

          /* If pending, show QR code and countdown */
          status === 'pending' && qrCodeUrl ? (
            <div className="text-center space-y-4" role="status">
              <img src={qrCodeUrl!} alt="BankID QR code" className="mx-auto w-48 h-48" />
              <div>{t('timeoutLabel', { count: timeLeft })}</div>
              <div className="space-x-4">
                {timeLeft < 30 && <button onClick={() => startAuth(personalNumber)} className="underline text-blue-600">{t('restart')}</button>}
                <button onClick={cancelAuth} className="underline text-gray-600">{t('cancel')}</button>
              </div>
            </div>
          ) :

          /* If user sign step */
          status === 'userSign' ? (
            <div role="alert" className="text-center text-gray-800">{t('openApp')}</div>
          ) :

          /* If complete, success message */
          status === 'complete' ? (
            <div role="alert" className="text-center text-green-600 font-bold">{t('loggedIn')}</div>
          ) :

          /* If failed or unknown */
          (
            <div role="alert" className="text-center text-red-600 font-bold">{t('errorOccurred', { action: t('login') })}</div>
          )}
        </div>
      </main>

      {/* Footer with powered by logo */}
      <footer className="py-6">
        <div className="max-w-md mx-auto text-center">
          <p className="text-gray-400 text-xs mb-2">{t('poweredBy')}</p>
          <Image src="/media/gidir-logo.png" alt="Gidir" width={80} height={24} />
        </div>
      </footer>
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
