import { useNavigate } from "@solidjs/router";

interface Props {
    title: string,
    children: import("c:/Users/Adam/source/repos/maso-solid/node_modules/solid-js/types/jsx").JSX.Element[],
    onSubmit(e: Event & {
        submitter: HTMLElement;
    } & {
        currentTarget: HTMLFormElement;
        target: Element;
    }): void
}

export default function FromBase(props: Props) {
    const navigate = useNavigate()
    return (
    <div style={{
        display: 'flex',
        "flex-direction": 'column',
        "margin-top": '20px',
        "background-color": 'white',
        "border-radius": '5px',
        "align-items": 'center',
        width: 'fit-content',
        padding: '5px',
        margin: '0 auto'
    }}>
        <form onSubmit={props.onSubmit}>
            <div style={{display: 'flex', "flex-direction": 'column', gap: '8px', padding: '5px'}}>
                <h1>{props.title}</h1>
                {props.children}
                <input type="button" value="Zpět" onClick={() => navigate('/')}></input>
            </div>
        </form>
    </div>)
}