'use client';

import { useState } from 'react';
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, CircleHelp, GraduationCap, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurriculumWorkspace } from '@/components/curriculum-workspace';

const majors = [
  { id: '视觉传达设计', short: '视传', credits: 175, library: 122, required: 89, decision: '大三选择方向', term: '第 5 学期前' },
  { id: '数字媒体艺术', short: '数媒', credits: 175, library: 117, required: 89, decision: '确定专业重心', term: '第 3 学期末' },
  { id: '包装设计', short: '包装', credits: 175, library: 122, required: 89, decision: '确定专业重心', term: '第 3 学期末' },
  { id: '智能交互设计', short: '交互', credits: 180, library: 96, required: 89, decision: '选择课程群', term: '第 4 学期末' },
];

const semesters = [
  { n: 1, title: '建立共同基础', note: '专业导论、形式基础', action: '选定学科通识课' },
  { n: 2, title: '训练视觉语言', note: '图形、色彩、空间与材料' },
  { n: 3, title: '进入专业核心', note: '文字、动态、设计研究' },
  { n: 4, title: '第一次分流', note: '方向课程开始出现', action: '了解两个方向' },
  { n: 5, title: '建立方向能力', note: '品牌策略或视觉文化', action: '确认方向与选修组合' },
  { n: 6, title: '扩展与交叉', note: '跨专业课程、工作坊' },
  { n: 7, title: '综合项目', note: '项目实践、专业拓展' },
  { n: 8, title: '完成毕业成果', note: '毕业设计与展示' },
];

export default function Home() {
  const [majorName, setMajorName] = useState('视觉传达设计');
  const major = majors.find((item) => item.id === majorName) ?? majors[0];

  return (
    <main className="min-h-screen">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回首页">
          <span className="brand-mark"><GraduationCap size={19} /></span>
          <span><strong>视觉学院</strong><small>2026 培养方案</small></span>
        </a>
        <nav aria-label="主导航">
          <a className="active" href="#roadmap">四年路线</a>
          <a href="#credits">学分总账</a>
          <a href="#courses">课程查询</a>
          <a href="#faq">常见问题</a>
        </nav>
        <Button variant="outline" className="search-button"><Search />查课程</Button>
      </header>

      <div id="top" className="page-shell">
        <section className="intro">
          <div>
            <p className="eyebrow">山东工艺美术学院 · 视觉学院</p>
            <h1>看懂你的四年，<br />在该选择时做好准备。</h1>
            <p className="intro-copy">这里不替代选课系统，只帮你理解培养方案：什么时候做决定、要修多少学分、每门课通往哪里。</p>
          </div>
          <div className="major-picker" role="group" aria-label="选择专业">
            <span>我就读的专业</span>
            <div>
              {majors.map((item) => (
                <button key={item.id} className={majorName === item.id ? 'selected' : ''} onClick={() => setMajorName(item.id)}>{item.short}</button>
              ))}
            </div>
          </div>
        </section>

        <section className="decision-card" aria-labelledby="decision-title">
          <div className="decision-date"><CalendarDays /><span>下一次重要决定</span><strong>{major.term}</strong></div>
          <div className="decision-main">
            <p>{major.id}</p>
            <h2 id="decision-title">{major.decision}</h2>
            <span>提前了解选择规则、课程组合和对后续学习的影响。</span>
          </div>
          <Button className="decision-button">查看怎么选<ArrowRight /></Button>
        </section>

        <section id="roadmap" className="section-block">
          <div className="section-heading">
            <div><span className="section-index">01</span><h2>四年路线</h2></div>
            <p>先看节奏，再看课程。标记处是你需要主动做决定的时间。</p>
          </div>
          <div className="roadmap" aria-label={`${major.id}八学期路线`}>
            {semesters.map((semester, index) => (
              <article className={`semester ${semester.action ? 'has-action' : ''}`} key={semester.n}>
                <div className="semester-top"><span>S{semester.n}</span><small>{index < 2 ? '打基础' : index < 5 ? '建方向' : '出成果'}</small></div>
                <h3>{semester.title}</h3>
                <p>{semester.note}</p>
                {semester.action && <div className="action-note"><span>需要决定</span>{semester.action}</div>}
              </article>
            ))}
          </div>
        </section>

        <section id="credits" className="section-block credit-section">
          <div className="section-heading">
            <div><span className="section-index">02</span><h2>学分总账</h2></div>
            <p>“可选的课”不等于“全部都要修”。两个数字必须分开看。</p>
          </div>
          <div className="credit-grid">
            <article className="credit-ledger">
              <div><span>毕业总学分</span><strong>{major.credits}</strong><small>包含通识、专业与实践环节</small></div>
              <div className="ledger-compare">
                <span><small>专业课程库</small><strong>{major.library}</strong><em>学分</em></span>
                <span className="operator">≠</span>
                <span className="highlight"><small>实际应修</small><strong>{major.required}</strong><em>学分</em></span>
              </div>
            </article>
            <article className="rule-card">
              <BookOpen />
              <div><span>限选规则</span><h3>{major.id === '视觉传达设计' ? '从 68 学分课程库中修满 35 学分' : major.id === '智能交互设计' ? '20 学分共同课程，加 10 学分方向课程' : '按两个课程组组合修读'}</h3><p>课程库表示你“可以选什么”，实际应修表示毕业审核“要求你完成什么”。</p></div>
            </article>
          </div>
        </section>

        <section className="quick-links" aria-label="其他入口">
          <a href="#courses"><BookOpen /><span><strong>查一门课程</strong><small>按学期、性质与方向筛选</small></span><ArrowRight /></a>
          <a href="#faq"><CircleHelp /><span><strong>我有一个具体问题</strong><small>用学生的说法查规则</small></span><ArrowRight /></a>
          <a href="#check"><CheckCircle2 /><span><strong>检查还差什么</strong><small>勾选已修课程，本地保存</small></span><ArrowRight /></a>
        </section>

        <CurriculumWorkspace major={major.id} />
      </div>
    </main>
  );
}
