import API_URL from '../config';
// Simple API utility for ProfileSettings
export async function fetchUserProfile(email) {
  const res = await fetch(`${API_URL}/api/member?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return await res.json();
}

export async function updateUserProfile(profile) {
  const res = await fetch(`${API_URL}/api/update-member`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!res.ok) throw new Error('Failed to update user profile');
  return await res.json();
}

export async function changePassword({ email, currentPassword, newPassword }) {
  const res = await fetch(`${API_URL}/api/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, currentPassword, newPassword })
  });
  if (!res.ok) throw new Error('Failed to change password');
  return await res.json();
}
