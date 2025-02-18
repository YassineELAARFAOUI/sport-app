'use client';
import { useState } from "react";
import * as actions from '@/actions';

export default function RegisterPage() {
    const [formState, setFormState] = useState({ message: '' });
    
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        // Appel à l'action
        actions.createUser(formData).then(response => {
            setFormState({ message: 'User created successfully' });
        }).catch(error => {
            setFormState({ message: 'Error creating user' });
        });
    }

    return (
        <form onSubmit={handleSubmit} className="h-screen flex items-center justify-center">
            <div className="text-center mb-10">
                <h3 className="">Register PAGE</h3>
                <div className="flex gap-10 justify-center mt-6 w-fit">
                    <label className="w-10" htmlFor="name">
                        Name
                    </label>
                    <input className="border rounded p-2 w-[300px]" type="text" name="name" id="name" />
                </div>
                <div className="flex gap-10 justify-center mt-6 w-fit">
                    <label className="w-10" htmlFor="email">
                        Email
                    </label>
                    <input className="border rounded p-2 w-[300px]" type="text" name="email" id="email" />
                </div>
                <div className="flex gap-10 justify-center mt-6 w-fit">
                    <label className="w-10" htmlFor="password">
                        Password
                    </label>
                    <input className="border rounded p-2 w-[300px]" type="password" name="password" id="password" />
                </div>
                <div className="flex gap-10 justify-center mt-6 w-fit">
                    <label className="w-10" htmlFor="role">
                        Role
                    </label>
                    <select className="border rounded p-2 w-[300px]" name="role" id="role">
                        <option value="VIEWER">Viewer</option>
                        <option value="AUTHOR">Author</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
                <div className="flex justify-center mt-6">
                    <button type="submit" className="rounded p-2 bg-blue-200">
                        Register
                    </button>
                </div>
                {formState.message && <p>{formState.message}</p>}

                <div className="mt-4">
                     <p>
                         you have already account?{" "}
                         <a href="/login" className="text-blue-500">login</a>
                     </p>
                 </div>
            </div>
        </form>
    );
}
