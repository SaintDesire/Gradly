import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { title } = body;
        
        if (!title) {
            return new NextResponse("Title is required", { status: 400 });
        }
        
        const course = await db.course.create({
            data: {
                userId,
                title,
            },
        });
        

        return NextResponse.json(course);
    } catch (error) {
        console.error("[COURSES]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
