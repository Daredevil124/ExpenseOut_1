import { NextResponse } from "next/server";
import dbConnect from "../models/dbConnect";
import { User } from "../models";

export const POST = async (req) => {
    try {
        const { email, password } = await req.json();

        if(!email || !password) {
            return NextResponse.json({message: "Email and Password are required"}, {status: 400});
        }

        await dbConnect();

        const user = await User.create({ email, password });

        return NextResponse.json({message: "User created successfully", user}, {status: 201});
    } catch (error) {
        return NextResponse.json({message: "Internal Server Error", error: error.message}, {status: 500});
    }
}