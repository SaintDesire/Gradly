import { Category, Chapter, Course } from "@prisma/client";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: Chapter[];
  progress: number | null;
}
type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
}

export const getDashboardCourses = async (userId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/dashboard-courses?userId=${userId}`);
    
    if (!response.ok) throw new Error('Ошибка при загрузке курсов');

    return await response.json();
  } catch (error) {
    console.error("[GET_DASHBOARD_COURSES]", error);
    return { completedCourses: [], coursesInProgress: [] };
  }
};
