import { useEffect, useRef, useState } from 'react'
import type { Shape } from '../types/shape.ts'

interface CanvasProps {
    shapes: Shape[]
    onAddShape: (x: number, y: number) => void
    onRemoveShape: (id: string) => void
    onMoveShape: (id: string, x: number, y: number) => void
    selectedTool?: 'select' | 'erase'
}

// Utility function to check if a point is inside a shape
const pointInShape = (shape: Shape, x: number, y: number): boolean => {
    const dx = x - shape.x
    const dy = y - shape.y

    switch (shape.type) {
        case 'circle':
            return Math.hypot(dx, dy) <= shape.width / 2
        case 'square':
            return Math.abs(dx) <= shape.width / 2 && Math.abs(dy) <= shape.height / 2
        case 'triangle': {
            // Triangle hit detection using barycentric coordinates
            const halfWidth = shape.width / 2
            const halfHeight = shape.height / 2

            // Triangle vertices (pointing upward)
            const p0 = { x: shape.x, y: shape.y - halfHeight }
            const p1 = { x: shape.x - halfWidth, y: shape.y + halfHeight }
            const p2 = { x: shape.x + halfWidth, y: shape.y + halfHeight }

            const det = (p1.y - p2.y) * (p0.x - p2.x) + (p2.x - p1.x) * (p0.y - p2.y)
            const s = ((p1.y - p2.y) * (x - p2.x) + (p2.x - p1.x) * (y - p2.y)) / det
            const t = ((p2.y - p0.y) * (x - p2.x) + (p0.x - p2.x) * (y - p2.y)) / det
            const u = 1 - s - t

            return s >= 0 && t >= 0 && u >= 0
        }
        default:
            return false
    }
}

// Drawing function
const drawShapes = (ctx: CanvasRenderingContext2D, shapes: Shape[], hoveredId?: string) => {
    const { width, height } = ctx.canvas
    ctx.clearRect(0, 0, width, height)

    shapes.forEach((shape) => {
        ctx.beginPath()

        // Set style based on hover state
        if (hoveredId === shape.id) {
            ctx.strokeStyle = '#3b82f6' // Blue when hovered
            ctx.fillStyle = shape.color + '40' // Semi-transparent fill
            ctx.lineWidth = 3
        } else {
            ctx.strokeStyle = shape.color
            ctx.fillStyle = shape.color + '20' // Very light fill
            ctx.lineWidth = 2
        }

        switch (shape.type) {
            case 'circle':
                ctx.arc(shape.x, shape.y, shape.width / 2, 0, Math.PI * 2)
                break
            case 'square':
                ctx.rect(
                    shape.x - shape.width / 2,
                    shape.y - shape.height / 2,
                    shape.width,
                    shape.height
                )
                break
            case 'triangle':
            { const halfWidth = shape.width / 2
                const halfHeight = shape.height / 2
                ctx.moveTo(shape.x, shape.y - halfHeight)
                ctx.lineTo(shape.x - halfWidth, shape.y + halfHeight)
                ctx.lineTo(shape.x + halfWidth, shape.y + halfHeight)
                ctx.closePath()
                break }
        }

        ctx.fill()
        ctx.stroke()
    })
}

export default function Canvas({
                                   shapes,
                                   onAddShape,
                                   onRemoveShape,
                                   onMoveShape,
                                   selectedTool = 'select'
                               }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null)  // Changed from string to number
    const [hoveredShapeId, setHoveredShapeId] = useState<string | null>(null)

    // Handle canvas resize
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const resize = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth
                canvas.height = canvas.parentElement.clientHeight
                repaint()
            }
        }

        resize()
        window.addEventListener('resize', resize)
        return () => window.removeEventListener('resize', resize)
    }, [])

    // Repaint when shapes change
    useEffect(() => {
        repaint()
    }, [shapes, hoveredShapeId])

    const repaint = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        drawShapes(ctx, shapes, hoveredShapeId || undefined)
    }

    // Get cursor position relative to canvas
    const getCursorPos = (e: MouseEvent): { x: number; y: number } => {
        const canvas = canvasRef.current!
        const rect = canvas.getBoundingClientRect()
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    // Find shape at given coordinates
    const findShapeAt = (x: number, y: number): Shape | null => {
        // Check from top to bottom (last drawn first)
        for (let i = shapes.length - 1; i >= 0; i--) {
            const shape = shapes[i]
            if (pointInShape(shape, x, y)) {
                return shape
            }
        }
        return null
    }

    // Mouse event handlers
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const onMouseDown = (e: MouseEvent) => {
            const { x, y } = getCursorPos(e)
            const shape = findShapeAt(x, y)

            if (shape) {
                if (selectedTool === 'erase') {
                    onRemoveShape(shape.id)
                } else {
                    // Start dragging
                    dragRef.current = {
                        id: shape.id,
                        offsetX: x - shape.x,
                        offsetY: y - shape.y
                    }
                }
            } else if (selectedTool !== 'erase') {
                // Add new shape
                onAddShape(x, y)
            }
        }

        const onMouseMove = (e: MouseEvent) => {
            const { x, y } = getCursorPos(e)

            if (dragRef.current) {
                // Update dragging shape position
                const { id, offsetX, offsetY } = dragRef.current
                onMoveShape(id, x - offsetX, y - offsetY)
            } else {
                // Update hover state
                const shape = findShapeAt(x, y)
                setHoveredShapeId(shape?.id || null)
            }
        }

        const onMouseUp = () => {
            dragRef.current = null
        }

        const onMouseLeave = () => {
            dragRef.current = null
            setHoveredShapeId(null)
        }

        const onDoubleClick = (e: MouseEvent) => {
            const { x, y } = getCursorPos(e)
            const shape = findShapeAt(x, y)
            if (shape) {
                onRemoveShape(shape.id)
            }
        }

        canvas.addEventListener('mousedown', onMouseDown)
        canvas.addEventListener('mousemove', onMouseMove)
        canvas.addEventListener('mouseup', onMouseUp)
        canvas.addEventListener('mouseleave', onMouseLeave)
        canvas.addEventListener('dblclick', onDoubleClick)

        return () => {
            canvas.removeEventListener('mousedown', onMouseDown)
            canvas.removeEventListener('mousemove', onMouseMove)
            canvas.removeEventListener('mouseup', onMouseUp)
            canvas.removeEventListener('mouseleave', onMouseLeave)
            canvas.removeEventListener('dblclick', onDoubleClick)
        }
    }, [shapes, selectedTool, onAddShape, onRemoveShape, onMoveShape])

    const getCursor = () => {
        if (selectedTool === 'erase') return 'not-allowed'
        if (hoveredShapeId) return 'move'
        return 'crosshair'
    }

    return (
        <div className="mx-2 my-0 flex justify-center">
            {/* board wrapper */}
            <div className="relative" style={{ width: 1300, height: 600}}>
                <canvas
                    ref={canvasRef}
                    className="absolute rounded-lg border border-gray-300 bg-gray-100"
                    style={{ cursor: getCursor() }}
                    width={1500}
                    height={600}
                />
            </div>
        </div>
    )
}