import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import axios from "axios";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; } }
) {
  try {
    const { userId } = auth();

    if(!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    const { list } = await req.json();

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    for (let item of list) {
      const data = { position: item.position };  // или другие данные, такие как title, description и т.д.
      const list = [{ id: item.id}];
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/chapter/update/${params.courseId}/${item.id}`,
        { data, list }
      );
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}