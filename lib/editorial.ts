export type Story = { title: string; body: string };
export type ServiceDetail = { name: string; proposition: string; fit: string; approach: Story[]; outputs: string[]; boundary: string; related: string[]; concept?: string };

export const serviceDetails: Record<string, ServiceDetail> = {
  "custom-software": {
    name: "Custom software", proposition: "Software built around requirements generic products cannot solve.",
    fit: "A distinctive workflow should not depend on a growing collection of workarounds. Custom software becomes useful when the rules, users, or integrations that matter to your organization cannot be supported well by an existing product. The starting question is not what to build, but which part of the work genuinely needs a purpose-built system.",
    approach: [
      { title: "Define the working model", body: "Map the people, decisions, information, and exceptions involved. Separate essential requirements from habits that no longer serve the organization. A focused first release should have a clear job to do." },
      { title: "Connect the product to its environment", body: "Consider existing applications, identity, data sources, and operational constraints together. Interfaces and integration boundaries need to be designed as part of the same system, not left until the end." },
      { title: "Make ownership practical", body: "Testing, documentation, deployment, and handover belong in the scope discussion. The people responsible for the system need to understand how it behaves and how future change will be managed." },
    ],
    outputs: ["A prioritized requirements and workflow map", "A product design and technical architecture", "A tested application and agreed integrations", "Deployment, documentation, and handover materials"],
    boundary: "Custom development is not always the right answer. Where an existing platform can meet the important requirements, configuration or integration may be the more maintainable route. Scope, ownership, and post-launch support should be agreed before delivery begins.",
    related: ["business-systems", "digital-experiences"], concept: "purpose-built-workflow",
  },
  "business-systems": {
    name: "Business systems & digital transformation", proposition: "Turn fragmented operations into connected workflows.",
    fit: "When purchasing, finance, operations, and customer teams maintain different versions of the same information, adding another application rarely resolves the underlying problem. Transformation starts with the relationships between teams: where work begins, who is responsible, and which record everyone can rely on.",
    approach: [
      { title: "Follow the work across teams", body: "Trace a complete process, including approvals, exceptions, and reporting. Identify repeated entry, unclear ownership, and delays before deciding which steps to automate or redesign." },
      { title: "Establish dependable information", body: "A connected workflow needs consistent records and clear data ownership. Migration, reconciliation, access permissions, and integration with existing systems should be considered alongside platform selection." },
      { title: "Plan for adoption", body: "A system changes how people work. Role-specific views, training needs, and a manageable rollout are as important as configuration. Reporting should support decisions rather than reproduce every existing spreadsheet." },
    ],
    outputs: ["Current-state and proposed workflow maps", "Platform, integration, and data requirements", "Configured workflows and operational reporting", "A migration, rollout, and adoption plan"],
    boundary: "An engagement may involve ERP or CRM implementation, targeted automation, integration, or a combination. The technology follows the operating requirements; it does not define Alool's approach. A practical scope preserves what works and changes what prevents the organization from working as a whole.",
    related: ["technology-consulting", "custom-software"], concept: "connected-operations-platform",
  },
  "digital-experiences": {
    name: "Digital experiences", proposition: "Digital experiences connected to the systems behind them.",
    fit: "A useful website or portal helps someone complete a task and makes the next step clear. But the experience does not end when a form is submitted. Information must reach the right team, trigger the right workflow, and remain understandable to the person who started the request.",
    approach: [
      { title: "Start with the user's task", body: "Organize content and navigation around what people need to accomplish, rather than asking them to understand an internal structure. Plain language and accessible interaction patterns support that work." },
      { title: "Design the complete journey", body: "Connect the public-facing experience to records, permissions, notifications, and staff tools. Consider successful journeys alongside missing information, interrupted sessions, and requests that need human attention." },
      { title: "Build for continuity", body: "Reusable interface patterns make an experience easier to maintain as services grow. Content ownership, performance, testing, and accessibility should inform the design and engineering scope from the beginning." },
    ],
    outputs: ["A content structure and user-journey map", "Interface designs and reusable experience patterns", "A responsive website, portal, or product interface", "Agreed integrations and content-management guidance"],
    boundary: "The right scope may be a public website, a customer portal, or an operational product interface. The common requirement is a coherent journey across the visible experience and the organization behind it. Accessibility requirements and verification should be agreed for the actual audience and service.",
    related: ["custom-software", "business-systems"], concept: "digital-service-experience",
  },
  "technology-consulting": {
    name: "Technology consulting & modernization", proposition: "Understand what should change before deciding what to build.",
    fit: "Technology decisions often arrive before there is a shared view of the problem. A platform is reaching its limits, an integration is unreliable, or several teams need conflicting changes. Consulting creates a basis for decisions: what exists, what must remain, what could change, and what each option would mean.",
    approach: [
      { title: "Understand the current landscape", body: "Review workflows, applications, data, dependencies, and ownership together. Distinguish a product limitation from a process problem, and identify the constraints that genuinely shape the available choices." },
      { title: "Compare viable paths", body: "Consider keeping, improving, integrating, replacing, or building systems. Evaluate tradeoffs in complexity, maintainability, transition risk, and organizational capacity rather than treating a new platform as the default answer." },
      { title: "Sequence the change", body: "A modernization roadmap should show dependencies and decision points. Smaller stages can make assumptions testable and keep essential operations running while the organization moves toward a different system." },
    ],
    outputs: ["A current-state systems and dependency review", "An options assessment with explicit tradeoffs", "A proposed architecture or platform direction", "A prioritized roadmap and decision record"],
    boundary: "Advisory work can stand on its own or inform a later delivery engagement. The scope should specify the decisions to support, the evidence available, and the people who will act on the recommendations. A roadmap is useful only when it is grounded in the organization's ability to carry it out.",
    related: ["business-systems", "custom-software"],
  },
};

