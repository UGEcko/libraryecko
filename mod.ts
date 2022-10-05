import { notesBetween, CustomEvent, Note } from "https://deno.land/x/remapper@2.1.0/src/mod.ts"
import { Notes } from "./notes.ts"

type presets = ["NoBlock","NoArrow"]
    



/**
 * NotesBetween | Pretty basic, has presets and trackset!     
 * @param {number} sb - the start beat of the notes to be changed           
 * @param {number} eb - the end beat of the notes to be changed        
 * @param {string} track - Track that notes are added to  
 * @param {number} preset - Preset for the notes. 1 = NoBlock 2 = NoArrow None = Just track applied       
 */
export function NotesB(startbeat:number, endbeat:number, track:string, preset:number|undefined) {
    if(preset == 1){
        notesBetween(startbeat, endbeat, x => {
        x.track.value = track
        x.animate.dissolve = [0]
        })
    }
    if(preset == 2){
        notesBetween(startbeat, endbeat, x => {
        x.track.value = track
        x.animate.dissolveArrow = [0]
        })
    }
    if(preset == undefined){
        notesBetween(startbeat, endbeat, x => {
        x.track.value = track
        
        })
    }
    
}


    
