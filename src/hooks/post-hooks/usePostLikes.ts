import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export function usePostLikes(slug: string, isAuthenticated: boolean) {
  const client = useQueryClient();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Fetch likes count + status
  const { data } = useQuery({
    queryKey: ["likes", slug],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${slug}/like`,{method:"GET"});
      return res.json();
    },
    initialData: { likesCount: 0, hasLiked: false, success: true },
    refetchOnWindowFocus: false, // optional, disable auto refetch
  });

  const mutation = useMutation({
    mutationFn: async () => {
      await fetch(`/api/posts/${slug}/like`, { method: "PUT" });
    },
    onMutate: async () => {
      client.setQueryData(["likes", slug], (prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          hasLiked: !prev.hasLiked,
          likesCount: prev.likesCount + (prev.hasLiked ? -1 : 1),
        };
      });
    },
    onError: () => {
      client.invalidateQueries({ queryKey: ["likes", slug] });
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["likes", slug] });

       client.invalidateQueries({ queryKey: ["recent-posts"] });
    },
  });

  // ✅ Debounced toggle function with auth check
  const toggleLike = () => {
    if (!isAuthenticated) {
      router.push("/sign-in"); // redirect to login page
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      mutation.mutate();
    }, 400);
  };

  return { data, toggleLike };
}
