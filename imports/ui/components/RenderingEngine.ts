import { EntityInstance, Pos } from "/imports/core/interfaces";
import { pacmanMap, spawnSpots } from "/imports/data/map";

const SPRITE_SIZE = 16

class RenderingEngine
{
    img: HTMLImageElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    scale: number = 1
    data: EntityInstance[] = []
    pickedUpItems: Pos[] = []
    isInput: boolean

    constructor(canvas: HTMLCanvasElement, isInput?: boolean) {
        this.img = this.loadImage()
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

        // render entities
        this.data.sort(sortFunc).forEach(ent => {
            const offsetX = ent.spriteMapOffset[0] + RenderingEngine.facingDirToOffset(ent)
            const offsetY = ent.spriteMapOffset[1]
            if(ent.flashing && !flashNow) {
                return
            }
            this.drawSprite(offsetX, offsetY, ent.position[0], ent.position[1])
        })

        if(this.isInput) {
            //this.drawText('Předměty:', 1, pacmanMap.length + 1)
            for(let i = 0; i < this.pickedUpItems.length; i++) {
                const offset = this.pickedUpItems[i]
                this.drawPickedUpItem(offset[0], offset[1], i, 0)
            }
        }

        /*this.testSpawns()
        spawnSpots.forEach((ss) => {
            this.drawSprite(4, 2, ss.position[0], ss.position[1])
        })*/

        /*this.drawSprite(4, 2, 9, 11)
        this.drawSprite(5, 2, 5, 6)
        this.drawSprite(6, 2, 13, 4)
        this.drawSprite(7, 2, 15, 10)*/
    }

