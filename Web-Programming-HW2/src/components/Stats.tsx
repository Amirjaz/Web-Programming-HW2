import type { Shape, ShapeType } from '../types/shape.ts'

interface StatsProps {
    shapes: Shape[]
}

export default function Stats({ shapes }: StatsProps) {
    const countShapes = (type: ShapeType) => {
        return shapes.filter(shape => shape.type === type).length
    }

    return (
        <div className="bg-gray-800 text-white p-3 flex justify-around">
            <div className="flex items-center">
                <span className="w-4 h-4 bg-red-500 mr-2"></span>
                Squares: {countShapes('square')}
            </div>
            <div className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Circles: {countShapes('circle')}
            </div>
            <div className="flex items-center">
                <span className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-500 mr-2"></span>
                Triangles: {countShapes('triangle')}
            </div>
        </div>
    )
}