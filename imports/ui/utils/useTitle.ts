import { onCleanup, onMount } from "solid-js"

export default function useTitle(title: string) {
    let oldTitle: string
    onMount(() => {
        oldTitle = document.title
        document.title = title
    })
    onCleanup(() => {
        document.title = oldTitle
    })
}