import Link from 'next/link'
import { Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-white text-gray-900">
      <main className="text-center">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-16">
          <a
            href="#"
            className="flex items-center gap-3 font-semibold text-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-800 text-white">
              <Mail className="h-6 w-6" />
            </div>
            <p className="text-gray-900">Atrinum</p>
          </a>
        </div>
        {/* Welcome Section */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to Atrinum!
        </h1>
        <p className="text-lg mb-8 max-w-md mx-auto text-gray-600">
          A confirmation email has been sent to your inbox. Please check your
          email to verify your account and complete the setup process.
        </p>
        {/* Button Section */}
        <Link href="/login">
          <Button>
            Go to Login
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </main>
      {/* Footer Section */}
      <footer className="mt-16 text-sm text-gray-500">
        &copy; 2025 Atrinum. All rights reserved.
      </footer>
    </div>
  )
}
