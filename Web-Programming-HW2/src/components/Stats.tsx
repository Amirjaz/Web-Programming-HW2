import type { Shape, ShapeType } from '../types/shape.ts'

interface StatsProps {
    shapes: Shape[]
}

export default function Stats({ shapes }: StatsProps) {
    const countShapes = (type: ShapeType) =>
        shapes.filter((shape) => shape.type === type).length

    return (
        <div className="bg-gray-900 text-white p-4 flex flex-wrap justify-around gap-4 shadow-md">
            <StatItem color="bg-red-500" label="Squares" count={countShapes('square')} shape="square" />
            <StatItem color="bg-green-500" label="Circles" count={countShapes('circle')} shape="circle" />
            <StatItem color="border-b-yellow-500" label="Triangles" count={countShapes('triangle')} shape="triangle" />
        </div>
    )
}

function StatItem({
                      color,
                      label,
                      count,
                      shape,
                  }: {
    color: string
    label: string
    count: number
    shape: ShapeType
}) {
    return (
        <div className="flex items-center gap-3 min-w-[140px]">
            {shape === 'triangle' ? (
                <div className="w-4 h-4 flex items-center justify-center">
                    <div className={`w-0 h-0 border-l-[10px] border-r-[10px] border-b-[18px] border-l-transparent border-r-transparent ${color}`} />
                </div>
            ) : (
                <div
                    className={`w-4 h-4 ${color} ${
                        shape === 'circle' ? 'rounded-full' : ''
                    }`}
                />
            )}
            <span className="text-sm font-medium">{label}: {count}</span>
        </div>
    )
}
