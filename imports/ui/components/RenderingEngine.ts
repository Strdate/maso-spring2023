import { EntityInstance } from "/imports/core/interfaces";
import { pacmanMap } from "/imports/data/map";

const SPRITE_SIZE = 16

class RenderingEngine
{
    img: HTMLImageElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    scale: number;
    data: EntityInstance[];

    constructor(canvas: HTMLCanvasElement) {
        this.img = this.loadImage()
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")!
        this.scale = 1
        this.data = []
    }

    render = (newData?: EntityInstance[]) => {
        console.log('Rendering... :)')
        if(newData) {
            this.data = newData
        }
        this.resize()

        // clear canvas
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)

        // render map
        for(let i = 0; i < pacmanMap.length; i++) {
            for(let j = 0; j < pacmanMap[i].length; j++) {
                this.drawSprite(pacmanMap[i][j], 0,j+1,i+1)
            }
        }

        // render entities
        this.data.forEach(ent => {
            const offsetX = ent.spriteMapOffset[0] + RenderingEngine.facingDirToOffset(ent)
            const offsetY = ent.spriteMapOffset[1]
            this.drawSprite(offsetX, offsetY, ent.position[0], ent.position[1])
        })
    }

    loadImage = () => {
        const img = new Image()
        img.src = '/images/sprites.png'
        img.onload = () => this.render()
        return img
    }

    drawSprite = (mapOffsetX: number, mapOffsetY: number, left: number, top: number, scale: number = this.scale) => {
        this.ctx.drawImage(
            this.img,
            mapOffsetX * SPRITE_SIZE,
            mapOffsetY * SPRITE_SIZE,
            SPRITE_SIZE,
            SPRITE_SIZE,
            (left - 1) * SPRITE_SIZE * scale,
            (top - 1) * SPRITE_SIZE * scale,
            SPRITE_SIZE * scale,
            SPRITE_SIZE * scale)
    }

    resize = () => {
        const rect = this.canvas.getBoundingClientRect()
        this.scale = (window.innerHeight - rect.top) * 0.95 / SPRITE_SIZE / pacmanMap.length
        this.canvas.height = this.scale * SPRITE_SIZE * pacmanMap.length
        this.canvas.width = this.scale * SPRITE_SIZE * pacmanMap[0].length
        this.ctx.imageSmoothingEnabled = false
    }

    static facingDirToOffset = (ent: EntityInstance) => {
        switch(ent.facingDir) {
            case 'RIGHT': return 0
            case 'DOWN': return 1
            case 'LEFT': return 2
            case 'UP': return 3
            default: return 0
        }
    }
}

export default RenderingEngine