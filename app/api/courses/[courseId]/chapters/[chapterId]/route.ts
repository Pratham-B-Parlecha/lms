import Mux from "@mux/mux-node";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET
});

export async function DELETE(req: Request, {params}: {params: {chapterId: string, courseId: string}}) {
  try {
    const {userId} = auth();
    if(!userId) {
      return new NextResponse("Unauthorized", {status: 401});
    }
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId
      }
    });
    if(!ownCourse) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId
      }
    });
    
    if(!chapter) {
      return new NextResponse("not found", {status: 404});
    }

    if(chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId
        }
      })
      if(existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assestId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id
          }
        })
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId
      }
    });

    const publishedChapterInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true
      }
    })

    if(!publishedChapterInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId
        },
        data: {
          isPublished: false
        }
      })
    }
    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("Chapter Delete", error);
    return new NextResponse("Internal error", {status: 500})
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { chapterId: string; courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { isPublished, ...values } = await req.json();
    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });
    
    if(values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        }
      })

      if(existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assestId)
        await db.muxData.delete({
          where: {
            id: existingMuxData.id
          }
        })
      }
      const assest = await mux.video.assets.create({
        input: values.videoUrl,
        playback_policy: ["public"],
        test: false
      })
      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assestId: assest.id,
          playbackId: assest.playback_ids?.[0]?.id
        }
      })
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTER ID]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
