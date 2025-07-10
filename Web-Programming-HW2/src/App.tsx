import { useState } from 'react'
import Header from './components/Header'
import Canvas from './components/Canvas'
import Sidebar from './components/Sidebar'
import Stats from './components/Stats'
import type {Shape, ShapeType} from './types/shape.ts'

export default function App() {
    const [title, setTitle] = useState<string>('My Painting')
    const [shapes, setShapes] = useState<Shape[]>([])
    const [selectedShape, setSelectedShape] = useState<ShapeType | null>(null)

    const addShape = (x: number, y: number) => {
        if (!selectedShape) return

        const newShape: Shape = {
            id: Date.now(),
            type: selectedShape,
            x,
            y,
            width: 100,
            height: 100,
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`
        }

        setShapes([...shapes, newShape])
    }

    const removeShape = (id: number) => {
        setShapes(shapes.filter(shape => shape.id !== id))
    }

    const exportPainting = () => {
        const data = {
            title,
            shapes
        }
        const json = JSON.stringify(data, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title}.json`
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
                />
            </div>

            <Stats shapes={shapes} />
        </div>
    )
}