import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function EmailConfirmed() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-white text-gray-900">
      <main className="text-center">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-16">
          <a
            href="#"
            className="flex items-center gap-3 font-semibold text-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-600 text-white">
              <CheckCircle className="h-6 w-6" />
            </div>
            <p className="text-gray-900">Atrinum</p>
          </a>
        </div>
        {/* Confirmation Section */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Your Email Has Been Confirmed!
        </h1>
        <p className="text-lg mb-8 max-w-md mx-auto text-gray-600">
          Thank you for confirming your email. You can now log in to get
          started.
        </p>
        {/* Button Section */}
        <Link
          href="/login"
          className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          Go to Login
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </main>
      {/* Footer Section */}
      <footer className="mt-16 text-sm text-gray-500">
        &copy; 2025 Atrinum. All rights reserved.
      </footer>
    </div>
  )
}
