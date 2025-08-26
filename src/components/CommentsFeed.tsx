'use client'

import { IComment } from '@/models/Comment'
import React, { useState } from 'react'

export default function CommentsFeed() {
    const [comments,setComments] = useState<IComment[]>([]);
    const [loading,setLoding] = useState(true);
    const [error, setError] = useState(false);
  return (
    <div className=' flex flex-col gap-2'>
      
    </div>
  )
}

