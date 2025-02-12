"use client";
import { isTeacher } from "@/lib/teacher";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isTeacherUser, setIsTeacherUser] = useState<boolean | null>(null);

  useEffect(() => {
    if (userId) {
      // Загрузка роли пользователя только один раз
      const checkTeacherRole = async () => {
        const isTeacherUser = await isTeacher(userId);
        setIsTeacherUser(isTeacherUser); // Сохраняем роль в состояние
        setLoading(false); // Отметим, что загрузка завершена
      };
      checkTeacherRole();
    }
  }, [userId]);

  // Пока идет загрузка или роль пользователя не определена, показываем индикатор
  if (loading || isTeacherUser === null) {
    return <></>;
  }

  // Если роль пользователя определена, рендерим children
  return <>{children}</>;
};

export default TeacherLayout;
