'use client'

import Navbar from '@/components/Navbar'
import { School, ShieldCheck, ArrowRight, UserCheck, GraduationCap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
    const router = useRouter()
    const [loadingRole, setLoadingRole] = useState<'student' | 'teacher' | null>(null)

    const handleLogin = (role: 'student' | 'teacher') => {
        setLoadingRole(role)
        // 模拟统一身份认证跳转与回调
        setTimeout(() => {
            if (role === 'teacher') {
                localStorage.setItem('user', JSON.stringify({ name: '张教授', role: 'teacher', id: 'T001' }))
            } else {
                localStorage.setItem('user', JSON.stringify({ name: '测试学生', role: 'student', id: '20240101' }))
            }
            router.push('/profile')
            router.refresh()
        }, 1200)
    }

    return (
        <main>
            <Navbar />
            <section className="section container" style={{ paddingTop: '140px', display: 'flex', justifyContent: 'center' }}>
                <div className="glass login-card">
                    <div className="login-icon">
                        <School size={36} />
                    </div>
                    <h2 className="page-title" style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>上海理工大学统一身份认证</h2>
                    <p className="page-lead" style={{ marginBottom: '2.2rem' }}>
                        请使用您的校园网账号登录科研协同平台，系统将自动关联您的学籍或教工信息。
                    </p>

                    <div className="note-card">
                        <div className="note-title">
                            <ShieldCheck size={16} /> 官方加密通道已开启
                        </div>
                        <div className="muted" style={{ fontSize: '0.85rem' }}>
                            对接学校身份认证系统 (CAS / OAuth2)，确保数据真实性与安全。
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '0.8rem' }}>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', justifyContent: 'center', fontSize: '1.05rem' }}
                            onClick={() => handleLogin('student')}
                            disabled={loadingRole !== null}
                        >
                            {loadingRole === 'student' ? '正在跳转认证中心...' : <>学生账号登录 <GraduationCap size={20} /></>}
                        </button>
                        <button
                            className="btn btn-glass"
                            style={{ width: '100%', padding: '1rem', justifyContent: 'center', fontSize: '1.05rem' }}
                            onClick={() => handleLogin('teacher')}
                            disabled={loadingRole !== null}
                        >
                            {loadingRole === 'teacher' ? '正在跳转认证中心...' : <>导师账号登录 <UserCheck size={20} /></>}
                        </button>
                    </div>

                    <p className="muted" style={{ marginTop: '1.6rem', fontSize: '0.8rem' }}>
                        登录即代表您同意《科研协同平台学术社区公约》
                    </p>
                </div>
            </section>
        </main>
    )
}
