import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: '上海理工大学科研协同平台',
    description: '面向上海理工大学师生的科研课题对接与人才协同平台。',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="zh-CN">
            <body>{children}</body>
        </html>
    )
}
