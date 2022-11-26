import { onCleanup, onMount } from "solid-js"

interface Props {
    name: string
}

export default function Title(props: Props) {
    let oldTitle: string
    onMount(() => {
        oldTitle = document.title
        document.title = props.name
    })
    onCleanup(() => {
        document.title = oldTitle
    })
    return (null)
}