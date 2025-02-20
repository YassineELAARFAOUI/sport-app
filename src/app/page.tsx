import { cookies } from "next/headers"; // Utiliser cookies de Next.js
import { getAllArticles } from "@/actions"; // Assure-toi que le chemin est correct
import Image from "next/image";
import Link from "next/link";
import { Decimal } from "@prisma/client/runtime/library";

// Définir l'interface pour les articles
interface Article {
  id: number;
  title: string;
  content: string;
  price: Decimal;
  imageUrl: string | null; // L'image peut être absente
}

export default async function Home() {
    const cookie = cookies().get('user'); // Récupérer le cookie de session

    if (!cookie) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10">
                <h1 className="text-3xl font-bold mb-4">Bienvenue sur la page d'accueil</h1>
                <p className="text-xl mb-4">Vous n'êtes pas connecté.</p>
                {/* Bouton de redirection vers la page de login */}
                <div className="text-center">
                    <Link href="/login">
                        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                            Se connecter
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const user = JSON.parse(cookie.value); // Extraire les données de l'utilisateur à partir du cookie
    const articles: Article[] = await getAllArticles(); // Récupérer les articles avec typage explicite

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-5xl mx-auto px-4">
                {/* Affichage des informations utilisateur */}
                <h1 className="text-3xl font-bold text-center mb-8">
                    Bienvenue {user.name} sur la page d'accueil
                </h1>
                <p className="text-center mb-8">
                    Vous êtes connecté en tant que {user.role}.
                </p>

                {/* Bouton pour voir le profil */}
                <div className="text-center mb-4">
                    <Link href={`/user/${user.id}`}>
                        <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                            Voir mon profil
                        </button>
                    </Link>
                </div>

                {/* Bouton pour créer un nouvel article - Visible seulement pour AUTHOR */}
                {user.role === "AUTHOR" && (
                    <div className="text-center mb-8">
                        <Link href="/articles/new">
                            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                                Créer un nouveau article
                            </button>
                        </Link>
                    </div>
                )}

                {/* Affichage de la liste des articles */}
                <h2 className="text-2xl font-semibold text-center mb-8">Liste des Articles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article: Article) => (
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
                                <h3 className="text-xl font-semibold mt-4">{article.title}</h3>
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
