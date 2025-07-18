'use client';

import * as React from 'react';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography
} from '@mui/material';
import API from '@/lib/axio-client';

interface User {
  id: number;
  name: string;
  avatar?: string;
  jobTitle?: string;
  country?: string;
  city?: string;
  role: string;
  timezone?: string;
}

export function AccountInfo(): React.JSX.Element {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const userData = localStorage.getItem('custom-auth-user');
    if (userData) {
      const parsed = JSON.parse(userData);
      const userId = parsed.id;

      API.get(`/user/${userId}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!user) {
    return <Typography>User not found</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar
              src={user.avatar || '/assets/avatar.png'}
              sx={{ height: '80px', width: '80px' }}
            />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user.name}</Typography>
            <Typography color="text.secondary" variant="body2">
              {user.role || 'Unknown City'}, {user.country || 'Unknown Country'}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user.timezone || 'GTM+0'}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text">
          User Info
        </Button>
      </CardActions>
    </Card>
  );
}
