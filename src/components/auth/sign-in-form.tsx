'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import {
  Stack, Typography, FormControl, InputLabel, OutlinedInput,
  FormHelperText, Button, Alert, Link
} from '@mui/material';
import RouterLink from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';

import { authClient } from '@/lib/auth/client';
import { paths } from '@/paths'; // atau ganti '/dashboard' manual

// 1. Schema validasi
const schema = zod.object({
  email: zod.string().min(1, 'Email wajib diisi').email(),
  password: zod.string().min(1, 'Password wajib diisi'),
});

type Values = zod.infer<typeof schema>;

// 2. Default values yang aman
const defaultValues: Values = {
  email: '',
  password: '',
};

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
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

    router.push(paths.dashboard.overview || '/dashboard');
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h4">Sign in</Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          {/* Email Input */}
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput
                  {...field}
                  value={field.value ?? ''} // ✅ no undefined
                  label="Email address"
                />
                {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
              </FormControl>
            )}
          />

          {/* Password Input */}
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  {...field}
                  value={field.value ?? ''} // ✅ no undefined
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon cursor="pointer" onClick={() => setShowPassword(false)} />
                    ) : (
                      <EyeSlashIcon cursor="pointer" onClick={() => setShowPassword(true)} />
                    )
                  }
                />
                {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
              </FormControl>
            )}
          />

          {/* Forgot password link */}
          <div>
            <Link component={RouterLink} href="/auth/reset-password" variant="subtitle2">
              Forgot password?
            </Link>
          </div>

          {/* Root error */}
          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

          {/* Submit button */}
          <Button disabled={isPending} type="submit" variant="contained">
            Sign in
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
