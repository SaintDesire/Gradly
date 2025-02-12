"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

// Интерфейс пользователя
interface User {
  id: string;
  email: string;
  clerkId: string
  role: string;
}

// Обновляем структуру, чтобы передавать userId
export const columns = (currentUserId: string | null | undefined): ColumnDef<User>[] => [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Role
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const user: User = row.original;
      const [selectedRole, setSelectedRole] = useState(user.role || "USER");

      const isCurrentUser = user.clerkId.trim() === currentUserId?.trim();

      return (
        <Select
          value={selectedRole}
          onValueChange={(value) => {
            setSelectedRole(value);
            row.original.role = value;
          }}
          disabled={isCurrentUser}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Roles</SelectLabel>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="TEACHER">Teacher</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    id: "apply",
    header: "Apply",
    cell: ({ row }) => {
      const user: User = row.original;

      const isCurrentUser = user.clerkId.trim() === currentUserId?.trim();

      const handleClick = async () => {
        try {
          const response = await axios.post("/api/update-role", {
            userId: user.id,
            newRole: user.role,
          });

          if (response.status === 200) {
            toast.success(`Role updated successfully for ${user.email}`);
          }
        } catch (error) {
          console.error("Error updating role:", error);
          toast.error("Failed to update role");
        }
      };

      return (
        <Button onClick={handleClick} disabled={isCurrentUser}>
          Apply
        </Button>
      );
    },
  },
];
