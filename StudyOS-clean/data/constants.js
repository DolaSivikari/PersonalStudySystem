// ==================== PMP 49 PROCESSES ====================
const PMP_KNOWLEDGE_AREAS = [
    { id: 'integration', name: 'Integration', color: '#8b5cf6', processes: [
        { num: '4.1', name: 'Develop Project Charter' },
        { num: '4.2', name: 'Develop Project Management Plan' },
        { num: '4.3', name: 'Direct and Manage Project Work' },
        { num: '4.4', name: 'Manage Project Knowledge' },
        { num: '4.5', name: 'Monitor and Control Project Work' },
        { num: '4.6', name: 'Perform Integrated Change Control' },
        { num: '4.7', name: 'Close Project or Phase' }
    ]},
    { id: 'scope', name: 'Scope', color: '#3b82f6', processes: [
        { num: '5.1', name: 'Plan Scope Management' },
        { num: '5.2', name: 'Collect Requirements' },
        { num: '5.3', name: 'Define Scope' },
        { num: '5.4', name: 'Create WBS' },
        { num: '5.5', name: 'Validate Scope' },
        { num: '5.6', name: 'Control Scope' }
    ]},
    { id: 'schedule', name: 'Schedule', color: '#06b6d4', processes: [
        { num: '6.1', name: 'Plan Schedule Management' },
        { num: '6.2', name: 'Define Activities' },
        { num: '6.3', name: 'Sequence Activities' },
        { num: '6.4', name: 'Estimate Activity Durations' },
        { num: '6.5', name: 'Develop Schedule' },
        { num: '6.6', name: 'Control Schedule' }
    ]},
    { id: 'cost', name: 'Cost', color: '#10b981', processes: [
        { num: '7.1', name: 'Plan Cost Management' },
        { num: '7.2', name: 'Estimate Costs' },
        { num: '7.3', name: 'Determine Budget' },
        { num: '7.4', name: 'Control Costs' }
    ]},
    { id: 'quality', name: 'Quality', color: '#22c55e', processes: [
        { num: '8.1', name: 'Plan Quality Management' },
        { num: '8.2', name: 'Manage Quality' },
        { num: '8.3', name: 'Control Quality' }
    ]},
    { id: 'resource', name: 'Resource', color: '#84cc16', processes: [
        { num: '9.1', name: 'Plan Resource Management' },
        { num: '9.2', name: 'Estimate Activity Resources' },
        { num: '9.3', name: 'Acquire Resources' },
        { num: '9.4', name: 'Develop Team' },
        { num: '9.5', name: 'Manage Team' },
        { num: '9.6', name: 'Control Resources' }
    ]},
    { id: 'communications', name: 'Comms', color: '#eab308', processes: [
        { num: '10.1', name: 'Plan Communications Management' },
        { num: '10.2', name: 'Manage Communications' },
        { num: '10.3', name: 'Monitor Communications' }
    ]},
    { id: 'risk', name: 'Risk', color: '#f97316', processes: [
        { num: '11.1', name: 'Plan Risk Management' },
        { num: '11.2', name: 'Identify Risks' },
        { num: '11.3', name: 'Perform Qualitative Risk Analysis' },
        { num: '11.4', name: 'Perform Quantitative Risk Analysis' },
        { num: '11.5', name: 'Plan Risk Responses' },
        { num: '11.6', name: 'Implement Risk Responses' },
        { num: '11.7', name: 'Monitor Risks' }
    ]},
    { id: 'procurement', name: 'Procurement', color: '#ef4444', processes: [
        { num: '12.1', name: 'Plan Procurement Management' },
        { num: '12.2', name: 'Conduct Procurements' },
        { num: '12.3', name: 'Control Procurements' }
    ]},
    { id: 'stakeholder', name: 'Stakeholder', color: '#ec4899', processes: [
        { num: '13.1', name: 'Identify Stakeholders' },
        { num: '13.2', name: 'Plan Stakeholder Engagement' },
        { num: '13.3', name: 'Manage Stakeholder Engagement' },
        { num: '13.4', name: 'Monitor Stakeholder Engagement' }
    ]}
];

