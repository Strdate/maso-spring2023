import { createSignal, createContext, useContext, JSX, onCleanup } from 'solid-js'
import { TimeSync } from 'meteor/mizzao:timesync'

interface Props {
    children: JSX.Element | JSX.Element[],
}

const CurTimeContext = createContext();

function useInterval(interval: number, callback: any) {
    const timer = setInterval(callback, interval)
    onCleanup(() => clearInterval(timer))
}

export function CurTimeProvider(props: Props) {
  const [curTime, setCurTime] = createSignal(0)
  const updateTime = () => {
    setCurTime(roundHundred(new Date().getTime() + TimeSync.serverOffset()))
  }

  useInterval(100, () => {
    updateTime()
  })

  return (
    <CurTimeContext.Provider value={curTime}>
      {props.children}
    </CurTimeContext.Provider>
  );
}

export function useCurTime() { return useContext(CurTimeContext) as () => number; }

function roundHundred(value: number) {
    return Math.round(value / 100) * 100
}