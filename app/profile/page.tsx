'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import SkillSelector from '@/components/SkillSelector'
import { User, BookOpen, PenTool, Save, School, GraduationCap, ShieldCheck, BadgeCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
    const router = useRouter()
    const [role, setRole] = useState<'student' | 'teacher'>('student')
    const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', '计算机视觉'])
    const [isAuth, setIsAuth] = useState(false)

    // 模拟从统一登录获取用户信息
    useEffect(() => {
        const user = localStorage.getItem('user')
        if (!user) {
            router.push('/login')
        } else {
            setIsAuth(true)
        }
    }, [router])

    return (
        <main>
            <Navbar />

            <section className="section container" style={{ paddingTop: '140px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {/* Header & Role Switcher */}
                    <div className="glass" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                    {isAuth && <span style={{ fontSize: '0.75rem', fontWeight: 'normal', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>已通过学校认证</span>}
                                </h2>
                                <p style={{ fontSize: '0.9rem' }}>学号/工号: 20240101 | {role === 'student' ? '学生身份' : '教师身份'}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            <button
                                onClick={() => setRole('student')}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: role === 'student' ? 'var(--primary)' : 'transparent',
                                    color: 'white',
                                    fontWeight: 600,
                                    transition: 'all 0.2s'
                                }}
                            >
                                我是学生
                            </button>
                            <button
                                onClick={() => setRole('teacher')}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: role === 'teacher' ? 'var(--primary)' : 'transparent',
                                    color: 'white',
                                    fontWeight: 600,
                                    transition: 'all 0.2s'
                                }}
                            >
                                我是老师
                            </button>
                        </div>
                    </div>

                    <div className="grid" style={{ gap: '2rem' }}>
                        {/* 基本信息 */}
                        <div className="glass" style={{ padding: '2.5rem' }}>
                            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <PenTool size={20} color="var(--primary)" /> 基本信息
                            </h3>
                            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>姓名 (由学校库同步)</label>
                                    <input type="text" className="glass" disabled value="测试用户" style={{ width: '100%', padding: '0.8rem', color: 'white', border: '1px solid var(--glass-border)', outline: 'none', opacity: 0.7 }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>所属学院</label>
                                    <input type="text" className="glass" style={{ width: '100%', padding: '0.8rem', color: 'white', border: '1px solid var(--glass-border)', outline: 'none' }} placeholder="例如：信息与通信工程学院" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>校区</label>
                                    <select className="glass" style={{ width: '100%', padding: '0.8rem', color: 'white', border: '1px solid var(--glass-border)', outline: 'none', background: 'var(--background)' }}>
                                        <option>本部校区</option>
                                        <option>沙河校区</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>公开联系方式 (Email)</label>
                                    <input type="email" className="glass" style={{ width: '100%', padding: '0.8rem', color: 'white', border: '1px solid var(--glass-border)', outline: 'none' }} placeholder="student@university.edu.cn" />
                                </div>
                            </div>
                        </div>

                        {/* 学术技能 */}
                        <div className="glass" style={{ padding: '2.5rem' }}>
                            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <BookOpen size={20} color="var(--secondary)" /> {role === 'student' ? '能力标签' : '研究关键词'}
                            </h3>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                                    从主流库中选择最匹配的标签：
                                </label>
                                <SkillSelector
                                    selectedSkills={selectedSkills}
                                    onChange={setSelectedSkills}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                                    {role === 'student' ? '个人详情与项目成果' : '课题组研究背景'}
                                </label>
                                <textarea
                                    className="glass"
                                    rows={5}
                                    style={{ width: '100%', padding: '0.8rem', color: 'white', border: '1px solid var(--glass-border)', outline: 'none', resize: 'vertical' }}
                                    placeholder={role === 'student' ? '请详细描述您的科研经历、竞赛成果或实验室背景...' : '请介绍目前课题组的主要研究方向、在研项目及对学生的招募要求...'}
                                />
                            </div>
                        </div>

                        <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                                <ShieldCheck size={16} /> 您的真实身份信息已通过学校加密校验
                            </div>
                            <button href="/" className="btn btn-primary" style={{ padding: '1rem 3rem' }}>
                                <Save size={20} /> 更新个人档案
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
