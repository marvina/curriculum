'use client';

import { useMemo, useState } from 'react';
import { graduateDirections } from '@/lib/graduate-data';

const semesterOrder = ['1', '1-2', '2', '3', '1-5', '培养期内'];

function semesterLabel(value: string) {
  if (value === '培养期内') return value;
  if (value.includes('-')) return `第 ${value.replace('-', '–')} 学期`;
  return `第 ${value} 学期`;
}

export function GraduateProgram() {
  const [directionName, setDirectionName] = useState(graduateDirections[0].id);
  const direction = graduateDirections.find((item) => item.id === directionName) ?? graduateDirections[0];
  const courseSemesters = useMemo(() => semesterOrder
    .map((semester) => ({ semester, courses: direction.courses.filter((course) => course.semester === semester) }))
    .filter((item) => item.courses.length > 0), [direction]);
  const professionalDirections = graduateDirections.filter((item) => item.code === '1357');
  const academicDirections = graduateDirections.filter((item) => item.code === '1403');

  return (
    <div id="top" className="page-shell graduate-page-shell">
      <section className="intro graduate-hero">
        <img className="hero-image" src="/images/curriculum-hero-v1.png" alt="" />
        <div className="hero-topline">
          <p>山东工艺美术学院 · 2026 硕士研究生培养方案</p>
          <span>{direction.degree} / {direction.code}</span>
        </div>
        <div className="hero-content">
          <div>
            <p className="major-name">{direction.program}</p>
            <h1>{direction.headline}</h1>
          </div>
          <p className="intro-copy">{direction.description}</p>
        </div>
        <span className="hero-year">2026</span>
      </section>

      <section className="professional-intro graduate-professional-intro" aria-label="选择研究生培养方向">
        <div className="major-picker graduate-direction-picker" role="group" aria-label="研究生培养方向">
          <span>培养方向 / DIRECTION</span>
          <div>{graduateDirections.map((item, index) => (
            <button key={`${item.code}-${item.id}`} className={directionName === item.id ? 'selected' : ''} onClick={() => setDirectionName(item.id)}>
              <small>0{index + 1}</small>{item.id}
            </button>
          ))}</div>
        </div>
      </section>

      <section id="journey" className="story-section graduate-journey-section">
        <div className="story-heading"><span>01</span><div><p>三年培养路径</p><h2>从课程学习进入研究与创作</h2></div></div>
        <div className="year-journey">
          <article className="year-row">
            <div className="year-number"><small>YEAR</small><strong>01</strong><span>第一学年</span></div>
            <div className="year-story"><span>理论与方法</span><h3>建立研究基础与方向能力</h3><p>完成公共课、理论课、专业基础课和主要方向课程，形成研究问题与方法意识。</p></div>
            <div className="year-courses"><small>第 1–2 学期重点</small><div>{direction.courses.filter((item) => ['1','1-2','2'].includes(item.semester)).slice(0,8).map((item) => <span key={`${item.semester}-${item.name}`}>{item.name}</span>)}</div></div>
          </article>
          <article className="year-row">
            <div className="year-number"><small>YEAR</small><strong>02</strong><span>第二学年</span></div>
            <div className="year-story"><span>研究与实践</span><h3>深化方向研究并推进实践项目</h3><p>进入工作室、前沿研究与开放性实践，通过项目、调研和学术活动形成阶段性成果。</p></div>
            <div className="year-courses"><small>第 3 学期与跨学期实践</small><div>{direction.courses.filter((item) => ['3','1-5','培养期内'].includes(item.semester)).slice(0,8).map((item) => <span key={`${item.semester}-${item.name}`}>{item.name}</span>)}</div></div>
          </article>
          <article className="year-row">
            <div className="year-number"><small>YEAR</small><strong>03</strong><span>第三学年</span></div>
            <div className="year-story"><span>毕业考核</span><h3>完成专业成果与学位论文</h3><p>{direction.code === '1357' ? '专业实践能力展示与学位论文答辩共同构成毕业考核，二者均须达到合格标准。' : '围绕研究方向完成学位论文；实践类研究生还须完成与论文相互支撑的毕业创作。'}</p></div>
            <div className="year-courses"><small>培养结果</small><div>{direction.focus.map((item) => <span key={item}>{item}</span>)}</div></div>
          </article>
        </div>
      </section>

      <section id="tracks" className="graduate-direction-section">
        <div className="track-heading"><span>02</span><p>研究生培养方向</p><h2>两类学位 六个培养方向</h2></div>
        <div className="graduate-program-grid">
          <article>
            <span>专业学位 · 1357</span>
            <h3>设计专业学位硕士</h3>
            <p>强调设计实践、应用创新与综合专业能力。课程总学分不少于 50 学分。</p>
            <div>{professionalDirections.map((item) => <button key={item.id} className={direction.id === item.id ? 'active' : ''} onClick={() => setDirectionName(item.id)}>{item.id}</button>)}</div>
          </article>
          <article>
            <span>学术学位 · 1403</span>
            <h3>设计学硕士</h3>
            <p>强调理论研究、实证方法与设计创新。课程总学分不少于 38 学分。</p>
            <div>{academicDirections.map((item) => <button key={item.id} className={direction.id === item.id ? 'active' : ''} onClick={() => setDirectionName(item.id)}>{item.id}</button>)}</div>
          </article>
        </div>
        <div className="graduate-selected-direction">
          <span>当前方向</span><h3>{direction.id}</h3><p>{direction.description}</p>
          <div>{direction.focus.map((item) => <em key={item}>{item}</em>)}</div>
        </div>
      </section>

      <section id="courses" className="section-block graduate-courses-section">
        <div className="section-heading">
          <div><span className="section-index">03</span><h2>研究生课程资料</h2></div>
          <p>{direction.program} · {direction.minCredits} · {direction.duration}</p>
        </div>
        <div className="graduate-course-summary"><strong>{direction.courses.length}</strong><span>门已列明课程</span><p>按培养方案原始开课学期显示；选修空白项不虚构课程名称。</p></div>
        <div className="graduate-semester-groups">
          {courseSemesters.map((semester) => (
            <section className="graduate-semester-group" key={semester.semester}>
              <div className="course-semester-heading">
                <div><span>S{semester.semester}</span><h3>{semesterLabel(semester.semester)}</h3></div>
                <small>{semester.courses.length} 门课程</small>
              </div>
              <div className="graduate-course-grid">
                {semester.courses.map((item) => (
                  <article className="graduate-course-card" key={`${item.semester}-${item.name}`}>
                    <div><span>{item.group}</span><em>{item.nature}</em></div>
                    <h3>{item.name}</h3>
                    <dl>
                      <div><dt>学分</dt><dd>{item.credits}</dd></div>
                      <div><dt>学时</dt><dd>{item.hours}</dd></div>
                      <div><dt>考核</dt><dd>{item.assessment}</dd></div>
                    </dl>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="graduate-source-note">资料依据：{direction.source}。空白专业选修课和一般选修课以导师指导及学校当学期课程安排为准。</p>
      </section>

      <footer className="site-footer"><span>视觉学院 · 2026 版研究生培养方案</span><span>当前方向：{direction.id}</span></footer>
    </div>
  );
}
