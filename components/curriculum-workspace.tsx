'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookMarked, Check, Download, Filter, Search, SlidersHorizontal } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';
import curriculum from '@/lib/curriculum-data.json';

type Course = (typeof curriculum.courses)[number];

const faqs: Record<string, { q: string; a: string }[]> = {
  视觉传达设计: [
    { q: '68 学分的方向课是不是都要修？', a: '不是。68 学分是可选课程库，毕业审核要求从中完成 35 学分。课程库与实际应修必须分开看。' },
    { q: '两个方向必须二选一吗？', a: '方向用于帮助你形成连贯的能力组合。具体能否跨方向选课，以当学期教学安排和专业确认口径为准。' },
    { q: '什么时候开始考虑方向？', a: '建议从第 4 学期开始了解两个方向，在进入第 5 学期前确认主要方向和限选组合。' },
  ],
  数字媒体艺术: [
    { q: '两个课程组各要选几门？', a: '现行方案的结构为 14＋14＋7 学分。两个主要课程组各选择 4 门，再完成共同课程部分。' },
    { q: '动画、影像和交互能混着选吗？', a: '可以形成交叉组合，但要先满足各课程组的最低要求，并留意课程之间的能力衔接。' },
    { q: '什么时候要确定学习重心？', a: '第 3 学期末是第一个关键节点。此时需要为第 4 学期及之后的限选课程做准备。' },
  ],
  包装设计: [
    { q: '两个方向组能只选一个吗？', a: '这条规则目前需要专业进一步确认。网站暂按“两个方向组组合修读”展示，不把待确认口径当作正式结论。' },
    { q: '为什么有些课程实践学时特别高？', a: '包装设计包含材料、结构和工艺训练。课程卡中的“动手占比”由实践学时除以总学时计算。' },
    { q: '什么时候要确定方向重心？', a: '建议在第 3 学期末完成第一次方向判断，为后续课程组组合留出空间。' },
  ],
  智能交互设计: [
    { q: '界面与交互两边都选，学分怎么计算？', a: '课程按实际修读学分累计，但仍需满足共同课程与方向课程的结构要求，不能只看总数。' },
    { q: '课程群什么时候二选一？', a: '第 4 学期末完成选择，第 5 学期进入更集中的方向课程学习。' },
    { q: '跨专业交叉课程到底是 16 还是 18 学分？', a: '这项口径仍待确认。网站在正式确认前不会把其中一个数字作为确定要求。' },
  ],
};

const resources: Record<string, { pdf: string; pptx: string }> = {
  视觉传达设计: { pdf: '/downloads/视觉传达设计专业2026级新生人才培养方案宣讲.pdf', pptx: '/downloads/视觉传达设计专业2026级新生人才培养方案宣讲.pptx' },
  数字媒体艺术: { pdf: '/downloads/数字媒体艺术专业2026级新生人才培养方案宣讲.pdf', pptx: '/downloads/数字媒体艺术专业2026级新生人才培养方案宣讲.pptx' },
  包装设计: { pdf: '/downloads/包装设计专业2026级新生人才培养方案宣讲.pdf', pptx: '/downloads/包装设计专业2026级新生人才培养方案宣讲.pptx' },
  智能交互设计: { pdf: '/downloads/智能交互设计专业2026级新生人才培养方案宣讲.pdf', pptx: '/downloads/智能交互设计专业2026级新生人才培养方案宣讲.pptx' },
};

function courseMatches(course: Course, search: string, semester: string, nature: string) {
  const words = `${course.name} ${course.group} ${course.nature}`.toLowerCase();
  return (!search || words.includes(search.toLowerCase())) &&
    (!semester || String(course.semester) === semester) &&
    (!nature || course.nature === nature);
}

