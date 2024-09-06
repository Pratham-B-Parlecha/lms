"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { format } from "path";


interface CourseEnrollButtonProps {
    courseId: string;
    price: number;
}

export const CourseEnrollButton = ({courseId, price}: CourseEnrollButtonProps) => {
    return (
        <Button className="w-full md:w-auto" size="sm">
            Enroll for {formatPrice(price)}
        </Button>
    )
}