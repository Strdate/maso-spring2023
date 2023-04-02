import { onCleanup } from "solid-js";

export default function useKeyHold(callbackFn: (code: string) => void, timeMs = 1000) {
    let lastKeyUpAt = 0

    const keyDownCallback = (ev: KeyboardEvent) => {
        const keyDownAt = new Date().getTime()
        const code = ev.code
        setTimeout(function() {
            if (keyDownAt > lastKeyUpAt) {
                callbackFn(code)
            }
        }, timeMs);
    }

    const keyUpCallback = () => {
        lastKeyUpAt = new Date().getTime()
    }

    window.addEventListener('keydown',keyDownCallback)
    window.addEventListener('keyup',keyUpCallback)

    onCleanup(() => {
        window.removeEventListener('keydown',keyDownCallback)
        window.removeEventListener('keyup',keyUpCallback)
    })
}