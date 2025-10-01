// src/app/signup/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signupApi } from "@/services/authService";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
    name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();

    const { register, handleSubmit, reset, formState: { errors, isValid, touchedFields } } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: "onChange"
    });

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);
        setServerError(null);

        const result = await signupApi(data.name, data.email, data.password);

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

            {/* Signup Card */}
            <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100 p-8 md:p-10 animate-fadeIn">
                <h2 className="text-2xl font-bold text-center text-emerald-700 mb-6">
                    Create Your Account
                </h2>

                {serverError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
                        {serverError}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* Name Input */}
                    <div className="flex flex-col">
                        <label htmlFor="name" className="mb-1 font-medium text-emerald-700">
                            Name
                        </label>
                        <input
                            {...register("name")}
                            type="text"
                            id="name"
                            placeholder="Your full name"
                            className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition shadow-sm bg-white/80 ${errors.name ? "border-red-300 focus:ring-red-500 focus:border-red-500" :
                                touchedFields.name ? "border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500" :
                                    "border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                                }`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

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

                    {/* Confirm Password Input */}
                    <div className="flex flex-col">
                        <label htmlFor="confirmPassword" className="mb-1 font-medium text-emerald-700">
                            Confirm Password
                        </label>
                        <input
                            {...register("confirmPassword")}
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm your password"
                            className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition shadow-sm bg-white/80 ${errors.confirmPassword ? "border-red-300 focus:ring-red-500 focus:border-red-500" :
                                touchedFields.confirmPassword ? "border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500" :
                                    "border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                                }`}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    {/* Signup Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !isValid}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-emerald-200" />
                    <span className="mx-3 text-emerald-500 font-medium">OR</span>
                    <hr className="flex-grow border-emerald-200" />
                </div>

                {/* Social Signup Buttons */}
                <div className="flex flex-col gap-4">
                    <button className="w-full py-3 rounded-2xl border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                        <span>🔗</span> Continue with Google
                    </button>
                    <button className="w-full py-3 rounded-2xl border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                        <span>🐦</span> Continue with Twitter
                    </button>
                </div>

                {/* Login Link */}
                <p className="text-center mt-6 text-emerald-600">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline transition">
                        Login
                    </Link>
                </p>
            </div>

            {/* Optional Illustration */}
            <div className="mt-12 hidden md:flex justify-center animate-fadeIn delay-200">
                <div className="w-80 h-40 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-400 text-lg">[Signup Illustration]</span>
                </div>
            </div>
        </div>
    );
}