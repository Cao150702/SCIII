'use client'

import Link from 'next/link'
import { GraduationCap, User, LogIn } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
    const [isLoggedIn] = useState(() => {
        if (typeof window === 'undefined') return false
        return Boolean(localStorage.getItem('user'))
    })

    return (
        <nav className="navbar glass">
            <Link href="/" className="logo">
                <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '10px', color: 'white' }}>
                    <GraduationCap size={22} />
                </div>
                <span>上海理工大学科研协同平台</span>
            </Link>

            <div className="nav-links">
                <Link href="/projects">课题搜索</Link>
                <Link href="/students">人才查询</Link>

                {isLoggedIn ? (
                    <>
                        <Link href="/dashboard">我的工作台</Link>
                        <Link href="/profile" className="btn btn-primary">
                            <User size={18} />
                            个人中心
                        </Link>
                    </>
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
