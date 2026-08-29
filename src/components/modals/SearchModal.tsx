"use client"
import React, { useState } from 'react'
import Modal from './Modal'
import { useModalStore } from '@/store/useModalStore'

import { useRouter } from 'next/navigation';
import { useDebounce } from '@/custom-hooks/usePost';
import { useQuery } from '@tanstack/react-query';
import { searchPosts } from '@/services/post';
import { Post } from '@/types/post';


const SearchModal = () => {
    const { closeSearch, isSearchOpen } = useModalStore();
    const [query, setQuery] = useState("");
    const router = useRouter();
    const debouncedQuery = useDebounce(query, 400);
    const handleNavigate = (slug: string) => {
        router.push(`/articles/${slug}`);
        closeSearch();
        setQuery("");
    }

    const {
        data: results = [],
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["search-posts", debouncedQuery],
        queryFn: () => searchPosts(debouncedQuery),
        enabled: debouncedQuery.length > 1, //prevent useless requests
    });
    return (
        <Modal onClose={closeSearch} isOpen={isSearchOpen}>
            <div className='space-y-4'>
                <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder='Search articles' autoFocus className='max-h-80 overflow-y-auto rounded-xl border border-white/10 divide-y divide-white/10' />
                <div>
                    {(isLoading || isFetching) && (
                        <div>Searching.....</div>
                    )}

                    {isLoading && debouncedQuery && results.length == 0 && (
                        <div className='px-4 py-3 text-gray-400 text-sm'> No results found!
                        </div>
                    )}

                    {
                        results.map((result: Post) => {
                            return (
                                <button onClick={() => handleNavigate(result.slug)} key={result.id} className='w-full text-left px-4 py-3 text-gray-300 transition hover:bg-white/5 hover:text-white cursor-pointer' >
                                    {result.title}
                                </button>
                            )
                        })
                    }
                </div>
            </div>
        </Modal>
    )
}

export default SearchModal