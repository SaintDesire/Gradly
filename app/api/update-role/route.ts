import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const { userId, newRole } = await req.json();

    if (!userId || !newRole) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Находим пользователя по userId (id из базы данных, может быть clerkId)
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Обновляем роль пользователя в базе данных
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    // Обновляем роль в публичной метаинформации пользователя в Clerk
    const clerkUser = await clerkClient.users.getUser(user.clerkId);

    if (!clerkUser) {
      return new NextResponse("Clerk user not found", { status: 404 });
    }

    await clerkClient.users.updateUserMetadata(user.clerkId, {
      publicMetadata: {
        ...clerkUser.publicMetadata,
        role: newRole, // Обновляем роль в публичной метаинформации
      },
    });

    // Отправляем успешный ответ с обновлённой ролью
    return NextResponse.json({ role: updatedUser.role });
  } catch (error) {
    console.error("Error updating user role:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
