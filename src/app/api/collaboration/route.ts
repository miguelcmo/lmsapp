import { NextResponse } from "next/server"
import crypto from "crypto"

/**
 * Genera un JWT token válido para Tiptap Collaboration
 * Basado en la documentación: https://tiptap.dev/docs/guide/collaborate-on-documents
 */
export async function POST() {
  try {
    const appId = process.env.NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID
    let secret = process.env.TIPTAP_COLLAB_SECRET

    if (!appId) {
      console.error(
        "Missing NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID. Please configure Tiptap in your environment variables"
      )
      return NextResponse.json(
        { error: "Collaboration not configured" },
        { status: 500 }
      )
    }

    // Usar una secret por defecto para desarrollo si no está configurada
    if (!secret) {
      console.warn(
        "TIPTAP_COLLAB_SECRET no configurado. Usando secret de desarrollo."
      )
      secret = "dev-secret-change-in-production"
    }

    const now = Math.floor(Date.now() / 1000)
    const expiresIn = 24 * 60 * 60 // 24 horas

    const header = {
      typ: "JWT",
      alg: "HS256",
    }

    const payload = {
      iat: now,
      nbf: now,
      exp: now + expiresIn,
      iss: "https://cloud.tiptap.dev",
      aud: appId,
    }

    const headerEncoded = Buffer.from(JSON.stringify(header)).toString("base64url")
    const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString("base64url")

    const unsignedToken = `${headerEncoded}.${payloadEncoded}`

    // Firmar con HMAC-SHA256
    const signature = crypto
      .createHmac("sha256", secret)
      .update(unsignedToken)
      .digest("base64url")

    const token = `${unsignedToken}.${signature}`

    console.log("JWT token generado exitosamente para Tiptap")

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error generando token JWT:", error)
    return NextResponse.json(
      { error: "Failed to generate collaboration token" },
      { status: 500 }
    )
  }
}
