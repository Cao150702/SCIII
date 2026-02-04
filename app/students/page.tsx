'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Search, Code, Star, Mail, Briefcase, GraduationCap, Award } from 'lucide-react'

// Mock data for students with academic-specific fields
const INITIAL_STUDENTS = [
    {
        id: 1,
        name: '陈同学',
        major: '计算机科学与技术',
        grade: '大三',
        gpa: '3.9/4.0',
        cet: 'CET-6 (610)',
        skills: ['Python', 'PyTorch', '计算机视觉'],
        experience: '在顶会发表过一篇关于图像增强的论文，有较强的工程能力。',
        projects: ['智能交通监控系统', '开源医学影像库贡献者'],
        contact: 'chen@student.edu.cn',
        campus: '本部校区'
    },
    {
        id: 2,
        name: '林同学',
        major: '软件工程',
        grade: '大四 (已保研)',
        gpa: '3.8/4.0',
        cet: 'CET-6 (580)',
        skills: ['Rust', '分布式系统', 'Golang'],
        experience: '某互联网大厂实习经历，参与过高并发路由系统的重构。',
        projects: ['高性能KV存储引擎', '个性化推荐系统'],
        contact: 'lin@student.edu.cn',
        campus: '沙河校区'
    },
    {
        id: 3,
        name: '赵同学',
        major: '电子工程',
        grade: '大二',
        gpa: '4.0/4.0',
        cet: 'CET-4 (650)',
        skills: ['FPGA', '嵌入式', 'C++'],
        experience: '全国大学生电子设计竞赛一等奖获得者，熟悉硬件底层开发。',
        projects: ['多路信号采集处理系统', '自平衡小车'],
        contact: 'zhao@student.edu.cn',
        campus: '本部校区'
    }
]

export default function StudentsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterGrade, setFilterGrade] = useState('全部')

    const filteredStudents = INITIAL_STUDENTS.filter(s => {
        const matchesSearch = s.name.includes(searchQuery) ||
            s.major.includes(searchQuery) ||
            s.skills.some(sk => sk.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesGrade = filterGrade === '全部' || s.grade.includes(filterGrade);

        return matchesSearch && matchesGrade;
    })

    const grades = ['全部', '大一', '大二', '大三', '大四'];

    return (
        <main>
            <Navbar />

            <section className="section container" style={{ paddingTop: '140px' }}>
                <div className="page-header">
                    <h2 className="page-title">发现 <span className="gradient-text">优秀人才</span></h2>
                    <p className="page-lead">聚合上理工优秀本科与研究生画像，快速定位科研合作伙伴。</p>

                    <div className="filter-row" style={{ marginTop: '1.8rem' }}>
                        <div className="search-bar">
                            <Search size={22} color="#9aa4b2" />
                            <input
                                type="text"
                                placeholder="搜索学生姓名、专业或技能关键词..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input"
                            />
                        </div>

                        <div className="pill-group">
                            {grades.map(grade => (
                                <button
                                    key={grade}
                                    onClick={() => setFilterGrade(grade)}
                                    className={`pill ${filterGrade === grade ? 'active' : ''}`}
                                >
                                    {grade}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-3">
                    {filteredStudents.map(student => (
                        <div key={student.id} className="card glass">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{student.name}</h3>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                                        <GraduationCap size={14} /> {student.major} · {student.grade}
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary)', padding: '0.5rem', borderRadius: '8px' }}>
                                    <Star size={18} fill="currentColor" />
                                </div>
                            </div>

                            <div className="metric-grid">
                                <div className="metric-card">
                                    <div className="metric-label">GPA</div>
                                    <div className="metric-value">{student.gpa}</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-label">英语水平</div>
                                    <div className="metric-value" style={{ color: 'var(--primary)' }}>{student.cet}</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.2rem' }}>
                                <p style={{ fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.6rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                    <Award size={14} color="var(--primary)" /> 个人亮点与经历
                                </p>
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5', height: '3.6rem', overflow: 'hidden' }}>{student.experience}</p>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div className="tag-list">
                                    {student.skills.map(skill => (
                                        <span key={skill} className="tag-item">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="card-footer" style={{ justifyContent: 'center' }}>
                                <a href={`mailto:${student.contact}`} className="btn btn-glass" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem' }}>
                                    <Mail size={16} /> 查看简历并预约面试
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
