'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import SkillSelector from '@/components/SkillSelector'
import { User, BookOpen, PenTool, Save, ShieldCheck, BadgeCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

type CurrentUser = {
    id: string
    name: string
    role: 'student' | 'teacher'
}

export default function ProfilePage() {
    const router = useRouter()
    const [role, setRole] = useState<'student' | 'teacher'>('student')
    const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', '计算机视觉'])
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
    const [isAuth, setIsAuth] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined') return
        const raw = localStorage.getItem('user')
        if (!raw) {
            setIsAuth(false)
            return
        }
        try {
            const parsed = JSON.parse(raw)
            if (parsed?.id && parsed?.role) {
                setCurrentUser(parsed)
                setRole(parsed.role)
                setIsAuth(true)
                return
            }
        } catch (_) {
            setIsAuth(false)
        }
    }, [])

    useEffect(() => {
        if (!isAuth) {
            router.push('/login')
        }
    }, [isAuth, router])

    const handleSaveProfile = () => {
        if (!currentUser) return
        const nextUser = { ...currentUser, role }
        localStorage.setItem('user', JSON.stringify(nextUser))
        setCurrentUser(nextUser)
    }

    return (
        <main>
            <Navbar />

            <section className="section container" style={{ paddingTop: '140px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="glass" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: '80px', height: '80px', background: 'var(--primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    <User size={40} />
                                </div>
                                {isAuth && (
                                    <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: '#10b981', color: 'white', borderRadius: '50%', padding: '2px', border: '2px solid var(--background)' }}>
                                        <BadgeCheck size={18} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    个人中心
                                    {isAuth && <span className="badge accent">已通过学校认证</span>}
                                </h2>
                                <p className="muted" style={{ fontSize: '0.9rem' }}>
                                    学号/工号: {currentUser?.id || '20240101'} | {role === 'student' ? '学生身份' : '教师身份'}
                                </p>
                            </div>
                        </div>

                        <div className="role-toggle">
                            <button
                                onClick={() => setRole('student')}
                                className={`role-btn ${role === 'student' ? 'active' : ''}`}
                            >
                                我是学生
                            </button>
                            <button
                                onClick={() => setRole('teacher')}
                                className={`role-btn ${role === 'teacher' ? 'active' : ''}`}
                            >
                                我是老师
                            </button>
                        </div>
                    </div>

                    <div className="grid" style={{ gap: '2rem' }}>
                        <div className="glass form-card">
                            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <PenTool size={20} color="var(--primary)" /> 基本信息
                            </h3>
                            <div className="form-grid">
                                <div>
                                    <label className="form-label">姓名 (由学校库同步)</label>
                                    <input type="text" className="form-input" disabled value={currentUser?.name || '测试用户'} />
                                </div>
                                <div>
                                    <label className="form-label">所属学院</label>
                                    <input type="text" className="form-input" placeholder="例如：信息与通信工程学院" />
                                </div>
                                <div>
                                    <label className="form-label">校区</label>
                                    <select className="form-input" style={{ background: 'var(--background)' }}>
                                        <option>本部校区</option>
                                        <option>沙河校区</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">公开联系方式 (Email)</label>
                                    <input type="email" className="form-input" placeholder="student@university.edu.cn" />
                                </div>
                            </div>
                        </div>

                        <div className="glass form-card">
                            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <BookOpen size={20} color="var(--secondary)" /> {role === 'student' ? '能力标签' : '研究关键词'}
                            </h3>

                            <div style={{ marginBottom: '2rem' }}>
                                <label className="form-label" style={{ marginBottom: '1rem' }}>
                                    从主流库中选择最匹配的标签：
                                </label>
                                <SkillSelector
                                    selectedSkills={selectedSkills}
                                    onChange={setSelectedSkills}
                                />
                            </div>

                            <div>
                                <label className="form-label">
                                    {role === 'student' ? '个人详情与项目成果' : '课题组研究背景'}
                                </label>
                                <textarea
                                    className="form-input"
                                    rows={5}
                                    style={{ resize: 'vertical' }}
                                    placeholder={role === 'student' ? '请详细描述您的科研经历、竞赛成果或实验室背景...' : '请介绍目前课题组的主要研究方向、在研项目及对学生的招募要求...'}
                                />
                            </div>
                        </div>

                        <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                                <ShieldCheck size={16} /> 您的真实身份信息已通过学校加密校验
                            </div>
                            <button type="button" className="btn btn-primary" style={{ padding: '1rem 3rem' }} onClick={handleSaveProfile}>
                                <Save size={20} /> 更新个人档案
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
