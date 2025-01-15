import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// !!!IMPORTANT
// This GET request needs to stay in this path (api/auth/confirm).
// It is hard coded in the Supabase reset email template:
//   <a href="{{ .SiteURL }}/api/auth/confirm?...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'
  const redirectTo = new URL(next, request.nextUrl.origin)

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      return NextResponse.redirect(redirectTo.toString())
    }
  }

  //TODO: Add proper error page (maybe general).
  redirectTo.pathname = '/error'
  return NextResponse.redirect(redirectTo.toString())
}
