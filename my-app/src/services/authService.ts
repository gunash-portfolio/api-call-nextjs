import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { error } from "console";

export class AuthService{
    static async register (data:{
        email:string
        password: string
        name?:string
    }) {
        try {
            const existingUser = await prisma.user.findUnique({
                where:{email : data.email}
            })
          if(existingUser){
            return {
                success:false,
                error:"User with this email already exists",
                status:409
            }
          }
          const hashedPassword = await hash(data.password, 12)
          const user = await prisma.user.create({
            data:{
                email:data.email,
                password: hashedPassword,
                name:data.name
            },
            select:{
                id:true,
                email:true,
                name:true,
                role:true,
                createdAt:true
            }
          })

          return {
            success:true,
            data:user,
            status:201
          }

        } catch(error){
            console.error("Error registering user", error)
            return {
                success:false,
                error: "Failed to register user",
                status:500
            }
        }
    }

    static async getUserById(id: number){
        try{
            const user = await prisma.user.findUnique({
                where:{id},
                select:{
                    id:true,
                    email:true,
                    name:true,
                    role:true,
                    createdAt:true
                }
            })

            if(!user){
                return{
                    success:false,
                    error: "User not found",
                    status:404
                }
            }

            return{
                success:true,
                data:user,
                status:200
            }
        }catch(error){
            console.error("Error fetching user", error)
            return {
                success:false,
                error:"Failed to fetch user",
                status:500
            }
        }
    }
}