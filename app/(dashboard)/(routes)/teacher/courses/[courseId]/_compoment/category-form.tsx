"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1)
});

export const CategoryForm = ({ initialData, courseId, options }: CategoryFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const editToggle = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        await axios.patch(`/api/courses/${courseId}`, values);
        toast.success("Course updated")
        editToggle()
        router.refresh()
    } catch{
        toast.error("something went wrong")
    }
  };

  const selectedOption = options.find(option => option.value === initialData.categoryId);

  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course category
        <Button variant="ghost" onClick={editToggle}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit category
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className={cn("text-sm mt-2", !initialData.categoryId && "text-slate-500 italic")}>{selectedOption?.label || "No category"}</p>}
      {isEditing && (
         <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
           <FormField
             control={form.control}
             name="categoryId"
             render={({ field }) => (
               <FormItem>
                 <FormControl>
                   <Combobox options={options} {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           <Button type="submit" disabled={!isValid || isSubmitting}>Submit</Button>
         </form>
       </Form>
      )}
    </div>
  );
};
