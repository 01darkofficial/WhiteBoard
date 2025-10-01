"use client";

import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/services/authService";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const res = await getUser();
            if (!res.success) {
                router.push("/"); // redirect to login/landing
            } else {
                setLoading(false); // allow rendering children
            }
        };
        checkAuth();
    }, [router]);

    if (loading) return null; // or a spinner/placeholder

    return <>{children}</>;
}

export function PublicRoute({ children }: { children: JSX.Element }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const res = await getUser();
            if (res.success) {
                router.push("/dashboard"); // redirect if already logged in
            } else {
                setLoading(false); // allow rendering public page
            }
        };
        checkAuth();
    }, [router]);

    if (loading) return null; // or a spinner/placeholder

    return <>{children}</>;
}
