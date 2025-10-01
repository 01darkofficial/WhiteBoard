// src/app/login/page.tsx
"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginApi } from "@/services/authService";


const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const { register, handleSubmit, reset, formState: { errors, isValid, touchedFields } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onChange"
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setServerError("");

        const result = await loginApi(data.email, data.password);

        if (result.success) {
            reset(); // Clear the form
            router.push("/dashboard"); // Redirect to dashboard
        } else {
            // Show backend error message
            setServerError(result.error || "Something went wrong. Please try again.");
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 px-4 md:px-6 py-12">
            {/* Logo */}
            <header className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-emerald-700 text-center animate-fadeIn">
                    CollabBoard
                </h1>
            </header>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100 p-8 md:p-10 animate-fadeIn">
                <h2 className="text-2xl font-bold text-center text-emerald-700 mb-6">
                    Welcome Back
                </h2>

                {serverError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
                        {serverError}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* Email Input */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="mb-1 font-medium text-emerald-700">
                            Email
                        </label>
                        <input
                            {...register("email")}
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition shadow-sm bg-white/80 ${errors.email ? "border-red-300 focus:ring-red-500 focus:border-red-500" :
                                touchedFields.email ? "border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500" :
                                    "border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                                }`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="flex flex-col">
                        <label htmlFor="password" className="mb-1 font-medium text-emerald-700">
                            Password
                        </label>
                        <input
                            {...register("password")}
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition shadow-sm bg-white/80 ${errors.password ? "border-red-300 focus:ring-red-500 focus:border-red-500" :
                                touchedFields.password ? "border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500" :
                                    "border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                                }`}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !isValid}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? "Signing In..." : "Login"}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-emerald-200" />
                    <span className="mx-3 text-emerald-500 font-medium">OR</span>
                    <hr className="flex-grow border-emerald-200" />
                </div>

                {/* Social Login Buttons (optional) */}
                <div className="flex flex-col gap-4">
                    <button className="w-full py-3 rounded-2xl border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                        <span>🔗</span> Continue with Google
                    </button>
                    <button className="w-full py-3 rounded-2xl border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                        <span>🐦</span> Continue with Twitter
                    </button>
                </div>

                {/* Signup Link */}
                <p className="text-center mt-6 text-emerald-600">
                    Don't have an account?{" "}
                    <Link href="/signup" className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline transition">
                        Sign Up
                    </Link>
                </p>
            </div>

            {/* Optional Illustration */}
            <div className="mt-12 hidden md:flex justify-center animate-fadeIn delay-200">
                <div className="w-80 h-40 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-400 text-lg">[Login Illustration]</span>
                </div>
            </div>
        </div>
    );
}