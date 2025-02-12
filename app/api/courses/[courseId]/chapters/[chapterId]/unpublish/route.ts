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

    const data = { isPublished: false };  // или другие данные, такие как title, description и т.д.
    const list = [{ id: params.chapterId, courseId: params.courseId, }];
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/chapter/update/${params.courseId}/${params.chapterId}`,
      { data, list }
    );
    const unPublishedChapter = response.data

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true
      },
    })

    if (!publishedChaptersInCourse) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false
        }
      })
    }

    return NextResponse.json(unPublishedChapter);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 })

  }
}