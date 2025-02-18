import { getArticleById, updateArticle } from "@/actions";
import { redirect } from "next/navigation";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
    const article = await getArticleById(params.id);

    if (!article) {
        return redirect("/");
    }

    async function handleSubmit(formData: FormData) {
        "use server"; // Active l'action côté serveur
        await updateArticle(params.id, formData);
        redirect(`/articles/${params.id}`);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-4">Modifier l'article</h1>
                <form action={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        defaultValue={article.title}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <textarea
                        name="content"
                        defaultValue={article.content}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        defaultValue={article.price.toNumber()} // Convert Decimal to number
                        className="w-full p-2 border rounded"
                        required
                    />
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                            Nouvelle image
                        </label>
                        <input
                            type="file"
                            name="imageUrl"
                            accept="image/*"
                            className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Enregistrer
                    </button>
                </form>
            </div>
        </div>
    );
}
