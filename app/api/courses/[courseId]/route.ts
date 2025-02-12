import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import axios from "axios";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()
    const { courseId } = params;
    const values = await req.json()

    if(!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/courses/update/${courseId}`, values);
    const course = response.data
    return NextResponse.json(course)
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()

    if(!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId
      },
      include: {
        chapters: true
      }
    })

    if (!course) {
      return new NextResponse("Not Found", { status: 404 })
    }

    for (const chapter of course.chapters) {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/chapter/delete/${chapter.id}`);
    }

    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/courses/delete/${params.courseId}`);
    const deletedCourse = response.data
    
    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 })
  }
}