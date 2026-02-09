'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { Bell, CheckCircle2, ClipboardList, GraduationCap, UserCheck } from 'lucide-react'

type CurrentUser = {
  id: string
  name: string
  role: 'student' | 'teacher'
}

type Notification = {
  id: number
  title: string
  body: string
  is_read: number
  created_at: string
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

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)
  const [studentRequests, setStudentRequests] = useState<StudentJoinRequest[]>([])
  const [teacherRequests, setTeacherRequests] = useState<TeacherJoinRequest[]>([])
  const [hint, setHint] = useState<string | null>(null)
  const [requestFilter, setRequestFilter] = useState('')
  const [requestProject, setRequestProject] = useState('全部项目')
  const [selectedRequests, setSelectedRequests] = useState<Record<string, boolean>>({})
  const [pendingAction, setPendingAction] = useState(false)

  const getStatusLabel = (status: StudentJoinRequest['status']) => {
    if (status === 'approved') return '已通过'
    if (status === 'rejected') return '已拒绝'
    return '待审核'
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem('user')
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      if (parsed?.id && parsed?.role) {
        setCurrentUser(parsed)
      }
    } catch (_) {
      setCurrentUser(null)
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

  const loadNotifications = async () => {
    if (!currentUser) return
    const response = await apiFetch('/api/notifications')
    const data = await response.json().catch(() => ({}))
    if (!response.ok) return
    setNotifications(data.notifications || [])
    setUnread(data.unread || 0)
  }

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

  const filteredTeacherRequests = teacherRequests.filter((request) => {
    const matchQuery = request.student_name.includes(requestFilter) || request.project_title.includes(requestFilter)
    const matchProject = requestProject === '全部项目' || request.project_title === requestProject
    return matchQuery && matchProject
  })

  const projectOptions = Array.from(new Set(teacherRequests.map((req) => req.project_title)))

  const toggleSelect = (key: string) => {
    setSelectedRequests((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const clearSelection = () => setSelectedRequests({})

  const bulkHandle = async (action: 'approve' | 'reject') => {
    if (pendingAction) return
    const targets = filteredTeacherRequests.filter((req) => selectedRequests[`${req.project_id}-${req.student_id}`])
    if (targets.length === 0) {
      setHint('请先选择要处理的申请')
      return
    }
    setPendingAction(true)
    await Promise.all(
      targets.map((req) =>
        apiFetch(`/api/projects/${req.project_id}/${action}`, {
          method: 'POST',
          body: JSON.stringify({ studentId: req.student_id })
        })
      )
    )
    setHint(action === 'approve' ? '已批量通过' : '已批量拒绝')
    await loadRequests()
    clearSelection()
    setPendingAction(false)
  }

  const markAllRead = async () => {
    const response = await apiFetch('/api/notifications', {
      method: 'POST',
      body: JSON.stringify({})
    })
    if (response.ok) {
      setHint('已标记为已读')
      await loadNotifications()
    }
  }

  useEffect(() => {
    loadNotifications()
    loadRequests()
  }, [currentUser])

  return (
    <main>
      <Navbar />

      <section className="section container" style={{ paddingTop: '140px' }}>
        <div className="page-header">
          <h2 className="page-title">我的 <span className="gradient-text">工作台</span></h2>
          <p className="page-lead">查看申请进度、待办审批与系统通知。</p>
        </div>

        {hint && <div className="glass action-hint"><CheckCircle2 size={16} /> {hint}</div>}

        <div className="grid" style={{ gap: '2rem' }}>
          <div className="glass form-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Bell size={18} /> 通知中心
                {unread > 0 && <span className="badge accent">{unread} 未读</span>}
              </h3>
              <button className="btn btn-glass" onClick={markAllRead}>全部标记已读</button>
            </div>
            <div className="member-list">
              {notifications.length === 0 && <div className="muted">暂无通知</div>}
              {notifications.map(note => (
                <div key={note.id} className="member-card">
                  <div className="member-info">
                    <div className="member-name">{note.title}</div>
                    <div className="member-meta">{note.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {currentUser?.role === 'student' && (
            <div className="glass form-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <GraduationCap size={18} /> 我的申请
              </h3>
              <div className="member-list">
                {studentRequests.length === 0 && <div className="muted">暂无申请记录</div>}
                {studentRequests.map(req => (
                  <div key={req.project_id} className="member-card">
                    <div className="member-info">
                      <div className="member-name">{req.project_title}</div>
                      <div className="member-meta">导师：{req.teacher_name}</div>
                      <div className="rating-chip">当前状态：{getStatusLabel(req.status)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentUser?.role === 'teacher' && (
            <div className="glass form-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <UserCheck size={18} /> 待审批学生
              </h3>
              <div className="dashboard-filters">
                <input
                  className="form-input"
                  placeholder="搜索学生或项目..."
                  value={requestFilter}
                  onChange={(event) => setRequestFilter(event.target.value)}
                />
                <select
                  className="form-input"
                  value={requestProject}
                  onChange={(event) => setRequestProject(event.target.value)}
                >
                  <option>全部项目</option>
                  {projectOptions.map((title) => (
                    <option key={title}>{title}</option>
                  ))}
                </select>
              </div>
              <div className="member-actions" style={{ marginBottom: '1rem' }}>
                <button className="btn btn-primary" onClick={() => bulkHandle('approve')} disabled={pendingAction}>批量通过</button>
                <button className="btn btn-glass" onClick={() => bulkHandle('reject')} disabled={pendingAction}>批量拒绝</button>
                <button className="btn btn-glass" onClick={clearSelection}>清空选择</button>
              </div>
              <div className="member-list">
                {filteredTeacherRequests.length === 0 && <div className="muted">暂无待审批申请</div>}
                {filteredTeacherRequests.map(req => {
                  const key = `${req.project_id}-${req.student_id}`
                  return (
                  <div key={key} className="member-card">
                    <div className="member-info">
                      <div className="member-name">{req.student_name}</div>
                      <div className="member-meta">{req.student_major || '未填专业'} · {req.student_grade || '未填年级'}</div>
                      <div className="rating-chip">项目：{req.project_title}</div>
                    </div>
                    <div className="member-actions">
                      <label className="checkbox-row">
                        <input type="checkbox" checked={Boolean(selectedRequests[key])} onChange={() => toggleSelect(key)} />
                        选择
                      </label>
                    </div>
                    <div className="member-actions">
                      <a className="btn btn-primary" href="/projects">去审批</a>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}

          <div className="glass form-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <ClipboardList size={18} /> 快捷入口
            </h3>
            <div className="member-actions">
              <a className="btn btn-primary" href="/projects">项目与科研组</a>
              <a className="btn btn-glass" href="/profile">个人资料</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
