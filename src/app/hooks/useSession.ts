'use client';
import { useEffect, useState } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export function useSession() {
    const [user, setUser] = useState<User | null>(null); // 👈 Définir un type explicite

    useEffect(() => {
        const sessionCookie = document.cookie
            .split("; ")
            .find(row => row.startsWith("session="));

        if (sessionCookie) {
            try {
                const sessionData: User = JSON.parse(decodeURIComponent(sessionCookie.split("=")[1]));
                setUser(sessionData);
            } catch (error) {
                console.error("Error parsing session cookie", error);
            }
        }
    }, []);

    return { user };
}
