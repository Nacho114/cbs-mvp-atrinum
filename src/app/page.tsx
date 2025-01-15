import Link from 'next/link'
import { ArrowRight, GalleryVerticalEnd } from 'lucide-react'

export default function Home() {
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
              <GalleryVerticalEnd className="h-6 w-6" />
            </div>
            <p className="text-gray-900">Atrinum</p>
          </a>
        </div>
        {/* Tagline Section */}
        <p className="text-xl mb-8 max-w-md mx-auto text-gray-600">
          Simple, secure banking at your fingertips.
        </p>
        {/* Button Section */}
        <Link
          href="/login"
          className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          Get Started
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
