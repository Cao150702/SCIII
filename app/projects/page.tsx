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
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>探索 <span className="gradient-text">科研课题</span></h2>

                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0 1.5rem', flex: 1, minWidth: '300px' }}>
                            <Search size={24} color="#94a3b8" />
                            <input
                                type="text"
                                placeholder="搜索项目名称、领域或关键词..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '1.2rem 1rem',
                                    color: 'white',
                                    width: '100%',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {levels.map(level => (
                                <button
                                    key={level}
                                    onClick={() => setFilterLevel(level)}
                                    className={`btn ${filterLevel === level ? 'btn-primary' : 'btn-glass'}`}
                                    style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
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
                                <span style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>
                                    {project.level}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: project.status === '招募中' ? '#10b981' : '#ef4444' }}>
                                    ● {project.status}
                                </span>
                            </div>

                            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem' }}>{project.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.2rem', height: '4rem', overflow: 'hidden', lineBreak: 'anywhere' }}>
                                {project.description}
                            </p>

                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                {project.tags.map(tag => (
                                    <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', color: '#cbd5e1' }}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{project.professor}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{project.department} | {project.campus}</span>
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
