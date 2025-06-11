declare module 'moji-translate' {
    export function translate(sentence: string, onlyEmoji?: boolean): string
    export function getAllEmojiForWord(word: string): string
    export function translateForDisplay(word: string): string
    export function isMaybeAlreadyAnEmoji(word: string): string
}