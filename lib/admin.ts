export const isAdmin = async (userId: string) => {
  try {
    const response = await fetch(`/api/auth`, { cache: "no-store" });
    const data = await response.json();

    return data === "ADMIN";
  } catch (error) {
    console.log("[USER]", error);
    return false;
  }
};
