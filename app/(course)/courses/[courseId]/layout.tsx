import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import CourseSidebar from "./_components/CourseSidebar";
import CourseNavbar from "./_components/CourseNavbar";
import { getCourse } from "@/actions/get-course";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const data = await getCourse(userId, params.courseId);
  if (!data?.course) {
    return redirect("/");
  }

  const course = data.course
  const progressCount = data.progressCount
  return (
    <div className="h-full">
      <div className="h-[80px] lg:pl-[350px] inset-y-0 w-full z-50">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className="hidden lg:flex h-full w-[350px] inset-y-0 z-50 fixed top-0 left-0">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="lg:pl-[350px] h-full">{children}</main>
    </div>
  );
};

export default Layout;
