'use client'

import Navbar from '@/components/Navbar'
import { School, ShieldCheck, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = () => {
        setIsLoading(true)
        // 模拟统一身份认证跳转与回调
        setTimeout(() => {
            localStorage.setItem('user', JSON.stringify({ name: '测试学生', role: 'student', id: '20240101' }))
            router.push('/profile')
            router.refresh()
        }, 1500)
    }

    return (
        <main>
            <Navbar />
            <section className="section container" style={{ paddingTop: '160px', display: 'flex', justifyContent: 'center' }}>
                <div className="glass" style={{ maxWidth: '500px', width: '100%', padding: '3rem', textAlign: 'center' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--primary)' }}>
                        <School size={40} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>高校统一身份认证</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '2.5rem' }}>
                        请使用您的校园网账号登录 ResearchBridge，系统将自动关联您的学籍或教工信息。
                    </p>

                    <div style={{ textAlign: 'left', marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: '#10b981', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <ShieldCheck size={16} /> 官方加密通道已开启
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            对接学校身份认证系统 (CAS / OAuth2)，确保数据真实性。
                        </div>
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', justifyContent: 'center', fontSize: '1.1rem' }}
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? '正在跳转认证中心...' : <>立即通过校内账号登录 <ArrowRight size={20} /></>}
                    </button>

                    <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#64748b' }}>
                        登录即代表您同意《ResearchBridge 学术社区公约》
                    </p>
                </div>
            </section>
        </main>
    )
}