export type IndustryDetail = { name: string; context: string; journey: string[]; story: Story[]; services: string[]; question: string };
export const industryDetails: Record<string, IndustryDetail> = {
  "business-enterprise": {
    name: "Business & enterprise", context: "Growth makes the connections between teams more important. An order may touch sales, stock, purchasing, dispatch, and finance before it is complete. When each team sees only its own step, exceptions become difficult to resolve and management reports arrive after the decisions they were meant to support.",
    journey: ["Request or order", "Availability and approval", "Fulfillment", "Reconciliation and reporting"],
    story: [
      { title: "One process, different responsibilities", body: "A useful system can preserve distinct team responsibilities while connecting their records. The design questions include who can change an order, which approval is required, and how another team learns that something has changed." },
      { title: "Improve the connections first", body: "Not every existing tool needs to be replaced. Start by examining shared identifiers, repeated data entry, and unreliable handoffs. A focused integration or redesigned workflow may resolve the immediate problem before a larger platform change is needed." },
      { title: "Make exceptions visible", body: "Routine transactions are only part of the picture. Delays, mismatches, missing information, and approvals need an owner and a clear next step. Reporting becomes more useful when it points to decisions that someone can actually make." },
    ], services: ["business-systems", "custom-software"], question: "Which workflow becomes hardest to manage as your teams or locations grow?",
  },
  government: {
    name: "Government & public sector", context: "A public service must make sense to people who do not know how the organization is arranged. Behind a request may be several departments, records, decisions, and channels. A digital system needs to connect those responsibilities without making the public navigate the internal complexity.",
    journey: ["Find a service", "Submit a request", "Review and route", "Communicate a decision"],
    story: [
      { title: "Design around the service", body: "Start with what someone is trying to do, what information is genuinely needed, and what happens next. Plain language, accessible patterns, and support for different access needs belong in the service design discussion." },
      { title: "Connect public and staff journeys", body: "A request should reach an accountable team with enough context to act. Status definitions, access permissions, record history, and exceptional cases need to be designed alongside the public interface. Digitizing a form alone does not create an end-to-end service." },
      { title: "Plan for stewardship", body: "Consider maintainability, staff changes, existing records, and the capacity to operate the system over time. Applicable security, accessibility, procurement, and records requirements must be established for the specific engagement; they cannot be assumed from a generic platform choice." },
    ], services: ["digital-experiences", "technology-consulting"], question: "Where does a public request lose clarity between submission and resolution?",
  },
  development: {
    name: "NGOs & development organizations", context: "Program teams need information that reflects what is happening in the field without turning delivery into repeated data entry. Different locations, connectivity conditions, reporting requirements, and responsibilities can make a single dependable picture difficult to maintain.",
    journey: ["Field activity", "Capture and review", "Program evidence", "Reporting and decisions"],
    story: [
      { title: "Respect field conditions", body: "The right workflow depends on the people collecting information, the devices available, and how reliably they can connect. Offline capture, synchronization, and validation may be relevant, but their behavior needs to be designed around actual working conditions." },
      { title: "Keep evidence connected", body: "Records need enough context to be useful: where information came from, who reviewed it, and what it relates to. Shared definitions and traceable changes can support reporting without asking each team to reconstruct the same evidence separately." },
      { title: "Be deliberate about access", body: "Program information can include sensitive material. Discuss which data is necessary, who needs access, and how information is shared or retained. A system should support the organization's agreed practices rather than quietly introduce a new set of assumptions." },
    ], services: ["custom-software", "business-systems"], question: "Which reporting or field-data task takes time away from program delivery?",
  },
  startups: {
    name: "Startups & technology ventures", context: "Early product decisions need to create learning without creating unnecessary infrastructure. A small team may need to validate a problem, make a first product usable, or replace fragile foundations as real usage grows. Each stage calls for a different balance of speed, scope, and maintainability.",
    journey: ["Frame the problem", "Test an assumption", "Build a focused release", "Learn from use"],
    story: [
      { title: "Choose what to learn first", body: "Define the user, the task, and the assumption that matters most. A prototype, a limited workflow, or a focused release can answer different questions. Feature volume is not a useful substitute for a clear reason to build." },
      { title: "Keep the first system coherent", body: "An MVP still needs understandable data, access rules, and a reliable core journey. Select the simplest architecture that supports those requirements, while identifying which shortcuts would make later changes difficult." },
      { title: "Evolve with evidence", body: "Use what is learned from real use to decide the next scope. Integration, operational tooling, and modernization become relevant as the product and team change. The aim is a foundation the team can own, not a complex platform built for an imagined future." },
    ], services: ["custom-software", "technology-consulting"], question: "What does your next release need to prove?",
  },
};

