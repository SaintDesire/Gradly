"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Chapter, Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ClipboardIcon, Edit2, Eye, Trash2 } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AiFillEyeInvisible } from "react-icons/ai";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type CourseWithChapters = Course & {
  chapters: Chapter[];
};

export const columns: ColumnDef<CourseWithChapters>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return (
        <Badge
          variant={price === 0 ? "secondary" : "outline"}
          className={
            price !== 0 && price !== null
              ? " bg-transparent border-transparent"
              : ""
          }
        >
          {price === 0 && "For Free"}
          {price === null && "Undefined"}
          {price !== 0 && price !== null && <>{formatted}</>}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Published
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;

      return (
        <Badge variant={isPublished ? "default" : "secondary"}>
          {isPublished ? (
            "Published"
          ) : (
            <>
              <AiFillEyeInvisible className="mr-1" /> Draft
            </>
          )}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const course = row.original;
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [hasPublishedChapters, setHasPublishedChapters] = useState(false);

      useEffect(() => {
        const checkPublishedChapters = () => {
          const publishedChapters = course.chapters.some(
            (chapter) => chapter.isPublished
          );
          setHasPublishedChapters(publishedChapters);
        };

        checkPublishedChapters();
      }, [course.chapters]);

      const onDelete = async () => {
        try {
          await axios.delete(`/api/courses/${course.id}`);
          toast.success("Course deleted!");

          setIsDialogOpen(false);
          router.refresh();
        } catch (error) {
          toast.error("Something went wrong!");
        }
      };

      return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(course.id)}
              >
                <ClipboardIcon className="w-4 h-4 mr-2" />
                Copy Course ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {hasPublishedChapters && (
                <Link href={`/courses/${course.id}`}>
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    View Course
                  </DropdownMenuItem>
                </Link>
              )}

              <Link href={`/teacher/courses/${course.id}`}>
                <DropdownMenuItem>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Course Details
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <DialogTrigger
                  className="flex gap-1 items-center w-full"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Course
                  </>
                </DialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-[425px] border">
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete this
                course and remove its data from our database.
              </DialogDescription>
            </DialogHeader>
            <div className="flex w-full gap-2 items-center">
              <DialogClose asChild>
                <Button
                  className="w-full rounded-md hover:scale-100"
                  variant="outline"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className="w-full rounded-md hover:scale-100"
                variant="destructive"
                onClick={onDelete}
              >
                Delete Course
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
    enableHiding: false,
  },
];
