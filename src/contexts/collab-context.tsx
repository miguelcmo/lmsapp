"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { TiptapCollabProvider } from "@tiptap-pro/provider"
import { Doc as YDoc } from "yjs"
import {
  fetchCollabToken,
  getUrlParam,
  TIPTAP_COLLAB_DOC_PREFIX,
  TIPTAP_COLLAB_APP_ID,
} from "@/lib/tiptap-collab-utils"

export type CollabContextValue = {
  provider: TiptapCollabProvider | null
  ydoc: YDoc
  hasCollab: boolean
  setupError: boolean
}

export const CollabContext = createContext<CollabContextValue>({
  hasCollab: false,
  provider: null,
  ydoc: new YDoc(),
  setupError: false,
})

export const CollabConsumer = CollabContext.Consumer
export const useCollab = (): CollabContextValue => {
  const context = useContext(CollabContext)
  if (!context) {
    throw new Error("useCollab must be used within an CollabProvider")
  }
  return context
}

export const useCollaboration = (room: string, enabled: boolean = true) => {
  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null)
  const [collabToken, setCollabToken] = useState<string | null>(null)
  const [hasCollab, setHasCollab] = useState<boolean>(enabled) // Inicializar con el valor de enabled
  const [setupError, setSetupError] = useState<boolean>(false)
  const ydoc = useMemo(() => new YDoc(), [])

  useEffect(() => {
    const noCollabParam = getUrlParam("noCollab")
    // Solo deshabilitar si está en URL o si enabled es false
    const shouldHaveCollab = enabled && parseInt(noCollabParam || "0") !== 1
    setHasCollab(shouldHaveCollab)
  }, [enabled])

  useEffect(() => {
    if (!hasCollab) {
      // No obtener token si colaboración está deshabilitada
      return
    }

    const getToken = async () => {
      const token = await fetchCollabToken()
      setCollabToken(token)
      // If hasCollab is true but token is null, there's a setup error
      if (!token) {
        setSetupError(true)
      }
    }

    getToken()
  }, [hasCollab])

  useEffect(() => {
    if (!hasCollab || !collabToken) return

    const docPrefix = TIPTAP_COLLAB_DOC_PREFIX
    const documentName = room ? `${docPrefix}${room}` : docPrefix
    const appId = TIPTAP_COLLAB_APP_ID

    const newProvider = new TiptapCollabProvider({
      name: documentName,
      appId,
      token: collabToken,
      document: ydoc,
    })

    setProvider(newProvider)

    return () => {
      newProvider.destroy()
    }
  }, [collabToken, ydoc, room, hasCollab])

  return { provider, ydoc, hasCollab, setupError }
}

export function CollabProvider({
  children,
  room,
  enabled = true,
}: Readonly<{
  children: React.ReactNode
  room: string
  enabled?: boolean
}>) {
  const { hasCollab, provider, ydoc, setupError } = useCollaboration(room, enabled)

  const value = useMemo<CollabContextValue>(
    () => ({
      hasCollab,
      provider,
      ydoc,
      setupError,
    }),
    [hasCollab, provider, ydoc, setupError]
  )

  return (
    <CollabContext.Provider value={value}>{children}</CollabContext.Provider>
  )
}
