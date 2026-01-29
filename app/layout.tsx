import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Research Bridge - Connecting Teachers & Students',
    description: 'A platform for research collaboration and talent discovery.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
