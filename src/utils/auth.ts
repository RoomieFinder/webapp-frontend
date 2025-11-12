export function removeAuthToken() {
  document.cookie = "auth_token=; path=/; max-age=0";
}

// ใช้ไม่ได้ เพราะ token เป็น httpOnly
// ต้องลบจากฝั่ง server

// fetch('/logout', { method: 'POST', credentials: 'include' })
//   .then(() => window.location.href = '/login');