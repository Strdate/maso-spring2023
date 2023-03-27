import { onCleanup, onMount } from "solid-js"

export default function useClass(className: string) {
    onMount(() => {
        document.body.classList.add(className);
    })
    onCleanup(() => {
        document.body.classList.remove(className);
    })
}