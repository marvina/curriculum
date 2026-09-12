'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurriculumWorkspace } from '@/components/curriculum-workspace';
import curriculum from '@/lib/curriculum-data.json';

const majors = [
  {
    id: '视觉传达设计', short: '视传', degree: '四年制艺术类 · 艺术学学士', code: '130502',
    headline: '让信息被看见，\n让内容被记住',
    description: '从字体、版式和图形出发，逐步进入品牌系统、视觉叙事与数字传播。你会把一个想法组织成清晰、完整、可以真正使用的视觉方案。',
    abilities: ['视觉语言', '品牌系统', '叙事与插画', '数字媒介'],
    years: [
      ['打底', '学会看、学会画、学会做', '通识课程与形式基础帮你建立观察、造型和基本表达能力。'],
      ['专业基础', '建立自己的视觉语言', '图形、色彩、文字、空间、动态和设计研究组成全班共同的专业底子。'],
      ['选择方向', '让作品开始形成主线', '在品牌策略与视觉叙事之间确定重心，通过方向课和工作坊完成系统项目。'],
      ['完成作品', '把能力放进真实课题', '在专产对接、毕业考察和毕业设计中完成作品集，准备就业或继续深造。'],
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
      ['打底', '建立艺术与形式基础', '先学会观察和造型，同时理解数字媒体艺术覆盖的内容与行业。'],
      ['数字创作', '掌握画面、运动和技术工具', '从色彩、形态和图形进入编程、三维、视听语言与人工智能工作流。'],
      ['组合课程', '在创作与传播之间形成重心', '两个课程组各挑四门，再用综合设计把不同方法合成一个完整项目。'],
      ['真实项目', '完成可展示的数字作品', '在专产对接和毕业设计中完成影像、交互、展演或数字文创成果。'],
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
      ['打底', '建立造型与材料意识', '通识课程和形式基础训练观察、图形与动手能力。'],
      ['专业基础', '从平面走向结构与实物', '色彩、空间与材料、图形和版式构成包装设计的共同基础。'],
      ['包装项目', '同时理解制作与销售', '在工艺与数字智能、品牌与商业策划两组课程中建立完整的包装能力。'],
      ['产业实践', '让方案进入真实生产条件', '通过企业项目、毕业考察和毕业设计完成可打样、可呈现的包装成果。'],
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
      ['数理与形式', '同时建立工程和设计基础', '高等数学、大学物理、形式基础与工程制图组成第一年的学习底座。'],
      ['交互核心', '理解人，并把方案做出来', '程序、界面、设计思维、传感器和 Web 前端让交互从想法变成原型。'],
      ['综合项目', '把交互放进产品或场景', '先学习共同的专业实践课，再选择智能产品或智慧文旅课程群。'],
      ['工程落地', '在真实约束下完成系统', '专产对接和毕业设计检验用户研究、技术实现与系统整合能力。'],
    ],
    tracks: [
      { title: '智能产品与座舱', question: '怎样把交互做进实体产品和车里？', study: '智能产品、软硬件联动、座舱 HMI 与设计竞赛工作坊', output: '带硬件原型与交互演示的产品或座舱方案' },
      { title: '智慧文旅与体验服务', question: '怎样把交互做进场景和服务里？', study: '智慧文旅、沉浸体验、思辨设计与设计服务工作坊', output: '包含服务流程和场景交互的体验方案' },
    ],
    outcomes: ['能完成用户研究到高保真原型的流程', '能结合软件、传感器与智能技术', '能用测试数据持续改进体验'],
    careers: ['UX 工程', '智能产品设计', '座舱 HMI', 'XR 体验', '数字政务与公共服务'],
  },
] as const;

export default function Home() {
  const [majorName, setMajorName] = useState<(typeof majors)[number]['id']>('视觉传达设计');
  const major = majors.find((item) => item.id === majorName) ?? majors[0];
  const majorCourses = useMemo(() => curriculum.courses.filter((course) => course.major === major.id), [major.id]);

  return (
    <main className="min-h-screen">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回首页">
          <span className="brand-mark">视</span>
          <span><strong>视觉传达设计学院</strong><small>School of Visual Communication Design</small></span>
        </a>
        <nav aria-label="主导航">
          <a className="active" href="#top">专业介绍</a>
          <a href="#journey">四年课程</a>
          <a href="#tracks">学习方向</a>
          <a href="#courses">课程资料</a>
        </nav>
        <Button nativeButton={false} variant="outline" className="search-button" render={<a href="#courses" />}><Search />查课程</Button>
      </header>

      <div id="top" className="page-shell">
        <section className="intro">
          <div className="hero-topline">
            <p>山东工艺美术学院 · 2026 本科专业导览</p>
            <span>{major.degree} / {major.code}</span>
          </div>
          <div className="hero-word" aria-hidden="true">VISUAL</div>
          <div className="hero-content">
            <div>
              <p className="major-name">{major.id}</p>
              <h1>{major.headline.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
            </div>
            <p className="intro-copy">{major.description}</p>
          </div>
          <div className="ability-list">{major.abilities.map((ability, index) => <span key={ability}><em>0{index + 1}</em>{ability}</span>)}</div>
          <span className="hero-year">2026</span>
        </section>

        <section className="professional-intro" aria-label="选择专业">
          <div className="major-picker" role="group" aria-label="选择你想了解的专业">
            <span>选择专业 / SELECT MAJOR</span>
            <div>{majors.map((item) => <button key={item.id} className={majorName === item.id ? 'selected' : ''} onClick={() => setMajorName(item.id)}><small>0{majors.indexOf(item) + 1}</small>{item.id}</button>)}</div>
          </div>
          <a href="#journey">看四年怎么学<ArrowDown /></a>
        </section>

        <section id="journey" className="story-section">
          <div className="story-heading"><span>01</span><div><p>四年课程规划</p><h2>能力怎样一年一年长出来</h2></div></div>
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
          <div className="track-heading"><span>02</span><p>大三学习方向</p><h2>课程开始汇成自己的作品线</h2></div>
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
          <div className="section-heading"><div><span className="section-index">03</span><h2>毕业时你能做什么</h2></div><p>培养结果最终要落在可以完成的项目和可以展示的作品上。</p></div>
          <div className="outcome-layout">
            <div className="outcome-list">{major.outcomes.map((outcome, index) => <div key={outcome}><span>0{index + 1}</span><p>{outcome}</p></div>)}</div>
            <div className="career-block"><span>常见职业方向</span><div>{major.careers.map((career) => <em key={career}>{career}</em>)}</div><p>也可以继续报考相关专业硕士，课程项目和毕业作品会成为申请与复试的重要材料。</p></div>
          </div>
        </section>

        <CurriculumWorkspace major={major.id} />
      </div>
    </main>
  );
}
