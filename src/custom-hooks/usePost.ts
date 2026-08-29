"use client"
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { FetchPostsResponse } from '@/types/post'
import { deletePost, fetchPosts } from '@/services/post'
import { useRouter } from 'next/navigation'

const useInfinitePosts = ({ limit }: { limit: number }) => {
  return useInfiniteQuery<FetchPostsResponse>({
    queryKey: ["post"],
    queryFn: ({ pageParam }) => fetchPosts({
      pageParam: pageParam as string | null,
      limit
    }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  }

  )
}

export default useInfinitePosts

export function useDeletePost() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      router.replace("/articles")
    },
    onError: (error) => {
      console.error("DELETE_POST_ERROR:", error);
      alert("Failed to delete post");
    }
  })
}

export function useDebounce<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}