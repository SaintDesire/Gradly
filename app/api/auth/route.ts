import { auth, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Параллельная загрузка данных: сначала получаем роль пользователя из Clerk, а потом ищем в базе данных
    const [user, existingUser] = await Promise.all([
      clerkClient.users.getUser(userId),
      db.user.findUnique({ where: { clerkId: userId } }),
    ]);

    const role = user.publicMetadata.role || "USER";
    return NextResponse.json(role);
  } catch (error) {
    console.log("[USER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Параллельная загрузка данных: сначала получаем пользователя и проверяем существующего пользователя в базе данных
    const [user, existingUser] = await Promise.all([
      clerkClient.users.getUser(userId),
      db.user.findUnique({ where: { clerkId: userId } }),
    ]);

    const email = user.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return new NextResponse("Email not found", { status: 400 });
    }

    // Если пользователь не найден в базе, создаем нового
    if (!existingUser) {
      await db.user.create({
        data: {
          clerkId: userId,
          email: email,
          role: "USER",
        },
      });
    }

    // Если роль пользователя отличается от ожидаемой, обновляем ее
    if (!user.publicMetadata.role || !["USER", "TEACHER", "ADMIN"].includes(user.publicMetadata.role.toString())) {
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          role: "USER",
        },
      });
    }

    return new NextResponse("Role added successfully", { status: 200 });
  } catch (error) {
    console.log("[USER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
