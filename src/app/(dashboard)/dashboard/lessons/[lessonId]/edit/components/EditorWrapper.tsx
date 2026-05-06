"use client"

import dynamic from "next/dynamic"
import { useState, useEffect, useRef } from "react"

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
})

type SaveStatus = "idle" | "saving" | "saved" | "error"

export default function EditorWrapper({
  lessonId,
  initialContent,
}: any) {
  const [content, setContent] = useState(
    initialContent || { type: "doc", content: [] }
  )
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef(JSON.stringify(initialContent))

  // Debounce save - espera 2 segundos después del último cambio
  const save = async (json: any) => {
    console.log("📝 Editor content changed:", json)
    setContent(json)

    // Limpiar timeout anterior
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    setSaveStatus("saving")

    // Esperar 2 segundos antes de guardar
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const jsonString = JSON.stringify(json)
        
        // No guardar si el contenido es igual al último guardado
        if (jsonString === lastSavedRef.current) {
          console.log("✅ Contenido sin cambios, no se guarda")
          setSaveStatus("idle")
          return
        }

        console.log("💾 Enviando a API:", `/api/lessons/${lessonId}`)
        console.log("Contenido:", json)
        
        const response = await fetch(`/api/lessons/${lessonId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: json }),
        })

        console.log("Response status:", response.status)
        const result = await response.json()
        console.log("Response:", result)

        if (!response.ok) {
          const errorMsg = result?.details || result?.error || `HTTP ${response.status}`
          throw new Error(errorMsg)
        }

        console.log("✅ Guardado exitoso:", result)
        
        lastSavedRef.current = jsonString
        setSaveStatus("saved")
        setErrorMsg("")

        // Cambiar estado después de 2 segundos
        setTimeout(() => setSaveStatus("idle"), 2000)
      } catch (error) {
        console.error("❌ Error al guardar:", error)
        const msg = error instanceof Error ? error.message : "Error desconocido"
        setErrorMsg(msg)
        setSaveStatus("error")
      }
    }, 2000)
  }

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div>
      {/* Indicador de estado */}
      <div className="fixed top-4 right-4 z-50">
        {saveStatus === "saving" && (
          <div className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            Guardando...
          </div>
        )}
        {saveStatus === "saved" && (
          <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Guardado
          </div>
        )}
        {saveStatus === "error" && (
          <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Error: {errorMsg}
          </div>
        )}
      </div>

      {/* Editor */}
      <Editor
        content={content}
        onChange={save}
      />
    </div>
  )
}