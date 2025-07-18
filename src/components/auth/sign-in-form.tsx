'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import {
  Stack, Typography, FormControl, InputLabel, OutlinedInput,
  FormHelperText, Button, Alert, IconButton, Box
} from '@mui/material';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';

import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';

// 1. Schema validasi Zod
const schema = zod.object({
  email: zod.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: zod.string().min(1, 'Password wajib diisi'),
});

type Values = zod.infer<typeof schema>;

// 2. Default value untuk form
const defaultValues: Values = {
  email: '',
  password: '',
};

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const { checkSession } = useUser();

  const [showPassword, setShowPassword] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  // 3. React Hook Form setup
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  // 4. Submit handler
  const onSubmit = async (values: Values) => {
    setIsPending(true);
    const { error } = await authClient.signInWithPassword(values);

    if (error) {
      setError('root', { type: 'server', message: error });
      setIsPending(false);
      return;
    }

    // ⏬ Refresh session context
    await checkSession();

    // 🔁 Redirect ke dashboard
    router.push('/dashboard');
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h4" fontWeight="bold">Sign in</Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)} fullWidth>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput
                  {...field}
                  value={field.value ?? ''}
                  label="Email address"
                />
                {errors.email && (
                  <FormHelperText>{errors.email.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)} fullWidth>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  {...field}
                  value={field.value ?? ''}
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  endAdornment={
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <EyeSlashIcon size={18} /> : <EyeIcon size={18} />}
                    </IconButton>
                  }
                />
                {errors.password && (
                  <FormHelperText>{errors.password.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />


          {/* Root/server error */}
          {errors.root && (
            <Alert severity="error">{errors.root.message}</Alert>
          )}

          {/* Submit */}
          <Button type="submit" variant="contained" disabled={isPending} fullWidth>
            {isPending ? 'Memproses...' : 'Sign in'}
          </Button>

            <Box
              bgcolor="grey.100"
              px={2}
              py={1.5}
              mt={2}
              borderRadius={2}
              textAlign="center"
            >
              <Typography variant="body2" color="text.secondary">
                Gunakan akun contoh: <strong>dwidelta@example.com</strong> / <strong>dwidelta123</strong>
              </Typography>
            </Box>
        </Stack>
      </form>
    </Stack>
  );
}
