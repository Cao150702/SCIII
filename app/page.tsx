import Navbar from '@/components/Navbar'
import { ArrowRight, Search, Users, Lightbulb } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
    return (
        <main>
            <Navbar />

            <section className="section container" style={{ paddingTop: '160px' }}>
                <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-flex',
                        padding: '0.5rem 1rem',
                        background: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '100px',
                        color: 'var(--primary)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        marginBottom: '2rem'
                    }}>
                        🚀 开启您的科研之旅
                    </div>
                    <h1>
                        连接 <span className="gradient-text">智慧</span> 与 <span className="gradient-text">机遇</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: '3rem' }}>
                        在这里，老师发布前沿科研课题，学生展示卓越技能。我们打破信息差，让学术合作更高效、更透明。
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                        <Link href="/projects" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                            寻找科研课题 <ArrowRight size={20} />
                        </Link>
                        <Link href="/students" className="btn btn-glass" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                            发现优秀人才
                        </Link>
                    </div>
                </div>
            </section>

            <section className="section container">
                <div className="grid grid-3">
                    <div className="card glass">
                        <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>
                            <Search size={40} />
                        </div>
                        <h3>课题搜索引擎</h3>
                        <p>通过关键词锁定感兴趣的项目，查看详细要求和联系方式。</p>
                    </div>

                    <div className="card glass">
                        <div style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }}>
                            <Users size={40} />
                        </div>
                        <h3>人才画像展示</h3>
                        <p>学生全方位展示技能与项目经历，老师快速评估匹配度。</p>
                    </div>

                    <div className="card glass">
                        <div style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>
                            <Lightbulb size={40} />
                        </div>
                        <h3>直接沟通渠道</h3>
                        <p>无需繁琐流程，直接联系项目负责人，开启深度学术交流。</p>
                    </div>
                </div>
            </section>

            <footer style={{ padding: '4rem 0', textAlign: 'center', borderTop: '1px solid var(--glass-border)' }}>
                <p>© 2026 ResearchBridge. 让科研更简单。</p>
            </footer>
        </main>
    )
}