// ==================== WISDOM & PRINCIPLES ====================
const WISDOM = [
    { quote: "The successful warrior is the average man, with laser-like focus.", source: "Bruce Lee" },
    { quote: "We are what we repeatedly do. Excellence is not an act, but a habit.", source: "Aristotle" },
    { quote: "The impediment to action advances action. What stands in the way becomes the way.", source: "Marcus Aurelius" },
    { quote: "Discipline equals freedom.", source: "Jocko Willink" },
    { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", source: "Chinese Proverb" },
    { quote: "Hard choices, easy life. Easy choices, hard life.", source: "Jerzy Gregorek" },
    { quote: "You do not rise to the level of your goals. You fall to the level of your systems.", source: "James Clear" },
    { quote: "The man who moves a mountain begins by carrying away small stones.", source: "Confucius" },
    { quote: "Be not afraid of going slowly, be afraid only of standing still.", source: "Chinese Proverb" },
    { quote: "First, master the fundamentals.", source: "Larry Bird" },
    { quote: "A project manager's job is not to know everything, but to know who knows.", source: "Construction PM Wisdom" },
    { quote: "In nuclear, there are no small mistakes. Attention to detail is not optional.", source: "Nuclear Industry Principle" },
    { quote: "Schedule drives budget. Understand the schedule, control the project.", source: "Construction Management" },
    { quote: "The amateur practices until they get it right. The professional practices until they can't get it wrong.", source: "Unknown" },
    { quote: "Think in decades. Act in days.", source: "Shreyas Doshi" }
];

const TIPS = {
    dashboard: [
        { type: 'info', title: 'Morning Routine', text: 'Start each day with the Protocol. It takes 5 minutes and sets your direction.' },
        { type: 'info', title: 'Compound Effect', text: '1% better daily = 37x better in a year. Small consistent actions beat sporadic big efforts.' }
    ],
    protocol: [
        { type: 'info', title: 'Why This Matters', text: 'The morning sets the trajectory. Top performers have non-negotiable morning routines.' },
        { type: 'success', title: 'Your Strength', text: 'Deliberative (#1): Use this time to think carefully about what truly matters today.' }
    ],
    discipline: [
        { type: 'info', title: 'The Scorecard', text: 'Rate yourself honestly. The goal isn\'t perfection—it\'s awareness and gradual improvement.' },
        { type: 'warning', title: 'Consistency > Intensity', text: 'A 70% day every day beats a 100% day once a week.' }
    ],
    learn: [
        { type: 'info', title: 'Active Recall', text: 'Don\'t just read. Test yourself. Write from memory. Explain concepts out loud.' },
        { type: 'info', title: 'Spaced Repetition', text: 'Review material at increasing intervals: 1 day, 3 days, 1 week, 2 weeks, 1 month.' }
    ],
    goals: [
        { type: 'info', title: 'Break It Down', text: 'If a goal feels overwhelming, it\'s not broken down enough. Add more milestones.' },
        { type: 'success', title: 'Your Strength', text: 'Analytical (#2): Use this to identify the critical path to each goal.' }
    ],
    tasks: [
        { type: 'info', title: 'Eat the Frog', text: 'Do your most important (often hardest) task first when energy is highest.' },
        { type: 'warning', title: 'Urgent vs Important', text: 'Important tasks build your future. Urgent tasks manage the present. Prioritize important.' }
    ],
    tracker: [
        { type: 'info', title: 'What Gets Measured', text: 'Tracking time reveals truth. You\'ll discover where hours actually go.' },
        { type: 'info', title: 'Deep Work Target', text: 'Aim for 3-4 hours of focused study daily. Quality beats quantity.' }
    ],
    habits: [
        { type: 'info', title: 'Habit Stacking', text: 'Attach new habits to existing ones: "After I [CURRENT HABIT], I will [NEW HABIT]."' },
        { type: 'info', title: 'Never Miss Twice', text: 'Missing once is an accident. Missing twice is the start of a new (bad) habit.' }
    ],
    journal: [
        { type: 'info', title: 'Reflection Compounds', text: 'Weekly reviews are where real learning happens. Patterns become visible.' },
        { type: 'success', title: 'Your Strength', text: 'Context (#4): Use journaling to see how past patterns inform future decisions.' }
    ]
};

// ==================== DISCIPLINE SYSTEM ====================
const DISCIPLINES = [
    { id: 'wake', name: 'Wake on time', desc: 'Started day at planned time', max: 10 },
    { id: 'protocol', name: 'Morning Protocol', desc: 'Completed morning routine', max: 10 },
    { id: 'focus', name: 'Deep Work', desc: '3+ hours focused study/work', max: 10 },
    { id: 'learn', name: 'Learning', desc: 'Studied something new', max: 10 },
    { id: 'health', name: 'Health', desc: 'Exercise, nutrition, sleep', max: 10 }
];

// ==================== LEARNING PATHWAYS ====================
const PATHWAYS = {
    pmp: {
        name: 'PMP Certification',
        desc: 'Project Management Professional - PMI',
        modules: [
            { id: 'p1', name: 'Integration Management', topics: ['Project charter', 'Project plan', 'Change control', 'Close project'], hours: 15 },
            { id: 'p2', name: 'Scope Management', topics: ['Requirements', 'WBS', 'Scope control'], hours: 12 },
            { id: 'p3', name: 'Schedule Management', topics: ['Activity sequencing', 'CPM', 'Schedule compression', 'Gantt charts'], hours: 15 },
            { id: 'p4', name: 'Cost Management', topics: ['Estimating', 'Budgeting', 'Earned Value Management'], hours: 15 },
            { id: 'p5', name: 'Quality Management', topics: ['Quality planning', 'QA/QC', 'Continuous improvement'], hours: 10 },
            { id: 'p6', name: 'Resource Management', topics: ['Team development', 'RACI', 'Conflict resolution'], hours: 12 },
            { id: 'p7', name: 'Communications', topics: ['Communication planning', 'Stakeholder engagement', 'Reporting'], hours: 8 },
            { id: 'p8', name: 'Risk Management', topics: ['Risk identification', 'Qualitative/Quantitative analysis', 'Response planning'], hours: 15 },
            { id: 'p9', name: 'Procurement', topics: ['Contract types', 'Procurement process', 'Vendor management'], hours: 10 },
            { id: 'p10', name: 'Stakeholder Management', topics: ['Stakeholder analysis', 'Engagement strategies'], hours: 8 }
        ]
    },
    mcmaster: {
        name: 'McMaster BTech Prep',
        desc: 'Civil Engineering Infrastructure Technology — aligned with CEBOK3',
        modules: [
            { id: 'm1', name: 'Mathematics Review', topics: ['Calculus', 'Linear algebra', 'Differential equations', 'Statistics & probability'], hours: 40 },
            { id: 'm2', name: 'Engineering Mechanics', topics: ['Statics', 'Dynamics', 'Strength of materials', 'Structural analysis'], hours: 35 },
            { id: 'm3', name: 'Materials Science', topics: ['Concrete properties', 'Steel behavior', 'Timber & composites', 'Material testing'], hours: 20 },
            { id: 'm4', name: 'Geotechnical Engineering', topics: ['Soil mechanics', 'Foundation design', 'Earth retention', 'Site investigation'], hours: 25 },
            { id: 'm5', name: 'Construction Methods & Estimating', topics: ['Heavy civil methods', 'Quantity takeoff', 'Cost estimating', 'Bid process'], hours: 25 },
            { id: 'm6', name: 'Engineering Economics', topics: ['Time value of money', 'Cost-benefit analysis', 'Life-cycle costing', 'Economic decision making'], hours: 15 },
            { id: 'm7', name: 'Sustainability & Environment', topics: ['Environmental impact', 'Resource efficiency', 'Green infrastructure', 'Climate adaptation'], hours: 15 },
            { id: 'm8', name: 'Design & Breadth in CE', topics: ['Design process', 'Transportation basics', 'Water resources', 'Environmental engineering'], hours: 20 }
        ]
    },
    smr: {
        name: 'SMR Specialization',
        desc: 'Small Modular Reactor Construction',
        modules: [
            { id: 's1', name: 'Nuclear Industry Overview', topics: ['Regulatory framework', 'CNSC', 'Safety culture'], hours: 15 },
            { id: 's2', name: 'Nuclear-Grade QA/QC', topics: ['CSA N299', 'Quality programs', 'Documentation'], hours: 20 },
            { id: 's3', name: 'Modular Construction', topics: ['Off-site fabrication', 'Heavy lift logistics', 'Sequencing'], hours: 15 },
            { id: 's4', name: 'Nuclear Concrete', topics: ['Specifications', 'Placement', 'Testing requirements'], hours: 15 },
            { id: 's5', name: 'Project Controls', topics: ['EVM for nuclear', 'Schedule risk analysis', 'Change management'], hours: 20 }
        ]
    }
};


// ==================== LEARNING SCIENCE ENHANCEMENTS ====================

// Phase 4: Elaboration Prompts (from Make It Stick)
const ELABORATION_PROMPTS = [
    "Explain what you just studied as if teaching a new intern on a construction site.",
    "What real-world example from your experience illustrates this concept?",
    "How does this connect to something you already knew before today?",
    "If this concept is true, what else must also be true?",
    "What would happen if the opposite of this were true?",
    "How does this relate to another subject you're studying?",
    "Can you create an analogy using something from everyday life?",
    "What surprised you about this material? Why?",
    "How would you apply this in a nuclear construction project?",
    "What questions does this material raise that you can't yet answer?",
    "How does this challenge or confirm what you previously believed?",
    "Describe a scenario where getting this wrong would have real consequences.",
    "What's the most important takeaway, and why does it matter?",
    "How would you explain this to someone who disagrees with it?",
    "Connect this to one of the PMP knowledge areas. Which one, and how?"
];

// Phase 5: Critical Thinking Questions (from Asking the Right Questions)
const CRITICAL_THINKING_QUESTIONS = [
    { id: 'issue', label: 'What is the issue or topic?', hint: 'State the core question or controversy.' },
    { id: 'conclusion', label: 'What is the conclusion or claim?', hint: 'What is the author/source trying to convince you of?' },
    { id: 'reasons', label: 'What are the reasons?', hint: 'What evidence or arguments support the conclusion?' },
    { id: 'ambiguity', label: 'What words or phrases are ambiguous?', hint: 'Are key terms defined clearly, or could they mean different things?' },
    { id: 'valueAssumptions', label: 'What are the value assumptions?', hint: 'What unstated values or priorities underlie the argument?' },
    { id: 'descriptiveAssumptions', label: 'What are the descriptive assumptions?', hint: 'What beliefs about how the world works are taken for granted?' },
    { id: 'fallacies', label: 'Are there any fallacies in the reasoning?', hint: 'Look for: ad hominem, straw man, false dilemma, slippery slope, appeal to authority.' },
    { id: 'evidence', label: 'How good is the evidence?', hint: 'Is it based on research, anecdote, authority, or intuition? How reliable?' },
    { id: 'rivalCauses', label: 'Are there rival causes or alternative explanations?', hint: 'Could something else explain the same outcome?' },
    { id: 'omitted', label: 'What significant information is omitted?', hint: 'What would you need to know to fully evaluate this claim?' }
];

// ==================== PMBOK 7TH EDITION: 12 PRINCIPLES ====================
const PMP_PRINCIPLES = [
    { id: 'stewardship', num: 1, name: 'Be a Diligent, Respectful, and Caring Steward', icon: '🏛️', domain: 'Stakeholder', desc: 'Act with integrity, care, trustworthiness, and compliance. Consider financial, social, technical, and environmental impacts.' },
    { id: 'team', num: 2, name: 'Create a Collaborative Project Team Environment', icon: '👥', domain: 'Team', desc: 'Foster team agreements, shared ownership, and diverse perspectives. Support individual and team learning.' },
    { id: 'stakeholders', num: 3, name: 'Effectively Engage with Stakeholders', icon: '🤝', domain: 'Stakeholder', desc: 'Proactively identify, analyze, and engage stakeholders throughout the project lifecycle.' },
    { id: 'value', num: 4, name: 'Focus on Value', icon: '💎', domain: 'Delivery', desc: 'Align project with business objectives. Continuously evaluate and adjust to maximize value delivery.' },
    { id: 'systems', num: 5, name: 'Recognize, Evaluate, and Respond to System Interactions', icon: '🔄', domain: 'Project Work', desc: 'Think holistically. Recognize that projects operate within larger systems and respond to internal/external factors.' },
    { id: 'leadership', num: 6, name: 'Demonstrate Leadership Behaviors', icon: '🌟', domain: 'Team', desc: 'Effective leadership is not limited to a single person. Adapt leadership style to context and motivate the team.' },
    { id: 'tailoring', num: 7, name: 'Tailor Based on Context', icon: '✂️', domain: 'Planning', desc: 'Design the project approach based on the unique context — goals, stakeholders, governance, and environment.' },
    { id: 'quality', num: 8, name: 'Build Quality into Processes and Deliverables', icon: '✅', domain: 'Delivery', desc: 'Quality is planned in, not inspected in. Focus on prevention over inspection.' },
    { id: 'complexity', num: 9, name: 'Navigate Complexity', icon: '🧩', domain: 'Uncertainty', desc: 'Continuously evaluate and navigate project complexity driven by human behavior, system interactions, and ambiguity.' },
    { id: 'risk', num: 10, name: 'Optimize Risk Responses', icon: '⚖️', domain: 'Uncertainty', desc: 'Assess both threats and opportunities. Select and implement optimal risk responses.' },
    { id: 'adaptability', num: 11, name: 'Embrace Adaptability and Resiliency', icon: '🌊', domain: 'Project Work', desc: 'Build adaptability and resiliency into approaches. Be prepared to adapt when conditions change.' },
    { id: 'change', num: 12, name: 'Enable Change to Achieve the Envisioned Future State', icon: '🚀', domain: 'Delivery', desc: 'Prepare impacted stakeholders for adoption and sustained change. Address change fatigue.' }
];

// ==================== PMBOK 7TH EDITION: 8 PERFORMANCE DOMAINS ====================
const PMP_DOMAINS = [
    { id: 'stakeholder', name: 'Stakeholder', icon: '🤝', principles: ['stewardship','stakeholders'], desc: 'Activities related to stakeholders. Outcomes: productive working relationship, stakeholder agreement, stakeholder satisfaction.' },
    { id: 'team', name: 'Team', icon: '👥', principles: ['team','leadership'], desc: 'Activities related to the project team. Outcomes: shared ownership, high-performing team, applicable leadership.' },
    { id: 'devapproach', name: 'Development Approach & Life Cycle', icon: '🔄', principles: ['tailoring'], desc: 'Activities related to development approach, cadence, and project life cycle phases.' },
    { id: 'planning', name: 'Planning', icon: '📋', principles: ['tailoring','systems'], desc: 'Activities for organizing, elaborating, and coordinating project work. Evolves throughout the project.' },
    { id: 'projectwork', name: 'Project Work', icon: '⚙️', principles: ['systems','adaptability'], desc: 'Activities for establishing processes, managing resources, and fostering a learning environment.' },
    { id: 'delivery', name: 'Delivery', icon: '📦', principles: ['value','quality','change'], desc: 'Activities for delivering the scope, quality, and outcomes the project was undertaken to achieve.' },
    { id: 'measurement', name: 'Measurement', icon: '📊', principles: ['value','quality'], desc: 'Activities for assessing project performance and taking appropriate responsive actions (EVM, KPIs, dashboards).' },
    { id: 'uncertainty', name: 'Uncertainty', icon: '🎲', principles: ['complexity','risk'], desc: 'Activities for understanding and managing risk, ambiguity, and complexity.' }
];

// ==================== ITTO DATA (Key ITTOs per Process) ====================
const PMP_ITTOS = {
    '4.1': { inputs: ['Business documents','Agreements','Enterprise environmental factors','Organizational process assets'], tools: ['Expert judgment','Data gathering (brainstorming, focus groups)','Interpersonal skills (conflict mgmt, facilitation)','Meetings'], outputs: ['Project charter','Assumption log'] },
    '4.2': { inputs: ['Project charter','Outputs from other processes','Enterprise environmental factors','Organizational process assets'], tools: ['Expert judgment','Data gathering','Interpersonal skills','Meetings'], outputs: ['Project management plan'] },
    '4.3': { inputs: ['Project management plan','Project documents','Approved change requests','Enterprise environmental factors'], tools: ['Expert judgment','Project management information system (PMIS)','Meetings'], outputs: ['Deliverables','Work performance data','Issue log','Change requests','Project plan updates'] },
    '4.4': { inputs: ['Project management plan','Project documents','Deliverables','Enterprise environmental factors'], tools: ['Expert judgment','Knowledge management','Information management','Interpersonal skills'], outputs: ['Lessons learned register','Project plan updates'] },
    '4.5': { inputs: ['Project management plan','Project documents','Work performance information','Agreements'], tools: ['Expert judgment','Data analysis (alternatives, cost-benefit, EVM, trend)','Decision making','Meetings'], outputs: ['Work performance reports','Change requests','Project plan updates'] },
    '4.6': { inputs: ['Project management plan','Project documents','Work performance reports','Change requests'], tools: ['Expert judgment','Change control tools','Data analysis','Decision making','Meetings'], outputs: ['Approved change requests','Project plan updates','Project document updates'] },
    '4.7': { inputs: ['Project charter','Project management plan','Project documents','Accepted deliverables','Agreements'], tools: ['Expert judgment','Data analysis','Meetings'], outputs: ['Project documents updates','Final product/service/result transition','Final report','Organizational process assets updates'] },
    '5.1': { inputs: ['Project charter','Project management plan','Enterprise environmental factors'], tools: ['Expert judgment','Data analysis','Meetings'], outputs: ['Scope management plan','Requirements management plan'] },
    '5.2': { inputs: ['Project charter','Project management plan','Project documents','Agreements','Enterprise environmental factors'], tools: ['Expert judgment','Data gathering (brainstorming, interviews, questionnaires)','Data analysis','Decision making','Interpersonal skills','Context diagram','Prototypes'], outputs: ['Requirements documentation','Requirements traceability matrix'] },
    '5.3': { inputs: ['Project charter','Project management plan','Project documents','Enterprise environmental factors'], tools: ['Expert judgment','Data analysis','Decision making','Interpersonal skills'], outputs: ['Project scope statement','Project document updates'] },
    '5.4': { inputs: ['Project management plan','Project documents','Enterprise environmental factors'], tools: ['Expert judgment','Decomposition'], outputs: ['Scope baseline (scope statement + WBS + WBS dictionary)','Project document updates'] },
    '5.5': { inputs: ['Project management plan','Project documents','Verified deliverables','Work performance data'], tools: ['Inspection','Decision making'], outputs: ['Accepted deliverables','Work performance information','Change requests'] },
    '5.6': { inputs: ['Project management plan','Project documents','Work performance data'], tools: ['Data analysis (variance, trend)'], outputs: ['Work performance information','Change requests','Project plan updates'] },
    '6.1': { inputs: ['Project charter','Project management plan','Enterprise environmental factors'], tools: ['Expert judgment','Data analysis','Meetings'], outputs: ['Schedule management plan'] },
    '6.2': { inputs: ['Project management plan','Enterprise environmental factors'], tools: ['Expert judgment','Decomposition','Rolling wave planning','Meetings'], outputs: ['Activity list','Activity attributes','Milestone list'] },
    '6.3': { inputs: ['Project management plan','Project documents','Enterprise environmental factors'], tools: ['Precedence diagramming method (PDM)','Dependency determination','Leads and lags','PMIS'], outputs: ['Project schedule network diagrams','Project document updates'] },
    '6.4': { inputs: ['Project management plan','Project documents','Enterprise environmental factors'], tools: ['Expert judgment','Analogous estimating','Parametric estimating','Three-point estimating (PERT)','Bottom-up estimating','Data analysis','Decision making','Meetings'], outputs: ['Duration estimates','Basis of estimates','Project document updates'] },
    '6.5': { inputs: ['Project management plan','Project documents','Agreements','Enterprise environmental factors'], tools: ['Schedule network analysis','Critical path method (CPM)','Resource optimization','Data analysis (what-if, simulation)','Leads and lags','Schedule compression (crashing, fast tracking)','PMIS','Agile release planning'], outputs: ['Schedule baseline','Project schedule','Schedule data','Project calendars','Change requests'] },
    '6.6': { inputs: ['Project management plan','Project documents','Work performance data'], tools: ['Data analysis (EVM, iteration burndown, variance, trend, what-if)','Critical path method','PMIS','Resource optimization','Leads and lags','Schedule compression'], outputs: ['Work performance information','Schedule forecasts','Change requests','Project plan updates'] },
    '7.1': { inputs: ['Project charter','Project management plan','Enterprise environmental factors'], tools: ['Expert judgment','Data analysis','Meetings'], outputs: ['Cost management plan'] },
    '7.2': { inputs: ['Project management plan','Project documents','Enterprise environmental factors'], tools: ['Expert judgment','Analogous estimating','Parametric estimating','Bottom-up estimating','Three-point estimating','Data analysis','PMIS','Decision making'], outputs: ['Cost estimates','Basis of estimates','Project document updates'] },
    '7.3': { inputs: ['Project management plan','Project documents','Business documents','Agreements'], tools: ['Expert judgment','Cost aggregation','Data analysis (reserve analysis)','Historical information review','Funding limit reconciliation','Financing'], outputs: ['Cost baseline','Project funding requirements','Project document updates'] },
    '7.4': { inputs: ['Project management plan','Project documents','Project funding requirements','Work performance data'], tools: ['Expert judgment','Data analysis (EVM: PV, EV, AC, SV, CV, SPI, CPI, EAC, ETC, TCPI, VAC)','To-complete performance index','PMIS'], outputs: ['Work performance information','Cost forecasts','Change requests','Project plan updates'] },
    '8.1': { inputs: ['Project charter','Project management plan','Project documents','Enterprise environmental factors'], tools: ['Expert judgment','Data gathering','Data analysis (cost-benefit, cost of quality)','Decision making','Data representation (flowcharts, matrix diagrams, mind maps)','Test and inspection planning','Meetings'], outputs: ['Quality management plan','Quality metrics','Project plan updates','Project document updates'] },
    '11.1': { inputs: ['Project charter','Project management plan','Project documents','Enterprise environmental factors'], tools: ['Expert judgment','Data analysis (stakeholder analysis)','Meetings'], outputs: ['Risk management plan'] },
    '11.2': { inputs: ['Project management plan','Project documents','Agreements','Procurement documentation','Enterprise environmental factors'], tools: ['Expert judgment','Data gathering (brainstorming, checklists, interviews)','Data analysis (root cause, assumptions, SWOT)','Interpersonal skills','Prompt lists','Meetings'], outputs: ['Risk register','Risk report','Project document updates'] },
    '11.5': { inputs: ['Project management plan','Project documents','Enterprise environmental factors'], tools: ['Expert judgment','Data gathering','Interpersonal skills','Strategies for threats (escalate, avoid, transfer, mitigate, accept)','Strategies for opportunities (escalate, exploit, share, enhance, accept)','Contingent response strategies','Data analysis','Decision making'], outputs: ['Change requests','Project plan updates','Project document updates'] },
    '13.1': { inputs: ['Project charter','Business documents','Project management plan','Agreements','Enterprise environmental factors'], tools: ['Expert judgment','Data gathering','Data analysis (stakeholder analysis, document analysis)','Data representation (stakeholder mapping: power/interest grid, salience model)','Meetings'], outputs: ['Stakeholder register','Change requests','Project plan updates'] }
};

// ==================== EVM FORMULAS ====================
const EVM_FORMULAS = [
    { abbr: 'CV', name: 'Cost Variance', formula: 'EV - AC', interp: 'Positive = under budget' },
    { abbr: 'SV', name: 'Schedule Variance', formula: 'EV - PV', interp: 'Positive = ahead of schedule' },
    { abbr: 'CPI', name: 'Cost Performance Index', formula: 'EV / AC', interp: '>1 = under budget' },
    { abbr: 'SPI', name: 'Schedule Performance Index', formula: 'EV / PV', interp: '>1 = ahead of schedule' },
    { abbr: 'EAC₁', name: 'Estimate at Completion (atypical)', formula: 'AC + (BAC - EV)', interp: 'If current variance is atypical' },
    { abbr: 'EAC₂', name: 'Estimate at Completion (typical)', formula: 'BAC / CPI', interp: 'If current CPI will continue' },
    { abbr: 'EAC₃', name: 'Estimate at Completion (CPI+SPI)', formula: 'AC + (BAC - EV) / (CPI × SPI)', interp: 'Considers both cost and schedule' },
    { abbr: 'ETC', name: 'Estimate to Complete', formula: 'EAC - AC', interp: 'How much more will it cost' },
    { abbr: 'VAC', name: 'Variance at Completion', formula: 'BAC - EAC', interp: 'Positive = under budget at end' },
    { abbr: 'TCPI', name: 'To-Complete Performance Index (BAC)', formula: '(BAC - EV) / (BAC - AC)', interp: '<1 = easier, >1 = harder to meet BAC' },
    { abbr: 'TCPI₂', name: 'To-Complete Performance Index (EAC)', formula: '(BAC - EV) / (EAC - AC)', interp: 'Efficiency needed to meet new EAC' }
];

// ==================== PMP SCENARIO QUESTIONS ====================
const PMP_SCENARIOS = [
    { q: 'You are the PM on a construction project. The sponsor requests adding a new building wing not in the original scope. What should you do FIRST?', choices: ['Start planning the new wing immediately','Evaluate the impact through integrated change control','Tell the sponsor it cannot be done','Add it to the risk register'], answer: 1, principle: 'systems', process: '4.6', explain: 'All scope changes must go through Perform Integrated Change Control (4.6). Evaluate impact on schedule, cost, quality, and risk before making decisions.' },
    { q: 'During project execution, two team members have a persistent conflict about technical approach. As PM, what should you do?', choices: ['Escalate to the sponsor','Ignore it — they will resolve it themselves','Address it directly using conflict resolution techniques','Remove both team members'], answer: 2, principle: 'team', process: '9.5', explain: 'Manage Team (9.5) includes conflict management. The PM should address conflict directly. Collaboration/problem-solving is the preferred approach.' },
    { q: 'Your project CPI is 0.85 and SPI is 0.92. What does this tell you?', choices: ['The project is under budget and ahead of schedule','The project is over budget and behind schedule','The project is under budget and behind schedule','The project is over budget and ahead of schedule'], answer: 1, principle: 'value', process: '7.4', explain: 'CPI < 1 means over budget (getting less value per dollar). SPI < 1 means behind schedule. Both indices below 1 indicate trouble.' },
    { q: 'A key stakeholder is resistant to the project and actively blocking progress. What should you do FIRST?', choices: ['Remove the stakeholder from the project','Escalate to the sponsor immediately','Analyze the stakeholder\'s concerns and engagement level','Proceed without the stakeholder\'s input'], answer: 2, principle: 'stakeholders', process: '13.3', explain: 'Manage Stakeholder Engagement (13.3) requires understanding why stakeholders resist. Analyze their concerns first, then develop an engagement strategy.' },
    { q: 'You discover that a deliverable completed last week does not meet the quality requirements. What is the BEST course of action?', choices: ['Accept it and move on to save schedule','Log it as a lesson learned','Create a change request to rework the deliverable','Blame the team member who produced it'], answer: 2, principle: 'quality', process: '8.3', explain: 'Control Quality (8.3) identifies nonconformance. A change request for corrective action (rework) is the proper process. Quality cannot be compromised.' },
    { q: 'You are starting a new agile project. Stakeholders want a detailed 18-month Gantt chart. What is the BEST approach?', choices: ['Create the detailed Gantt chart as requested','Explain agile uses only a product backlog, no schedule','Create a high-level roadmap with progressive elaboration at iteration level','Refuse to plan beyond the current sprint'], answer: 2, principle: 'tailoring', process: '6.5', explain: 'Tailor based on context (Principle 7). For agile, use rolling wave planning — high-level roadmap for the long term, detailed planning for near-term iterations.' },
    { q: 'During risk identification, a team member identifies a risk with very low probability but catastrophic impact (nuclear safety incident). How should this be handled?', choices: ['Ignore it due to low probability','Add it to the watch list','Develop a detailed risk response plan including avoidance strategy','Accept the risk passively'], answer: 2, principle: 'risk', process: '11.5', explain: 'In nuclear construction, catastrophic-impact risks require active response plans regardless of probability. Safety risks demand avoidance or mitigation strategies.' },
    { q: 'Halfway through the project, you realize the original requirements no longer align with business needs due to market changes. What should you do?', choices: ['Continue with original requirements — a change will increase costs','Initiate change control to re-evaluate and realign scope with current business value','Stop the project immediately','Ask the sponsor to decide everything'], answer: 1, principle: 'value', process: '4.6', explain: 'Focus on Value (Principle 4). Projects must deliver value. If business needs change, use integrated change control to realign the project with current value targets.' },
    { q: 'Your project team is distributed across 3 time zones. Communication is breaking down. What is the MOST effective action?', choices: ['Require everyone to work the same hours','Create a communications management plan with agreed protocols','Send more emails','Reduce team size'], answer: 1, principle: 'team', process: '10.1', explain: 'Plan Communications Management (10.1) defines who needs what info, when, and how. For distributed teams, establish communication protocols, tools, and overlapping hours.' },
    { q: 'A vendor delivers materials that are 10% cheaper than contracted but have lower specifications. What should you do?', choices: ['Accept the materials to save money','Reject the materials and request contract compliance','Use them for non-critical components','Renegotiate the contract for the lower specification'], answer: 1, principle: 'quality', process: '12.3', explain: 'Control Procurements (12.3) ensures contract compliance. The vendor must deliver what was contracted. Lower specs could compromise quality and safety.' }
];

// ==================== 6TH ↔ 7TH CROSS-REFERENCE ====================
const PMP_CROSS_REF = {
    'integration': { domain: 'projectwork', principles: ['systems','leadership','adaptability'], pg6: ['4.1','4.2','4.3','4.4','4.5','4.6','4.7'] },
    'scope': { domain: 'planning', principles: ['tailoring','value'], pg6: ['5.1','5.2','5.3','5.4','5.5','5.6'] },
    'schedule': { domain: 'planning', principles: ['tailoring','value'], pg6: ['6.1','6.2','6.3','6.4','6.5','6.6'] },
    'cost': { domain: 'measurement', principles: ['value','stewardship'], pg6: ['7.1','7.2','7.3','7.4'] },
    'quality': { domain: 'delivery', principles: ['quality','value'], pg6: ['8.1','8.2','8.3'] },
    'resource': { domain: 'team', principles: ['team','leadership'], pg6: ['9.1','9.2','9.3','9.4','9.5','9.6'] },
    'communications': { domain: 'stakeholder', principles: ['stakeholders','team'], pg6: ['10.1','10.2','10.3'] },
    'risk': { domain: 'uncertainty', principles: ['risk','complexity'], pg6: ['11.1','11.2','11.3','11.4','11.5','11.6','11.7'] },
    'procurement': { domain: 'projectwork', principles: ['stewardship','systems'], pg6: ['12.1','12.2','12.3'] },
    'stakeholder': { domain: 'stakeholder', principles: ['stakeholders','stewardship','change'], pg6: ['13.1','13.2','13.3','13.4'] }
};

// ==================== CEBOK3: 21 CIVIL ENGINEERING OUTCOMES ====================
// Bloom's Taxonomy Levels: 1=Remember, 2=Understand, 3=Apply, 4=Analyze, 5=Evaluate, 6=Create
const CEBOK3_OUTCOMES = {
    foundational: {
        name: 'Foundational', icon: '📐', outcomes: [
            { id: 'math', name: 'Mathematics', bloomTarget: 4, desc: 'Calculus, linear algebra, differential equations, probability, statistics for engineering analysis.' },
            { id: 'natSci', name: 'Natural Sciences', bloomTarget: 4, desc: 'Physics, chemistry, earth sciences as foundation for engineering problem solving.' },
            { id: 'socSci', name: 'Social Sciences', bloomTarget: 3, desc: 'Economics, sociology, political science — understanding forces shaping infrastructure decisions.' },
            { id: 'humanities', name: 'Humanities', bloomTarget: 2, desc: 'History, philosophy, cultural awareness informing ethical and societal engineering decisions.' }
        ]
    },
    engFundamentals: {
        name: 'Engineering Fundamentals', icon: '⚙️', outcomes: [
            { id: 'materials', name: 'Materials Science', bloomTarget: 4, desc: 'Properties of steel, concrete, timber, composites. Material selection and behavior under load.' },
            { id: 'mechanics', name: 'Engineering Mechanics', bloomTarget: 4, desc: 'Statics, dynamics, strength of materials, structural analysis. Force systems and equilibrium.' },
            { id: 'experiments', name: 'Experimental Methods & Data Analysis', bloomTarget: 4, desc: 'Lab testing, field measurement, statistical analysis, data interpretation for engineering decisions.' },
            { id: 'critThinking', name: 'Critical Thinking & Problem Solving', bloomTarget: 5, desc: 'Systematic approaches to complex problems. Identifying assumptions, evaluating evidence, synthesizing solutions.' }
        ]
    },
    technical: {
        name: 'Technical', icon: '🏗️', outcomes: [
            { id: 'projMgmt', name: 'Project Management', bloomTarget: 4, desc: 'Planning, scheduling, cost control, resource management, risk management for civil engineering projects.' },
            { id: 'engEcon', name: 'Engineering Economics', bloomTarget: 4, desc: 'Time value of money, cost-benefit analysis, life-cycle costing, economic decision making.' },
            { id: 'riskUncert', name: 'Risk & Uncertainty', bloomTarget: 4, desc: 'Risk identification, assessment, quantification, and management in civil engineering context.' },
            { id: 'breadth', name: 'Breadth in CE Areas', bloomTarget: 3, desc: 'Exposure across structural, geotech, water resources, environmental, transportation, construction.' },
            { id: 'design', name: 'Design', bloomTarget: 5, desc: 'Engineering design process including problem definition, alternatives, analysis, and optimization.' },
            { id: 'depth', name: 'Depth in a CE Area', bloomTarget: 5, desc: 'Advanced competency in at least one CE specialization (e.g., nuclear construction, heavy civil).' },
            { id: 'sustainability', name: 'Sustainability', bloomTarget: 4, desc: 'Environmental stewardship, resource efficiency, social equity in engineering decisions.' }
        ]
    },
    professional: {
        name: 'Professional', icon: '💼', outcomes: [
            { id: 'communication', name: 'Communication', bloomTarget: 5, desc: 'Written, oral, graphical, and digital communication for technical and non-technical audiences.' },
            { id: 'teamLead', name: 'Teamwork & Leadership', bloomTarget: 4, desc: 'Collaborative work, conflict resolution, mentoring, leading diverse teams on complex projects.' },
            { id: 'lifelong', name: 'Lifelong Learning', bloomTarget: 5, desc: 'Self-directed learning, professional development, staying current with technology and standards.' },
            { id: 'profAttitudes', name: 'Professional Attitudes', bloomTarget: 4, desc: 'Commitment to quality, safety, public welfare, and the profession. Creativity, curiosity, persistence.' },
            { id: 'profRespons', name: 'Professional Responsibilities', bloomTarget: 5, desc: 'Licensure, codes, standards, regulations, business practices, public policy engagement.' },
            { id: 'ethics', name: 'Ethical Responsibilities', bloomTarget: 5, desc: 'ASCE/PEO code of ethics, moral reasoning, resolving ethical dilemmas in practice.' }
        ]
    }
};

const BLOOMS_LEVELS = [
    { level: 1, name: 'Remember', verb: 'Recall', desc: 'Retrieve relevant knowledge from memory', color: '#94a3b8' },
    { level: 2, name: 'Understand', verb: 'Explain', desc: 'Construct meaning from information', color: '#60a5fa' },
    { level: 3, name: 'Apply', verb: 'Use', desc: 'Carry out a procedure in a given situation', color: '#34d399' },
    { level: 4, name: 'Analyze', verb: 'Differentiate', desc: 'Break material into parts and determine relationships', color: '#fbbf24' },
    { level: 5, name: 'Evaluate', verb: 'Judge', desc: 'Make judgments based on criteria and standards', color: '#f97316' },
    { level: 6, name: 'Create', verb: 'Design', desc: 'Put elements together to form a novel, coherent whole', color: '#ef4444' }
];

// ==================== CONSTRUCTION ESTIMATING REFERENCE ====================
const ESTIMATING_PROCESS = [
    { step: 1, name: 'Review Bid Documents', desc: 'Study drawings, specs, addenda. Create query list. Visit site.', icon: '📋' },
    { step: 2, name: 'Quantity Takeoff', desc: 'Measure all work items from drawings. Net in-place quantities. Organize by trade/CSI division.', icon: '📐' },
    { step: 3, name: 'Price Labor', desc: 'Crew composition × hourly rates × productivity factors. Include burden (benefits, taxes, insurance).', icon: '👷' },
    { step: 4, name: 'Price Materials', desc: 'Unit costs × quantities + waste factors. Get supplier quotes. Include delivery and taxes.', icon: '🧱' },
    { step: 5, name: 'Price Equipment', desc: 'Rental/ownership costs + operating costs (fuel, maintenance). Match to production rates.', icon: '🚜' },
    { step: 6, name: 'Subcontractor Pricing', desc: 'Obtain minimum 3 quotes per trade. Evaluate scope coverage. Check exclusions.', icon: '🤝' },
    { step: 7, name: 'General Expenses / Site Overhead', desc: 'Temp facilities, supervision, site office, utilities, insurance, permits, cleanup.', icon: '🏢' },
    { step: 8, name: 'Head Office Overhead', desc: 'Company overhead allocated to project as percentage of total cost.', icon: '🏛️' },
    { step: 9, name: 'Markup & Profit', desc: 'Risk assessment drives markup percentage. Consider competition, project complexity, bonding.', icon: '💰' },
    { step: 10, name: 'Bid Closing', desc: 'Final sub quotes, last-minute adjustments, management review, bid submission.', icon: '📨' }
];

const ESTIMATING_FORMULAS = [
    { name: 'Swell Factor', formula: 'Swell Volume = Bank Volume × (1 + Swell %)', example: '100 m³ bank × 1.25 = 125 m³ loose' },
    { name: 'Compaction Factor', formula: 'Compacted Volume = Bank Volume × (1 - Shrinkage %)', example: '100 m³ bank × 0.90 = 90 m³ compacted' },
    { name: 'Labor Cost', formula: 'Labor = (Quantity / Productivity) × Crew Rate', example: '100 m² formwork / 3.5 m²/hr × $45/hr = $1,286' },
    { name: 'Unit Cost', formula: 'Unit Cost = (Labor + Material + Equipment) / Quantity', example: 'Total $50,000 / 200 m³ = $250/m³' },
    { name: 'Waste Factor', formula: 'Order Qty = Net Qty × (1 + Waste %)', example: '1000 bricks × 1.05 = 1050 bricks ordered' },
    { name: 'Markup', formula: 'Bid Price = Direct Cost + OH + Profit', example: '$100K + 10% OH + 8% Profit = $118,000' },
    { name: 'Productivity Rate', formula: 'Hours = Quantity / (Crew Size × Output/hr)', example: '500 m² / (4 workers × 2 m²/hr) = 62.5 hrs' },
    { name: 'Life-Cycle Cost', formula: 'LCC = Initial Cost + PV(Operating) + PV(Maintenance) - PV(Salvage)', example: 'Compare options over 25-year life using discount rate' }
];
