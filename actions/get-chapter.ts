interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
};

export const getChapter = async ({ userId, courseId, chapterId }: GetChapterProps) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chapter/${userId}/${courseId}/${chapterId}`
    );
    if (!response.ok) {
      throw new Error('Ошибка при получении данных главы');
    }

    const { chapter, course, nextChapter, userProgress, purchase } = await response.json();

    return {
      chapter,
      course,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    console.log('[GET_CHAPTER]', error);
    return {
      chapter: null,
      course: null,
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};