export function CurriculumWorkspace({ major }: { major: string }) {
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('');
  const [nature, setNature] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);

  const majorCourses = useMemo(() => curriculum.courses.filter((course) => course.major === major), [major]);
  const visibleCourses = useMemo(() => majorCourses.filter((course) => courseMatches(course, search, semester, nature)), [majorCourses, search, semester, nature]);
  const completedCredits = majorCourses.filter((course) => completed.includes(course.id)).reduce((sum, course) => sum + Number(course.credits), 0);
  const libraryCredits = majorCourses.reduce((sum, course) => sum + Number(course.credits), 0);
  const natures = [...new Set(majorCourses.map((course) => course.nature))];

  useEffect(() => {
    const saved = window.localStorage.getItem('curriculum-completed');
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  function toggleCourse(id: string, checked: boolean) {
    setCompleted((current) => {
      const next = checked ? [...new Set([...current, id])] : current.filter((item) => item !== id);
      window.localStorage.setItem('curriculum-completed', JSON.stringify(next));
      return next;
    });
  }

  useEffect(() => setShowAll(false), [major, search, semester, nature]);

  return (
    <>
      <section id="courses" className="section-block">
        <div className="section-heading">
          <div><span className="section-index">03</span><h2>课程查询</h2></div>
          <p>数据来自《0001视觉学院数据_已修正.xlsx》，当前为 2026 版。</p>
        </div>
        <div className="course-toolbar">
          <label className="course-search"><Search /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索课程名称或课程组" aria-label="搜索课程" /></label>
          <NativeSelect value={semester} onChange={(event) => setSemester(event.target.value)} aria-label="按学期筛选">
            <NativeSelectOption value="">全部学期</NativeSelectOption>
            {[1,2,3,4,5,6,7,8].map((n) => <NativeSelectOption value={String(n)} key={n}>第 {n} 学期</NativeSelectOption>)}
          </NativeSelect>
          <NativeSelect value={nature} onChange={(event) => setNature(event.target.value)} aria-label="按课程性质筛选">
            <NativeSelectOption value="">全部性质</NativeSelectOption>
            {natures.map((item) => <NativeSelectOption value={item} key={item}>{item}</NativeSelectOption>)}
          </NativeSelect>
          {(search || semester || nature) && <Button variant="ghost" onClick={() => { setSearch(''); setSemester(''); setNature(''); }}>清除筛选</Button>}
        </div>

        <div className="course-summary"><Filter /><span>找到 <strong>{visibleCourses.length}</strong> 门课程</span><small>{majorCourses.length} 门纳入当前专业课程库</small></div>
        <div className="course-grid">
          {visibleCourses.slice(0, showAll ? visibleCourses.length : 12).map((course) => (
            <article className="course-card" key={course.id}>
              <div className="course-card-top"><span>S{course.semester}</span><em>{course.nature}</em></div>
              <h3>{course.name}</h3>
              <p>{course.group}</p>
              <div className="course-metrics">
                <span><strong>{course.credits}</strong><small>学分</small></span>
                <span><strong>{course.hours.total}</strong><small>总学时</small></span>
                <span><strong>{course.practiceRate}%</strong><small>动手占比</small></span>
              </div>
              <label className="course-check"><Checkbox checked={completed.includes(course.id)} onCheckedChange={(checked) => toggleCourse(course.id, checked === true)} /><span>{completed.includes(course.id) ? '已计入我的进度' : '标记为已修'}</span></label>
            </article>
          ))}
        </div>
        {visibleCourses.length === 0 && <div className="empty-state"><SlidersHorizontal /><h3>没有符合条件的课程</h3><p>试试清除一个筛选条件。</p></div>}
        {visibleCourses.length > 12 && <Button variant="outline" className="show-more" onClick={() => setShowAll(!showAll)}>{showAll ? '收起课程' : `查看全部 ${visibleCourses.length} 门`}</Button>}
      </section>

      <section id="check" className="section-block check-section">
        <div className="section-heading light-heading">
          <div><span className="section-index">04</span><h2>我的学分自查</h2></div>
          <p>勾选状态只保存在当前浏览器，不需要账号，也不会上传个人数据。</p>
        </div>
        <div className="check-grid">
          <div className="check-score"><span>已标记专业课程</span><strong>{completedCredits.toFixed(1).replace('.0','')}</strong><em>学分</em><small>课程库总计 {libraryCredits.toFixed(1).replace('.0','')} 学分</small></div>
          <div className="check-progress">
            <Progress value={Math.min(100, completedCredits / 89 * 100)}>
              <ProgressLabel>专业课程应修参考进度</ProgressLabel>
              <ProgressValue>{Math.min(100, completedCredits / 89 * 100).toFixed(0)}%</ProgressValue>
            </Progress>
            <p>此进度只统计当前课程表中的专业课程，用于日常自查，不作为毕业审核结果。</p>
            <a href="#courses">继续标记课程</a>
          </div>
        </div>
      </section>

      <section id="faq" className="section-block faq-section">
        <div className="section-heading">
          <div><span className="section-index">05</span><h2>常见问题</h2></div>
          <p>用学生真正会问的话说明规则，内容随专业切换。</p>
        </div>
        <div className="faq-layout">
          <div className="faq-intro"><BookMarked /><h3>{major}</h3><p>这里先回答最容易影响选课判断的问题。涉及待确认口径时，会明确标出。</p></div>
          <Accordion className="faq-list">
            {faqs[major].map((faq, index) => (
              <AccordionItem key={faq.q} value={`faq-${index}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent><p>{faq.a}</p></AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="resources">
        <div><span>原始资料</span><h2>需要完整版本？</h2><p>下载当前专业的新生宣讲材料，核对课程结构与具体要求。</p></div>
        <div className="resource-actions">
          <Button nativeButton={false} render={<a href={resources[major].pdf} download />}><Download />下载 PDF</Button>
          <Button nativeButton={false} variant="outline" render={<a href={resources[major].pptx} download />}><Download />下载 PPTX</Button>
        </div>
      </section>

      <footer className="site-footer"><span>视觉学院 · 2026 版人才培养方案</span><span>课程数据：2026-09-11 核对版</span></footer>
    </>
  );
}
