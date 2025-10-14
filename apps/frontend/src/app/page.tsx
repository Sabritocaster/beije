'use client';

import { useState, FormEvent } from 'react';
import { CustomPackagePage } from '../features/custom-package/components/CustomPackagePage';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  useLazyCheckVerificationQuery,
  useRegisterMutation,
} from '../services/userApi';

const extractErrorMessage = (error: unknown): string => {
  if (
    error &&
    typeof error === 'object' &&
    'data' in error &&
    error.data &&
    typeof error.data === 'object' &&
    'message' in error.data
  ) {
    const message = (error.data as { message?: string }).message;
    if (message) return message;
  }
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message?: string }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }
  return 'Bir hata oluştu, lütfen tekrar dene.';
};

function Header({ activeView, setActiveView }: { activeView: string, setActiveView: (view: string) => void }) {
  return (
    <header className="sticky top-0 z-10 rounded-full bg-[#f9f5f3] px-6 py-4 shadow-panel backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold tracking-tight text-[#ee3f6b]">
          beije.
        </span>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-500">
          <button
            type="button"
            onClick={() => setActiveView('package')}
            className={`transition-colors hover:text-slate-900 ${activeView === 'package' ? 'text-slate-900' : ''}`}>
            Package
          </button>
          <button
            type="button"
            onClick={() => setActiveView('email')}
            className={`transition-colors hover:text-slate-900 ${activeView === 'email' ? 'text-slate-900' : ''}`}>
            Email
          </button>
        </nav>
      </div>
    </header>
  );
}

function EmailPage() {
  const [register, registerState] = useRegisterMutation();
  const [checkVerification, checkState] = useLazyCheckVerificationQuery();

  const [registerFeedback, setRegisterFeedback] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [statusFeedback, setStatusFeedback] = useState('');
  const [statusError, setStatusError] = useState('');

  const onRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRegisterFeedback('');
    setRegisterError('');

    const formData = new FormData(event.currentTarget);
    const username = (formData.get('username') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();

    if (!username || !email) {
      setRegisterError('Kullanıcı adı ve e-posta adresi gerekli.');
      return;
    }

    try {
      const response = await register({ username, email }).unwrap();
      setRegisterFeedback(response.message);
      event.currentTarget.reset();
    } catch (error) {
      setRegisterError(extractErrorMessage(error));
    }
  };

  const onCheckStatus = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusFeedback('');
    setStatusError('');
    const formData = new FormData(event.currentTarget);
    const username = (formData.get('status-username') as string)?.trim();
    if (!username) {
      setStatusError('Lütfen bir kullanıcı adı gir.');
      return;
    }
    try {
      const response = await checkVerification(username).unwrap();
      setStatusFeedback(response.message);
    } catch (error) {
      setStatusError(extractErrorMessage(error));
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            E-posta Doğrulama Simülasyonu
          </Typography>

          <Stack component="form" spacing={1.5} onSubmit={onRegister} noValidate sx={{ mt: 2 }}>
            <TextField name="username" label="Kullanıcı adı" size="small" required />
            <TextField name="email" type="email" label="E-posta" size="small" required />
            <Button type="submit" variant="outlined" disabled={registerState.isLoading}>
              {registerState.isLoading ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CircularProgress size={18} />
                  <span>Gönderiliyor...</span>
                </Stack>
              ) : (
                'Doğrulama e-postası gönder'
              )}
            </Button>
          </Stack>

          <Stack component="form" spacing={1.5} mt={3} onSubmit={onCheckStatus} noValidate>
            <TextField name="status-username" label="Kullanıcı adı" size="small" required />
            <Button type="submit" variant="text" disabled={checkState.isFetching}>
              {checkState.isFetching ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CircularProgress size={18} />
                  <span>Sorgulanıyor...</span>
                </Stack>
              ) : (
                'Doğrulama durumunu kontrol et'
              )}
            </Button>
          </Stack>

          <Stack mt={2} spacing={1.5}>
            {registerFeedback && <Alert severity="success">{registerFeedback}</Alert>}
            {registerError && <Alert severity="error">{registerError}</Alert>}
            {statusFeedback && <Alert severity="info">{statusFeedback}</Alert>}
            {statusError && <Alert severity="warning">{statusError}</Alert>}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}


export default function Page() {
  const [activeView, setActiveView] = useState('package');

  return (
    <div>
      <Header activeView={activeView} setActiveView={setActiveView} />
      {activeView === 'package' ? <CustomPackagePage /> : <EmailPage />}
    </div>
  );
}
