'use server';
import { db } from "@/db";
import { Decimal } from "@prisma/client/runtime/library";
import { redirect } from "next/navigation";
import { writeFile } from 'fs/promises';
import path from 'path';
import cookie from 'cookie';
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
export async function loginUser(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
        console.log("User not found");
        redirect('/login'); // Redirection si l'utilisateur n'existe pas
        return; // Ajout d'un return pour éviter que le code continue
    }

    if (user.password !== password) {
        console.log("Invalid password");
        redirect('/login'); // Redirection si le mot de passe est incorrect
        return; // Ajout d'un return pour éviter que le code continue
    }

    console.log("Login successful");
    redirect('/'); // Redirection en cas de succès
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

        // Stocker l'image sur le serveur
        const filePath = path.join(process.cwd(), 'public/uploads', file.name);
        await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

        // Création de l'article avec `authorId = 1`
        await db.article.create({
            data: {
                title,
                content,
                price,
                imageUrl: `/uploads/${file.name}`,
                authorId: 1 // Valeur par défaut de l'auteur
            }
        });

    } catch (error) {
        console.error("Error creating article:", error);
        throw new Error("Failed to create article");
    }
}
//recupere toutes les articles :
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

    // Vérification si une nouvelle image a été téléchargée
    let imageUrl = null;
    if (file) {
        const filePath = path.join(process.cwd(), 'public/uploads', file.name);
        await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

        // Utiliser le chemin relatif pour la base de données
        imageUrl = `/uploads/${file.name}`;
    }

    await db.article.update({
        where: { id: Number(id) },
        data: {
            title,
            content,
            price,
            imageUrl: imageUrl ?? undefined, // Si l'image n'est pas définie, on ne change pas l'image
        },
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