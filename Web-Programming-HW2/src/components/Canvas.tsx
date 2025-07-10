import type { Shape } from '../types/shape.ts'

interface CanvasProps {
    shapes: Shape[]
    onAddShape: (x: number, y: number) => void
    onRemoveShape: (id: number) => void
}

export default function Canvas({ shapes, onAddShape, onRemoveShape }: CanvasProps) {
    const handleCanvasClick = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        onAddShape(x, y)
    }

    const renderShape = (shape: Shape) => {
        const style = {
            position: 'absolute' as const,
            left: `${shape.x}px`,
            top: `${shape.y}px`,
            width: `${shape.width}px`,
            height: `${shape.height}px`,
            backgroundColor: shape.type !== 'triangle' ? shape.color : 'transparent',
            border: shape.type === 'triangle' ? 'none' : `2px solid ${shape.color}`,
        }

        switch (shape.type) {
            case 'square':
                return (
                    <div
                        key={shape.id}
                        style={style}
                        className="cursor-pointer"
                        onDoubleClick={() => onRemoveShape(shape.id)}
                    />
                )
            case 'circle':
                return (
                    <div
                        key={shape.id}
                        style={{ ...style, borderRadius: '50%' }}
                        className="cursor-pointer"
                        onDoubleClick={() => onRemoveShape(shape.id)}
                    />
                )
            case 'triangle':
                return (
                    <div
                        key={shape.id}
                        style={{
                            ...style,
                            width: 0,
                            height: 0,
                            borderLeft: `${shape.width / 2}px solid transparent`,
                            borderRight: `${shape.width / 2}px solid transparent`,
                            borderBottom: `${shape.height}px solid ${shape.color}`,
                            left: `${shape.x - shape.width / 2}px`,
                        }}
                        className="cursor-pointer"
                        onDoubleClick={() => onRemoveShape(shape.id)}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div
            className="flex-1 bg-gray-100 relative overflow-hidden"
            onClick={handleCanvasClick}
        >
            {shapes.map(renderShape)}
        </div>
    )
}