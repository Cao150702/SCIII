'use client'

import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/Navbar'
import { Search, Mail, Tag, User, Users, Star, Crown, UserMinus, UserPlus, LogOut, MessageSquare } from 'lucide-react'

type RatingSummary = {
    avg: number
    count: number
}

type ProjectMember = {
    id: string
    name: string
    major: string | null
    grade: string | null
    campus: string | null
    email: string | null
    rating: RatingSummary | null
}

type Project = {
    id: number
    title: string
    description: string
    tags: string[]
    department: string
    level: string
    status: string
    campus: string
    capacity: number
    deadline: string | null
    pendingCount: number
    teacher: {
        id: string
        name: string
        email: string | null
        rating: RatingSummary | null
    }
    members: ProjectMember[]
}

type CurrentUser = {
    id: string
    name: string
    role: 'student' | 'teacher'
}

type StudentJoinRequest = {
    project_id: number
    status: 'pending' | 'approved' | 'rejected'
    created_at: string
    decided_at: string | null
    project_title: string
    teacher_name: string
}

type TeacherJoinRequest = {
    project_id: number
    student_id: string
    student_name: string
    student_major: string | null
    student_grade: string | null
    project_title: string
    created_at: string
}

const levels = ['全部', '国创项目', '省创项目', '导师纵向课题', '校企横向项目']

const buildRatingKey = (projectId: number, rateeId: string) => `${projectId}:${rateeId}`

