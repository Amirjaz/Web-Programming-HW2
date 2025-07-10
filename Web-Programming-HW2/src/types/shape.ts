export type ShapeType = 'square' | 'circle' | 'triangle'

export interface Shape {
    id: number
    type: ShapeType
    x: number
    y: number
    width: number
    height: number
    color: string
}