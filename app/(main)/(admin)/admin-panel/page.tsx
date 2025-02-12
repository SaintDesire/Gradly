"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { DataTable } from "../_components/data-table";
import { columns } from "../_components/columns";
import { isAdmin } from "@/lib/admin";
import { User } from "@prisma/client";
import { Spinner } from "@/components/ui/spinner";

const AdminPage = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const checkRoleAndFetchData = async () => {
      if (!userId) {
        router.push("/dashboard");
        return;
      }

      const admin = await isAdmin(userId);
      if (!admin) {
        router.push("/dashboard");
        return;
      }

      try {
        const { data } = await axios.get("/api/users");
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
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
        <h1 className="text-4xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">List of all users</p>
      </div>
      <DataTable columns={columns(userId)} data={users} />
    </div>
  );
};

export default AdminPage;
