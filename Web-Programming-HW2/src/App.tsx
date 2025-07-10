import { useState, useCallback } from 'react'
// import { v4 as uuid } from 'uuid'
import Header from './components/Header'
import Canvas from './components/Canvas'
import Sidebar from './components/Sidebar'
import Stats from './components/Stats'
import type { Shape, ShapeType } from './types/shape'

// Very basic UUID generator
const uuid = () => crypto.randomUUID()

export default function App() {
    const [title, setTitle] = useState<string>('My Painting')
    const [shapes, setShapes] = useState<Shape[]>([])
    const [selectedShape, setSelectedShape] = useState<ShapeType | null>(null)

    const addShape = (x: number, y: number) => {
        if (!selectedShape) return

        const width = 100
        const height = 100

        const newShape: Shape = {
            id: uuid(),
            type: selectedShape,
            x: x - width / 2, // Center on click
            y: y - height / 2,
            width,
            height,
            color: `#${Math.floor(Math.random() * 0xffffff)
                .toString(16)
                .padStart(6, '0')}`,
        }

        setShapes((prev) => [...prev, newShape])
    }

    const removeShape = (id: string) => {
        setShapes((prev) => prev.filter((shape) => shape.id !== id))
    }

    const moveShape = useCallback((id: string, x: number, y: number) => {
        setShapes((prev) =>
            prev.map((shape) =>
                shape.id === id ? { ...shape, x, y } : shape
            )
        )
    }, [])

    const exportPainting = () => {
        const data = { title, shapes }
        const json = JSON.stringify(data, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title.replace(/\s+/g, '_')}.json`
        a.click()
    }

    const importPainting = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string
                const data = JSON.parse(content)
                setTitle(data.title || 'Imported Painting')
                setShapes(data.shapes || [])
            } catch (error) {
                console.error('Error parsing JSON:', error)
            }
        }
        reader.readAsText(file)
    }

    return (
        <div className="flex flex-col h-screen">
            <Header
                title={title}
                onTitleChange={setTitle}
                onExport={exportPainting}
                onImport={importPainting}
            />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    selectedShape={selectedShape}
                    onSelectShape={setSelectedShape}
                />

                <Canvas
                    shapes={shapes}
                    onAddShape={addShape}
                    onRemoveShape={removeShape}
                    onMoveShape={moveShape}
                />
            </div>

            <Stats shapes={shapes} />
        </div>
    )
}
