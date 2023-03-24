import { onCleanup, onMount, untrack } from "solid-js";
import RenderingEngine from "./RenderingEngine";
import { vertices, connections } from "/imports/data/map";

export default function GameMap() {
    let re: RenderingEngine;
    console.log('GameMap mounted!')
    const timer = setInterval(() => re?.render(), 1000);
    onCleanup(() => {
        clearInterval(timer)
        console.log('GameMap dismounted!')
    });
    onMount(() => {
        const canvas = document.getElementById("game-map") as HTMLCanvasElement
        re = new RenderingEngine(canvas)
        re.render()
    })

  return <canvas id="game-map" width='300px' height='300px' /*style={{position:'absolute', top: '0', left: '0'}}*/></canvas>
}

