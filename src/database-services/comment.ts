

export class CommentServices {

    async getComments({slug}: { slug: string }) {
       try {
         const response = await fetch(`/api/posts/${slug}/comment`, {
                 method: 'GET',
                 headers: { 'Content-Type': 'application/json' },
             });
             const data = await response.json(); 
             return data
       } catch (error) {
            throw error;
       }
    }

    async getReplies({commentId}: {commentId: string}){
        try {
            const response = await fetch(`/api/comment/${commentId}/replies`, {
                 method: 'GET',
                 headers: { 'Content-Type': 'application/json' },
             });
             const data = await response.json(); 
             return data
        } catch (error) {
            throw error
        }
    }

    async addComment({slug,comment}: {slug:string,comment:string}){
        try {
            const response = await fetch(`/api/posts/${slug}/comment`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(comment)
             });
             const data = await response.json(); 
             return data
        } catch (error) {
            
        }
    }

    async addReply({commentId,comment}: {commentId:string,comment:string}){
        try {
            const response = await fetch(`/api/comments/${commentId}/replies `, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(comment)
             });
             const data = await response.json(); 
             return data
        } catch (error) {
            throw error
        }
    }

    async deleteComment({commentId}: {commentId:string}){
        try {
            const response = await fetch(`/api/comments/${commentId} `, {
                 method: 'DELETE',
                 headers: { 'Content-Type': 'application/json' },
             });
             const data = await response.json(); 
             return data
        } catch (error) {
            throw error;
        }
    }

    async toggleCommentLike({commentId}: {commentId:string}){
        try {
            const response = await fetch(`/api/comments/${commentId}/likes `, {
                 method: 'PUT',
                 headers: { 'Content-Type': 'application/json' },
             });
             const data = await response.json(); 
             return data
        } catch (error) {
            throw error;
        }
    }
    
} 

const commentServices = new CommentServices();

export default commentServices;