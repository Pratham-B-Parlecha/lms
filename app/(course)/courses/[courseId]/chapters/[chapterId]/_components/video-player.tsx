"use client";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import toast, { Toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId?: string;
  playbackId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

export const VideoPlayer = ({
  chapterId,
  completeOnEnd,
  courseId,
  isLocked,
  nextChapterId,
  playbackId,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async() => {
    try {
      if(completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        });
        if(!nextChapterId) {
          confetti.onOpen();
        }

        toast.success("progress updated");
        router.refresh();

        if(nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch {
      toast.error("something went wrong");
    }
  }

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="w-8 h-8 animate-spin text text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="w-8 h-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  );
};
