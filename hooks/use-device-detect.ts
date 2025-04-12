'use client'

import { useState, useEffect } from 'react'

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean
}

type DeviceType = 'mobile' | 'tablet' | 'desktop'
type OSType = 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'unknown'

interface DeviceInfo {
  deviceType: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  os: OSType
  isIOS: boolean
  isAndroid: boolean
  isStandalone: boolean
  canInstall: boolean
}

export function useDeviceDetect(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    deviceType: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    os: 'unknown',
    isIOS: false,
    isAndroid: false,
    isStandalone: false,
    canInstall: false,
  })

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') return

    // Detect device type
    const userAgent = navigator.userAgent
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const tablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)

    // Detect OS
    const isIOS =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const isAndroid = /Android/.test(userAgent)

    let os: OSType = 'unknown'
    if (isIOS) os = 'iOS'
    else if (isAndroid) os = 'Android'
    // Check if app is in standalone mode (installed as PWA)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as NavigatorWithStandalone).standalone ||
      false

    // Determine if the app can be installed
    // This is a simplified check - in reality you'd use the beforeinstallprompt event
    const canInstall = !isStandalone && (isAndroid || isIOS)
    const deviceType = tablet ? 'tablet' : mobile ? 'mobile' : 'desktop'

    setDeviceInfo({
      deviceType,
      isMobile: mobile && !tablet,
      isTablet: tablet,
      isDesktop: !mobile && !tablet,
      os,
      isIOS,
      isAndroid,
      isStandalone,
      canInstall,
    })
  }, [])

  return deviceInfo
}
