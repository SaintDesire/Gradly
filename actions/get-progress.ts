const getProgress = async (
  userId: string,
  courseId: string,
): Promise<number> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-progress?userId=${userId}&courseId=${courseId}`);
    
    if (!response.ok) throw new Error('Ошибка при загрузке прогресса');

    const progressPercentage = await response.json();
    return progressPercentage;
  } catch (error) {
    console.error("[GET_PROGRESS]", error);
    return 0;
  }
}

export default getProgress