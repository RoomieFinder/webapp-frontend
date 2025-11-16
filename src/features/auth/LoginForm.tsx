"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // App Router
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";

export default function LoginPanel({
  onClose,
  onSwitchToRegister,
}: {
  onClose: () => void;
  onSwitchToRegister: () => void;
}) {
  const router = useRouter();

  // state input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // state error
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");

  // validation function
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

  // blur handler
  const handleBlurEmail = () => setEmailError(validateEmail(email));
  const handleBlurPassword = () => setPasswordError(validatePassword(password));

  // submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) return;

    try {
      const res = await fetch(process.env.APP_ADDRESS ? `${process.env.APP_ADDRESS}/auth/login` : "https://roomie-finder-api-316466908775.asia-southeast1.run.app/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setMessage("Login success");
        onClose();           // Close the login panel
        router.push("/role");
      } else {
        if(data.error != "invalid credentials"){
          setMessage("This account is banned")
        }
        else if(data.error){
          setMessage("Invalid credentials")
        }
        else if(data.message == null){
          setMessage("Login failed: Password do not match");
        }else{
          setMessage("Login failed: " + (data.message || ""));
        }
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
          <h2 className="text-8xl mt-12 text-gray-900">Login</h2>

          <p className="text-sm text-gray-600 mb-6">
            Don&apos;t have an account?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 underline cursor-pointer"
            >
              Sign up here
            </button>
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="font-semibold text-gray-700">
                Password
              </label>
              <PasswordInput
                value={password}
                onChange={setPassword}
                onBlur={handleBlurPassword}
                error={passwordError}
              />
              <button
                type="button"
                className="text-xs text-gray-400 mt-auto cursor-pointer w-fit hover:underline focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full cursor-pointer mt-2">
              Login
            </Button>

            {/* Message */}
            {message && (
              <p
                className={`text-sm text-center ${message === "Login success" ? "text-green-500" : "text-red-500"
                  }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
