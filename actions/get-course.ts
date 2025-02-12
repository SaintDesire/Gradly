export const getCourse = async (userId: string, courseId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/course?courseId=${courseId}&userId=${userId}`);

    if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`);

    return await response.json();
  } catch (error) {
    console.error("[GET_COURSE] Ошибка запроса:", error);
    return null;
  }
};
