import bcrypt from 'bcrypt';
import client from '../client';

export default {
  Mutation: {
    createAccount: async (
      _,
      { username, email, name, location, avatarURL, githubUsername, password }
    ) => {  
        try{      
            const existingUser = await client.user.findFirst({
            where: {
              OR: [
                { 
                  username 
                }, 
                { email }],
            },
          });
          if (existingUser) {
            throw new Error("The username or email is already taken.");
          }
          const hashPassword = await bcrypt.hash(password, 10);
          const user=await client.user.create({
            data: {
              username,
              email,
              name,
              location,
              password: hashPassword,
              avatarURL,
              githubUsername,
            },
        });
        if(user) {
          return {
            ok: true,
          };
        } else {
          throw new Error('fail to createAccount.');
        }
      } catch(e){
        return {
          ok: false,
          error: e.message,
        };
      }
    },
  },
};