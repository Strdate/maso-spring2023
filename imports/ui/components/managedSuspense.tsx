import { Show } from "solid-js"

interface Props {
    loading: boolean,
    found: boolean,
    children: import("c:/Users/Adam/source/repos/maso-solid/node_modules/solid-js/types/jsx").JSX.Element[]
        | import("c:/Users/Adam/source/repos/maso-solid/node_modules/solid-js/types/jsx").JSX.Element
}

export default function ManagedSuspense(props: Props) {
    /*createEffect(() => {
        console.log(`ManagedSuspense. Loading: ${props.loading}, found: ${props.found}`)
    })*/
    return (
        <Show when={!props.loading} fallback={<div class='error-box'>Loading...</div>}>
            <Show when={props.found} fallback={<div class='error-box'>Hra nebyla nalezena :(</div>}>
                {props.children}
            </Show>
        </Show>
    )
}