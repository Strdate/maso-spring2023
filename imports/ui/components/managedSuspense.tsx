import { Show } from "solid-js"
import { JSX } from "solid-js";

interface Props {
    loading: boolean,
    found: boolean,
    children: JSX.Element | JSX.Element[]
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