    loadImage = () => {
        const img = new Image()
        const src = '/images/sprites.png'
        img.src = src
        img.onload = () => this.render()
        img.onerror = () => setTimeout(() => {
            console.log('Image error')
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

    drawText = (text: string, left: number, top: number) => {
        const scale = this.scale
        this.ctx.font = `${6 * scale}px publicPixel`
        //console.log('text height:',6*scale)
        this.ctx.fillStyle = '#ffffff'
        this.ctx.textBaseline = 'top'
        this.ctx.fillText(
            text,
            (left - 1) * SPRITE_SIZE * scale,
            (top - 1) * SPRITE_SIZE * scale
        )
    }

    resize = () => {
        const rect = this.canvas.getBoundingClientRect()
        const prevScale = this.scale
        const newScale = (window.innerHeight - rect.top) * 0.95 / SPRITE_SIZE / (pacmanMap.length + (this.isInput ? 1 : 0))
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

    /*testSpawns = () => {
        const spawns = [{"time":2,"pos":[17,5],"entId":2,"ss":"I"},{"time":2,"pos":[9,8],"entId":4,"ss":"K"},{"time":6,"pos":[6,1],"entId":1,"ss":"B"},{"time":7,"pos":[10,11],"entId":3,"ss":"Q"},{"time":12,"pos":[14,7],"entId":4,"ss":"M"},{"time":14,"pos":[1,2],"entId":1,"ss":"A"},{"time":15,"pos":[5,10],"entId":3,"ss":"P"},{"time":16,"pos":[7,4],"entId":2,"ss":"G"},{"time":19,"pos":[3,5],"entId":1,"ss":"F"},{"time":19,"pos":[17,5],"entId":4,"ss":"I"},{"time":21,"pos":[10,11],"entId":3,"ss":"Q"},{"time":23,"pos":[10,2],"entId":2,"ss":"C"},{"time":28,"pos":[3,10],"entId":1,"ss":"N"},{"time":28,"pos":[14,1],"entId":2,"ss":"D"},{"time":28,"pos":[13,4],"entId":4,"ss":"H"},{"time":29,"pos":[15,10],"entId":3,"ss":"R"},{"time":34,"pos":[3,12],"entId":1,"ss":"O"},{"time":34,"pos":[19,2],"entId":2,"ss":"E"},{"time":36,"pos":[9,8],"entId":4,"ss":"K"},{"time":38,"pos":[5,10],"entId":1,"ss":"P"},{"time":39,"pos":[17,5],"entId":2,"ss":"I"},{"time":39,"pos":[17,10],"entId":3,"ss":"S"},{"time":45,"pos":[3,5],"entId":1,"ss":"F"},{"time":45,"pos":[17,12],"entId":3,"ss":"T"},{"time":46,"pos":[14,7],"entId":4,"ss":"M"},{"time":53,"pos":[7,4],"entId":2,"ss":"G"},{"time":53,"pos":[10,11],"entId":3,"ss":"Q"},{"time":53,"pos":[17,5],"entId":4,"ss":"I"},{"time":56,"pos":[6,1],"entId":1,"ss":"B"},{"time":60,"pos":[10,2],"entId":2,"ss":"C"},{"time":61,"pos":[5,10],"entId":3,"ss":"P"},{"time":62,"pos":[13,4],"entId":4,"ss":"H"},{"time":64,"pos":[1,2],"entId":1,"ss":"A"},{"time":65,"pos":[14,1],"entId":2,"ss":"D"},{"time":67,"pos":[10,11],"entId":3,"ss":"Q"},{"time":69,"pos":[3,5],"entId":1,"ss":"F"},{"time":70,"pos":[9,8],"entId":4,"ss":"K"},{"time":71,"pos":[19,2],"entId":2,"ss":"E"},{"time":75,"pos":[15,10],"entId":3,"ss":"R"},{"time":76,"pos":[17,5],"entId":2,"ss":"I"},{"time":78,"pos":[3,10],"entId":1,"ss":"N"},{"time":80,"pos":[14,7],"entId":4,"ss":"M"},{"time":84,"pos":[3,12],"entId":1,"ss":"O"},{"time":85,"pos":[17,10],"entId":3,"ss":"S"},{"time":87,"pos":[17,5],"entId":4,"ss":"I"},{"time":88,"pos":[5,10],"entId":1,"ss":"P"},{"time":90,"pos":[7,4],"entId":2,"ss":"G"},{"time":91,"pos":[17,12],"entId":3,"ss":"T"},{"time":95,"pos":[3,5],"entId":1,"ss":"F"},{"time":96,"pos":[13,4],"entId":4,"ss":"H"},{"time":97,"pos":[10,2],"entId":2,"ss":"C"},{"time":99,"pos":[10,11],"entId":3,"ss":"Q"},{"time":102,"pos":[14,1],"entId":2,"ss":"D"},{"time":104,"pos":[9,8],"entId":4,"ss":"K"},{"time":106,"pos":[6,1],"entId":1,"ss":"B"},{"time":107,"pos":[5,10],"entId":3,"ss":"P"},{"time":108,"pos":[19,2],"entId":2,"ss":"E"},{"time":113,"pos":[17,5],"entId":2,"ss":"I"},{"time":113,"pos":[10,11],"entId":3,"ss":"Q"},{"time":114,"pos":[1,2],"entId":1,"ss":"A"},{"time":114,"pos":[14,7],"entId":4,"ss":"M"},{"time":119,"pos":[3,5],"entId":1,"ss":"F"},{"time":121,"pos":[15,10],"entId":3,"ss":"R"},{"time":121,"pos":[17,5],"entId":4,"ss":"I"},{"time":127,"pos":[7,4],"entId":2,"ss":"G"},{"time":128,"pos":[3,10],"entId":1,"ss":"N"},{"time":130,"pos":[13,4],"entId":4,"ss":"H"},{"time":131,"pos":[17,10],"entId":3,"ss":"S"},{"time":134,"pos":[3,12],"entId":1,"ss":"O"},{"time":134,"pos":[10,2],"entId":2,"ss":"C"},{"time":137,"pos":[17,12],"entId":3,"ss":"T"},{"time":138,"pos":[5,10],"entId":1,"ss":"P"},{"time":138,"pos":[9,8],"entId":4,"ss":"K"},{"time":139,"pos":[14,1],"entId":2,"ss":"D"},{"time":145,"pos":[3,5],"entId":1,"ss":"F"},{"time":145,"pos":[19,2],"entId":2,"ss":"E"},{"time":145,"pos":[10,11],"entId":3,"ss":"Q"},{"time":148,"pos":[14,7],"entId":4,"ss":"M"},{"time":150,"pos":[17,5],"entId":2,"ss":"I"},{"time":153,"pos":[5,10],"entId":3,"ss":"P"},{"time":155,"pos":[17,5],"entId":4,"ss":"I"},{"time":156,"pos":[6,1],"entId":1,"ss":"B"},{"time":159,"pos":[10,11],"entId":3,"ss":"Q"},{"time":164,"pos":[1,2],"entId":1,"ss":"A"},{"time":164,"pos":[7,4],"entId":2,"ss":"G"},{"time":164,"pos":[13,4],"entId":4,"ss":"H"},{"time":167,"pos":[15,10],"entId":3,"ss":"R"},{"time":169,"pos":[3,5],"entId":1,"ss":"F"},{"time":171,"pos":[10,2],"entId":2,"ss":"C"},{"time":172,"pos":[9,8],"entId":4,"ss":"K"},{"time":176,"pos":[14,1],"entId":2,"ss":"D"},{"time":177,"pos":[17,10],"entId":3,"ss":"S"},{"time":178,"pos":[3,10],"entId":1,"ss":"N"},{"time":182,"pos":[19,2],"entId":2,"ss":"E"},{"time":182,"pos":[14,7],"entId":4,"ss":"M"},{"time":183,"pos":[17,12],"entId":3,"ss":"T"},{"time":184,"pos":[3,12],"entId":1,"ss":"O"},{"time":187,"pos":[17,5],"entId":2,"ss":"I"},{"time":188,"pos":[5,10],"entId":1,"ss":"P"},{"time":189,"pos":[17,5],"entId":4,"ss":"I"},{"time":191,"pos":[10,11],"entId":3,"ss":"Q"},{"time":195,"pos":[3,5],"entId":1,"ss":"F"},{"time":198,"pos":[13,4],"entId":4,"ss":"H"},{"time":199,"pos":[5,10],"entId":3,"ss":"P"},{"time":201,"pos":[7,4],"entId":2,"ss":"G"},{"time":205,"pos":[10,11],"entId":3,"ss":"Q"},{"time":206,"pos":[6,1],"entId":1,"ss":"B"},{"time":206,"pos":[9,8],"entId":4,"ss":"K"},{"time":208,"pos":[10,2],"entId":2,"ss":"C"},{"time":213,"pos":[14,1],"entId":2,"ss":"D"},{"time":213,"pos":[15,10],"entId":3,"ss":"R"},{"time":214,"pos":[1,2],"entId":1,"ss":"A"},{"time":216,"pos":[14,7],"entId":4,"ss":"M"},{"time":219,"pos":[3,5],"entId":1,"ss":"F"},{"time":219,"pos":[19,2],"entId":2,"ss":"E"},{"time":223,"pos":[17,10],"entId":3,"ss":"S"},{"time":223,"pos":[17,5],"entId":4,"ss":"I"},{"time":224,"pos":[17,5],"entId":2,"ss":"I"},{"time":228,"pos":[3,10],"entId":1,"ss":"N"},{"time":229,"pos":[17,12],"entId":3,"ss":"T"},{"time":232,"pos":[13,4],"entId":4,"ss":"H"},{"time":234,"pos":[3,12],"entId":1,"ss":"O"},{"time":237,"pos":[10,11],"entId":3,"ss":"Q"},{"time":238,"pos":[5,10],"entId":1,"ss":"P"},{"time":238,"pos":[7,4],"entId":2,"ss":"G"}]
        const time = 56
        spawns.filter((spawn) => spawn.time > time * 3  && spawn.time < (time + 8) * 3).forEach((spawn, i) => {
            this.drawSprite(4, 2, spawn.pos[0], spawn.pos[1])
            //this.drawText(spawn.ss, spawn.pos[0], spawn.pos[1])
            this.drawText(Math.ceil(((spawn.time - time*3)%24)/3).toString(), spawn.pos[0] + (spawn.ss === 'E' ? -1 : 1) + (i%8)*0.06, spawn.pos[1])
        })
        spawnSpots.forEach((s) => this.drawText(s.letter, s.position[0], s.position[1]))
    }*/

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