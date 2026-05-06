import {prisma} from "@/lib/prisma"
import EditorWrapper from "./components/EditorWrapper"

export default async function LessonEditPage({
  params,
}: {
  params: Promise<{ lessonId: string }>
}) {
  const { lessonId } = await params

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  })

  if (!lesson) return <div>No encontrado</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">
        {lesson.title}
      </h1>

      <EditorWrapper
        lessonId={lesson.id}
        initialContent={lesson.content}
      />

    </div>
  )
}