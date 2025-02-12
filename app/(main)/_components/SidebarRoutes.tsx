"use client";

import { ArrowLeft, BarChart, Compass, List, Plus } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { redirect, usePathname } from "next/navigation";
import { MdOutlineLeaderboard } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { cn } from "@/lib/utils";
import { BiShoppingBag } from "react-icons/bi";
import { isTeacher } from "@/lib/teacher";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const guestRoutes = [
  {
    icon: PiStudent,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Compass,
    label: "Courses",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: ArrowLeft,
    label: "Student Dashboard",
    href: "/dashboard",
  },
  {
    icon: Plus,
    label: "Create a Course",
    href: "/teacher/create",
  },
  {
    icon: List,
    label: "My Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

const SidebarRoutes = () => {
  const { userId } = useAuth();
  const [isTeacherUser, setIsTeacherUser] = useState<boolean | null>(null); // Состояние для роли
  const pathname = usePathname();

  useEffect(() => {
    if (userId) {
      // Загрузка роли пользователя только один раз
      const checkTeacherRole = async () => {
        const isTeacherUser = await isTeacher(userId);
        setIsTeacherUser(isTeacherUser); // Сохраняем роль в состояние
      };
      checkTeacherRole();
    }
  }, [userId]);

  // Определяем, какой набор маршрутов показывать
  const isTeacherPage = pathname?.includes("/teacher") && isTeacherUser;
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className={cn("flex flex-col w-full py-6 gap-2")}>
      {routes.map((route, index) => (
        <SidebarItem
          key={index}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
