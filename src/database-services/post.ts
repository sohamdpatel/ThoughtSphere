import { MutatePost } from "@/app/types/post";


export class PostServices {

    async getLatestPosts({cursor}: {cursor: string | null}) {
       try {
         const response = await fetch(`/api/posts?limit=5${cursor ? `&cursor=${cursor}` : ""}`, {
                 method: 'GET',
                 headers: { 'Content-Type': 'application/json' },
             });
             const data = await response.json(); 
             return data
       } catch (error) {
            throw error;
       }
    }

    async addPost({ title, content, tags, fileLink }: Partial<MutatePost>) {
        try {
         const response = await fetch(`/api/posts`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({title, content, tags, fileLink})
             });
             const data = await response.json(); 
             return data
       } catch (error) {
            throw error;
       }
    }

    async getPost({slug}: {slug: string}){
        try {
            console.log("slug",slug);
            
         const response = await fetch(`/api/posts/${slug}`, {
                 method: 'GET',
                 headers: { 'Content-Type': 'application/json' },
             });
            //  console.log(response);
             
             const data = await response.json(); 
             return data;
       } catch (error) {
            throw error;
       }
    }

    async updatePost({ slug, title, content, tags, fileLink }: MutatePost){
        try {
         const response = await fetch(`/api/posts/${slug}`, {
                 method: 'PUT',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({title, content, tags, fileLink})
             });
             const data = await response.json(); 
             return data
       } catch (error) {
            throw error;
       }
    }

    async toggleLike({slug}: {slug: string}){
        try {
         const response = await fetch(`/api/posts/${slug}/like`, {
                 method: 'PUT',
                 headers: { 'Content-Type': 'application/json' },
             });
            //  const data = await response.json(); 
             return response
       } catch (error) {    
            throw error;
       }
    }

    async deletePost({slug}: {slug:string}){
        try {
            const response = await fetch(`/api/posts/${slug} `, {
                 method: 'DELETE',
                 headers: { 'Content-Type': 'application/json' },
             });
             const data = await response.json(); 
             return data
        } catch (error) {
            throw error;
        }
    }
}

const postServices = new PostServices();

export default postServices;