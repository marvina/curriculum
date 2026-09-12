'use client';

import { useMemo, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { CurriculumWorkspace } from '@/components/curriculum-workspace';
import { GraduateProgram } from '@/components/graduate-program';
import curriculum from '@/lib/curriculum-data.json';

const majors = [
  {
    id: '视觉传达设计', short: '视传', degree: '四年制艺术类 · 艺术学学士', code: '130502',
    headline: '让信息被看见，\n让内容被记住',
    description: '从字体、版式和图形出发，逐步进入品牌系统、视觉叙事与数字传播。你会把一个想法组织成清晰、完整、可以真正使用的视觉方案。',
    abilities: ['视觉语言', '品牌系统', '叙事与插画', '数字媒介'],
    years: [
      ['基础训练', '掌握造型基础与设计方法', '通过通识课程与形式基础训练，建立观察、造型和基本视觉表达能力。'],
      ['专业基础', '建立系统的视觉表达能力', '围绕图形、色彩、文字、空间、动态与设计研究，形成共同的专业能力基础。'],
      ['方向深化', '明确专业方向并深化项目实践', '在品牌策略与视觉叙事方向中确定学习重心，通过方向课程与工作坊完成系统项目。'],
      ['综合实践', '完成综合实践与毕业创作', '通过专产对接、毕业考察与毕业设计，形成能够体现专业能力的作品体系。'],
    ],
    tracks: [
      { title: '品牌策略与传播', question: '怎样让一个品牌被理解和记住？', study: '品牌策划、信息可视化、包装与消费体验、界面和跨媒介传播', output: '一套从策略到落地的品牌视觉系统' },
      { title: '视觉叙事与插画', question: '怎样用图像和文字讲好一个故事？', study: '插画语言、编辑设计、纸媒、文化符号与动态叙事', output: '一条具有个人风格的叙事作品线' },
    ],
    outcomes: ['能从调研和内容中提炼视觉概念', '能建立完整的品牌或叙事系统', '能把课程项目整理成清晰的作品集'],
    careers: ['品牌设计', '信息与界面设计', '插画与出版', '文创与文旅', '数字内容设计'],
  },
  {
    id: '数字媒体艺术', short: '数媒', degree: '四年制艺术类 · 艺术学学士', code: '130508',
    headline: '用数字技术，\n把创意变成体验',
    description: '从视觉基础进入影像、三维、交互和 AIGC 创作。你会把一个创意做成影像、展演、数字文创或可交互的内容，并让它被传播出去。',
    abilities: ['数字影像', '三维与动态', '交互体验', 'AIGC 创作'],
    years: [
      ['基础训练', '建立艺术基础与数字媒介认知', '通过观察、造型与形式训练，理解数字媒体艺术的专业范围和行业应用。'],
      ['数字创作', '掌握数字创作方法与技术工具', '从色彩、形态和图形进入编程、三维、视听语言与人工智能创作流程。'],
      ['综合设计', '形成跨媒介综合创作能力', '按照课程组要求完成方向课程，并通过综合设计整合多种媒介与创作方法。'],
      ['毕业实践', '完成面向真实课题的数字作品', '在专产对接和毕业设计中完成影像、交互、展演或数字文创成果。'],
    ],
    tracks: [
      { title: '数字视觉艺术', question: '怎样把画面和空间做出来？', study: '三维、动态、程序生成、角色场景、界面与数字展演', output: '动态影像、交互原型或数字展演视觉方案' },
      { title: '数智创意与传播', question: '怎样让数字内容抵达观众？', study: '插画、影像、信息可视化、用户体验、数字文创与营销', output: '数字文创产品或完整的内容传播方案' },
    ],
    outcomes: ['能独立完成影像、交互或展演创作', '能用 AIGC 和数字工具建立创作流程', '能从策划推进到制作与传播'],
    careers: ['数字内容策划', '三维与动态设计', '数字展演', '文创与 IP', '新媒体运营'],
  },
  {
    id: '包装设计', short: '包装', degree: '四年制艺术类 · 艺术学学士', code: '130512T',
    headline: '从结构与材料出发，\n完成一件真实商品',
    description: '包装设计连接视觉、结构、材料与市场。你会从造型和工艺入手，完成能生产、能运输、能被消费者理解的品牌包装方案。',
    abilities: ['造型结构', '材料工艺', '包装视觉', '品牌策划'],
    years: [
      ['基础训练', '建立造型基础与材料认知', '通过通识课程和形式基础训练，建立观察、图形表达与材料实践能力。'],
      ['专业基础', '掌握包装视觉、结构与制作基础', '围绕色彩、空间与材料、图形和版式，建立包装设计的共同专业基础。'],
      ['综合设计', '形成工艺、品牌与商业综合能力', '通过工艺与数字智能、品牌与商业策划课程，系统整合包装设计能力。'],
      ['产业实践', '在产业实践中完成毕业创作', '通过企业项目、毕业考察和毕业设计，完成满足打样与展示要求的包装成果。'],
    ],
    tracks: [
      { title: '包装工艺与数字智能', question: '怎样把包装真正做出来？', study: '材料、容器结构、印刷工艺、3D 效果与智能包装', output: '可打样的结构与材料方案，或智能包装原型' },
      { title: '品牌与商业包装策划', question: '怎样让包装在市场里发挥作用？', study: '品牌策略、视觉识别、消费体验、文创与服务设计', output: '从品牌策略到包装落地的完整商业方案' },
    ],
    outcomes: ['能整合视觉、结构和材料完成包装', '能理解生产工艺与行业规范', '能把设计方案推进到打样和展示'],
    careers: ['包装视觉设计', '容器结构研发', '材料与工艺', '品牌策划', '文创产品设计'],
  },
  {
    id: '智能交互设计', short: '交互', degree: '四年制理工类 · 工学学士', code: '080218T',
    headline: '既懂人，也懂技术，\n设计下一代交互系统',
    description: '把设计思维、程序与智能技术放在一起学习。你会研究人怎样使用产品，再通过界面、传感器、XR 和人工智能做出可以运行的体验。',
    abilities: ['人机交互', '程序与硬件', 'XR 体验', '智能产品'],
    years: [
      ['数理与形式', '建立工程科学与设计基础', '高等数学、大学物理、形式基础与工程制图构成第一年的学习基础。'],
      ['交互核心', '理解“人”，形成可验证的交互方案', '通过程序、界面、设计思维、传感器和 Web 前端课程，将用户需求转化为可验证的交互原型。'],
      ['综合项目', '面向产品与场景开展综合设计', '完成共同专业实践课程后，进入智能产品或智慧文旅课程群开展综合项目。'],
      ['工程实践', '在真实约束下完成系统设计', '通过专产对接和毕业设计，综合检验用户研究、技术实现与系统整合能力。'],
    ],
    tracks: [
      { title: '智能产品与座舱', question: '怎样把交互做进实体产品和车里？', study: '智能产品、软硬件联动、座舱 HMI 与设计竞赛工作坊', output: '带硬件原型与交互演示的产品或座舱方案' },
      { title: '智慧文旅与体验服务', question: '怎样把交互做进场景和服务里？', study: '智慧文旅、沉浸体验、思辨设计与设计服务工作坊', output: '包含服务流程和场景交互的体验方案' },
    ],
    outcomes: ['能完成用户研究到高保真原型的流程', '能结合软件、传感器与智能技术', '能用测试数据持续改进体验'],
    careers: ['UX 工程', '智能产品设计', '座舱 HMI', 'XR 体验', '数字政务与公共服务'],
  },
  {
    id: '时尚设计与传播', short: '时尚', degree: '四年制艺术类 · 艺术学学士', code: '130502',
    headline: '以时尚为媒介，\n连接文化与商业',
    description: '立足时尚产业与品牌传播，从视觉感知、时尚画册与型录、文化衍生品出发，深度融合新媒体、活动策划与 AI 辅助设计。你会将时尚创意转化为兼具文化内涵与商业价值的视觉传播方案。',
    abilities: ['时尚视觉', '品牌传播', '文创衍生', '数字媒介'],
    years: [
      ['造型感知', '掌握造型基础与形式审美', '通过通识课程与形式感知训练，建立观察、造型与传统文化采风实践能力。'],
      ['专业基础', '建立时尚表达与设计思维', '围绕图形、色彩、文字版式、AI辅助设计与经略海洋低碳课程，形成扎实的专业能力基础。'],
      ['方向深化', '深化时尚媒介与品牌实践', '在时尚品牌传播、画册型录、IP衍生与文化工作坊中确定发展重心，完成系统项目。'],
      ['产业实践', '专产对接与综合毕业创作', '通过企业专产对接、毕业考察与毕业设计，完成兼具创新意识与商业落地价值的成果体系。'],
    ],
    tracks: [
      { title: '时尚品牌与媒介传播', question: '怎样让一个时尚品牌深入人心？', study: '时尚画册与型录、标志设计、商业视觉与推广、新媒体传播、时尚品牌策划', output: '一套完整的时尚品牌策划与跨媒介传播方案' },
      { title: '时尚视觉与文创衍生', question: '怎样将时尚创意落地为真实产品？', study: '插画语言、包装设计、IP形象设计、时尚文化衍生品、交互体验设计', output: '系列化时尚文创衍生品或数字化时尚交互原型' },
    ],
    outcomes: ['能独立完成时尚品牌与型录画册策划', '能将文化资源转化为时尚衍生品', '能运用数字媒体与AI技术开展时尚传播'],
    careers: ['时尚品牌设计', '时尚出版与型录设计', '文创与IP衍生研发', '活动策划与商业美陈', '时尚新媒体运营'],
  },
] as const;

export default function Home() {
  const [level, setLevel] = useState<'undergraduate' | 'graduate'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('level') === 'graduate') return 'graduate';
    }
    return 'undergraduate';
  });
  const [majorName, setMajorName] = useState<(typeof majors)[number]['id']>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const m = params.get('major');
      if (m && majors.some((item) => item.id === m)) return m as (typeof majors)[number]['id'];
    }
    return '视觉传达设计';
  });
  const major = majors.find((item) => item.id === majorName) ?? majors[0];
  const majorCourses = useMemo(() => curriculum.courses.filter((course) => course.major === major.id), [major.id]);

  return (
    <main className="min-h-screen">
      <header className="site-header">
        <div className="site-header-inner">
          <div className="brand-title">
            <a className="brand-logo-link" href="https://visual.sdada.edu.cn" target="_blank" rel="noreferrer" title="访问视觉传达设计学院官网" aria-label="视觉传达设计学院官网">
              <img src="./images/svcd.png" alt="视觉传达设计学院" className="brand-logo-img" />
            </a>
            <div className="brand-divider" aria-hidden="true" />
            <div className="brand-text">
              <a
                className="brand-catalog-link"
                href="#top"
                onClick={(e) => {
                  if (level !== 'undergraduate') setLevel('undergraduate');
                  const el = document.getElementById('top');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                aria-label="返回课程目录首页"
                title="返回课程目录首页"
              >
                <span className="brand-catalog-title">课程目录</span>
                <span className="brand-catalog-sub">2026 人才培养方案专业课程导览</span>
              </a>
            </div>
          </div>

          <div className="header-actions">
            <nav className="degree-tabs" aria-label="培养层次">
              <button
                type="button"
                className={`degree-tab ${level === 'undergraduate' ? 'active' : ''}`}
                aria-pressed={level === 'undergraduate'}
                onClick={() => setLevel('undergraduate')}
              >
                本科
              </button>
              <button
                type="button"
                className={`degree-tab ${level === 'graduate' ? 'active' : ''}`}
                aria-pressed={level === 'graduate'}
                onClick={() => setLevel('graduate')}
              >
                研究生
              </button>
            </nav>
            <a
              className="nav-btn"
              href="https://visual.sdada.edu.cn/kczl.htm"
              target="_blank"
              rel="noreferrer"
              title="前往课程教学周历系统"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>课程周历</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: 0.65 }}>
                <path d="M7 17l9.2-9.2M17 17V8H8" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {level === 'undergraduate' ? <div id="top" className="page-shell">
        <section className="intro">
          <img className="hero-image" src="./images/curriculum-hero-v1.png" alt="" />
          <div className="hero-topline">
            <p>山东工艺美术学院 · 2026 本科专业导览</p>
            <span>{major.degree} / {major.code}</span>
          </div>
          <div className="hero-content">
            <div>
              <h1>{major.id}</h1>
              <p className="intro-copy">{major.description}</p>
            </div>
          </div>
          <span className="hero-year">2026</span>
        </section>

        <section className="professional-intro" aria-label="选择专业">
          <div className="major-picker" role="group" aria-label="选择你想了解的专业">
            <span>选择专业 / SELECT MAJOR</span>
            <div>
              {majors.map((item) => <button key={item.id} className={majorName === item.id ? 'selected' : ''} onClick={() => setMajorName(item.id)}><small>0{majors.indexOf(item) + 1}</small>{item.id}</button>)}
            </div>
          </div>
          <a href="#journey">看四年怎么学<ArrowDown /></a>
        </section>

        <section id="journey" className="story-section">
          <div className="story-heading"><span>01</span><div><p>四年课程规划</p><h2>四年课程体系与能力进阶</h2></div></div>
          <div className="year-journey">
            {major.years.map((year, index) => {
              const yearCourses = majorCourses.filter((course) => Number(course.semester) >= index * 2 + 1 && Number(course.semester) <= index * 2 + 2);
              return (
                <article className="year-row" key={year[0]}>
                  <div className="year-number"><small>YEAR</small><strong>0{index + 1}</strong><span>大{['一','二','三','四'][index]}</span></div>
                  <div className="year-story"><span>{year[0]}</span><h3>{year[1]}</h3><p>{year[2]}</p></div>
                  <div className="year-courses">
                    <small>这一年会遇到的专业课程</small>
                    <div>{yearCourses.length ? yearCourses.slice(0, 8).map((course) => <span key={course.id}>{course.name}</span>) : <><span>毕业考察</span><span>毕业设计与论文</span></>}</div>
                    {yearCourses.length > 8 && <em>另有 {yearCourses.length - 8} 门课程，可在课程资料中查看</em>}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="tracks" className="track-section">
          <div className="track-heading"><span>02</span><p>大三学习方向</p><h2>专业设置两个学习方向</h2></div>
          <div className="track-grid">
            {major.tracks.map((track, index) => (
              <article key={track.title}>
                <div className="track-title"><span>方向 0{index + 1}</span><h3>{track.title}</h3></div>
                <p className="track-question">{track.question}</p>
                <dl><div><dt>主要学习</dt><dd>{track.study}</dd></div><div><dt>毕业时可以形成</dt><dd>{track.output}</dd></div></dl>
              </article>
            ))}
          </div>
          <p className="track-note">方向帮助你组织课程与作品。共同基础课仍然是整个专业的核心。</p>
        </section>

        <section className="outcome-section">
          <div className="section-heading"><div><span className="section-index">03</span><h2>毕业时你能做什么</h2></div><p>培养目标通过可实施的项目成果与可展示的作品进行综合检验。</p></div>
          <div className="outcome-layout">
            <div className="outcome-list">{major.outcomes.map((outcome, index) => <div key={outcome}><span>0{index + 1}</span><p>{outcome}</p></div>)}</div>
            <div className="career-block"><span>常见职业方向</span><div>{major.careers.map((career) => <em key={career}>{career}</em>)}</div><p>也可以继续报考相关专业硕士，课程项目和毕业作品会成为申请与复试的重要材料。</p></div>
          </div>
        </section>

        <CurriculumWorkspace major={major.id} />
      </div> : <GraduateProgram />}
    </main>
  );
}
