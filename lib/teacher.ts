export const isTeacher = async (userId: string | null) => {
  try {
    const response = await fetch(`/api/auth`, { cache: "no-store" });
    const data = await response.json();

    return data === "TEACHER";
  } catch (error) {
    console.log("[USER]", error);
    return false;
  }
};
