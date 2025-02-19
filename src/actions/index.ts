'use server';
import { db } from "@/db";
import { Decimal } from "@prisma/client/runtime/library";
import { redirect } from "next/navigation";
import { writeFile } from 'fs/promises';
import path from 'path';
import cookie from 'cookie';
import { cookies } from "next/headers";
type Role = 'VIEWER' | 'AUTHOR' | 'ADMIN'; // Define Role type explicitly if needed

export async function createUser(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as Role; // Cast to 'Role' type

        // Create a user
        await db.user.create({
            data: {
                name,
                email,
                password,
                role,
            }
        });
    } catch (err: unknown) {
      console.log("hello world");
    }

    redirect('/login');
}

//login a user
// Assurez-vous de bien configurer la session ou les cookies.
export async function loginUser(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Récupère l'utilisateur avec les données les plus récentes de la base de données
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
        return { success: false, error: "User not found" };
    }

    // Vérifie si le mot de passe correspond
    if (user.password !== password) {
        return { success: false, error: "Invalid password" };
    }

    // Met à jour le cookie avec les informations les plus récentes
    cookies().set('user', JSON.stringify({
        id: user.id,
        name: user.name, // Nom mis à jour
        email: user.email,
        role: user.role
    }), {
        httpOnly: true, // pour éviter l'accès au cookie par JavaScript côté client
        path: '/', 
        maxAge: 60 * 60 * 24, // 1 jour de validité
    });

    return { success: true };
}


//create article 
export async function createArticle(formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const price = new Decimal(formData.get('price') as string); 
        const file = formData.get('imageUrl') as File;

        if (!file) {
            throw new Error("Image file is required");
        }

        // Récupérer l'ID de l'utilisateur à partir des cookies
        const cookie = cookies().get('user');
        if (!cookie) {
            throw new Error("User is not logged in");
        }

        const user = JSON.parse(cookie.value);
        const authorId = user.id;

        // Stocker l'image sur le serveur
        const filePath = path.join(process.cwd(), 'public/uploads', file.name);
        await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

        // Création de l'article avec l'ID de l'utilisateur
        await db.article.create({
            data: {
                title,
                content,
                price,
                imageUrl: `/uploads/${file.name}`,
                authorId: authorId // Utilisation de l'ID de l'utilisateur connecté
            }
        });

        // Retourner une réponse à côté client
        return { success: true, message: "Article created successfully!" };

    } catch (error) {
        console.error("Error creating article:", error);
        return { success: false, message: "Failed to create article" };
    }
}
//recupere toutes les articles :z
export async function getAllArticles() {
    try {
        const articles = await db.article.findMany();
        return articles;
    } catch (error) {
        console.error("Error fetching articles:", error);
        throw new Error("Failed to fetch articles");
    }
}
//recupere un seul artcile par un click
export async function getArticleById(id: string) {
    return await db.article.findUnique({
        where: { id: Number(id) }, // Convertir l'id en Number si besoin
    });
}

//modifier une article 
export async function updateArticle(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const price = new Decimal(formData.get("price") as string);
    const file = formData.get("imageUrl") as File;

    let updateData: any = { title, content, price };

    // Vérification si une nouvelle image a été téléchargée
    if (file && file.size > 0) {
        const filePath = path.join(process.cwd(), 'public/uploads', file.name);
        await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

        // Ajouter l'image au champ de mise à jour
        updateData.imageUrl = `/uploads/${file.name}`;
    }

    await db.article.update({
        where: { id: Number(id) },
        data: updateData,
    });
}
//recupere un user par son id 
export async function getUserById(id: string) {
    return await db.user.findUnique({
        where: { id: Number(id) },
    });
}

//upadte des infos de user
export async function updateUser(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const updatedData: any = { name, email };

    if (password) {
        // Si un mot de passe est fourni, on le met à jour
        updatedData.password = password;
    }

    await db.user.update({
        where: { id: Number(id) },
        data: updatedData,
    });
}