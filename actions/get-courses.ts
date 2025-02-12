import { Category, Course } from "@prisma/client";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: {id: string}[];
  progress: number | null;
}

type GetCourse = {
  userId: string,
  title?: string,
  categoryId?: string,
}

export const getCourses = async ({
  userId,
  title,
  categoryId
}: GetCourse) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/courses?userId=${userId}&title=${title}&categoryId=${categoryId}`
    );
    if (!response.ok) {
      throw new Error('Ошибка при получении курсов');
    }

    const coursesWithProgress = await response.json();

    return coursesWithProgress;
  } catch (error) {
    console.log('[GET_COURSES]', error);
    return [];
  }
}