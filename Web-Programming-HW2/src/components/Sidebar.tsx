import type { ShapeType } from '../types/shape.ts'

interface SidebarProps {
    selectedShape: ShapeType | null
    onSelectShape: (shape: ShapeType | null) => void
}

const shapeTypes: ShapeType[] = ['square', 'circle', 'triangle']

export default function Sidebar({ selectedShape, onSelectShape }: SidebarProps) {
    return (
        <aside className="w-48 bg-gray-200 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Shapes</h2>
            <div className="space-y-3">
                {shapeTypes.map((shape) => (
                    <div
                        key={shape}
                        onClick={() => onSelectShape(shape === selectedShape ? null : shape)}
                        className={`p-3 rounded cursor-pointer flex items-center justify-center ${selectedShape === shape ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
                    >
                        <div className={`w-8 h-8 ${getShapeStyle(shape)}`}></div>
                        <span className="ml-2 capitalize">{shape}</span>
                    </div>
                ))}
            </div>
        </aside>
    )
}

function getShapeStyle(shape: ShapeType) {
    switch (shape) {
        case 'square':
            return 'bg-red-500'
        case 'circle':
            return 'bg-green-500 rounded-full'
        case 'triangle':
            return 'w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-yellow-500'
        default:
            return ''
    }
}