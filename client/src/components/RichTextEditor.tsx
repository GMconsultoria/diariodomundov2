"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { useEffect, useCallback } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon,
  Heading2, Heading3, List, ListOrdered,
  Link as LinkIcon, AlignLeft, AlignCenter, AlignRight,
  Undo, Redo, Minus, Quote, Image as ImageIcon,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

// ─── Botão da barra de ferramentas ─────────────────────────────────────────
function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        // Prevenir que o editor perca o foco ao clicar nos botões
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={[
        "p-2 rounded-lg transition-colors text-sm flex items-center justify-center",
        active
          ? "bg-accent text-white"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ─── Separador vertical da toolbar ─────────────────────────────────────────
function Divider() {
  return <div className="w-px h-6 bg-border mx-1 flex-shrink-0" />;
}

// ─── Componente principal ───────────────────────────────────────────────────
export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Comece a escrever sua matéria aqui...",
  minHeight = "400px",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Parágrafo padrão ao pressionar Enter
        paragraph: {},
        // Headings disponíveis: H2 e H3
        heading: { levels: [2, 3] },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }: { editor: any }) => {
      const html = editor.getHTML();
      // Converter o marcador de parágrafo vazio do Tiptap para string vazia
      onChange(html === "<p></p>" ? "" : html);
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none",
        style: `min-height: ${minHeight}; padding: 1.5rem;`,
      },
    },
  });

  // Sincronizar conteúdo externo (ex: ao carregar matéria existente para edição)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && value !== undefined) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  // ── Inserir link ──────────────────────────────────────────────────────────
  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL do link:", prev ?? "https://");
    if (url === null) return; // cancelou
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  // ── Inserir imagem por URL ────────────────────────────────────────────────
  const handleInsertImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL da imagem:");
    if (!url) return;
    editor.chain().focus().setImage({ src: url, alt: "" }).run();
  }, [editor]);

  if (!editor) return null;

  const isHeading2 = editor.isActive("heading", { level: 2 });
  const isHeading3 = editor.isActive("heading", { level: 3 });

  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-background shadow-sm">
      {/* ── Barra de Ferramentas ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 p-3 border-b border-border bg-muted/30 sticky top-0 z-10">

        {/* Histórico */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Desfazer (Ctrl+Z)"
        >
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Refazer (Ctrl+Y)"
        >
          <Redo size={16} />
        </ToolbarButton>

        <Divider />

        {/* Formatação de texto */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Negrito (Ctrl+B)"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Itálico (Ctrl+I)"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Sublinhado (Ctrl+U)"
        >
          <UnderlineIcon size={16} />
        </ToolbarButton>

        <Divider />

        {/* Títulos */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={isHeading2}
          title="Título (H2)"
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={isHeading3}
          title="Subtítulo (H3)"
        >
          <Heading3 size={16} />
        </ToolbarButton>

        <Divider />

        {/* Listas */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Lista com marcadores"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Lista numerada"
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <Divider />

        {/* Alinhamento */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Alinhar à esquerda"
        >
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Centralizar"
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Alinhar à direita"
        >
          <AlignRight size={16} />
        </ToolbarButton>

        <Divider />

        {/* Extras */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Citação / Destaque"
        >
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Linha separadora"
        >
          <Minus size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={handleSetLink}
          active={editor.isActive("link")}
          title="Inserir/editar link"
        >
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={handleInsertImage}
          title="Inserir imagem por URL"
        >
          <ImageIcon size={16} />
        </ToolbarButton>
      </div>

      {/* ── Área de Edição ──────────────────────────────────────────────── */}
      <EditorContent
        editor={editor}
        className="rich-editor prose prose-lg max-w-none"
      />

      {/* ── Dicas de Teclado ────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-3 border-t border-border bg-muted/20 text-[11px] text-muted-foreground">
        <span><kbd className="font-mono bg-muted px-1 rounded">Enter</kbd> novo parágrafo</span>
        <span><kbd className="font-mono bg-muted px-1 rounded">Ctrl+B</kbd> negrito</span>
        <span><kbd className="font-mono bg-muted px-1 rounded">Ctrl+I</kbd> itálico</span>
        <span><kbd className="font-mono bg-muted px-1 rounded">Ctrl+U</kbd> sublinhado</span>
        <span><kbd className="font-mono bg-muted px-1 rounded">Ctrl+Z</kbd> desfazer</span>
        <span><kbd className="font-mono bg-muted px-1 rounded">Ctrl+Shift+B</kbd> citação</span>
      </div>
    </div>
  );
}