export default function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterLevel, setFilterLevel] = useState('全部')
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
    const [activeRating, setActiveRating] = useState<string | null>(null)
    const [ratingDrafts, setRatingDrafts] = useState<Record<string, { score: number; comment: string }>>({})
    const [actionHint, setActionHint] = useState<string | null>(null)
    const [studentRequests, setStudentRequests] = useState<StudentJoinRequest[]>([])
    const [teacherRequests, setTeacherRequests] = useState<TeacherJoinRequest[]>([])

    useEffect(() => {
        if (typeof window === 'undefined') return
        const raw = localStorage.getItem('user')
        if (raw) {
            try {
                const parsed = JSON.parse(raw)
                if (parsed?.id && parsed?.role) {
                    setCurrentUser(parsed)
                }
            } catch (_) {
                setCurrentUser(null)
            }
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
        return fetch(url, { ...options, headers })
    }

    const loadProjects = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await apiFetch('/api/projects')
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data?.error || '加载失败')
            }
            setProjects(data.projects || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : '加载失败')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProjects()
    }, [currentUser])

    useEffect(() => {
        const loadRequests = async () => {
            if (!currentUser) return
            const response = await apiFetch('/api/join-requests')
            const data = await response.json().catch(() => ({}))
            if (!response.ok) return
            if (currentUser.role === 'student') {
                setStudentRequests(data.requests || [])
            } else {
                setTeacherRequests(data.requests || [])
            }
        }
        loadRequests()
    }, [currentUser])

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const query = searchQuery.toLowerCase()
            const matchesSearch =
                project.title.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query) ||
                project.tags.some((tag) => tag.toLowerCase().includes(query))

            const matchesLevel = filterLevel === '全部' || project.level === filterLevel

            return matchesSearch && matchesLevel
        })
    }, [projects, searchQuery, filterLevel])

    const handleApply = async (projectId: number) => {
        if (!currentUser) {
            setActionHint('请先登录后再申请加入')
            return
        }
        const response = await apiFetch(`/api/projects/${projectId}/apply`, { method: 'POST' })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
            setActionHint(data?.error || '申请失败')
            return
        }
        setActionHint('申请已提交，等待导师审核')
        await loadProjects()
        if (currentUser.role === 'student') {
            const reqResponse = await apiFetch('/api/join-requests')
            const reqData = await reqResponse.json().catch(() => ({}))
            if (reqResponse.ok) setStudentRequests(reqData.requests || [])
        }
    }

    const handleLeave = async (projectId: number) => {
        const response = await apiFetch(`/api/projects/${projectId}/leave`, { method: 'POST' })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
            setActionHint(data?.error || '退出失败')
            return
        }
        setActionHint('已退出科研组')
        await loadProjects()
    }

    const handleKick = async (projectId: number, studentId: string) => {
        const response = await apiFetch(`/api/projects/${projectId}/kick`, {
            method: 'POST',
            body: JSON.stringify({ studentId })
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
            setActionHint(data?.error || '踢出失败')
            return
        }
        setActionHint('已移除该学生')
        await loadProjects()
    }

    const handleApprove = async (projectId: number, studentId: string) => {
        const response = await apiFetch(`/api/projects/${projectId}/approve`, {
            method: 'POST',
            body: JSON.stringify({ studentId })
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
            setActionHint(data?.error || '审批失败')
            return
        }
        setActionHint('已通过申请')
        await loadProjects()
        if (currentUser?.role === 'teacher') {
            const reqResponse = await apiFetch('/api/join-requests')
            const reqData = await reqResponse.json().catch(() => ({}))
            if (reqResponse.ok) setTeacherRequests(reqData.requests || [])
        }
    }

    const handleReject = async (projectId: number, studentId: string) => {
        const response = await apiFetch(`/api/projects/${projectId}/reject`, {
            method: 'POST',
            body: JSON.stringify({ studentId })
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
            setActionHint(data?.error || '拒绝失败')
            return
        }
        setActionHint('已拒绝申请')
        if (currentUser?.role === 'teacher') {
            const reqResponse = await apiFetch('/api/join-requests')
            const reqData = await reqResponse.json().catch(() => ({}))
            if (reqResponse.ok) setTeacherRequests(reqData.requests || [])
        }
    }

    const handleRatingSubmit = async (projectId: number, rateeId: string) => {
        const key = buildRatingKey(projectId, rateeId)
        const draft = ratingDrafts[key]
        if (!draft) return

        const response = await apiFetch('/api/ratings', {
            method: 'POST',
            body: JSON.stringify({
                projectId,
                rateeId,
                score: draft.score,
                comment: draft.comment
            })
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
            setActionHint(data?.error || '评分失败')
            return
        }
        setActionHint('评分已提交')
        setActiveRating(null)
        await loadProjects()
    }

    const updateRatingDraft = (projectId: number, rateeId: string, next: { score?: number; comment?: string }) => {
        const key = buildRatingKey(projectId, rateeId)
        setRatingDrafts((prev) => {
            const current = prev[key] || { score: 5, comment: '' }
            return {
                ...prev,
                [key]: {
                    score: next.score ?? current.score,
                    comment: next.comment ?? current.comment
                }
            }
        })
    }

    return (
        <main>
            <Navbar />

            <section className="section container" style={{ paddingTop: '140px' }}>
                <div className="page-header">
                    <h2 className="page-title">探索 <span className="gradient-text">科研课题</span></h2>
                    <p className="page-lead">聚焦上理工优势学科方向，快速发现可参与的研究机会与课题组资源。</p>

                    <div className="filter-row" style={{ marginTop: '1.8rem' }}>
                        <div className="search-bar">
                            <Search size={22} color="#9aa4b2" />
                            <input
                                type="text"
                                placeholder="搜索项目名称、领域或关键词..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input"
                            />
                        </div>

                        <div className="pill-group">
                            {levels.map(level => (
                                <button
                                    key={level}
                                    onClick={() => setFilterLevel(level)}
                                    className={`pill ${filterLevel === level ? 'active' : ''}`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {actionHint && (
                    <div className="glass action-hint">
                        <MessageSquare size={16} /> {actionHint}
                    </div>
                )}

                {loading && (
                    <div className="glass empty-state">正在加载项目...</div>
                )}

                {!loading && error && (
                    <div className="glass empty-state">{error}</div>
                )}

                {!loading && !error && (
                    <div className="grid grid-3">
                        {filteredProjects.map(project => {
                            const isTeacherAdmin = currentUser?.role === 'teacher' && currentUser.id === project.teacher.id
                            const isMember = currentUser?.role === 'student' && project.members.some(member => member.id === currentUser.id)
                            const studentRequest = currentUser?.role === 'student'
                                ? studentRequests.find(req => req.project_id === project.id)
                                : null
                            const pendingRequests = teacherRequests.filter(req => req.project_id === project.id)

                            return (
                                <div key={project.id} className="card glass">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <span className="badge primary">{project.level}</span>
                                        <span className={`status ${project.status === '招募中' ? 'open' : 'closed'}`}>
                                            ● {project.status}
                                        </span>
                                    </div>

                                    <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem' }}>{project.title}</h3>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '1.2rem', height: '4rem', overflow: 'hidden', lineBreak: 'anywhere' }}>
                                        {project.description}
                                    </p>

                                    <div className="tag-list" style={{ marginBottom: '1.4rem' }}>
                                        {project.tags.map(tag => (
                                            <span key={tag} className="tag-item">
                                                <Tag size={12} /> {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="project-metrics">
                                        <div><Users size={14} /> {project.members.length}/{project.capacity} 名额</div>
                                        <div><Crown size={14} /> 截止 {project.deadline || '未设置'}</div>
                                        {isTeacherAdmin && project.pendingCount > 0 && (
                                            <div className="pending-chip">待审核 {project.pendingCount}</div>
                                        )}
                                    </div>

                                    <div className="card-footer" style={{ alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <User size={14} /> {project.teacher.name}
                                                {isTeacherAdmin && <span className="badge accent"><Crown size={12} /> 管理员</span>}
                                            </span>
                                            <span className="muted" style={{ fontSize: '0.78rem' }}>{project.department} · {project.campus}</span>
                                            {project.teacher.rating && (
                                                <span className="rating-chip">
                                                    <Star size={14} /> {project.teacher.rating.avg.toFixed(1)} ({project.teacher.rating.count})
                                                </span>
                                            )}
                                        </div>
                                        {project.status === '招募中' && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {currentUser?.role === 'student' && !isMember && (
                                                    <button
                                                        className="btn btn-primary"
                                                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                                        onClick={() => handleApply(project.id)}
                                                        disabled={studentRequest?.status === 'pending'}
                                                    >
                                                        <UserPlus size={14} /> {studentRequest?.status === 'pending' ? '申请中' : '申请加入'}
                                                    </button>
                                                )}
                                                {currentUser?.role === 'student' && isMember && (
                                                    <button className="btn btn-glass" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={() => handleLeave(project.id)}>
                                                        <LogOut size={14} /> 自己退出
                                                    </button>
                                                )}
                                                {(!currentUser || currentUser.role === 'teacher') && project.teacher.email && (
                                                    <a href={`mailto:${project.teacher.email}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                                                        <Mail size={14} /> 联系导师
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="group-section">
                                        <div className="group-title">
                                            <Users size={16} /> 科研组学生列表 ({project.members.length})
                                        </div>
                                        {project.members.length === 0 ? (
                                            <div className="muted" style={{ fontSize: '0.8rem' }}>暂无成员，欢迎申请加入。</div>
                                        ) : (
                                            <div className="member-list">
                                                {project.members.map(member => {
                                                    const ratingKey = buildRatingKey(project.id, member.id)
                                                    const ratingDraft = ratingDrafts[ratingKey] || { score: 5, comment: '' }

                                                    return (
                                                        <div key={member.id} className="member-card">
                                                            <div className="member-info">
                                                                <div className="member-name">{member.name}</div>
                                                                <div className="member-meta">{member.major || '未填专业'} · {member.grade || '未填年级'} · {member.campus || '校区未知'}</div>
                                                                {member.rating && (
                                                                    <div className="rating-chip">
                                                                        <Star size={14} /> {member.rating.avg.toFixed(1)} ({member.rating.count})
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="member-actions">
                                                                {isTeacherAdmin && (
                                                                    <button className="btn btn-glass" onClick={() => handleKick(project.id, member.id)}>
                                                                        <UserMinus size={14} /> 踢出
                                                                    </button>
                                                                )}
                                                                {currentUser?.role === 'teacher' && isTeacherAdmin && (
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        onClick={() => setActiveRating(activeRating === ratingKey ? null : ratingKey)}
                                                                    >
                                                                        <Star size={14} /> 评分
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {activeRating === ratingKey && currentUser?.role === 'teacher' && isTeacherAdmin && (
                                                                <div className="rating-form">
                                                                    <label>
                                                                        评分
                                                                        <select
                                                                            value={ratingDraft.score}
                                                                            onChange={(event) => updateRatingDraft(project.id, member.id, { score: Number(event.target.value) })}
                                                                        >
                                                                            {[5, 4, 3, 2, 1].map((score) => (
                                                                                <option key={score} value={score}>{score} 分</option>
                                                                            ))}
                                                                        </select>
                                                                    </label>
                                                                    <label>
                                                                        评语
                                                                        <textarea
                                                                            rows={2}
                                                                            value={ratingDraft.comment}
                                                                            onChange={(event) => updateRatingDraft(project.id, member.id, { comment: event.target.value })}
                                                                            placeholder="简要评价该学生表现"
                                                                        />
                                                                    </label>
                                                                    <div className="rating-actions">
                                                                        <button className="btn btn-primary" onClick={() => handleRatingSubmit(project.id, member.id)}>提交评分</button>
                                                                        <button className="btn btn-glass" onClick={() => setActiveRating(null)}>取消</button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {isTeacherAdmin && pendingRequests.length > 0 && (
                                        <div className="group-section">
                                            <div className="group-title">
                                                <UserPlus size={16} /> 待审核申请
                                            </div>
                                            <div className="member-list">
                                                {pendingRequests.map(request => (
                                                    <div key={`${request.project_id}-${request.student_id}`} className="member-card">
                                                        <div className="member-info">
                                                            <div className="member-name">{request.student_name}</div>
                                                            <div className="member-meta">
                                                                {request.student_major || '未填专业'} · {request.student_grade || '未填年级'}
                                                            </div>
                                                        </div>
                                                        <div className="member-actions">
                                                            <button className="btn btn-primary" onClick={() => handleApprove(project.id, request.student_id)}>通过</button>
                                                            <button className="btn btn-glass" onClick={() => handleReject(project.id, request.student_id)}>拒绝</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {currentUser?.role === 'student' && project.members.some(member => member.id === currentUser.id) && (
                                        <div className="rating-student">
                                            <div className="group-title">
                                                <Star size={16} /> 对导师评分
                                            </div>
                                            <div className="rating-form">
                                                <label>
                                                    评分
                                                    <select
                                                        value={(ratingDrafts[buildRatingKey(project.id, project.teacher.id)] || { score: 5 }).score}
                                                        onChange={(event) => updateRatingDraft(project.id, project.teacher.id, { score: Number(event.target.value) })}
                                                    >
                                                        {[5, 4, 3, 2, 1].map((score) => (
                                                            <option key={score} value={score}>{score} 分</option>
                                                        ))}
                                                    </select>
                                                </label>
                                                <label>
                                                    评语
                                                    <textarea
                                                        rows={2}
                                                        value={(ratingDrafts[buildRatingKey(project.id, project.teacher.id)] || { comment: '' }).comment}
                                                        onChange={(event) => updateRatingDraft(project.id, project.teacher.id, { comment: event.target.value })}
                                                        placeholder="感谢导师的支持，留下你的建议"
                                                    />
                                                </label>
                                                <div className="rating-actions">
                                                    <button className="btn btn-primary" onClick={() => handleRatingSubmit(project.id, project.teacher.id)}>提交评价</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>
        </main>
    )
}
