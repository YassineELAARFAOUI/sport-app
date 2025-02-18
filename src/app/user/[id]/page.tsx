// app/user/[id].tsx
import { getUserById } from "@/actions";
import Link from "next/link";

export default async function UserPage({ params }: { params: { id: string } }) {
    const user = await getUserById(params.id);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-red-500">Utilisateur non trouvé.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-3xl mx-auto px-4 bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-gray-600 mt-2">{user.email}</p>

                <div className="mt-6">
                    <Link
                        href={`/user/edit/${user.id}`}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    >
                        Modifier les informations
                    </Link>
                </div>
            </div>
        </div>
    );
}
