import { getAllArticles } from "@/actions"; // Assure-toi que le chemin est correct
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
    const articles = await getAllArticles();

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-5xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">Liste des Articles</h1>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <Link key={article.id} href={`/articles/${article.id}`}>
                            <div className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition">
                                {/* Vérifier si imageUrl est valide avant d'afficher l'image */}
                                {article.imageUrl && article.imageUrl.trim() !== "" ? (
                                    <Image 
                                        src={article.imageUrl} 
                                        alt={article.title} 
                                        width={300} 
                                        height={200} 
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-300 flex items-center justify-center rounded-lg">
                                        <span className="text-gray-500">Aucune image</span>
                                    </div>
                                )}
                                <h2 className="text-xl font-semibold mt-4">{article.title}</h2>
                                <p className="text-gray-600 mt-2">{article.content.substring(0, 80)}...</p>
                                <p className="text-lg font-bold text-blue-600 mt-3">
                                    {article.price.toString()} €
                                </p>
                            </div>
                        </Link>
                        
                    ))}
                </div>
            </div>
        </div>
    );
}
