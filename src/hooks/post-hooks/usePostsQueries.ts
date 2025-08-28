import { MutatePost } from "@/app/types/post";
import postServices from "@/database-services/post";
import { queryKeys } from "@/helpers/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function usePostsQueries() {
  const client = useQueryClient();

  function getPostById(slug: string) {
    return useQuery({
      queryKey: queryKeys.post(slug),
      queryFn: () => postServices.getPost({ slug }),
    });
  }

  function getPosts(cursor: string) {
    return useQuery({
      queryKey: queryKeys.posts,
      queryFn: () => postServices.getLatestPosts({ cursor }),
    });
  }

  function updatePost(slug: string) {
    return useMutation({
      mutationFn: (data: MutatePost) => postServices.updatePost(data),
      onSuccess: () => {
        toast.success("Post updated!");
        client.invalidateQueries({ queryKey: queryKeys.post(slug) });
        client.invalidateQueries({ queryKey: queryKeys.posts });
      },
      onError: (error: any) => {
        toast.error(error.message || "Update failed");
      },
      onSettled: () => {
        client.invalidateQueries({ queryKey: queryKeys.post(slug) });
        client.invalidateQueries({ queryKey: queryKeys.posts });
      },
    });
  }

  function AddPost() {
    return useMutation({
      mutationFn: (data: Partial<MutatePost>) => postServices.addPost(data),
      onSuccess: () => {
        toast.success("Post added successfully!");
        client.invalidateQueries({ queryKey: queryKeys.posts });
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to add post");
      },
      onSettled: () => {
        client.invalidateQueries({ queryKey: queryKeys.posts });
      },
    });
  }

  function deletePost(slug: string) {
    return useMutation({
      mutationFn: () => postServices.deletePost({ slug }),
      onSuccess: () => {
        toast.success("Post deleted!");
        client.invalidateQueries({ queryKey: queryKeys.posts });
      },
      onError: (error: any) => {
        toast.error(error.message || "Delete failed");
      },
      onSettled: () => {
        client.invalidateQueries({ queryKey: queryKeys.posts });
      },
    });
  }

  return { getPostById, getPosts, updatePost, AddPost, deletePost };
}
