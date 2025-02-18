'use client';
import { useState } from "react";
import * as actions from '@/actions';

export default function CreateArticle() {
    const [formState, setFormState] = useState({ message: '' });

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
            await actions.createArticle(formData);
            setFormState({ message: 'Article created successfully!' });
        } catch (error) {
            setFormState({ message: 'Error creating article.' });
        }
    }

    return (
        <form onSubmit={handleSubmit} className="h-screen flex items-center justify-center">
            <div className="text-center mb-10">
                <h3 className="text-xl font-bold">Add New Article</h3>
                
                <div className="flex gap-10 justify-center mt-6 w-fit">
                    <label className="w-16" htmlFor="title">Title</label>
                    <input className="border rounded p-2 w-[300px]" type="text" name="title" id="title" required />
                </div>

                <div className="flex gap-10 justify-center mt-6 w-fit">
                    <label className="w-16" htmlFor="content">Content</label>
                    <textarea className="border rounded p-2 w-[300px]" name="content" id="content" required />
                </div>

                <div className="flex gap-10 justify-center mt-6 w-fit">
                    <label className="w-16" htmlFor="price">Price</label>
                    <input className="border rounded p-2 w-[300px]" type="number" step="0.01" name="price" id="price" required />
                </div>

                <div className="flex gap-10 justify-center mt-6 w-fit">
                    <label className="w-16" htmlFor="imageUrl">Picture</label>
                    <input className="border rounded p-2 w-[300px]" type="file" name="imageUrl" id="imageUrl" accept="image/*" required />
                </div>

                <div className="flex justify-center mt-6">
                    <button type="submit" className="rounded p-2 bg-blue-500 text-white">Create Article</button>
                </div>

                {formState.message && <p className="mt-4 text-green-500">{formState.message}</p>}
            </div>
        </form>
    );
}
