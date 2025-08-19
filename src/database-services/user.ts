

export class UserServices {

    async validateUsername(debouncedUsername: string){
       try {
         const response = await fetch(`/api/users?username=${debouncedUsername}`, {
                 method: 'GET',
                 headers: { 'Content-Type': 'application/json' },
             });
             const data = await response.json(); 
             return data
       } catch (error) {
            throw error;
       }
    }
}

const userServices = new UserServices();

export default userServices