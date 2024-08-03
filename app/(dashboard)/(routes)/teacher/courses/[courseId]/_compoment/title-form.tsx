"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TitleFormProps {
    titleData: {
        title: string
    };
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1, {
        message: 'title is required'
    })
})

export const TitleForm = ({ titleData, courseId}: TitleFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), defaultValues: titleData
    })

    const { isSubmitting, isValid } = form.formState

    return (
        <div>
            title form
        </div>
    )
}