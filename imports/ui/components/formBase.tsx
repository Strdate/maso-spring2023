import { useNavigate } from "@solidjs/router";
import { JSX } from "solid-js";

interface Props {
    title: string,
    children: JSX.Element | JSX.Element[],
    onConfirm(data: any): void
    showBackButton?: boolean
    backButtonLink?: string
}

// TODO Add clear form option to FromBase (eg. for adding teams)
// TODO Refactor "FromBase" with typo to "FormBase"
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
        padding: '10px',
        margin: '0 auto',
    }}>
        <form id='inputform' onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.target as HTMLFormElement)
            const res = {} as any
            data.forEach((value, key) => res[key] = value)
            props.onConfirm(res)
        }}>
            <div style={{display:
                    'flex',
                    "flex-direction": 'column',
                    gap: '10px',
                    padding: '5px',
                    }}
                class='formbase'>
                <h1>{props.title}</h1>
                {props.children}
                {props.showBackButton ? <input type="button" value="Zpět" onClick={() => navigate(props.backButtonLink ?? '/')}></input> : null}
            </div>
        </form>
    </div>)
}