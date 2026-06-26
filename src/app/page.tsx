"use client";

import { useState, useEffect, useRef } from "react";

const ROUTES: Record<string, string> = {
  default: "M50 260 H950",
  experience: "M50 260 H440 V120 H720 V260 H950",
  projects: "M50 260 H950",
  skills: "M50 260 H440 V400 H720 V260 H950",
};

const NODE_CENTERS: Record<string, { x: number; y: number }> = {
  experience: { x: 580, y: 120 },
  projects: { x: 580, y: 260 },
  skills: { x: 580, y: 400 },
};

const SPEED = 0.34; // px per ms — constant token speed
const SPLIT = 390; // arc length at the branching intersection (x = 440)

type Active = "experience" | "projects" | "skills" | null;
type Role = { title: string; company: string; dates: string; bullets: string[] };
type Item = { title: string; tech: string; year: string; bullets: string[] };

export default function Home() {
  const [active, setActive] = useState<Active>(null);

  const [expData, setExpData] = useState<Role[] | null>(null);
  const [expOpen, setExpOpen] = useState(false);
  const [projData, setProjData] = useState<Item[] | null>(null);
  const [projOpen, setProjOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tokenRef = useRef<SVGCircleElement>(null);
  const routePathRef = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<Record<string, SVGGElement | null>>({});

  // latest hover, readable inside the animation loop without restarting it
  const activeRef = useRef<Active>(null);
  activeRef.current = active;

  // one continuous animation loop — decides its branch at the split point
  useEffect(() => {
    const token = tokenRef.current;
    const routePath = routePathRef.current;
    if (!token || !routePath) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cycle = ["experience", "projects", "skills"];

    let chosen = "projects";
    let cycleIdx = 0;
    let phase: "common" | "branch" = "common";
    let len = 0;
    let total = 0;
    let nodeLen = -1;
    let lit = false;

    const clearLit = () =>
      Object.values(nodeRefs.current).forEach((el) => el && el.classList.remove("lit"));

    const computeNodeLen = (key: string) => {
      const c = NODE_CENTERS[key];
      if (!c) return -1;
      let best = Infinity;
      let bestLen = -1;
      const N = 260;
      for (let i = 0; i <= N; i++) {
        const l = (i / N) * total;
        const pt = routePath.getPointAtLength(l);
        const d = (pt.x - c.x) ** 2 + (pt.y - c.y) ** 2;
        if (d < best) {
          best = d;
          bestLen = l;
        }
      }
      return bestLen;
    };

    routePath.setAttribute("d", ROUTES.projects);
    total = routePath.getTotalLength();
    const p0 = routePath.getPointAtLength(0);
    token.setAttribute("cx", String(p0.x));
    token.setAttribute("cy", String(p0.y));

    if (reduce) return;

    let raf = 0;
    let prev = performance.now();

    const tick = (now: number) => {
      const dt = now - prev;
      prev = now;
      len += SPEED * dt;

      // decision happens at the branch intersection
      if (phase === "common" && len >= SPLIT) {
        const act = activeRef.current;
        if (act) {
          chosen = act;
        } else {
          chosen = cycle[cycleIdx];
          cycleIdx = (cycleIdx + 1) % cycle.length;
        }
        routePath.setAttribute("d", ROUTES[chosen] ?? ROUTES.default);
        total = routePath.getTotalLength();
        nodeLen = computeNodeLen(chosen);
        if (act) routePath.classList.add("on");
        else routePath.classList.remove("on");
        clearLit();
        lit = false;
        phase = "branch";
      }

      // completed the journey -> loop back along the shared trunk
      if (len >= total) {
        len = 0;
        phase = "common";
        lit = false;
        clearLit();
        routePath.classList.remove("on");
      }

      const pt = routePath.getPointAtLength(len);
      token.setAttribute("cx", String(pt.x));
      token.setAttribute("cy", String(pt.y));

      if (phase === "branch" && nodeLen >= 0 && len >= nodeLen && !lit) {
        const el = nodeRefs.current[chosen];
        if (el) el.classList.add("lit");
        lit = true;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearLit();
      routePath.classList.remove("on");
    };
  }, []);

  async function toggle(id: "experience" | "projects") {
    if (id === "experience") {
      if (expOpen) return setExpOpen(false);
      if (expData) return setExpOpen(true);
      setLoading(id);
      setError(null);
      try {
        const res = await fetch(`/api/detail?id=${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setExpData(data.roles);
        setExpOpen(true);
      } catch {
        setError(id);
      } finally {
        setLoading(null);
      }
    } else {
      if (projOpen) return setProjOpen(false);
      if (projData) return setProjOpen(true);
      setLoading(id);
      setError(null);
      try {
        const res = await fetch(`/api/detail?id=${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProjData(data.items);
        setProjOpen(true);
      } catch {
        setError(id);
      } finally {
        setLoading(null);
      }
    }
  }

  return (
    <>
      <header className="hero">
        <div className="hero-top">
          <div className="eyebrow">
            <span className="dot" />
            LIVE PROCESS · career.xaml · running
          </div>
          <nav>
            <a href="#about">about</a>
            <a href="#experience">experience</a>
            <a href="#projects">projects</a>
            <a href="#contact">contact</a>
          </nav>
        </div>

        <div className="stage">
          <svg
            viewBox="0 0 1000 520"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Career rendered as an executing automation workflow"
          >
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g fill="none" stroke="#27303F" strokeWidth="1.6">
              <path d="M62 260 H150" />
              <path d="M390 260 H440 V120 H510" />
              <path d="M390 260 H510" />
              <path d="M390 260 H440 V400 H510" />
              <path d="M650 120 H720 V260 H770" />
              <path d="M650 260 H770" />
              <path d="M650 400 H720 V260 H770" />
            </g>

            <path ref={routePathRef} className="route" fill="none" />

            <circle cx="50" cy="260" r="8" fill="#E8A85C" />
            <text className="node-id" x="50" y="290" fontSize="10" textAnchor="middle">
              START
            </text>

            <g className="gnode">
              <rect x="150" y="218" width="240" height="84" rx="12" fill="#11151F" stroke="#2C3647" strokeWidth="1.4" />
              <circle className="pulse" cx="166" cy="234" r="4" fill="#4ADE80" style={{ animationDelay: "0s" }} />
              <text className="node-label" x="270" y="254" fontSize="21" fontWeight="600" textAnchor="middle" letterSpacing="-0.5">
                Debashrita Mishra
              </text>
              <text className="node-id" x="270" y="278" fontSize="12" textAnchor="middle">
                Senior RPA Developer · BFSI
              </text>
            </g>

            <a
              href="#experience"
              className={`gnode ${active === "experience" ? "active" : ""}`}
              onMouseEnter={() => setActive("experience")}
              onMouseLeave={() => setActive(null)}
            >
              <g ref={(el) => { nodeRefs.current.experience = el; }}>
                <rect x="510" y="92" width="140" height="56" rx="10" fill="#11151F" stroke="#2C3647" strokeWidth="1.3" />
                <circle className="pulse" cx="526" cy="108" r="3.5" fill="#4ADE80" style={{ animationDelay: "0.6s" }} />
                <text className="node-label" x="580" y="125" fontSize="15" textAnchor="middle">Experience</text>
              </g>
            </a>

            <a
              href="#projects"
              className={`gnode ${active === "projects" ? "active" : ""}`}
              onMouseEnter={() => setActive("projects")}
              onMouseLeave={() => setActive(null)}
            >
              <g ref={(el) => { nodeRefs.current.projects = el; }}>
                <rect x="510" y="232" width="140" height="56" rx="10" fill="#11151F" stroke="#2C3647" strokeWidth="1.3" />
                <circle className="pulse" cx="526" cy="248" r="3.5" fill="#4ADE80" style={{ animationDelay: "1.1s" }} />
                <text className="node-label" x="580" y="265" fontSize="15" textAnchor="middle">Projects</text>
              </g>
            </a>

            <a
              href="#skills"
              className={`gnode ${active === "skills" ? "active" : ""}`}
              onMouseEnter={() => setActive("skills")}
              onMouseLeave={() => setActive(null)}
            >
              <g ref={(el) => { nodeRefs.current.skills = el; }}>
                <rect x="510" y="372" width="140" height="56" rx="10" fill="#11151F" stroke="#2C3647" strokeWidth="1.3" />
                <circle className="pulse" cx="526" cy="388" r="3.5" fill="#4ADE80" style={{ animationDelay: "1.6s" }} />
                <text className="node-label" x="580" y="405" fontSize="15" textAnchor="middle">Agentic AI</text>
              </g>
            </a>

            <a href="#contact" className="gnode">
              <rect x="770" y="226" width="180" height="68" rx="12" fill="#1A140C" stroke="#E8A85C" strokeWidth="1.4" />
              <circle className="pulse" cx="788" cy="244" r="4" fill="#E8A85C" style={{ animationDelay: "0.3s" }} />
              <text className="node-label" x="868" y="252" fontSize="15" fill="#F3C58A" textAnchor="middle">Ask the agent</text>
              <text className="node-id" x="868" y="274" fontSize="9" fill="#9A7B52" textAnchor="middle">WIP · coming soon</text>
            </a>

            <g data-token>
              <circle ref={tokenRef} r="5.5" fill="#E8A85C" filter="url(#glow)" cx="50" cy="260" />
            </g>
          </svg>
        </div>

        <div className="console">
          ▸ <b>ask this site anything about my work</b>
          <span className="wip">WIP</span>
          <span className="cursor" />
        </div>
      </header>

      <main>
        {/* ABOUT */}
        <section id="about">
          <div className="wrap">
            <div className="sec-head">
              <span className="idx">01</span>
              <h2>About</h2>
            </div>
            <p className="lead">
              I build UiPath automations for banking and financial operations —
              REFramework, Orchestrator, Document Understanding with AI Center, and
              SAP payment processing, with recent work in agentic automation. Most of
              it runs in regulated finance, so the focus is automations that recover
              from failure on their own, with audit logs ops and finance teams can
              trace.
            </p>
            <div className="metrics">
              <div className="metric"><div className="v">4 yrs</div><div className="l">in production</div></div>
              <div className="metric"><div className="v">~40 hrs</div><div className="l">manual work cut / week</div></div>
              <div className="metric"><div className="v">20 / day</div><div className="l">salary payments</div></div>
              <div className="metric"><div className="v">15 / hr</div><div className="l">invoices processed</div></div>
              <div className="metric"><div className="v">16–25k</div><div className="l">records / month via API</div></div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience">
          <div className="wrap">
            <div className="sec-head">
              <span className="idx">02</span>
              <h2>Experience</h2>
            </div>
            <p className="lead">
              Four years across UiPath and Infosys, in production automation for
              regulated finance.
            </p>
            <button className="reveal-btn" onClick={() => toggle("experience")} disabled={loading === "experience"}>
              {loading === "experience" ? "loading…" : expOpen ? "▾ hide experience" : "▸ view experience"}
            </button>
            {expOpen && expData && (
              <div className="detail">
                {expData.map((r, i) => (
                  <div className="role" key={i}>
                    <div className="role-h">
                      <span className="t">{r.title}</span>
                      <span className="d">{r.dates}</span>
                    </div>
                    <div className="co">{r.company}</div>
                    <ul>{r.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
                  </div>
                ))}
              </div>
            )}
            {error === "experience" && (
              <p className="lead" style={{ color: "#E8A85C", marginTop: 16 }}>
                Couldn&apos;t load that — refresh and try again.
              </p>
            )}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <div className="wrap">
            <div className="sec-head">
              <span className="idx">03</span>
              <h2>Projects</h2>
            </div>
            <p className="lead">Two production builds in regulated finance.</p>
            <button className="reveal-btn" onClick={() => toggle("projects")} disabled={loading === "projects"}>
              {loading === "projects" ? "loading…" : projOpen ? "▾ hide projects" : "▸ view projects"}
            </button>
            {projOpen && projData && (
              <div className="detail">
                {projData.map((p, i) => (
                  <div className="role" key={i}>
                    <div className="role-h">
                      <span className="t">{p.title}</span>
                      <span className="d">{p.year}</span>
                    </div>
                    <div className="co">{p.tech}</div>
                    <ul>{p.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
                  </div>
                ))}
              </div>
            )}
            {error === "projects" && (
              <p className="lead" style={{ color: "#E8A85C", marginTop: 16 }}>
                Couldn&apos;t load that — refresh and try again.
              </p>
            )}
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills">
          <div className="wrap">
            <div className="sec-head">
              <span className="idx">04</span>
              <h2>Skills</h2>
            </div>
            <div className="skill-group">
              <h3>Automation</h3>
              <div className="chips">
                {["UiPath","REFramework","Orchestrator","Document Understanding / AI Center","SAP Automation","API Integration","GenAI","Automation Anywhere"].map((s) => (
                  <span className="chip" key={s}>{s}</span>
                ))}
              </div>
            </div>
            <div className="skill-group">
              <h3>Agentic</h3>
              <div className="chips">
                {["Agent Builder","Maestro","Multi-Agent Architecture","Autonomous Agents","Context Grounding","HITL","RAG"].map((s) => (
                  <span className="chip" key={s}>{s}</span>
                ))}
              </div>
            </div>
            <div className="skill-group">
              <h3>Programming &amp; Tools</h3>
              <div className="chips">
                {["Python","SQL","C#","VB.NET","Power Automate","Office Automation"].map((s) => (
                  <span className="chip" key={s}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <div className="wrap">
            <div className="sec-head">
              <span className="idx">05</span>
              <h2>Contact</h2>
            </div>
            <div className="contact-card">
              <p className="lead" style={{ margin: 0 }}>
                Résumé on request — email me or connect on LinkedIn.
              </p>
              <div className="links">
                <a className="btn btn-primary" href="mailto:mishradebashrit@gmail.com">Email me</a>
                <a className="btn" href="https://www.linkedin.com/in/debashrita-mishra-491495131" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </div>
              <div className="agent-note">
                <span className="wip">WIP</span>
                live agent — ask this site about my work — coming soon
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <span>Debashrita Mishra · Senior RPA Developer</span>
          <span>Built with Next.js</span>
        </div>
      </footer>
    </>
  );
}