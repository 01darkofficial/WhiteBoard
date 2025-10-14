"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import Select, { MultiValue } from "react-select";
import { addMemberApi } from "@/services/membershipService";
import { useUserStore } from "@/store/userStore";
import { useBoardStore } from "@/store/boardStore";

interface InviteModalProps {
    boardId: string;
    isOpen: boolean;
    onClose: () => void;
}

// ✅ Define validation schema
const inviteSchema = z.object({
    inviteeEmail: z.string().email("Invalid email address"),
    role: z.enum(["viewer", "editor", "admin"]).refine(val => !!val, {
        message: "Role is required",
    }),
    permissions: z.array(z.string()).min(1, "At least one permission required"),
});

type InviteFormData = z.infer<typeof inviteSchema>;

type PermissionOption = {
    value: string;
    label: string;
};

// ✅ Permission options
const permissionOptions: PermissionOption[] = [
    { value: "view", label: "View" },
    { value: "edit", label: "Edit" },
    { value: "comment", label: "Comment" },
    { value: "delete", label: "Delete" },
];

export default function InviteModal({ boardId, isOpen, onClose }: InviteModalProps) {
    const { fetchBoards } = useBoardStore();
    const { user } = useUserStore();
    const [loading, setLoading] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InviteFormData>({
        resolver: zodResolver(inviteSchema),
    });

    const onSubmit = async (data: InviteFormData) => {
        try {
            setLoading(true);
            const permissions = data.permissions;
            await addMemberApi(boardId, user!.email, data.inviteeEmail, data.role, permissions);
            await fetchBoards(user!);
            reset();
            onClose();
        } catch (error) {
            console.error("Failed to invite member:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-96 p-6 animate-fadeIn">
                <h2 className="text-xl font-semibold text-emerald-700 mb-4">Invite Member</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Invitee Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Invitee Email</label>
                        <input
                            type="email"
                            {...register("inviteeEmail")}
                            className="w-full mt-1 border rounded-md p-2 focus:ring-2 focus:ring-emerald-400 outline-none"
                            placeholder="invitee@example.com"
                        />
                        {errors.inviteeEmail && (
                            <p className="text-red-500 text-sm mt-1">{errors.inviteeEmail.message}</p>
                        )}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            {...register("role")}
                            className="w-full mt-1 border rounded-md p-2 focus:ring-2 focus:ring-emerald-400 outline-none"
                        >
                            <option value="">Select role</option>
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && (
                            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                        )}
                    </div>

                    {/* Permissions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Permissions</label>
                        <Controller
                            name="permissions"
                            control={control}
                            render={({ field }) => {
                                // Map field.value (string[]) to MultiValue<PermissionOption>
                                const selectedOptions = permissionOptions.filter(option =>
                                    field.value?.includes(option.value)
                                );

                                return (
                                    <Select<PermissionOption, true>
                                        isMulti
                                        options={permissionOptions}
                                        value={selectedOptions} // <-- Correct type for react-select
                                        className="mt-1"
                                        classNamePrefix="select"
                                        placeholder="Select permissions..."
                                        onChange={(selected: MultiValue<PermissionOption>) =>
                                            field.onChange(selected.map(opt => opt.value))
                                        }
                                    />
                                );
                            }}
                        />
                        {errors.permissions && (
                            <p className="text-red-500 text-sm mt-1">{errors.permissions.message}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition"
                        >
                            {loading ? "Inviting..." : "Invite"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
