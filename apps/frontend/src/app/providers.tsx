'use client';

import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { theme } from '../theme';

export function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
}
