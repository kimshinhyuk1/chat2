import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

export const createEdgeSupabaseClient = (request: NextRequest) => {
  // 기본 응답 객체 생성
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  })

  // Supabase 클라이언트 생성
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${request.headers.get("Authorization") || ""}`
        }
      }
    }
  )

  return { supabase, response }
}
