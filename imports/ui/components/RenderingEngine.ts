import { EntityInstance, Pos } from "/imports/core/interfaces";
import { pacmanMap, playerStartPos, spawnSpots } from "/imports/data/map";

const SPRITE_SIZE = 16
const HEALTH_INDICATOR_OFFSET: Pos = [4,3]

class RenderingEngine
{
    img: HTMLImageElement;
    houseImg: HTMLImageElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    scale: number = 1
    data: EntityInstance[] = []
    pickedUpItems: Pos[] = []
    isInput: boolean
    flash: boolean = false

    constructor(canvas: HTMLCanvasElement, isInput?: boolean) {
        this.img = this.loadImage('sprites')
        this.houseImg = this.loadImage('house')
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")!
        this.isInput = Boolean(isInput)
    }

    render = (newData?: EntityInstance[], pickedUpItems?: Pos[], flashNow?: boolean) => {
        console.log('Rendering... :)')
        if(newData) {
            this.data = newData//[...newData]
        }
        if(pickedUpItems) {
            this.pickedUpItems = pickedUpItems
        }
        if(flashNow !== undefined) {
            this.flash = flashNow
        }
        this.resize()

        // clear canvas
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)

        // render map
        for(let i = 0; i < pacmanMap.length; i++) {
            for(let j = 0; j < pacmanMap[i].length; j++) {
                const sprite = pacmanMap[i][j]
                if(sprite >= 0) {
                    this.drawSprite(sprite, 0,j+1,i+1)
                }
            }
        }

        this.drawGridLines()

        // render house
        const houseSize = [640,621]
        this.ctx.drawImage(
            this.houseImg,
            0,
            0,
            houseSize[0],
            houseSize[1],
            (playerStartPos[0] - 0.7) * SPRITE_SIZE * this.scale,
            (playerStartPos[1] - 0.6) * SPRITE_SIZE * this.scale,
            SPRITE_SIZE * this.scale * (0.4),
            SPRITE_SIZE * this.scale * (0.4)
        )

        // render entities
        this.data.sort(sortFunc).forEach(ent => {
            const offsetX = ent.spriteMapOffset[0] + RenderingEngine.facingDirToOffset(ent)
            const offsetY = ent.spriteMapOffset[1]
            if(ent.flashing && !this.flash) {
                return
            }
            this.drawSprite(offsetX, offsetY, ent.position[0], ent.position[1])
            if(ent.healthIndicator !== undefined) {
                this.drawSprite(HEALTH_INDICATOR_OFFSET[0] + ent.healthIndicator, HEALTH_INDICATOR_OFFSET[1], ent.position[0], ent.position[1])
            }
        })

        if(this.isInput) {
            spawnSpots.forEach(ss => {
                this.drawText(ss.letter, ss.position[0], ss.position[1])
            })
            //this.drawText('Předměty:', 1, pacmanMap.length + 1)
            for(let i = 0; i < this.pickedUpItems.length; i++) {
                const offset = this.pickedUpItems[i]
                this.drawPickedUpItem(offset[0], offset[1], i, 0)
            }
        }
    }

    loadImage = (name: string) => {
        const img = new Image()
        const src = `/images/${name}.png`
        img.src = src
        img.onload = () => this.render()
        img.onerror = () => setTimeout(() => {
            console.log(`Failed to load image ${name}.png`)
            img.src = src
        });
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

    drawPickedUpItem = (mapOffsetX: number, mapOffsetY: number, left: number, top: number) => {
        const scale = this.scale
        this.ctx.drawImage(
            this.img,
            mapOffsetX * SPRITE_SIZE,
            mapOffsetY * SPRITE_SIZE,
            SPRITE_SIZE,
            SPRITE_SIZE,
            (left /*+ 7*/) * SPRITE_SIZE * scale / 2,
            (top + pacmanMap.length * 2) * SPRITE_SIZE * scale / 2,
            SPRITE_SIZE * scale / 2.1,
            SPRITE_SIZE * scale / 2.1)
    }

    resize = () => {
        const rect = this.canvas.getBoundingClientRect()
        const prevScale = this.scale
        const rawScale = (window.innerHeight - rect.top) * 0.95 / SPRITE_SIZE / (pacmanMap.length + (this.isInput ? 1 : 0))
        const newScale = Math.floor(rawScale * 8) / 8
        if(newScale !== prevScale) {
            //console.log('scale changed')
            this.scale = newScale
            this.canvas.height = this.scale * SPRITE_SIZE * (pacmanMap.length + (this.isInput ? 0.5 : 0))
            this.canvas.width = this.scale * SPRITE_SIZE * pacmanMap[0].length
            this.ctx.imageSmoothingEnabled = false
            // hack cus I suck at css
            const tasksContainer = document.getElementById('tasks-container')
            if(tasksContainer) {
                tasksContainer.style.maxWidth = `${this.canvas.width}px`
            }
        }
    }

    drawGridLines = () => {
        const w = this.canvas.width
        const h = this.canvas.height
        var imageData = this.ctx.getImageData(0, 0, w, h);
        for (var i=0;i<imageData.data.length;i+=4)
        {
            //console.log(this.scale)
            if(Math.abs((i / 4) % w % (this.scale * SPRITE_SIZE)) < 1
             || Math.abs((i / 4) / w % (this.scale * SPRITE_SIZE)) < 1) {
                imageData.data[i] = 0//220
                imageData.data[i+1] = 0//220
                imageData.data[i+2] = 0//220
                //imageData.data[i+3] = 255
            }
        }
        this.ctx.putImageData(imageData,0,0);
    }

    drawText = (text: string, left: number, top: number) => {
        const scale = this.scale
        this.ctx.font = `${7 * scale}px publicPixel`
        this.ctx.fillStyle = '#000'
        this.ctx.textBaseline = 'top'
        this.ctx.fillText(
            text,
            (left - 0.7) * SPRITE_SIZE * scale,
            (top - 0.75) * SPRITE_SIZE * scale
        )
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

function sortFunc(a: EntityInstance, b: EntityInstance) {
    const getOrder = (inst: EntityInstance) => {
        switch(inst.category) {
            case 'ITEM': return 1
            case 'MONSTER': return 2
            case 'PACMAN' : return 3
        }
    }
    return getOrder(a) - getOrder(b)
}

export default RenderingEngine