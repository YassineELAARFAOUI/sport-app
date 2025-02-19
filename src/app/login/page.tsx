'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as actions from '@/actions';

export default function LoginPage() {
    const [formState, setFormState] = useState({ message: '' });
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
            const response = await actions.loginUser(formData);
            if (response.success) {
                router.push("/"); // Redirige vers la page d'accueil
            } else {
                setFormState({ message: response.error || "" });
            }
        } catch (error) {
            setFormState({ message: 'Erreur lors de la connexion' });
        }
    }

    return (
        <form onSubmit={handleSubmit} className="h-screen flex items-center justify-center">
            <div className="text-center mb-10">
                <h3 className="">LOGIN PAGE</h3>
                <div className="flex gap-10 justify-center mt-6 w-fit">
                    <label className="w-10" htmlFor="email">Email</label>
                    <input className="border rounded p-2 w-[300px]" type="text" name="email" id="email" />
                </div>
                <div className="flex gap-10 justify-center mt-6 w-fit">
                    <label className="w-10" htmlFor="password">Password</label>
                    <input className="border rounded p-2 w-[300px]" type="password" name="password" id="password" />
                </div>
                <div className="flex justify-center mt-6">
                    <button type="submit" className="rounded p-2 bg-blue-200">
                        Login
                    </button>
                </div>
                {formState.message && <p className="mt-4 text-red-500">{formState.message}</p>}
                <div className="mt-4">
                    <p>Don't have an account?{" "}
                        <a href="/register" className="text-blue-500">Register here</a>
                    </p>
                </div>
            </div>
        </form>
    );
}
