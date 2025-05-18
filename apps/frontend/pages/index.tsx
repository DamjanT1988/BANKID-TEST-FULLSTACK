// Before using React Aria hooks, install necessary packages:
// npm install @react-aria/textfield @react-aria/button @react-aria/label @react-aria/utils @react-aria/focus

// apps/frontend/pages/index.tsx

import { useEffect, useState, FormEvent, useRef } from 'react'
import { useRouter } from 'next/router'
import create from 'zustand'       // Zustand for lightweight state management
import axios from 'axios'         // HTTP client for backend requests
import Image from 'next/image'    // Next.js optimized Image component
import { useTranslation } from 'next-i18next'       // i18n hook for translations
import { serverSideTranslations } from 'next-i18next/serverSideTranslations' // SSR translation loader

// React Aria imports for accessibility
import { useTextField } from '@react-aria/textfield'
import { useButton } from '@react-aria/button'
import { useLabel } from '@react-aria/label'

// Define the shape of our authentication state
interface AuthState {
  orderRef: string | null                           // Unique reference for BankID session
  qrCodeUrl: string | null                          // URL for QR code image
  status: 'pending' | 'userSign' | 'complete' | 'failed' // Current status of the session
  hintCode: string | null                           // Hint code provided by BankID (e.g. "SKICKA")
  timeLeft: number                                   // Seconds remaining for QR code validity
  startAuth: (personalNumber: string) => void        // Initiate BankID flow
  cancelAuth: () => void                            // Cancel ongoing flow
}

// Create a Zustand store to hold authentication state globally
const useAuthStore = create<AuthState>((set, get) => ({
  orderRef: null,
  qrCodeUrl: null,
  status: 'pending',
  hintCode: null,
  timeLeft: 300,

  // startAuth: calls backend to get orderRef and qrCodeUrl
  startAuth: async (personalNumber: string) => {
    const resp = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/initiate`,
      { personalNumber }
    )
    set({
      orderRef: resp.data.orderRef,
      qrCodeUrl: resp.data.qrCodeUrl,
      status: 'pending',
      timeLeft: 300,
    })
  },

  // cancelAuth: notifies backend and resets state
  cancelAuth: async () => {
    const { orderRef } = get()
    if (!orderRef) return
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/cancel`,
      { orderRef }
    )
    set({ orderRef: null, qrCodeUrl: null, status: 'pending', hintCode: null })
  },
}))

// Main React component for the login page
export default function Home() {
  const router = useRouter()                 // Router for navigation & locale change
  const { t } = useTranslation('common')     // Translation function
  // Pull auth state and actions from the store
  const { orderRef, qrCodeUrl, status, hintCode, timeLeft, startAuth, cancelAuth } = useAuthStore()

  // Local state for user input (personal number)
  const [personalNumber, setPersonalNumber] = useState('')

  // Refs for ARIA hook integration
  const inputRef = useRef(null)
  const buttonRef = useRef(null)

  // ARIA: label props for the input field
  const { labelProps } = useLabel({
    label: String(t('personalNumberPlaceholder'))
  })
  // ARIA: inputProps to wire up accessibility behavior
  const { inputProps } = useTextField(
    {
      value: personalNumber,
      onChange: setPersonalNumber,
      label: String(t('personalNumberPlaceholder')),
      isRequired: true,
    },
    inputRef
  )
  // ARIA: buttonProps for the submit button
  const { buttonProps } = useButton(
    { onPress: () => startAuth(personalNumber) },
    buttonRef
  )

  // Helper to switch languages by pushing new locale to router
  const switchLocale = (lng: string) => {
    router.push(router.asPath, router.asPath, { locale: lng })
  }

  // Effect: poll backend status every second while flow is active
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (orderRef && status !== 'complete' && status !== 'failed') {
      interval = setInterval(async () => {
        const resp = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/status`,
          { params: { orderRef } }
        )
        // Update status and hint code
        useAuthStore.setState({ status: resp.data.status, hintCode: resp.data.hintCode })
      }, 1000)
    }
    return () => clearInterval(interval) // Cleanup on unmount or orderRef change
  }, [orderRef, status])

  // Effect: countdown timer for QR code expiration
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
      {/* Language switcher buttons */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button onClick={() => switchLocale('sv')} className="text-sm text-gray-600 hover:text-gray-800">SV</button>
        <button onClick={() => switchLocale('en')} className="text-sm text-gray-600 hover:text-gray-800">EN</button>
      </div>

      {/* Header section with logo & tagline */}
      <header className="py-6">
        <div className="max-w-md mx-auto text-center">
          <Image src="/media/logo.png" alt="PatientMe Logo" width={120} height={40} />
          <p className="text-gray-500 mt-2 text-sm">{t('tagline')}</p>
        </div>
      </header>

      {/* Main card container */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">{t('welcomeTitle')}</h1>
          <p className="text-gray-600 text-sm text-center">{t('welcomeText')}</p>

          {/* Initial login form (no active session) */}
          {!orderRef ? (
            <>
              {/* ARIA label (visually hidden) */}
              <label {...labelProps} className="sr-only" />
              {/* ARIA-enhanced input */}
              <input
                {...inputProps}
                ref={inputRef}
                placeholder={String(t('personalNumberPlaceholder'))}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {/* ARIA-enhanced submit button */}
              <button
                {...buttonProps}
                ref={buttonRef}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                aria-label={String(t('login'))}
              >
                <Image src="/media/bankid-icon.png" alt="BankID Icon" width={20} height={20} />
                <span>{t('login')}</span>
              </button>
            </>
          ) : null}

          {/* QR code and countdown while pending */}
          {status === 'pending' && qrCodeUrl && (
            <div role="status" className="text-center space-y-4">
              <img src={qrCodeUrl} alt="BankID QR code" className="mx-auto w-48 h-48" />
              <div>{t('timeoutLabel', { count: timeLeft })}</div>
              <div className="space-x-4">
                {timeLeft < 30 && (
                  <button onClick={() => startAuth(personalNumber)} className="underline text-blue-600">
                    {t('restart')}
                  </button>
                )}
                <button onClick={cancelAuth} className="underline text-gray-600">{t('cancel')}</button>
              </div>
            </div>
          )}

          {/* Messaging for other statuses */}
          {status === 'userSign' && (
            <div role="alert" className="text-center text-gray-800">
              {t('openApp')}<br /><strong>{hintCode}</strong>
            </div>
          )}
          {status === 'complete' && (
            <div role="alert" className="text-center text-green-600 font-bold">
              {t('loggedIn')}
            </div>
          )}
          {status === 'failed' && (
            <div role="alert" className="text-center text-red-600 font-bold">
              {t('errorOccurred', { action: t('login') })}
            </div>
          )}
        </div>
      </main>

      {/* Footer with attribution */}
      <footer className="py-6">
        <div className="max-w-md mx-auto text-center">
          <p className="text-gray-400 text-xs mb-2">{t('poweredBy')}</p>
          <Image src="/media/gidir-logo.png" alt="Gidir Logo" width={80} height={24} />
        </div>
      </footer>
    </div>
  )
}

// Pre-load translations for SSR
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
