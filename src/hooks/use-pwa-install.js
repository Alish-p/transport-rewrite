import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

/**
 * Detects the user's platform and manages PWA install prompt state.
 *
 * - Chrome/Edge (Android, Windows, macOS): captures the `beforeinstallprompt` event
 *   and exposes `promptInstall()` to trigger the native install dialog.
 * - iOS Safari: no native prompt exists — `isIos` flag signals the UI to show
 *   manual "Add to Home Screen" instructions.
 * - macOS Safari: same situation — `isMacSafari` flag signals Mac-specific instructions.
 */
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  const isMacSafari =
    /Macintosh/.test(navigator.userAgent) &&
    /Safari/.test(navigator.userAgent) &&
    !/Chrome/.test(navigator.userAgent);

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

  const isInstallable = Boolean(deferredPrompt);

  // Whether the install button should show any install option at all
  const canInstall = isInstallable || isIos || isMacSafari;

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);

    return outcome === 'accepted';
  }, [deferredPrompt]);

  return {
    /** True when the native Chrome/Edge install prompt is available */
    isInstallable,
    /** True on iOS Safari (needs manual instructions) */
    isIos,
    /** True on macOS Safari (needs manual instructions) */
    isMacSafari,
    /** True if the app is already running in standalone/PWA mode */
    isStandalone,
    /** True if any install path is available (native prompt or manual instructions) */
    canInstall,
    /** Triggers the native Chrome/Edge install prompt. Returns true if accepted. */
    promptInstall,
  };
}
