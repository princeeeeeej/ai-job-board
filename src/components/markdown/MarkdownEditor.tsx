import dynamic from "next/dynamic"

export const MarkdownEditor = dynamic(() => import("./_MarkdownEditor"), {srr: false})