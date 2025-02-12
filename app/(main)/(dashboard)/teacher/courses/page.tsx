"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { Course, Chapter } from "@prisma/client";
import { Spinner } from "@/components/ui/spinner";
import { isTeacher } from "@/lib/teacher";
import axios from "axios";

type CourseWithChapters = Course & {
  chapters: Chapter[];
};

const CoursesPage = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseWithChapters[]>([]);

  useEffect(() => {
    const checkRoleAndFetchData = async () => {
      if (!userId) {
        router.push("/dashboard");
        return;
      }

      const admin = await isTeacher(userId);
      if (!admin) {
        router.push("/dashboard");
        return;
      }

      try {
        const { data } = await axios.get("/api/courses");
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    checkRoleAndFetchData();
  }, [userId, router]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-6 md:p-12 bg-secondary/50 text-secondary-foreground min-h-[calc(100vh-80px)] md:rounded-tl-3xl">
      <div className="flex flex-col mb-8 gap-2">
        <h1 className="text-4xl font-bold">Your Courses</h1>
        <p className="text-muted-foreground">List of all your courses</p>
      </div>
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
