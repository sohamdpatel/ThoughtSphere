// src/components/Comment.tsx
"use client";

import React, { useState } from 'react';
import { IComment, ICommentAuthor } from '@/models/Comment';
// import { fetchReplies } from "@/api/commentApi";
import { IconChevronRight, IconLoader } from "@tabler/icons-react";

interface CommentProps {
  comment: IComment;
}

export default function Comment({ comment }: CommentProps) {
  const [replies, setReplies] = useState<IComment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

    const author = comment?.authorId as ICommentAuthor;
  

  const handleLoadReplies = async () => {
    if (hasLoaded) {
      setShowReplies(!showReplies);
      return;
    }
    
    setIsLoading(true);
    try {
    //   const fetchedReplies = await fetchReplies(comment._id.toString());
    //   setReplies(fetchedReplies);
      setHasLoaded(true);
      setShowReplies(true);
    } catch (err) {
      console.error(err);
      // Handle error state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 my-4 pl-8 border-l border-gray-200 dark:border-gray-700">
      {/* Comment Header */}
      <div className="flex items-center gap-2">
        <img
          src={author.image || "https://placehold.co/100x100"}
          alt={author.username}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="font-semibold text-gray-800 dark:text-gray-100">{comment.authorId.username}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(comment?.createdAt!).toLocaleDateString()}
        </div>
      </div>
      
      {/* Comment Content */}
      <p className="text-gray-700 dark:text-gray-300">
        {comment?.comment}
      </p>

      {/* Replies Loader */}
      {comment.replyCount > 0 && (
        <button
          onClick={handleLoadReplies}
          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <IconLoader className="h-4 w-4 animate-spin" />
          ) : (
            <IconChevronRight 
              className={`h-4 w-4 transition-transform duration-300 ${showReplies ? 'rotate-90' : 'rotate-0'}`} 
            />
          )}
          <span className="text-sm">
            {showReplies ? "Hide replies" : `Load ${comment.replyCount} replies`}
          </span>
        </button>
      )}

      {/* Recursively render replies if loaded */}
      {showReplies && replies.length > 0 && (
        <div className="pl-4">
          {replies.map((reply) => (
            <Comment key={reply._id.toString()} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
}