export const methodDetails = [
  { title: "Understand", body: "Start with the operating reality: the people doing the work, the decisions they make, and the constraints around them. Map an end-to-end workflow and include the exceptions. The purpose is a shared problem definition, not a list of features detached from their context.", participation: "Bring the people who use, manage, and will own the system into the discussion.", output: "A problem statement, workflow map, constraints, and priorities to review together." },
  { title: "Design", body: "Connect the proposed experience to the data, rules, integrations, and responsibilities behind it. Use workflows, interface designs, and architecture views to make choices concrete before implementation. Test uncertain assumptions and make tradeoffs explicit.", participation: "Review the proposed journeys and confirm how decisions and exceptions should work.", output: "An agreed design direction, technical approach, and a bounded delivery scope." },
  { title: "Engineer", body: "Turn the agreed design into working software in reviewable parts. Testing should cover the important journeys and failure conditions, not just the easiest path. Keep implementation decisions visible so that new information can be handled deliberately.", participation: "Review working increments and help resolve questions that need operational knowledge.", output: "Tested increments, documented decisions, and an updated view of remaining work." },
  { title: "Integrate", body: "Prepare the system for its actual environment. Consider existing applications, identity, data migration, deployment, and the people responsible for day-to-day use. Define how readiness will be assessed and how the transition will be managed.", participation: "Coordinate access, operational checks, training needs, and acceptance with the relevant owners.", output: "Agreed integrations, a transition plan, and operating and handover guidance." },
  { title: "Improve", body: "Learn from use after the system reaches its intended environment. Review unresolved friction, changing requirements, and opportunities to simplify. Prioritize improvements against the purpose of the system rather than allowing new features to accumulate without direction.", participation: "Bring user feedback and operational evidence into prioritization decisions.", output: "A prioritized improvement backlog and a separately agreed maintenance or next-stage scope." },
];

export const caseDetails: Record<string, { journey: string[]; considerations: Story[] }> = {
  "connected-operations-platform": { journey: ["Order recorded", "Stock and approval checked", "Dispatch coordinated", "Exceptions reconciled"], considerations: [
    { title: "Records and ownership", body: "A proposed design would define shared identifiers for orders, items, and locations, and identify which team can change each record. Reconciliation is needed where existing tools remain authoritative." },
    { title: "Exceptions and visibility", body: "Partial fulfillment, cancellations, and stock mismatches would need explicit states and owners. Dashboard views should reflect these states rather than hide unresolved work behind a single total." },
  ] },
  "digital-service-experience": { journey: ["Service identified", "Request submitted", "Assigned team reviews", "Decision and status shared"], considerations: [
    { title: "Access and status", body: "The proposed journey would distinguish public status from internal notes. Identity requirements, access permissions, and notification content would depend on the service and the information involved." },
    { title: "Incomplete and exceptional requests", body: "A request may need clarification, redirection, or a human decision. Those paths should have understandable instructions and a traceable handoff, not end with an unexplained error or a lost email." },
  ] },
  "purpose-built-workflow": { journey: ["Inspection planned", "Evidence captured", "Finding reviewed", "Corrective action closed"], considerations: [
    { title: "Offline and synchronized records", body: "An offline-first proposal needs rules for queued changes, conflicting edits, retries, and interrupted uploads. Connectivity behavior would require testing on the devices and networks used in the field." },
    { title: "Evidence and escalation", body: "Photos and findings would need to remain associated with the relevant site and inspection. Access, escalation criteria, and closure permissions should be agreed before treating the record as an operational source of truth." },
  ] },
};
