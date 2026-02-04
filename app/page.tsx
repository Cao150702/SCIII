import Navbar from '@/components/Navbar'
import { ArrowRight, Search, Users, Lightbulb } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
    return (
        <main className="page">
            <Navbar />

            <section className="section container hero">
                <div className="hero-inner">
                    <div className="hero-badge animate-in">科研对接 · 学术协同 · 校企共创</div>
                    <h1 className="hero-title animate-in animate-delay-1">
                        连接 <span className="gradient-text">智慧</span> 与 <span className="gradient-text">机遇</span>
                    </h1>
                    <p className="hero-subtitle animate-in animate-delay-2">
                        上海理工大学专属科研协同平台，帮助教师快速发布课题，学生展示能力与成果，推动跨学科合作高效落地。
                    </p>

                    <div className="hero-actions animate-in animate-delay-3">
                        <Link href="/projects" className="btn btn-primary">
                            寻找科研课题 <ArrowRight size={20} />
                        </Link>
                        <Link href="/students" className="btn btn-glass">
                            发现优秀人才
                        </Link>
                    </div>

                    <div className="hero-highlight">
                        <div className="highlight-card glass">
                            <div className="tag">本周新增</div>
                            <h4>24 个校内课题</h4>
                            <p>涵盖智能制造、光电与生物医学工程。</p>
                        </div>
                        <div className="highlight-card glass">
                            <div className="tag">精准匹配</div>
                            <h4>人才画像升级</h4>
                            <p>结合项目经历与技能图谱，快速定位合作者。</p>
                        </div>
                        <div className="highlight-card glass">
                            <div className="tag">高效协同</div>
                            <h4>一键对接</h4>
                            <p>集成校内邮箱与实验室通道，沟通直达。</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section container">
                <h2 className="feature-title">让科研合作更清晰、更可靠</h2>
                <p className="feature-lead">
                    从课题发布到团队招募，建立透明、可信、可追踪的协作体验，让每一次研究落地更稳、更快。
                </p>
                <div className="grid grid-3">
                    <div className="card glass">
                        <div style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>
                            <Search size={40} />
                        </div>
                        <h3>课题搜索引擎</h3>
                        <p>按方向、学院与关键词精准筛选，配套负责人信息与进度。</p>
                    </div>

                    <div className="card glass">
                        <div style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }}>
                            <Users size={40} />
                        </div>
                        <h3>人才画像展示</h3>
                        <p>学生能力、科研经历、竞赛成果一页可见，匹配更快。</p>
                    </div>

                    <div className="card glass">
                        <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>
                            <Lightbulb size={40} />
                        </div>
                        <h3>直接沟通渠道</h3>
                        <p>集成校内统一登录与实验室联络方式，沟通更高效。</p>
                    </div>
                </div>
            </section>

            <footer style={{ padding: '4rem 0', textAlign: 'center', borderTop: '1px solid var(--glass-border)' }}>
                <p>© 2026 上海理工大学科研协同平台. 让科研更简单。</p>
            </footer>
        </main>
    )
}
