import { createEffect, onCleanup, onMount } from "solid-js";
import useResize from "../utils/useResize";
import RenderingEngine from "./RenderingEngine";
import { IProjector } from "/imports/api/collections/projectors";

type Props = {
    projector: IProjector
}

export default function GameMap(props: Props) {
    let re: RenderingEngine;
    console.log('GameMap mounted!')
    const innerSize = useResize()
    onCleanup(() => {
        console.log('GameMap dismounted!')
    });
    onMount(() => {
        const canvas = document.getElementById("game-map") as HTMLCanvasElement
        re = new RenderingEngine(canvas)
    })
    createEffect(() => {
        innerSize() // trigger dependency
        re.render(props.projector.entities)
    })

  return <canvas id="game-map" width='300px' height='300px' ></canvas>
}

