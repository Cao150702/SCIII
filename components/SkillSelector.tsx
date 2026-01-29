'use client'

import { useState } from 'react'
import { Check, Plus, X, Tag } from 'lucide-react'

// 预设的高校主流技能库
const PRESET_SKILLS = {
    "人工智能/算法": ["Python", "PyTorch", "TensorFlow", "计算机视觉", "自然语言处理", "强化学习"],
    "软件/工程": ["Java", "C++", "Rust", "Go", "前端开发", "后端构建", "分布式系统"],
    "硬件/电子": ["FPGA", "嵌入式系统", "电路设计", "单片机", "信号处理"],
    "材料/化学": ["纳米材料", "表征分析", "化学合成", "柔性电子"],
    "其他学术": ["数学建模", "学术英语", "科技写作", "数据挖掘"]
}

interface SkillSelectorProps {
    selectedSkills: string[]
    onChange: (skills: string[]) => void
}

export default function SkillSelector({ selectedSkills, onChange }: SkillSelectorProps) {
    const [activeCategory, setActiveCategory] = useState<string>("人工智能/算法")

    const toggleSkill = (skill: string) => {
        if (selectedSkills.includes(skill)) {
            onChange(selectedSkills.filter(s => s !== skill))
        } else {
            if (selectedSkills.length < 8) {
                onChange([...selectedSkills, skill])
            }
        }
    }

    return (
        <div className="skill-selector">
            {/* 已选标签显示 */}
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {selectedSkills.length === 0 && <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>请从下方选择技能标签 (最多8个)</span>}
                {selectedSkills.map(skill => (
                    <span key={skill} className="glass" style={{
                        background: 'rgba(99, 102, 241, 0.2)',
                        color: 'var(--primary)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        border: '1px solid var(--primary)'
                    }}>
                        {skill}
                        <X size={14} style={{ cursor: 'pointer' }} onClick={() => toggleSkill(skill)} />
                    </span>
                ))}
            </div>

            <div className="glass" style={{ padding: '1.5rem', border: '1px solid var(--glass-border)' }}>
                {/* 分类切换 */}
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {Object.keys(PRESET_SKILLS).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: activeCategory === cat ? 'var(--primary)' : '#94a3b8',
                                fontWeight: activeCategory === cat ? 'bold' : 'normal',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                fontSize: '0.9rem'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* 预设技能展示 */}
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                    {PRESET_SKILLS[activeCategory as keyof typeof PRESET_SKILLS].map(skill => (
                        <button
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            style={{
                                background: selectedSkills.includes(skill) ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                color: selectedSkills.includes(skill) ? 'white' : '#cbd5e1',
                                border: '1px solid var(--glass-border)',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                            }}
                        >
                            {selectedSkills.includes(skill) ? <Check size={14} /> : <Plus size={14} />}
                            {skill}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
