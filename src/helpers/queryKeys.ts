// lib/queryKeys.ts
export const queryKeys = {
  posts: ["posts"] as const,
  post: (id: string) => ["post", id] as const,
  likes: (id: string) => ["likes", id] as const,
  comments: (id: string) => ["comments", id] as const,
  user: (id: string) => ["user", id] as const,
};
