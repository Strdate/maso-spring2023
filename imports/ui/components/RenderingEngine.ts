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
                const sprite = pacmanMap[i][j]
                if(sprite >= 0) {
                    this.drawSprite(sprite, 0,j+1,i+1)
                }
            }
        }

        /*const oldC = hexToRgb('#000000')!
        const newC = hexToRgb('#1919A6')!
        this.recolorImage(oldC.r,oldC.g,oldC.b,newC.r,newC.g,newC.b)

        const old2 = hexToRgb('#ffffff')!
        const new2 = hexToRgb('#A1045A'/*'#BF00FF'/*'#301934'/*'#593163'*//*)!
        this.recolorImage(old2.r,old2.g,old2.b,new2.r,new2.g,new2.b)*/

        // render entities
        this.data.forEach(ent => {
            const offsetX = ent.spriteMapOffset[0] + RenderingEngine.facingDirToOffset(ent)
            const offsetY = ent.spriteMapOffset[1]
            this.drawSprite(offsetX, offsetY, ent.position[0], ent.position[1])
        })

        /*this.drawSprite(4, 2, 9, 11)
        this.drawSprite(5, 2, 5, 6)
        this.drawSprite(6, 2, 13, 4)
        this.drawSprite(7, 2, 15, 10)*/
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

    // @ts-ignore
    /*recolorImage = (oldRed,oldGreen,oldBlue,newRed,newGreen,newBlue) => {

    const w = this.canvas.width
    const h = this.canvas.height

    // pull the entire image into an array of pixel data
    var imageData = this.ctx.getImageData(0, 0, w, h);

    // examine every pixel, 
    // change any old rgb to the new-rgb
    for (var i=0;i<imageData.data.length;i+=4)
      {
          // is this pixel the old rgb?
          if(imageData.data[i]==oldRed &&
             imageData.data[i+1]==oldGreen &&
             imageData.data[i+2]==oldBlue
          ){
              // change to your new rgb
              imageData.data[i]=newRed;
              imageData.data[i+1]=newGreen;
              imageData.data[i+2]=newBlue;
          }
      }
    // put the altered data back on the canvas  
    this.ctx.putImageData(imageData,0,0);
    // put the re-colored image back on the image

    }*/
}

/*function hexToRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }*/

export default RenderingEngine