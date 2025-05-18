// apps/frontend/pages/index.tsx

import { useEffect, useState, FormEvent } from 'react'
import create from 'zustand'
import axios from 'axios'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

interface AuthState {
  orderRef: string | null
  qrCodeUrl: string | null
  status: 'pending' | 'userSign' | 'complete' | 'failed'
  hintCode: string | null
  timeLeft: number
  startAuth: (personalNumber: string) => void
  cancelAuth: () => void
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
    )
    set({
      orderRef: resp.data.orderRef,
      qrCodeUrl: resp.data.qrCodeUrl,
      status: 'pending',
      timeLeft: 300,
    })
  },
  cancelAuth: async () => {
    const { orderRef } = get()
    if (orderRef) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/cancel`,
        { orderRef }
      )
      set({ orderRef: null, qrCodeUrl: null, status: 'pending', hintCode: null })
    }
  },
}))

export default function Home() {
  const { t, i18n } = useTranslation('common')
  const { orderRef, qrCodeUrl, status, hintCode, timeLeft, startAuth, cancelAuth } =
    useAuthStore()
  const [personalNumber, setPersonalNumber] = useState('')

  // Poll status
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (orderRef && status !== 'complete' && status !== 'failed') {
      interval = setInterval(async () => {
        const resp = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/status`,
          { params: { orderRef } }
        )
        useAuthStore.setState({
          status: resp.data.status,
          hintCode: resp.data.hintCode,
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [orderRef, status])

  // Countdown
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (orderRef && timeLeft > 0) {
      timer = setTimeout(
        () => useAuthStore.setState({ timeLeft: timeLeft - 1 }),
        1000
      )
    }
    return () => clearTimeout(timer!)
  }, [orderRef, timeLeft])

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gray-50">
      {/* Language switcher */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => i18n.changeLanguage('sv')}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          SV
        </button>
        <button
          onClick={() => i18n.changeLanguage('en')}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          EN
        </button>
      </div>

      {/* Header */}
      <header className="py-6">
        <div className="max-w-md mx-auto text-center">
          <Image src="/media/logo.png" alt="PatientMe" width={120} height={40} />
          <p className="text-gray-500 mt-2 text-sm">{t('tagline')}</p>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            {t('welcomeTitle')}
          </h1>
          <p className="text-gray-600 text-sm text-center">{t('welcomeText')}</p>

          {!orderRef ? (
            <>
              {/* Inloggningsformulär */}
              <form
                onSubmit={(e: FormEvent) => {
                  e.preventDefault()
                  startAuth(personalNumber)
                }}
                aria-label={String(t('login'))}
                className="space-y-4"
              >
                <input
                  type="text"
                  value={personalNumber}
                  onChange={(e) => setPersonalNumber(e.target.value)}
                  placeholder={String(t('personalNumberPlaceholder'))}
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                >
                  <Image
                    src="/media/bankid-icon.png"
                    alt="BankID"
                    width={20}
                    height={20}
                  />
                  <span>{t('login')}</span>
                </button>
              </form>

              {/* Separator */}
              <div className="flex items-center justify-center space-x-3 text-gray-400 text-sm">
                <span className="block h-px bg-gray-300 flex-1" />
                <span>{t('or')}</span>
                <span className="block h-px bg-gray-300 flex-1" />
              </div>

              {/* Social login */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center space-x-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50">
                  <Image
                    src="/media/google-logo.png"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  <span className="text-gray-700 text-sm">Google</span>
                </button>
                <button className="flex items-center justify-center space-x-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50">
                  <Image
                    src="/media/apple-logo.png"
                    alt="Apple"
                    width={20}
                    height={20}
                  />
                  <span className="text-gray-700 text-sm">Apple</span>
                </button>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center">
                {t('termsPrefix')}{' '}
                <a href="#" className="underline">
                  {t('terms')}
                </a>{' '}
                {t('and')}{' '}
                <a href="#" className="underline">
                  {t('privacy')}
                </a>
                .
              </p>
            </>
          ) : status === 'pending' && qrCodeUrl ? (
            <div className="text-center space-y-4" role="status">
              <img
                src={qrCodeUrl}
                alt="BankID QR code"
                className="mx-auto w-48 h-48"
              />
              <div>{t('timeoutLabel', { count: timeLeft })}</div>
              <div className="space-x-4">
                {timeLeft < 30 && (
                  <button
                    onClick={() => startAuth(personalNumber)}
                    className="underline text-blue-600"
                  >
                    {t('restart')}
                  </button>
                )}
                <button
                  onClick={cancelAuth}
                  className="underline text-gray-600"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          ) : status === 'userSign' ? (
            <div role="alert" className="text-center text-gray-800">
              {t('openApp')}
            </div>
          ) : status === 'complete' ? (
            <div role="alert" className="text-center text-green-600 font-bold">
              {t('loggedIn')}
            </div>
          ) : (
            <div role="alert" className="text-center text-red-600 font-bold">
              {t('errorOccurred', { action: t('login') })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6">
        <div className="max-w-md mx-auto text-center">
          <p className="text-gray-400 text-xs mb-2">{t('poweredBy')}</p>
          <Image
            src="/media/gidir-logo.png"
            alt="Gidir"
            width={80}
            height={24}
          />
        </div>
      </footer>
    </div>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common'
      ]))
    }
  }
}
