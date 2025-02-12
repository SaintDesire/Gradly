"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { isTeacher } from "@/lib/teacher";

interface RoleContextType {
  isTeacher: boolean;
  loading: boolean;
}

const RoleContext = createContext<RoleContextType>({
  isTeacher: false,
  loading: true,
});

export const RoleProvider = ({ children, userId }: { children: ReactNode; userId: string }) => {
  const [isTeacherRole, setIsTeacherRole] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const result = await isTeacher(userId);
      setIsTeacherRole(result);
      setLoading(false);
    };

    checkRole();
  }, [userId]);

  return (
    <RoleContext.Provider value={{ isTeacher: isTeacherRole, loading }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
