'use client';
import { useState } from "react";
import * as actions from '@/actions';
export default function LoginPage() {
     const [formState, setFormState] = useState({ message: '' });
     function handleSubmit(event:React.FormEvent<HTMLFormElement>){
         event.preventDefault();
                const formData = new FormData(event.currentTarget);
                // Appel à l'action
                actions.loginUser(formData).then(response => {
                    setFormState({ message: 'User loged successfully' });
                }).catch(error => {
                    setFormState({ message: 'Error login user' });
                });  
     }
    return (
        <form onSubmit={handleSubmit} className="h-screen flex items-center justify-center">
            <div className="text-center mb-10">
                <h3 className="">LOGIN PAGE</h3>
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
                <div className="flex justify-center mt-6">
                    <button type="submit" className="rounded p-2 bg-blue-200">
                        Login
                    </button>
                </div>
                <div className="mt-4">
                     <p>
                         Don't have an account?{" "}
                         <a href="/register" className="text-blue-500">Register here</a>
                     </p>
                 </div>
            </div>
        </form>
    );
}
