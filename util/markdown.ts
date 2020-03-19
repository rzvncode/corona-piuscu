import { div, isNullOrEmpty } from "solenya"
import { parse } from "marked"
import { encode, replaceAll } from "../util/util"
import marked = require("marked")
var xss: any = require("xss")

const renderer = new marked.Renderer()
renderer.link = (href, title, text) =>
    href.startsWith("/") ?
        `<a href="${href}" ${text}</a>` :
        `<a target="_blank" href="${href}">${text}</a>`

export const parseMarkdown = (text: string, substitutions?: object) => {
    text = substitute(text, substitutions)
    return xss(parse(encode(text), { renderer: renderer }))
}

export const markdownText = (name: string, text: string | undefined, map?: object, bypass = false) => {
    if (isNullOrEmpty(text))
        return "[" + name + "]"

    text = substitute(text!, map)
    return ! bypass ? parseMarkdown(text, map) : encode(text)
}

export type MarkdownOptions = {
    name?: string
    class?: string
    map?: object
    bypass?: boolean
}

export const markdownElement = (options: MarkdownOptions, text?: string) =>
    div({
        key: "markdown-" + (! options.name ? "" : options.name.replace(/ /g, "")),
        class: options.class,
        onAttached: e => e.innerHTML = markdownText(name, text, options.map, options.bypass)
    })

export const substitute = (text: string, substitutions?: object) => {
    if (substitutions)
        Object.keys(substitutions).forEach(token => {
            text = replaceAll(text, "@" + token, substitutions[token], true)
        })
    return text
}