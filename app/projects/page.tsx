'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Search, Mail, Tag, User } from 'lucide-react'

// Mock data for projects with university-specific fields
const INITIAL_PROJECTS = [
    {
        id: 1,
        title: '基于大模型的医学影像分析',
        professor: '张教授',
        department: '计算机学院',
        description: '利用最新的大语言模型与多模态模型对医学影像进行解读和辅助诊断。',
        tags: ['AI', '医疗', '深度学习'],
        contact: 'zhang@university.edu.cn',
        level: '导师纵向课题',
        status: '招募中',
        campus: '本部校区'
    },
    {
        id: 2,
        title: '高性能区块链共识算法研究',
        professor: '李老师',
        department: '网络空间安全学院',
        description: '研究在超大规模节点下的低延迟共识机制，并解决性能瓶颈。',
        tags: ['区块链', '分布式系统'],
        contact: 'li@university.edu.cn',
        level: '国创项目',
        status: '招募中',
        campus: '沙河校区'
    },
    {
        id: 3,
        title: '柔性电子材料的稳定性优化',
        professor: '王博士',
        department: '材料学院',
        description: '通过分子工程手段提高柔性屏幕材料在极端环境下的使用寿命。',
        tags: ['材料科学', '物理'],
        contact: 'wang@university.edu.cn',
        level: '校企横向项目',
        status: '名额已满',
        campus: '本部校区'
    }
]

export default function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterLevel, setFilterLevel] = useState('全部')

    const filteredProjects = INITIAL_PROJECTS.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesLevel = filterLevel === '全部' || p.level === filterLevel;

        return matchesSearch && matchesLevel;
    })

    const levels = ['全部', '国创项目', '省创项目', '导师纵向课题', '校企横向项目'];

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

                <div className="grid grid-3">
                    {filteredProjects.map(project => (
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
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <div className="card-footer">
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{project.professor}</span>
                                    <span className="muted" style={{ fontSize: '0.78rem' }}>{project.department} · {project.campus}</span>
                                </div>
                                {project.status === '招募中' && (
                                    <a href={`mailto:${project.contact}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                                        <Mail size={14} /> 联系导师
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
