import 'src/global.css';

// ----------------------------------------------------------------------

import { Provider as ReduxProvider } from 'react-redux';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { store } from 'src/redux/store';
import { LocalizationProvider } from 'src/locales';
import { I18nProvider } from 'src/locales/i18n-provider';
import { ThemeProvider } from 'src/theme/theme-provider';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { CheckoutProvider } from 'src/sections/checkout/context';

import { AuthProvider as JwtAuthProvider } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

const AuthProvider = JwtAuthProvider;

export default function App() {
  useScrollToTop();

  return (
    <I18nProvider>
      <LocalizationProvider>
        <AuthProvider>
          <ReduxProvider store={store}>
            <SettingsProvider settings={defaultSettings}>
              <ThemeProvider>
                <MotionLazy>
                  <CheckoutProvider>
                    <Snackbar />
                    <ProgressBar />
                    <SettingsDrawer />
                    <Router />
                  </CheckoutProvider>
                </MotionLazy>
              </ThemeProvider>
            </SettingsProvider>
          </ReduxProvider>
        </AuthProvider>
      </LocalizationProvider>
    </I18nProvider>
  );
}
