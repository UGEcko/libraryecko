// EckoLibrary | Updated 4/23/23
import { Environment, LightRemapper, Geometry, GeometryMaterial, GEO_SHADER, GEO_TYPE, ColorType, Difficulty , ModelScene, Text, RawGeometryMaterial, notesBetween, Note, eventsBetween,Color, EVENTACTION, EVENTGROUP, Event, Wall, CustomEvent, adjustFog, Vec4,rand} from "https://deno.land/x/remapper@3.1.1/src/mod.ts"

const map = new Difficulty("ExpertLawless", "ExpertStandard")





export function removePiece(ids: string[]) {

const env = new Environment(undefined, "Regex")

ids.forEach( x=> {
    env.id = x
    env.position = [-69420,-69420,-69420]
    env.push()
})

}

/**
 * @param  {string} text Text Input
 * @param  {string} fontModel Model used for text
 * @param  {RawGeometryMaterial} material the geometry material of the created text
 * @param  {(data:Text)=>void} data Additional data for text
 * @author UG-Ecko
 */
export function text(text: string, fontModel: string, material: RawGeometryMaterial, data?: (data: Text) => void) {
    const txt = new Text(fontModel)
    if (data) {
        data(txt)
    }
    new ModelScene(new Geometry("Cube", material)).static(txt.toObjects(text));
}
export function bgLasers(distance: number, baseID: number, lightType: number | EVENTGROUP) { // thnx nasa
    const bgLarers = new Geometry("Cube", "LightMaterial");
    for (let i = 0; i <= 3; i++) {
        let posZ = distance;
        let posX = 0;
        let invert = 1;
        let rotation = 0;
        if (i == 0 || i == 1) {posX = 0; posZ = distance;}
        if (i == 2 || i == 3) {posX = distance; posZ = 0;}
        if (i == 1 || i == 3) {invert = -1;}
        if (i == 3 || i == 2) {rotation = 90;}
        if (i > 0) bgLarers.duplicate = 1;
        bgLarers.position = [posX*invert,-2,posZ*invert]
        bgLarers.scale = [0.001,distance*2.5,0.001]
        bgLarers.rotation = [0,rotation,90]
        bgLarers.lightID = baseID+i
        bgLarers.lightType = lightType
        bgLarers.track.value = `BackgroundLasersTrack`
        bgLarers.push();
    }
    new LightRemapper().type(3).multiplyColor(2.5,50).run()
}

export function removeNotes(min: number, max: number, exceptions: string | string[]) { // thnx swiffer
    const skippedNotes: Note[] = [];

    map.notes.forEach(x => {
        if (x.time >= min && x.time <= max && x.track.value != exceptions) {
        x.push(true);
        skippedNotes.push(x);
        }
    });
    map.notes = map.notes.filter(x => !skippedNotes.some(n => n === x));
}


export function wallOnEvent(start: number, end: number, lightType: EVENTGROUP, data?: (data: Wall ) => void) {
        eventsBetween(start,end, x=> {
            if(x.type === lightType) {
                const w = new Wall(x.time)
                if (data) data(w)
                w.push()
            }
        })
}

export function eventOnEvent(start: number, end: number, lightType: EVENTGROUP, data?: (data: CustomEvent ) => void) {
    eventsBetween(start,end, x=> {
        if(x.type === lightType) {
            const c = new CustomEvent(x.time)
            if (data) data(c)
            c.push()
        }
    })
}

export function fogStuff(eventTime: number, attenuation: number, startY?: number, offset?: number) {
    adjustFog(x => {
        x.attenuation = attenuation
        x.startY = startY // 155 default
        x.offset = offset // 5 default
        x.height = 30
    },eventTime, 20)
}

export type direction = "Normal" | "Inverted"
export function pulseEvent(time: number, idBase: number, numberOfLights: number, offset: number, type: number | EVENTGROUP, direction: direction, color: Vec4 | [1,1,1,1]) {
const event = new Event()
const colors = new Color(color,'RGB').toFormat('HSV')

for(let i = 0; i < numberOfLights; i++) {
    event.time = time+(offset*i)
    event.type = type
    event.value = 6
    if (direction == "Normal") {
        event.customData = {
            "color" : colors,
              "lightID" : [
                idBase+i
              ]
    }
    }else if (direction == "Inverted") {
        event.customData = {
            "color" : color || [1,1,1,1],
              "lightID" : [
                idBase+numberOfLights-1-i
              ]
    }
    }
    event.push()
}
}
export function randEvent(time: number, idRangeStart: number, idRangeEnd: number, eventsPushed: number, offset: number, type: number | EVENTGROUP, index: number, color?: Vec4) {
    const event = new Event()
    let colors;
    if(color) {
       colors = new Color(color,'RGB').toFormat('HSV')
    } else {
        colors = [1,1,1,1]
    }
    
    for(let i = 0; i < eventsPushed; i++) {
        event.time = time+(offset*i)
        event.type = type
        event.value = 7
        event.customData = {
            "color" : colors,
                "lightID" : [
                rand(idRangeStart,idRangeEnd)
                ]
        }
        event.push()
    }
}

/**
 * @param  {number} start The Start of the Effect.
 * @param  {number} end The End of the Effect.
 * @param  {number} wallDur Duration of each Wall created in the effect.
 * @param  {number} amountOfWalls Amount of Walls in the Effect Time Frame.
 * @param  {number} density The amount of "Lines" of walls the effect contains. For 3 instances, do 3. The equation is 360/density. 
 * @param  {number} indivWallOffset The time between every wall spawn.
 * @param  {number} x
 * @param  {number} y
 */
export function wallF(start: number, end: number, wallDur: number, amountOfWalls: number, density: number, indivWallOffset: number, x: number, y: number) {
    
    const wall = new Wall()
    const passesAndAngle = 360/density
    const effectDur = end - start
    for(let p = 0; p < density; p++) {
        for(let i = 0; i<amountOfWalls; i++) {
            wall.time = start+(rand(-indivWallOffset,indivWallOffset)*i)
            wall.duration = wallDur
            wall.scale = [0.25,0.25,4]
            wall.color = [100,100,100,1]
            wall.NJS = 10
            wall.position = [x,y]
            
            wall.push()
            
        }
        wall.animate.rotation = [
            [0,passesAndAngle*p,0,0],[0,passesAndAngle*p,0,0.15],[90,passesAndAngle*p,0,0.35, 'easeInOutExpo']
        ]
        wall.animate.localRotation = [
            [0,0,0,0],[0,0,0,0.15],[45,0,0,0.35, 'easeInOutExpo'],[rand(-360,360),rand(-360,360),rand(-360,360),1, "easeInOutExpo"]
        ]
       
    }
}

    export function sineWall(start: number,wallDur: number, amountOfWalls: number,indivWallOffset: number, amp: number, freq: number, phase: number) {
        const wall = new Wall()
        for(let i = 0; i<amountOfWalls; i++) {
            const s = amp * Math.sin(freq * i + phase) + 10
            wall.time = start+(rand(-indivWallOffset,indivWallOffset)*i)
            wall.duration = wallDur
            wall.scale = [0.25,0.25,4]
            wall.color = [100,100,100,1]
            wall.NJS = 10
            wall.position = [s,s]
            wall.rotation = [0,-90,0]
            wall.push()
            
        } 
    }
    
