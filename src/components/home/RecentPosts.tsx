import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Post } from '@/types/post'

const getBaseUrl = () => {
    if (process.env.BASE_URL) return process.env.BASE_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000';
};

const RecentPosts = async () => {
    const baseUrl = getBaseUrl();
    let posts: Post[] = [];

    try {
        const res = await fetch(`${baseUrl}/api/posts/recent`, {
            cache: "no-store",
        });

        if (res.ok) {
            const data = await res.json();
            posts = data.posts || [];
        }
    } catch (error) {
        console.error("Failed to fetch recent posts:", error);
    }

    return (
        <div className="space-y-2 mb-10">
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold">Recent Posts</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {posts.map((p) => {
                    return (
                        <div key={p.id} className='group rounded-xl overflow-hidden bg-[#0B0B0B] border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/20'>
                            {p.coverImageURL && (
                                <div className='relative h-48 w-full overflow-hidden'>
                                    <Image src={p.coverImageURL} alt={p.title} className='object-cover transition-transform duration-300 group-hover:scale-105' fill />
                                    <div className='absolute inset-0 bg-black/30' />
                                </div>
                            )}

                            <div className='p-5 space-y-3'>
                                <time className='text-xs text-gray-400'>
                                    {
                                        new Date(p.createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })
                                    }
                                </time>
                                <h3 className='text-lg font-semibold text-white leading-snug group-hover:text-orange-500 transition-colors'>
                                    {p.title}
                                </h3>
                                <p className='text-sm text-gray-400 leading-relaxed line-clamp-3'>
                                    {p.except}
                                </p>
                                <Link href={`/articles/${p.slug}`} className='inline-block text-sm text-orange-600 hover:underline'>
                                    Read article →
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default RecentPosts