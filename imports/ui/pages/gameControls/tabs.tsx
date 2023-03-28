import { For } from "solid-js"

type Props = {
    tabList: string[],
    activeTab: string | undefined,
    callback: (tab: string) => void
}

export default function Tabs(props: Props) {
    return <div style={{display: 'flex', gap: '8px', padding: '0px 16px', "margin-right": 'auto'}}>
        <For each={props.tabList}>
            {(tab) =>
                <div class='app-bar-button tab-button' classList={{ 'tab-button-selected': tab === props.activeTab }} onClick={() => props.callback(tab)}>
                    {tab}
                </div>
            }
        </For>
    </div>
}