// app/user/edit.tsx
import { getUserById, updateUser } from "@/actions";
import { redirect } from "next/navigation";

export default async function EditUserPage({ params }: { params: { id: string } }) {
    const user = await getUserById(params.id);

    if (!user) {
        return redirect("/login");
    }

    async function handleSubmit(formData: FormData) {
        "use server"; // Active l'action côté serveur
        await updateUser(params.id, formData);
        redirect(`/user/${params.id}`);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-4">Modifier vos informations</h1>
                <form action={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        defaultValue={user.name}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        defaultValue={user.email}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Nouveau mot de passe"
                        className="w-full p-2 border rounded"
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Enregistrer les modifications
                    </button>
                </form>
            </div>
        </div>
    );
}
