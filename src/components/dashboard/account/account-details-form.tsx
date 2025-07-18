'use client';

import * as React from 'react';
import {
  Button, Card, CardActions, CardContent, CardHeader,
  Divider, FormControl, InputLabel, MenuItem,
  Select, SelectChangeEvent, Stack, TextField,
} from '@mui/material';
import API from '@/lib/axio-client';

const countries = [
  { value: 'japan', label: 'Japan' },
  { value: 'korea', label: 'South Korea' },
  { value: 'germany', label: 'Germany' },
  { value: 'canada', label: 'Canada' },
] as const;

export function AccountDetailsForm(): React.JSX.Element {
  const [userId, setUserId] = React.useState<number | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phoneNumber: '',
    destinationCountry: '',
    dateOfBirth: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId) return;

    try {
      await API.patch(`/user/${userId}`, {
        ...formData,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString()
          : null,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile.');
    }
  };

  React.useEffect(() => {
    try {
      const storedUser = localStorage.getItem('custom-auth-user');
      if (!storedUser) return;

      const parsed = JSON.parse(storedUser);
      const id = parsed?.id;
      if (id) {
        setUserId(id);
        fetchUserData(id);
      }
    } catch (error) {
      console.error('Error parsing user from localStorage', error);
    }
  }, []);

  const fetchUserData = async (id: number) => {
    try {
      const res = await API.get(`/user/${id}`);
      const data = res.data;
      console.log('Fetched user data:', data);

      setFormData({
        name: data.name || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        destinationCountry: data.destinationCountry || '',
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString().split('T')[0]
          : '',
      });

    } catch (error) {
      console.error('Failed to load user data', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Edit your profile information" title="Account" />
        <Divider />
        <CardContent>
          <Stack spacing={3}>
            {/* Dua kolom */}
            <Stack direction="row" spacing={3}>
              {/* Kolom kiri */}
              <Stack spacing={3} sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
                <FormControl fullWidth>
                  <InputLabel>Destination Country</InputLabel>
                  <Select
                    name="destinationCountry"
                    label="Destination Country"
                    value={formData.destinationCountry}
                    onChange={handleSelectChange}
                  >
                    {countries.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              {/* Kolom kanan */}
              <Stack spacing={3} sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  required
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">
            Save Changes
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
