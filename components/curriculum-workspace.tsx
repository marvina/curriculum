'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BookMarked, Download, Filter, Search, SlidersHorizontal } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import curriculum from '@/lib/curriculum-data.json';
import courseDescriptions from '@/lib/course-descriptions.json';

type Course = (typeof curriculum.courses)[number];
type CourseDescription = { description: string; prerequisite: string; source: string };

const descriptionAliases: Record<string, string> = {
  人工智能辅助视觉设计: '人工智能与视觉设计工作流',
  品牌形象系统设计: '视觉识别系统设计',
  包装与消费体验设计: '包装与用户体验设计',
  跨媒介品牌传播: '动态叙事与传播',
  '专产对接实务（一）': '专产对接1',
  '专产对接实务（二）': '专产对接2',
  '综合设计 一': '综合设计一',
  '综合设计 二': '综合设计二',
  专产对接一: '专产对接1',
  专产对接二: '专产对接2',
  web前端应用与开发: 'Web前端应用与开发',
  传感器技术与应用: '智能交互硬件基础',
};

function normalizeCourseName(name: string) {
  return name.toLowerCase().replace(/[\s（）()·—_－-]/g, '');
}

function findCourseDescription(major: string, courseName: string): CourseDescription | undefined {
  const catalog = (courseDescriptions as Record<string, Record<string, CourseDescription>>)[major] ?? {};
  const alias = descriptionAliases[courseName];
  if (catalog[courseName]) return catalog[courseName];
  if (alias && catalog[alias]) return catalog[alias];
  const normalizedTargets = [courseName, alias].filter(Boolean).map((name) => normalizeCourseName(name as string));
  const localMatch = Object.entries(catalog).find(([name]) => normalizedTargets.includes(normalizeCourseName(name)));
  if (localMatch) return localMatch[1];
  for (const otherCatalog of Object.values(courseDescriptions) as Record<string, CourseDescription>[]) {
    const fallback = Object.entries(otherCatalog).find(([name]) => normalizedTargets.includes(normalizeCourseName(name)));
    if (fallback) return fallback[1];
  }
  return undefined;
}

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
  时尚设计与传播: [
    { q: '时尚设计与传播与传统视觉传达有何不同？', a: '传统视传偏重品牌视觉与信息设计；时尚方向更聚焦时尚品牌、画册型录、IP与文创衍生品、商业推广与新媒体传播，深度衔接时尚消费产业。' },
    { q: '时尚方向的选课如何规划？', a: '第 4 学期进入插画、包装、招贴、型录等方向限选课；第 5 学期深入衍生品、交互与品牌策划，并通过系列工作坊完成综合商业项目落地。' },
    { q: '未来就业主要面向哪些行业领域？', a: '面向时尚品牌企业、时尚传媒与型录出版、文创潮玩研发、数字新媒体平台及商业展示策划等领域。' },
  ],
};

const resources: Record<string, { pdf: string }> = {
  视觉传达设计: { pdf: './downloads/视觉传达设计专业2026级新生人才培养方案宣讲.pdf' },
  数字媒体艺术: { pdf: './downloads/数字媒体艺术专业2026级新生人才培养方案宣讲.pdf' },
  包装设计: { pdf: './downloads/包装设计专业2026级新生人才培养方案宣讲.pdf' },
  智能交互设计: { pdf: './downloads/智能交互设计专业2026级新生人才培养方案宣讲.pdf' },
  时尚设计与传播: { pdf: './downloads/视觉传达设计专业2026级新生人才培养方案宣讲.pdf' },
};

function courseMatches(course: Course, search: string, semester: string, nature: string) {
  const words = `${course.name} ${course.group} ${course.nature}`.toLowerCase();
  return (!search || words.includes(search.toLowerCase())) &&
    (!semester || String(course.semester) === semester) &&
    (!nature || course.nature === nature);
}

function CourseCard({ course, onSelect }: { course: Course; onSelect: (course: Course) => void }) {
  return (
    <article
      className="course-card"
      role="button"
      tabIndex={0}
      aria-label={`查看${course.name}课程介绍`}
      onClick={() => onSelect(course)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(course);
        }
      }}
    >
      <div className="course-card-top"><span>S{course.semester}</span><em>{course.nature}</em></div>
      <h3>{course.name}</h3>
      <p>{course.group}</p>
      <div className="course-metrics">
        <span><strong>{course.credits}</strong><small>学分</small></span>
        <span><strong>{course.hours.total}</strong><small>总学时</small></span>
        <span><strong>{course.practiceRate}%</strong><small>动手占比</small></span>
      </div>
      <div className="course-open"><span>查看课程介绍</span><ArrowUpRight /></div>
    </article>
  );
}

