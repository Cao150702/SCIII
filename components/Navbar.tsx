'use client'

import Link from 'next/link'
import { GraduationCap, User, LogIn } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // 模拟检查登录状态
    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user) setIsLoggedIn(true)
    }, [])

    return (
        <nav className="navbar glass">
            <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.5rem' }}>
                <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '8px', color: 'white' }}>
                    <GraduationCap size={24} />
                </div>
                <span className="gradient-text">ResearchBridge</span>
            </Link>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link href="/projects" style={{ fontWeight: 500 }}>课题搜索</Link>
                <Link href="/students" style={{ fontWeight: 500 }}>人才查询</Link>

                {isLoggedIn ? (
                    <Link href="/profile" className="btn btn-primary">
                        <User size={18} />
                        个人中心
                    </Link>
                ) : (
                    <Link href="/login" className="btn btn-glass">
                        <LogIn size={18} />
                        校内统一登录
                    </Link>
                )}
            </div>
        </nav>
    )
}
