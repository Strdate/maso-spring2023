import { pacmanMap } from "/imports/data/map";

const SPRITE_SIZE = 16

class RenderingEngine
{
    img: HTMLImageElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    scale: number;

    constructor(canvas: HTMLCanvasElement) {
        this.img = this.loadImage()
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")!
        this.scale = 1
    }

    render = () => {
        console.log('Rendering... :)')
        this.resize()
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        for(let i = 0; i < pacmanMap.length; i++) {
            for(let j = 0; j < pacmanMap[i].length; j++) {
                this.drawSprite(pacmanMap[i][j], 0,j,i)
            }
        }

        this.drawSprite(0, 1, 3, 2)
    }

    loadImage = () => {
        const img = new Image()
        img.src = '/images/sprites.png'
        img.onload = () => this.render()
        return img
    }

    drawSprite = (mapOffsetX: number, mapOffsetY: number, top: number, left: number, scale: number = this.scale) => {
        this.ctx.drawImage(
            this.img,
            mapOffsetX * SPRITE_SIZE,
            mapOffsetY * SPRITE_SIZE,
            SPRITE_SIZE,
            SPRITE_SIZE,
            top * SPRITE_SIZE * scale,
            left * SPRITE_SIZE * scale,
            SPRITE_SIZE * scale,
            SPRITE_SIZE * scale)
    }

    resize = () => {
        this.scale = /*Math.floor(*/(window.innerHeight * 0.88) / SPRITE_SIZE / pacmanMap.length/*)*/
        this.canvas.height = this.scale * SPRITE_SIZE * pacmanMap.length
        this.canvas.width = this.scale * SPRITE_SIZE * pacmanMap[0].length
        this.ctx.imageSmoothingEnabled = false
    }
}

export default RenderingEngine