export function CurriculumWorkspace({ major }: { major: string }) {
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('');
  const [nature, setNature] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const majorCourses = useMemo(() => curriculum.courses.filter((course) => course.major === major), [major]);
  const visibleCourses = useMemo(() => majorCourses
    .filter((course) => courseMatches(course, search, semester, nature))
    .sort((a, b) => Number(a.semester) - Number(b.semester) || a.name.localeCompare(b.name, 'zh-CN')), [majorCourses, search, semester, nature]);
  const natures = [...new Set(majorCourses.map((course) => course.nature))];
  const displayedCourses = visibleCourses.slice(0, showAll ? visibleCourses.length : 12);
  const semesterGroups = [...new Set(displayedCourses.map((course) => Number(course.semester)))].sort((a, b) => a - b);

  useEffect(() => setShowAll(false), [major, search, semester, nature]);

  return (
    <>
      <section id="courses" className="section-block">
        <div className="section-heading">
          <div><span className="section-index">04</span><h2>分学期课程资料</h2></div>
          <p>课程按照开课学期分组，并支持按学期和课程性质进一步筛选。</p>
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
        <div className="course-groups">
          {semesterGroups.map((semesterNumber) => {
            const semesterCourses = displayedCourses.filter((course) => Number(course.semester) === semesterNumber);
            const courseGroupOrder = [...new Set(majorCourses
              .filter((course) => Number(course.semester) === semesterNumber)
              .map((course) => course.group))];
            const courseGroups = courseGroupOrder
              .map((group) => ({ group, courses: semesterCourses.filter((course) => course.group === group) }))
              .filter((item) => item.courses.length > 0);
            const showCourseGroups = semesterNumber >= 4 && courseGroups.length > 1;
            return (
              <section className="course-semester-group" key={semesterNumber} aria-labelledby={`semester-${semesterNumber}`}>
                <div className="course-semester-heading">
                  <div><span>S{semesterNumber}</span><h3 id={`semester-${semesterNumber}`}>第 {semesterNumber} 学期</h3></div>
                  <small>{semesterCourses.length} 门课程</small>
                </div>
                {showCourseGroups ? (
                  <div className="course-direction-groups">
                    {courseGroups.map((item, groupIndex) => (
                      <section className="course-direction-group" key={item.group} aria-labelledby={`semester-${semesterNumber}-group-${groupIndex}`}>
                        <div className="course-direction-heading">
                          <div><span>课程组 0{groupIndex + 1}</span><h4 id={`semester-${semesterNumber}-group-${groupIndex}`}>{item.group}</h4></div>
                          <small>{item.courses.length} 门课程</small>
                        </div>
                        <div className="course-grid">
                          {item.courses.map((course) => <CourseCard course={course} onSelect={setSelectedCourse} key={course.id} />)}
                        </div>
                      </section>
                    ))}
                  </div>
                ) : (
                  <div className="course-grid">
                    {semesterCourses.map((course) => <CourseCard course={course} onSelect={setSelectedCourse} key={course.id} />)}
                  </div>
                )}
              </section>
            );
          })}
        </div>
        {visibleCourses.length === 0 && <div className="empty-state"><SlidersHorizontal /><h3>没有符合条件的课程</h3><p>试试清除一个筛选条件。</p></div>}
        {visibleCourses.length > 12 && <Button variant="outline" className="show-more" onClick={() => setShowAll(!showAll)}>{showAll ? '收起课程' : `查看全部 ${visibleCourses.length} 门`}</Button>}
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
        </div>
      </section>

      <Dialog open={selectedCourse !== null} onOpenChange={(open) => { if (!open) setSelectedCourse(null); }}>
        {selectedCourse && (() => {
          const detail = findCourseDescription(major, selectedCourse.name);
          return (
            <DialogContent className="course-dialog">
              <DialogHeader>
                <div className="course-dialog-meta"><span>S{selectedCourse.semester}</span><span>{selectedCourse.nature}</span><span>{selectedCourse.group}</span></div>
                <DialogTitle>{selectedCourse.name}</DialogTitle>
                <DialogDescription>
                  {detail?.description ?? `本课程属于${selectedCourse.group}，安排在第 ${selectedCourse.semester} 学期，共 ${selectedCourse.hours.total} 学时。课程详细介绍将在相应教学大纲完成核定后补充。`}
                </DialogDescription>
              </DialogHeader>
              <dl className="course-dialog-facts">
                <div><dt>学分</dt><dd>{selectedCourse.credits}</dd></div>
                <div><dt>总学时</dt><dd>{selectedCourse.hours.total}</dd></div>
                <div><dt>实践学时占比</dt><dd>{selectedCourse.practiceRate}%</dd></div>
                {detail?.prerequisite && <div><dt>前修课程</dt><dd>{detail.prerequisite}</dd></div>}
              </dl>
              <p className="course-dialog-source">内容依据：{detail?.source ?? '2026 版人才培养方案'}</p>
            </DialogContent>
          );
        })()}
      </Dialog>

      <footer className="site-footer">
        <a href="https://visual.sdada.edu.cn" target="_blank" rel="noreferrer">
          山东工艺美术学院 视觉传达设计学院
        </a>
      </footer>
    </>
  );
}
