/* export class Cita {
    constructor(
        public  id: number,
        public texto: string = "",
        public autor: string = ""
    ){}
} */

export interface Cita {
    id?:number
    texto:string
    autor:string
}