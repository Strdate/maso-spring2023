import { createSignal, onCleanup, onMount } from "solid-js";

type SizeObj = {
    width: number,
    height: number
}

export default function useResize() {
    const [newSize, resize] = createSignal<SizeObj>({ width: 0, height: 0})
    const handleResize = () => resize({
        width: window.innerWidth,
        height: window.innerHeight
    })
    onMount(() => {
        window.addEventListener('resize', handleResize)
    })
    onCleanup(() => {
        window.removeEventListener('resize', handleResize)
    })
    handleResize()
    return newSize
}