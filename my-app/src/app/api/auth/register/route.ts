import {NextRequest, NextResponse} from "next/server"
import { AuthService } from "@/services/authService"

export async function POST(request:NextRequest){
    try{
        const{email,password,name} = await request.json()

        if(!email || !password){
            return NextResponse.json(
                {error:"Email and password are required"},
                {status:400}
            )
        }
        if(password.length<6){
            return NextResponse.json(
                {error: "Password must be at least 6 characters"},
                {status:400}
            )
        }

        const result = await AuthService.register({email,password,name})
        if(!result.success){
            return NextResponse.json(
                {error:result.error},
                {status: result.status}
            )
        }
        return NextResponse.json(
            {message:"User registered successfully", user:result.data},
            {status:result.status}
        )

    }catch(error){
        console.error("Error in register route",error)
        return NextResponse.json(
            {error:"Failed to register user"},
            {status:500}
        )
    }
}