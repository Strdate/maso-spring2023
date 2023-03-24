const INT_HEIGHT = 12
const INT_WIDTH = 19
const mapData = [
    [5,1,11,1,1,1,1,4,0,0,0,5,1,1,1,1,11,1,4],
    [2,0,2,0,0,0,0,9,1,11,1,8,0,0,0,0,2,0,2],
    [7,1,3,1,1,11,1,6,0,2,0,7,1,11,1,1,3,1,6],
    [0,0,2,0,0,7,1,11,1,3,1,11,1,6,0,0,2,0,0],
    [0,0,2,0,0,0,0,2,0,2,0,2,0,0,0,0,2,0,0],
    [14,1,3,1,1,11,1,6,0,2,0,7,1,11,1,1,3,1,15],
    [0,0,2,0,0,2,0,0,5,10,4,0,0,2,0,0,2,0,0],
    [5,1,10,1,4,7,4,0,2,0,2,0,5,6,5,1,10,1,4],
    [2,0,0,0,9,1,3,1,10,1,10,1,3,1,8,0,0,0,2],
    [9,1,12,0,2,0,2,0,0,0,0,0,2,0,2,0,13,1,8],
    [2,0,0,0,9,1,10,1,1,1,1,1,10,1,8,0,0,0,2],
    [7,1,1,1,6,0,0,0,0,0,0,0,0,0,7,1,1,1,6]
]

class RenderingEngine
{
    img: HTMLImageElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.img = this.loadImage()
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")!
    }

    render = () => {
        console.log('Rendering... :)')
        const scale = this.resize()
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        for(let i = 0; i < mapData.length; i++) {
            for(let j = 0; j < mapData[i].length; j++) {
                this.drawSprite(mapData[i][j],j,i,scale)
            }
        }
    }

    loadImage = () => {
        const img = new Image()
        img.src = '/images/sprites.png'
        img.onload = () => this.render()
        return img
    }

    drawSprite = (mapOffset: number, top: number, left: number, scale: number) => {
        this.ctx.drawImage(this.img, mapOffset * 8, 0, 8, 8, top * 8 * scale, left * 8 * scale, 8 * scale, 8 * scale)
    }

    resize = () => {
        const scale = /*Math.floor(*/(window.innerHeight * 0.88) / 8 / INT_HEIGHT/*)*/
        this.canvas.height = scale * 8 * INT_HEIGHT
        this.canvas.width = scale * 8 * INT_WIDTH
        this.ctx.imageSmoothingEnabled = false
        return scale
    }
}

export default RenderingEngine