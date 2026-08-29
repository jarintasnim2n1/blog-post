import auth from '@/lib/auth'
import slugify from "slugify";
import { error } from 'console'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import React from 'react'
import prisma from '@/lib/prisma';
import { CloudinaryUploadResult, uploadToCloudinary } from '@/services/cloudinary';


export const POST = async (req: Request) => {
    try {
        const session = await auth.api.getSession({ headers: await headers() })

        if (!session?.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const except = formData.get("except") as string;
        const coverImage = formData.get("coverImage") as File;

        if (!title || !coverImage || !content || !except) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            )
        }

        const baseSlug = slugify(title, {
            lower: true,
            strict: true,
            trim: true
        })

        let slug = baseSlug;
        let counter = 1;

        while (await prisma.post.findUnique({ where: { slug } })) {
            slug = `${slug}-${counter}`;
            counter++;
        }

        const imageData: CloudinaryUploadResult = await uploadToCloudinary(coverImage);
        const post = await prisma.post.create({
            data: {
                title, except, slug,
                content, coverImageURL: imageData.secure_url,
                coverImagePublicId: imageData.public_id,
                authorId: session.user.id
            }
        })
        return NextResponse.json(post, { status: 201 })
    } catch (error) {
        console.error("CREATE_POST_ERROR:", error)
    }

    return NextResponse.json(
        { error: "Failedto create post" },
        { status: 500 }
    )
}



export const GET = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const DEFAULT_LIMIT = 3;
        const cursor = searchParams.get("cursor");
        const limit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;

        const posts = await prisma.post.findMany({
            take: limit + 1,
            orderBy: {
                createdAt: "desc"
            },
            cursor: cursor ? { id: cursor } : undefined,

            skip: cursor ? 1 : 0,

            select: {
                id: true,
                except: true,
                title: true,
                slug: true,
                createdAt: true,
                coverImageURL: true,
            },
        })
        const hasMore = posts.length > limit;

        const items = hasMore ? posts.slice(0, limit) : posts;

        const nextCursor = hasMore ? items[items.length - 1].id : null;
        return NextResponse.json({
            posts: items,
            nextCursor,
        });
    } catch (error) {
        console.error("FETCH_POSTS_ERROR:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}