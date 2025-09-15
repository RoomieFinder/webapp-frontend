import { profile } from "console";

export async function postUser(data: any) {
  const baseUrl = process.env.APP_ADDRESS || "http://localhost:8080";
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("gender", data.gender);
  formData.append("hobbies", data.hobbies);
  formData.append("description", data.description);
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