import { getArticleById } from "@/actions";
import Image from "next/image";
import Link from "next/link";

export default async function ArticlePage({ params }: { params: { id: string } }) {
    const article = await getArticleById(params.id);

    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-red-500">Article non trouvé.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-3xl mx-auto px-4 bg-white p-6 rounded-lg shadow-lg">
                {article.imageUrl && article.imageUrl.trim() !== "" ? (
                    <Image 
                        src={article.imageUrl} 
                        alt={article.title} 
                        width={600} 
                        height={400} 
                        className="w-full h-64 object-cover rounded-lg"
                    />
                ) : (
                    <div className="w-full h-64 bg-gray-300 flex items-center justify-center rounded-lg">
                        <span className="text-gray-500">Aucune image</span>
                    </div>
                )}
                
                <h1 className="text-3xl font-bold mt-6">{article.title}</h1>
                <p className="text-gray-600 mt-4">{article.content}</p>
                <p className="text-xl font-bold text-blue-600 mt-4">{article.price.toString()} €</p>

                <div className="mt-6 flex gap-4">
                    <Link href="/" className="text-blue-500 hover:underline">
                        ← Retour à la liste
                    </Link>

                    {/* Bouton Modifier */}
                    <Link 
                        href={`/articles/${article.id}/edit`}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    >
                        Modifier
                    </Link>
                </div>
            </div>
        </div>
    );
}
