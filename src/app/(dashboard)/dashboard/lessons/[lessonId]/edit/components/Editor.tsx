// // "use client"

// // import { useEditor, EditorContent } from "@tiptap/react"
// // import StarterKit from "@tiptap/starter-kit"

// // export default function Editor({ content, onChange }: any) {
// //   const editor = useEditor({
// //     extensions: [StarterKit],
// //     content: content || "",
// //     onUpdate: ({ editor }) => {
// //       onChange(editor.getJSON())
// //     },
// //   })

// //   if (!editor) return null

// //   return (
// //     <div className="border rounded-md p-4 min-h-[200px]">
// //       <EditorContent editor={editor} />
// //     </div>
// //   )
// // }

// "use client"

// import { useEditor, EditorContent } from "@tiptap/react"
// import StarterKit from "@tiptap/starter-kit"
// import Link from "@tiptap/extension-link"
// import BubbleMenu from "@tiptap/extension-bubble-menu"
// import Placeholder from "@tiptap/extension-placeholder"

// export default function Editor({ content, onChange }: any) {
//   const editor = useEditor({
//     // extensions: [StarterKit],
//     extensions: [
//       StarterKit,
//       Link,
//       BubbleMenu.configure({
//         tippyOptions: {
//           duration: 100,
//         },
//       }),
//       Placeholder.configure({
//         placeholder: "Escribe algo… o usa / para comandos",
//       }),
//     ],

//     // 🔥 CLAVE PARA SSR
//     immediatelyRender: false,

//     content: content || { type: "doc", content: [] },

//     onUpdate: ({ editor }) => {
//       onChange(editor.getJSON())
//     },
//   })

//   if (!editor) return null

//   // return (
//   //   <div className="border rounded-md p-4 min-h-[200px]">
//   //     <EditorContent editor={editor} />
//   //   </div>
//   // )
//   return (
//   <div className="border rounded-md p-4 space-y-3">

//     {/* TOOLBAR */}
//     <div className="flex flex-wrap gap-2 border-b pb-2">

//       <button
//         onClick={() => editor.chain().focus().toggleBold().run()}
//         className="px-2 py-1 border rounded text-sm"
//       >
//         Bold
//       </button>

//       <button
//         onClick={() => editor.chain().focus().toggleItalic().run()}
//         className="px-2 py-1 border rounded text-sm"
//       >
//         Italic
//       </button>

//       <button
//         onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//         className="px-2 py-1 border rounded text-sm"
//       >
//         H2
//       </button>

//       <button
//         onClick={() => editor.chain().focus().toggleBulletList().run()}
//         className="px-2 py-1 border rounded text-sm"
//       >
//         Lista
//       </button>

//       <button
//         onClick={() => {
//           const url = window.prompt("URL")
//           if (url) {
//             editor.chain().focus().setLink({ href: url }).run()
//           }
//         }}
//         className="px-2 py-1 border rounded text-sm"
//       >
//         Link
//       </button>

//     </div>

//     {/* EDITOR */}
//     {/* <EditorContent editor={editor} /> */}

//     <div className="prose prose-sm max-w-none">
//       <EditorContent editor={editor} />
//     </div>

//   </div>
// )
// }



export default function Editor() {
  return (
    <>Editor</>
  )
}