import type { ChangeEvent } from 'react'

interface HeaderProps {
    title: string
    onTitleChange: (title: string) => void
    onExport: () => void
    onImport: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function Header({ title, onTitleChange, onExport, onImport }: HeaderProps) {
    return (
        <header className="bg-gray-900 text-white h-16 px-6 shadow-md flex items-center justify-between flex-wrap gap-4">
            <div className="flex-grow max-w-md ">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="Untitled Document"
                    className="w-full bg-gray-800 text-white placeholder-gray-400 placeholder:p-2 px-2 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    aria-label="Document Title"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <label className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition duration-200">
                    Import
                    <input
                        type="file"
                        accept=".json"
                        onChange={onImport}
                        className="hidden"
                    />
                </label>

                <button
                    onClick={onExport}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                >
                    Export
                </button>
            </div>
        </header>
    )
}
