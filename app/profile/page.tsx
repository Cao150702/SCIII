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

type Attachment = {
    id: number
    title: string
    url: string
}

export default function ProfilePage() {
    const router = useRouter()
    const [role, setRole] = useState<'student' | 'teacher'>('student')
    const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', '计算机视觉'])
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
    const [isAuth, setIsAuth] = useState(false)
    const [attachments, setAttachments] = useState<Attachment[]>([])
    const [attachmentDraft, setAttachmentDraft] = useState({ title: '', url: '' })
    const [attachmentHint, setAttachmentHint] = useState<string | null>(null)
    const [isOnline, setIsOnline] = useState(true)

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

    useEffect(() => {
        if (typeof window === 'undefined') return
        setIsOnline(navigator.onLine)
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    const apiFetch = async (url: string, options?: RequestInit) => {
        const headers = new Headers(options?.headers || {})
        headers.set('Content-Type', 'application/json')
        if (currentUser) {
            headers.set('x-user-id', currentUser.id)
            headers.set('x-user-role', currentUser.role)
            headers.set('x-user-name', currentUser.name || '')
        }
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)
        try {
            return await fetch(url, { ...options, headers, signal: controller.signal })
        } finally {
            clearTimeout(timeoutId)
        }
    }

    const loadAttachments = async () => {
        if (!currentUser) return
        const response = await apiFetch('/api/attachments')
        const data = await response.json().catch(() => ({}))
        if (response.ok) {
            setAttachments(data.attachments || [])
        }
    }

    useEffect(() => {
        loadAttachments()
    }, [currentUser])

    const handleSaveProfile = () => {
        if (!currentUser) return
        const nextUser = { ...currentUser, role }
        localStorage.setItem('user', JSON.stringify(nextUser))
        setCurrentUser(nextUser)
    }

    const handleAddAttachment = async () => {
        if (!attachmentDraft.title.trim() || !attachmentDraft.url.trim()) {
            setAttachmentHint('请填写附件标题与链接')
            return
        }
        const response = await apiFetch('/api/attachments', {
            method: 'POST',
            body: JSON.stringify(attachmentDraft)
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
            setAttachmentHint(data?.error || '保存失败')
            return
        }
        setAttachmentHint('附件已保存')
        setAttachmentDraft({ title: '', url: '' })
        await loadAttachments()
    }

    const handleRemoveAttachment = async (id: number) => {
        const response = await apiFetch('/api/attachments', {
            method: 'DELETE',
            body: JSON.stringify({ id })
        })
        if (response.ok) {
            setAttachmentHint('附件已删除')
            await loadAttachments()
        }
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

                        {role === 'student' && (
                            <div className="glass form-card">
                                <h3 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    学生成果附件（链接）
                                </h3>
                                {!isOnline && <div className="muted" style={{ marginBottom: '0.8rem' }}>离线状态下无法更新附件</div>}
                                {attachmentHint && <div className="muted" style={{ marginBottom: '0.8rem' }}>{attachmentHint}</div>}
                                <div className="form-grid">
                                    <div>
                                        <label className="form-label">附件标题</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={attachmentDraft.title}
                                            onChange={(event) => setAttachmentDraft((prev) => ({ ...prev, title: event.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">附件链接</label>
                                        <input
                                            type="url"
                                            className="form-input"
                                            value={attachmentDraft.url}
                                            onChange={(event) => setAttachmentDraft((prev) => ({ ...prev, url: event.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginTop: '1rem' }}>
                                    <button type="button" className="btn btn-primary" onClick={handleAddAttachment} disabled={!isOnline}>保存附件</button>
                                </div>
                                <div className="member-list" style={{ marginTop: '1.2rem' }}>
                                    {attachments.length === 0 && <div className="muted">暂无附件</div>}
                                    {attachments.map((attachment) => (
                                        <div key={attachment.id} className="member-card">
                                            <div className="member-info">
                                                <div className="member-name">{attachment.title}</div>
                                                <div className="member-meta">{attachment.url}</div>
                                            </div>
                                            <div className="member-actions">
                                                <a className="btn btn-glass" href={attachment.url} target="_blank" rel="noreferrer">打开</a>
                                                <button className="btn btn-glass" onClick={() => handleRemoveAttachment(attachment.id)}>删除</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
