"use client"

import { useState, useEffect, useRef } from "react"
import Editor from "./Editor"

type SaveStatus = "idle" | "saving" | "saved" | "error"

export default function EditorWrapper({ content, onChange }: any) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)
  
  return (
    <>
      <Editor content={content} onChange={onChange} />
      <div className="mt-2 text-sm">
        {saveStatus === "saving" && <span className="text-blue-500">Guardando...</span>}
      </div>
    </>
  )
}