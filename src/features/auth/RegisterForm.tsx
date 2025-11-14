"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // App Router
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";

export default function RegisterForm({
  onClose,
  onSwitchToLogin,
}: {
  onClose: () => void;
  onSwitchToLogin: () => void;
}) {
  // const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // error states
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [message, setMessage] = useState("");

  // validation functions
  const validateName = (value: string) => {
    if (!value) return "Name is required";
    const nameRegex = /^[A-Z][a-z]+ [A-Z][a-z]+$/; // ตัวอย่าง: John Doe
    if (!nameRegex.test(value)) {
      return "Please enter Name Lastname (first letter uppercase, space separated)";
    }
    return "";
  };

  const validatePhone = (value: string) => {
    if (!value) return "Phone number is required";
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(value)) return "Phone number must be 10 digits";
    return "";
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "Email is required";
    if (!emailRegex.test(value)) return "Please enter a valid email";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) return "Confirm Password is required";
    if (value !== password) return "Passwords do not match";
    return "";
  };

  // blur handlers
  const handleBlurName = () => setNameError(validateName(name));
  const handleBlurPhone = () => setPhoneError(validatePhone(phone));
  const handleBlurEmail = () => setEmailError(validateEmail(email));
  const handleBlurPassword = () => setPasswordError(validatePassword(password));
  const handleBlurConfirmPassword = () =>
    setConfirmPasswordError(validateConfirmPassword(confirmPassword));

  // submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(confirmPassword);

    setNameError(nameErr);
    setPhoneError(phoneErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);

    if (nameErr || phoneErr || emailErr || passwordErr || confirmPasswordErr)
      return;

    try {
      const { ok, data } = await (await import("@/api")).apiServices.authRegister({ username: name, email, password, phone, role: "user" });
      if (ok && data?.data?.ID) {
        setMessage("Register success");
        onSwitchToLogin();
      } else {
        setMessage("Register failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server");
    }
  };

  return (
    <div className="fixed inset-0 flex">
      <div className="w-1/2 bg-white flex flex-col p-8 relative shadow-lg">
        <button
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center transition cursor-pointer"
          onClick={onClose}
        >
          ←
        </button>

        <div className="mx-8 flex flex-col gap-4">
          <h2 className="text-8xl mt-12 text-gray-900">Register</h2>

          <p className="text-sm text-gray-600 mb-6">
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 underline cursor-pointer"
            >
              Already have an account?
            </button>
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="font-semibold text-gray-700">
                Name Lastname
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleBlurName}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${nameError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                  } text-black`}
              />
              {nameError && <p className="text-xs text-red-500">{nameError}</p>}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="font-semibold text-gray-700">
                Phone number
              </label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={handleBlurPhone}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${phoneError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                  } text-black`}
              />
              {phoneError && (
                <p className="text-xs text-red-500">{phoneError}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-semibold text-gray-700">
                Email address
              </label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleBlurEmail}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${emailError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                  } text-black`}
              />
              {emailError && (
                <p className="text-xs text-red-500">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <PasswordInput
              label="Password"
              value={password}
              onChange={setPassword}
              onBlur={handleBlurPassword}
              error={passwordError}
            />

            {/* Confirm Password */}
            <PasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              onBlur={handleBlurConfirmPassword}
              error={confirmPasswordError}
            />

            {/* Submit */}
            <Button type="submit" className="w-full cursor-pointer mt-2">
              Create Account
            </Button>
            {message && (
              <p className={`text-sm text-center ${message === "Register success" ? "text-green-500" : "text-red-500"}`}>{message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
