export const getAnalytics = async (userId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/${userId}`);
    if (!response.ok) {
      throw new Error('Ошибка при получении аналитики');
    }

    const { data, totalRevenue, totalSales, totalStudents } = await response.json();

    return {
      data,
      totalRevenue,
      totalSales,
      totalStudents,
    };
  } catch (error) {
    console.log('[GET_ANALYTICS]', error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
      totalStudents: 0,
    };
  }
};