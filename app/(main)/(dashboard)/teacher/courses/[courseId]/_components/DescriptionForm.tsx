"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FaPencilAlt } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BiLoader } from "react-icons/bi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";

interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
}
const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/courses/update/${courseId}`, values);
      toast.success("Course Updated!");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className=" border bg-accent/50 dark:bg-accent/20 rounded-lg p-4  ">
      <div className="font-medium text-lg flex items-start justify-between">
        <span className="flex items-center justify-center gap-2">
          {isSubmitting && <BiLoader className="animate-spin w-5 h-5" />}
          <span>
            Course Description <span className="text-red-500">*</span>
          </span>
        </span>
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <>
              <MdOutlineCancel className="h-4 w-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <FaPencilAlt className="h-4 w-4 mr-2" />
              Edit Text
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-3">
            <FormField control={form.control} name="description" render={({field} ) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea disabled={isSubmitting} placeholder="e.g. 'This course is about...'" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}></FormField>
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting}
              type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <p className={cn("mt-0 text-sm", !initialData.description && "text-muted-foreground italic")}>
          {initialData.description || "No description"}
        </p>
      )}
    </div>
  );
};

export default DescriptionForm;
