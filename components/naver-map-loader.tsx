"use client"

import type React from "react"

import { useEffect, useState } from "react"

export function NaverMapLoader({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (window.naver && window.naver.maps) {
      setLoaded(true)
      return
    }

    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID

    if (!clientId) {
      console.error("[v0] NEXT_PUBLIC_NAVER_MAP_CLIENT_ID is not set")
      return
    }

    const script = document.createElement("script")
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`
    script.async = true
    script.onload = () => {
      console.log("[v0] Naver Maps API loaded successfully")
      setLoaded(true)
    }
    script.onerror = () => {
      console.error("[v0] Failed to load Naver Maps API")
    }

    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">지도를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
