import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const {userId} = auth();
    const {title, author} = await req.json();
    
    if(!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    console.log("Sending request to server:", {
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
      body: { title, author, userId, isTeacher: true },
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, author, userId, isTeacher: true }), // Временно передаём isTeacher
    });

    if (!response.ok) {
      throw new Error("Failed to create course");
    }

    const course = await response.json(); // Получаем созданный курс
    console.log(course)
    return NextResponse.json(course)
  } catch (error) {
    console.log("[COURSES]", error)
    return new NextResponse("Internal Error", {status: 500})
  }
}

export async function GET() {
  try {
    const {userId } = auth();
    if(!userId) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    const courses = await db.course.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
        },
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
