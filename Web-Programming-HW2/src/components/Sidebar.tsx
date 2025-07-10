import type { ShapeType } from '../types/shape.ts'

interface SidebarProps {
    selectedShape: ShapeType | null
    onSelectShape: (shape: ShapeType | null) => void
}

const shapeTypes: ShapeType[] = ['square', 'circle', 'triangle']

export default function Sidebar({ selectedShape, onSelectShape }: SidebarProps) {
    return (
        <aside className="w-60 bg-white shadow-md rounded-r-lg p-5 overflow-y-auto h-full">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Select Shape</h2>
            <div className="space-y-4">
                {shapeTypes.map((shape) => {
                    const isActive = selectedShape === shape
                    return (
                        <div
                            key={shape}
                            onClick={() => onSelectShape(isActive ? null : shape)}
                            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition 
                                ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                        >
                            {shape === 'triangle' ? (
                                <div className="flex items-center justify-center w-10 h-10">
                                    <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[38px] border-l-transparent border-r-transparent border-b-yellow-500" />
                                </div>
                            ) : (
                                <div className={`w-10 h-10 ${getShapeStyle(shape)}`} />
                            )}
                            <span className="capitalize font-medium">{shape}</span>
                        </div>
                    )
                })}
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
            return ''
        default:
            return ''
    }
}
