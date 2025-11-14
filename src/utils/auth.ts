export function removeAuthToken() {
  document.cookie = "auth_token=; path=/; max-age=0";
}

// NOTE: Cannot remove httpOnly cookies from client-side. Server-side logout endpoint is required.
// Example (server): fetch('/logout', { method: 'POST', credentials: 'include' })
//   .then(() => window.location.href = '/login');

// fetch('/logout', { method: 'POST', credentials: 'include' })
//   .then(() => window.location.href = '/login');