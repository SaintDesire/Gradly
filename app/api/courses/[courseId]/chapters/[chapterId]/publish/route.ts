import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import axios from "axios";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string, chapterId: string } }
) {
  try {
    const { userId } = auth()

    if(!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId
      },
    })

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      }
    })
    
    if (!chapter || !chapter.title || !chapter.description || !chapter.videoUrl) {
      return new NextResponse("Missing required fields", { status: 400 })
    }
    
    const data = { isPublished: true };  // или другие данные, такие как title, description и т.д.
    const list = [{ id: params.chapterId, courseId: params.courseId, }];
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/chapter/update/${params.courseId}/${params.chapterId}`,
      { data, list }
    );
    const publishedChapter = response.data
    // const publishedChapter = await db.chapter.update({
    //   where: {
    //     id: params.chapterId,
    //     courseId: params.courseId,
    //   },
    //   data: {
    //     isPublished: true
    //   }
    // })

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 })

  }
}