import { escapeRegExp } from "lodash-es"
import $ from 'jquery'

export const constrain = (x: number, min: number, max: number) =>
    Math.max(min, Math.min(max, x))

// https://stackoverflow.com/questions/1219860/html-encoding-lost-when-attribute-read-from-input-field
export const encode = (s: string) =>
    $('<div/>').text(s).html()

// https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
export const htmlDecode = (input: string) => {
    let doc = new DOMParser().parseFromString(input, "text/html")
    return doc.documentElement.textContent
}

//https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
export const replaceAll = (str: string, find: string, replace: string, ignoreCase = false) =>
    str.replace(new RegExp(escapeRegExp(find), ignoreCase ? 'ig' : 'g'), replace)