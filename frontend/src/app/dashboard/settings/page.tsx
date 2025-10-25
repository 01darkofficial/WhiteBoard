"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import Modal from "@/components/Modal";
import { FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";

// Zod schemas
const usernameSchema = z.string().min(3, "Username must be at least 3 characters");
const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit");
// .regex(/[\W_]/, "Password must contain at least one special character");

export default function SettingsPage() {
    const router = useRouter();
    const user = useUserStore((state) => state.user);
    const updateUser = useUserStore((state) => state.updateUser);
    const deleteUser = useUserStore((state) => state.deleteUser);

    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
    const [isUsernameModalOpen, setUsernameModalOpen] = useState(false);
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    // Password modal fields
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    if (!user) return <p className="p-6 text-center">Loading user...</p>;

    /** Avatar change */
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
            const avatarString = reader.result as string;
            setAvatarPreview(avatarString);
            updateUser({ avatar: avatarString });
        };
        reader.readAsDataURL(file);
    };

    /** Username change */
    const handleUsernameChange = async (newName: string) => {
        try {
            usernameSchema.parse(newName);
            updateUser({ name: newName });
            setUsernameModalOpen(false);
        } catch (err: any) {
            console.error(err.message);
        }
    };

    /** Password change */
    const handlePasswordChange = async () => {
        try {
            passwordSchema.parse(password);
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            await updateUser({ password });
            setPasswordModalOpen(false);
            setPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            console.error(err.errors?.[0]?.message || "Invalid password");
        }
    };

    /** Delete account */
    const handleDeleteAccount = async () => {
        const res = await deleteUser();
        if (res.success) {
            alert("Account deleted successfully");
            router.push("/login");
        } else {
            console.error(res.error);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>

            <div className="bg-white shadow rounded p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Account Info</h2>

                {/* Avatar */}
                <div className="flex flex-col items-center space-y-2">
                    {avatarPreview ? (
                        <img
                            src={avatarPreview}
                            alt="User Avatar"
                            className="w-24 h-24 rounded-full border border-emerald-300 object-cover"
                        />
                    ) : (
                        <FaUserCircle className="w-24 h-24 text-emerald-500" />
                    )}
                    <label className="cursor-pointer text-sm text-emerald-600 hover:underline">
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        Change Avatar
                    </label>
                </div>

                {/* User Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={user.name}
                            readOnly
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={user.email}
                            readOnly
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <button
                        onClick={() => setUsernameModalOpen(true)}
                        className="flex-1 px-6 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition font-semibold"
                    >
                        Change Username
                    </button>

                    <button
                        onClick={() => setPasswordModalOpen(true)}
                        className="flex-1 px-6 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition font-semibold"
                    >
                        Change Password
                    </button>

                    <button
                        onClick={() => setDeleteModalOpen(true)}
                        className="flex-1 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition font-semibold"
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            {/* Username Modal */}
            <Modal title="Change Username" isOpen={isUsernameModalOpen} onClose={() => setUsernameModalOpen(false)}>
                <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                    id="new-username"
                />
                <button
                    onClick={() => {
                        const input = document.getElementById("new-username") as HTMLInputElement;
                        if (input.value.trim()) handleUsernameChange(input.value.trim());
                    }}
                    className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
                >
                    Save
                </button>
            </Modal>

            {/* Password Modal */}
            <Modal title="Change Password" isOpen={isPasswordModalOpen} onClose={() => setPasswordModalOpen(false)}>
                <div className="space-y-4">
                    {/* New Password */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
                        />
                        <span
                            className="absolute right-3 top-3 cursor-pointer text-gray-500"
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
                        />
                        <span
                            className="absolute right-3 top-3 cursor-pointer text-gray-500"
                            onClick={() => setShowConfirm(prev => !prev)}
                        >
                            {showConfirm ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <button
                        onClick={handlePasswordChange}
                        className="w-full px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition font-semibold"
                    >
                        Save
                    </button>
                </div>
            </Modal>

            {/* Delete Account Modal */}
            <Modal title="Delete Account" isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <p className="text-gray-700 mb-4">
                    Are you sure you want to delete your account? This action cannot be undone.
                </p>
                <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition mr-2"
                >
                    Delete
                </button>
                <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                    Cancel
                </button>
            </Modal>
        </div>
    );
}
