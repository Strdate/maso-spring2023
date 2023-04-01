import { createSignal, onCleanup } from "solid-js"

function useInterval(interval: number, callback: any) {
    const timer = setInterval(callback, interval)
    onCleanup(() => clearInterval(timer))
}

function useCurTime() {
    const [curTime, setCurTime] = createSignal(0)
    useInterval(100, () => {
        setCurTime(new Date().setMilliseconds(0))
    })
    return curTime
}

export { useInterval, useCurTime }