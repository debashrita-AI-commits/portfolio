"use client";

import { useState } from "react";

const heroSvg = `
<svg viewBox="0 0 1000 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Career rendered as an executing automation workflow">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4.5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <g fill="none" stroke="#27303F" stroke-width="1.6">
    <path d="M62 260 H150"/>
    <path d="M390 260 H440 V120 H510"/>
    <path d="M390 260 H510"/>
    <path d="M390 260 H440 V400 H510"/>
    <path d="M650 120 H720 V260 H770"/>
    <path d="M650 260 H770"/>
    <path d="M650 400 H720 V260 H770"/>
  </g>

  <circle cx="50" cy="260" r="8" fill="#E8A85C"/>
  <text class="node-id" x="50" y="290" font-size="10" text-anchor="middle">START</text>

  <g class="gnode">
    <rect x="150" y="218" width="240" height="84" rx="12" fill="#11151F" stroke="#2C3647" stroke-width="1.4"/>
    <circle class="pulse" cx="166" cy="234" r="4" fill="#4ADE80" style="animation-delay:0s"/>
    <text class="node-label" x="270" y="254" font-size="21" font-weight="600" text-anchor="middle" letter-spacing="-0.5">Debashrita Mishra</text>
    <text class="node-id" x="270" y="278" font-size="12" text-anchor="middle">Senior RPA Developer · BFSI</text>
  </g>

  <a href="#experience" class="gnode">
    <rect x="510" y="92" width="140" height="56" rx="10" fill="#11151F" stroke="#2C3647" stroke-width="1.3"/>
    <circle class="pulse" cx="526" cy="108" r="3.5" fill="#4ADE80" style="animation-delay:.6s"/>
    <text class="node-label" x="580" y="125" font-size="15" text-anchor="middle">Experience</text>
  </a>
  <a href="#projects" class="gnode">
    <rect x="510" y="232" width="140" height="56" rx="10" fill="#11151F" stroke="#2C3647" stroke-width="1.3"/>
    <circle class="pulse" cx="526" cy="248" r="3.5" fill="#4ADE80" style="animation-delay:1.1s"/>
    <text class="node-label" x="580" y="265" font-size="15" text-anchor="middle">Projects</text>
  </a>
  <a href="#skills" class="gnode">
    <rect x="510" y="372" width="140" height="56" rx="10" fill="#11151F" stroke="#2C3647" stroke-width="1.3"/>
    <circle class="pulse" cx="526" cy="388" r="3.5" fill="#4ADE80" style="animation-delay:1.6s"/>
    <text class="node-label" x="580" y="405" font-size="15" text-anchor="middle">Agentic AI</text>
  </a>

  <a href="#contact" class="gnode">
    <rect x="770" y="226" width="180" height="68" rx="12" fill="#1A140C" stroke="#E8A85C" stroke-width="1.4"/>
    <circle class="pulse" cx="788" cy="244" r="4" fill="#E8A85C" style="animation-delay:.3s"/>
    <text class="node-label" x="868" y="252" font-size="15" fill="#F3C58A" text-anchor="middle">Ask the agent</text>
    <text class="node-id" x="868" y="274" font-size="9" fill="#9A7B52" text-anchor="middle">WIP · coming soon</text>
  </a>

  <g data-token>
    <circle r="5.5" fill="#E8A85C" filter="url(#glow)">
      <animateMotion dur="3.6s" repeatCount="indefinite" path="M50 260 H950"/>
    </circle>
  </g>
</svg>`;

type Role = { title: string; company: string; dates: string; bullets: string[] };
type Item = { title: string; tech: string; year: string; bullets: string[] };

export default function Home() {
  const [exp, setExp] = useState<Role[] | null>(null);
  const [proj, setProj] = useState<Item[] | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function reveal(id: "experience" | "projects") {
    setLoading(id);
    setError(null);
    try {
      const res = await fetch(`/api/detail?id=${id}`);
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      if (id === "experience") setExp(data.roles);
      else setProj(data.items);
    } catch {
      setError(id);
    } finally {
      setLoading(null);
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

        <div className="stage" dangerouslySetInnerHTML={{ __html: heroSvg }} />

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
            {!exp ? (
              <button
                className="reveal-btn"
                onClick={() => reveal("experience")}
                disabled={loading === "experience"}
              >
                {loading === "experience" ? "loading…" : "▸ view experience"}
              </button>
            ) : (
              <div className="detail">
                {exp.map((r, i) => (
                  <div className="role" key={i}>
                    <div className="role-h">
                      <span className="t">{r.title}</span>
                      <span className="d">{r.dates}</span>
                    </div>
                    <div className="co">{r.company}</div>
                    <ul>
                      {r.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
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
            {!proj ? (
              <button
                className="reveal-btn"
                onClick={() => reveal("projects")}
                disabled={loading === "projects"}
              >
                {loading === "projects" ? "loading…" : "▸ view projects"}
              </button>
            ) : (
              <div className="detail">
                {proj.map((p, i) => (
                  <div className="role" key={i}>
                    <div className="role-h">
                      <span className="t">{p.title}</span>
                      <span className="d">{p.year}</span>
                    </div>
                    <div className="co">{p.tech}</div>
                    <ul>
                      {p.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
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
                <a className="btn btn-primary" href="mailto:mishradebashrit@gmail.com">
                  Email me
                </a>
                <a
                  className="btn"
                  href="https://www.linkedin.com/in/debashrita-mishra-491495131"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
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