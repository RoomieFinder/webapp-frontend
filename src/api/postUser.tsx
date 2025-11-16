interface UserUpdateData {
  username: string;
  email: string;
  phone: string;
  gender: string;
  description: string;
  hobbies?: (number | string)[];
  personal_picture?: File;
}

export async function postUser(data: UserUpdateData) {
  const baseUrl = process.env.APP_ADDRESS || "http://localhost:8080";
  const formData = new FormData();

  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("gender", data.gender);
  formData.append("description", data.description);

  // ✅ append hobbies one by one
  if (data.hobbies && Array.isArray(data.hobbies)) {
    data.hobbies.forEach((hobbyId: number | string) => {
      formData.append("hobbies", hobbyId.toString());
    });
  }

  if (data.personal_picture) {
    formData.append("personal_picture", data.personal_picture);
  }

  const res = await fetch(`${baseUrl}/user/editUserProfile`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  return res.ok;
}
