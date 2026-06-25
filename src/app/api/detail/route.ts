import { NextResponse } from "next/server";

const details: Record<string, unknown> = {
  experience: {
    roles: [
      {
        title: "Senior RPA Developer",
        company: "UiPath (Remote)",
        dates: "Apr 2026 – Present",
        bullets: [
          "Built a mail-classification and routing agent in UiPath Agent Builder that categorises incoming email and dynamically routes it to the correct queue, replacing a manual sorting step.",
          "Developed and enhanced the production salary-disbursement automation (UiPath with Document Understanding), processing ~20 salary payments per working day on a 5-day cycle.",
          "Built code-level fixes and stabilised payment workflows when issues surfaced, keeping live pay runs on schedule within strict financial timelines.",
          "Consulted on 15 change requests over 6 months of the bot running in production, scoping requirements and implementing enhancements without disrupting live operations.",
        ],
      },
      {
        title: "RPA Developer",
        company: "UiPath (Remote)",
        dates: "Nov 2024 – Mar 2026",
        bullets: [
          "Built several Document Understanding solutions on AI Center handling 3–4 document types, extending the framework where client requirements did not fit the standard template.",
          "Built SAP payment automations processing ~15 invoices per hour, with retry and exception handling and full audit logging against live financial transactions.",
          "Built a high-volume report-generation system that pulls 16–25k records over API for monthly reporting and downstream analysis.",
          "Automated PowerPoint report generation, including survey sentiment summaries produced by a GenAI step.",
          "Wrote SQL-based payment validation checks feeding a daily stakeholder report; authored PDDs, SDDs, user guides, and MTP docs.",
        ],
      },
      {
        title: "Senior Systems Engineer → Systems Engineer",
        company: "Infosys, Bhubaneswar",
        dates: "Mar 2021 – Aug 2023",
        bullets: [
          "Ran an RPA project end to end as the only developer: build, infrastructure, debugging, and client communication.",
          "Built ServiceNow ticket bots that ran every 30 minutes around the clock and cut ~40 hours of manual work a week.",
          "Set up Power Automate notifications via Teams and Outlook so high-priority tickets were flagged in real time; automated onboarding ticket creation (~40 tickets/week).",
          "Maintained RPA infrastructure — production runs, troubleshooting, performance reporting — and built PDF data-extraction routines for financial documents.",
        ],
      },
    ],
  },
  projects: {
    items: [
      {
        title: "Salary Payment Automation",
        tech: "UiPath · UI Automation · DU · GenAI · API",
        year: "2025",
        bullets: [
          "End-to-end salary-disbursement bot: pulled salary data from the client portal via UI Automation, extracted invoice figures with Document Understanding, and validated them against business rules using GenAI and Excel Automation.",
          "Paid each beneficiary from the beneficiary table via API automation with persistence activities, tracked payment status, and reported results in a custom email template I designed — which drew positive client feedback.",
        ],
      },
      {
        title: "Agentic Invoice Processing Bot",
        tech: "UiPath Agent Builder · DU · AI Center",
        year: "2025",
        bullets: [
          "Built a Document Understanding workflow in Studio Desktop for invoice classification and extraction, published to Orchestrator as a callable tool for an Agent Builder agent.",
          "The agent checks extracted data against business rules using context grounding, then routes exceptions to Action Center with the full document and a reason code — in place of hard-coded if-else branching.",
        ],
      },
    ],
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "";
  const data = details[id];
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}