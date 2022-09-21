import { Wall } from "https://deno.land/x/remapper@2.1.0/src/mod.ts"
export function createCircle(trackN: string, startBeat: number, dur: number, radius: number, amount: number, h: number, l: number, xPos: number, yPos: number, zPos: number, rot: number, disTime: number) {
    for (let i = 0; i <amount; i++) {
        let angle = Math.PI*2 / amount
        let rot = 360/amount*i
        let radians = angle *i
        let w  = 2*radius*Math.tan(Math.PI/amount)
        let sx = xPos + Math.cos(radians) * radius-w/2
        let sy = yPos + Math.sin(radians) * radius-h/2
        const wall = new Wall(startBeat,dur,0,0,0)
        wall.time = (startBeat+2)+0.005*i
        wall.interactable = false
        wall.track.value = trackN
        wall.scale = [w,h,l]
        wall.rotation = [0,0,0]
        wall.localRotation = [0,0,90+rot]
        wall.position = [sx,sy,0]
        wall.animate.definitePosition = [0,0,zPos]
        wall.color = [1,1,1,1]
    }
}
