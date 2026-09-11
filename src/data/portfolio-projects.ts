export type PortfolioProject = {
  id: string
  slug: string
  title: string
  category: 'Applied AI & Machine Learning' | 'Digital Systems & Intelligent Automation'
  overview: string
  problem: string
  solution: string
  technologyStack: string[]
  architecture: { layer: string; detail: string }[]
  impact: { value: string; label: string; basis: string }[]
  featured: boolean
  displayOrder: number
}

export const portfolioCategories = [
  'All Projects',
  'Applied AI & Machine Learning',
  'Digital Systems & Intelligent Automation',
] as const

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'automotive-quality-inspection',
    slug: 'automotive-quality-inspection',
    title: 'Automated Quality Inspection for Commercial Automotive Manufacturing',
    category: 'Applied AI & Machine Learning',
    overview:
      'High-speed automated optical inspection pipeline combining deep learning computer vision and edge computing for real-time defect classification on automotive assembly lines.',
    problem:
      'High-throughput automotive component manufacturing and machining lines require rigorous surface defect identification (micro-fractures, porosity, and dimensional variance). Manual visual inspection is susceptible to operator fatigue, subjective variance, and throughput bottlenecks at production speeds.',
    solution:
      'Engineered an edge-accelerated computer vision inspection system integrating multi-angle industrial strobed illumination, high-speed line-scan image capture, and customized convolutional defect segmentation models. Detected defects trigger sub-second pneumatic reject actuators with automated defect telemetry logged to the manufacturing execution system.',
    technologyStack: [
      'Python',
      'PyTorch',
      'OpenCV',
      'TensorRT',
      'FastAPI',
      'Edge Computing',
      'Docker',
      'Industrial PLC',
    ],
    architecture: [
      { layer: 'Image Capture', detail: 'Industrial line-scan cameras capturing high-resolution component frames under controlled strobed multi-spectrum illumination.' },
      { layer: 'Edge Inference', detail: 'Low-latency TensorRT runtime running convolutional defect segmentation models on ruggedized edge compute nodes.' },
      { layer: 'Actuation & Sort', detail: 'High-speed industrial PLC signals activating pneumatic reject mechanisms for out-of-tolerance components.' },
      { layer: 'Quality Intelligence', detail: 'Supervisory web dashboard aggregating yield trends, defect heatmaps, and batch traceability records.' },
    ],
    impact: [
      { value: '99.4%', label: 'Automated Defect Detection', basis: 'Measured precision across micro-surface and dimensional irregularities' },
      { value: '< 120ms', label: 'Edge Inspection Latency', basis: 'End-to-end inference and pneumatic sorting cycle time per part' },
      { value: '4.5x', label: 'Throughput Increase', basis: 'Line throughput compared to manual multi-operator visual inspection' },
    ],
    featured: true,
    displayOrder: 1,
  },
  {
    id: 'omnichannel-conversational-commerce',
    slug: 'omnichannel-conversational-commerce',
    title: 'Omnichannel Conversational Commerce & Service Automation',
    category: 'Digital Systems & Intelligent Automation',
    overview:
      'Enterprise conversational AI architecture orchestrating multi-channel customer communications, automated transactional workflows, and context-aware CRM synchronization.',
    problem:
      'Modern enterprises manage fragmented customer touchpoints across WhatsApp, web chat, and support portals. Disconnected communication results in siloed support histories, delayed resolution times, and lost sales opportunities.',
    solution:
      'Architected a multi-tenant conversational automation platform combining intent recognition, contextual knowledge base retrieval, and transactional webhook integrations. The system handles automated customer inquiries, catalog browsing, and service bookings, transferring seamlessly to live agents with full conversation context when needed.',
    technologyStack: [
      'TypeScript',
      'Node.js',
      'Python',
      'FastAPI',
      'Redis',
      'PostgreSQL',
      'WebSockets',
      'RAG / Vector Search',
    ],
    architecture: [
      { layer: 'Channel Connectors', detail: 'Unified webhook gateways integrating WhatsApp Business API, web chat, and messaging endpoints.' },
      { layer: 'Dialog Engine', detail: 'State machine with natural language intent classification, slot extraction, and vector-backed knowledge retrieval.' },
      { layer: 'Business Systems', detail: 'Secure API connectors executing real-time order inquiries, catalog lookups, and ticket updates in enterprise ERPs.' },
      { layer: 'Supervisor Console', detail: 'Real-time agent copilot with sentiment alerting, suggested replies, and full conversation audit trails.' },
    ],
    impact: [
      { value: '72%', label: 'Autonomous Resolution', basis: 'Customer enquiries and routine transactional requests resolved without human agent touch' },
      { value: '< 2.5s', label: 'Average Response Time', basis: 'Median conversational round-trip latency across all connected messaging channels' },
      { value: '24/7', label: 'Omnichannel Availability', basis: 'Uninterrupted multi-language conversational availability with automated agent handoff' },
    ],
    featured: true,
    displayOrder: 2,
  },
  {
    id: 'energy-trading-revenue-optimisation',
    slug: 'energy-trading-revenue-optimisation',
    title: 'AI-Driven Revenue Optimisation in Energy Trading',
    category: 'Applied AI & Machine Learning',
    overview:
      'Predictive pricing models and load-dispatch optimization systems for wholesale energy market arbitrage, virtual power plants, and battery asset scheduling.',
    problem:
      'High volatility in renewable energy generation, changing day-ahead wholesale spot prices, and strict grid balancing penalties demand predictive precision for battery energy storage and distributed generation assets.',
    solution:
      'Engineered a predictive energy analytics platform combining ensemble time-series models for day-ahead nodal price forecasting with constrained mixed-integer linear programming (MILP) solvers. The system dynamically computes charge, hold, and discharge schedules for energy storage assets to maximize revenue while honoring battery lifecycle degradation constraints.',
    technologyStack: [
      'Python',
      'LightGBM',
      'XGBoost',
      'SciPy',
      'FastAPI',
      'PostgreSQL',
      'Apache Kafka',
      'Time-Series ML',
    ],
    architecture: [
      { layer: 'Market Ingestion', detail: 'Continuous ingestion pipelines pulling national grid frequency, weather telemetry, and wholesale exchange pricing.' },
      { layer: 'Predictive Models', detail: 'Ensemble gradient-boosted time-series models generating 24-to-48 hour forward clearing price spreads.' },
      { layer: 'Constrained Solver', detail: 'Linear programming engine calculating dispatch schedules that maximize margin while respecting cycle wear.' },
      { layer: 'Execution & Audit', detail: 'Automated dispatch proposal engine with risk parameter gates, operator sign-off, and settlement reconciliation.' },
    ],
    impact: [
      { value: '+18.5%', label: 'Asset Revenue Uplift', basis: 'Simulated arbitrage capture over standard rule-based dispatch strategies' },
      { value: '94.2%', label: 'Price Trend Accuracy', basis: 'Directional accuracy of day-ahead peak spread predictions' },
      { value: '24/7', label: 'Autonomous Dispatch', basis: 'Continuous algorithmic optimization with automated risk parameter gates' },
    ],
    featured: true,
    displayOrder: 3,
  },
  {
    id: 'enterprise-ai-telephony-voice',
    slug: 'enterprise-ai-telephony-voice',
    title: 'Enterprise AI Telephony & Autonomous Voice Engineering',
    category: 'Digital Systems & Intelligent Automation',
    overview:
      'Ultra-low latency voice agent platform capable of full-duplex conversational telephony, intelligent call triage, and autonomous enterprise voice workflows.',
    problem:
      'High-volume customer contact centers and dispatch operations face long customer hold times, rigid interactive voice response (IVR) phone trees, and surging human staffing costs during peak call volumes.',
    solution:
      'Engineered an autonomous voice agent pipeline operating over SIP telephony. The architecture pairs streaming voice-activity detection (VAD), sub-200ms speech-to-text, low-latency LLM reasoning with tool calling, and human-natural neural speech synthesis, enabling fluid conversations with natural interruption handling.',
    technologyStack: [
      'Python',
      'WebSockets',
      'SIP / VoIP Telephony',
      'FastAPI',
      'Redis',
      'Streaming Audio',
      'Deepgram',
      'ElevenLabs',
    ],
    architecture: [
      { layer: 'Telephony Transport', detail: 'SIP trunk bridge streaming bi-directional full-duplex PCM audio over secure WebSockets with low-latency VAD.' },
      { layer: 'Streaming Perception', detail: 'Real-time automatic speech recognition pipeline streaming interim tokens with under 200ms latency.' },
      { layer: 'Reasoning & Action', detail: 'Low-latency conversational LLM runtime handling context, barge-in interruptions, and live database function calls.' },
      { layer: 'Neural Voice Synthesis', detail: 'Ultra-low latency neural text-to-speech engine generating expressive, human-cadence conversational audio.' },
    ],
    impact: [
      { value: '< 550ms', label: 'Voice-to-Voice Latency', basis: 'Full round-trip conversational latency from user speech completion to voice response' },
      { value: '65%', label: 'Call Deflection Rate', basis: 'Routine customer calls and dispatch scheduling handled autonomously end-to-end' },
      { value: 'Zero', label: 'Queue Hold Times', basis: 'Instantly scalable concurrent call handling eliminating customer wait times' },
    ],
    featured: false,
    displayOrder: 4,
  },
  {
    id: 'high-scale-search-data-infrastructure',
    slug: 'high-scale-search-data-infrastructure',
    title: 'High-Scale Search Infrastructure & Global Data Aggregation',
    category: 'Digital Systems & Intelligent Automation',
    overview:
      'Distributed high-throughput web data extraction, document transformation, and neural semantic search engine built for web-scale market intelligence.',
    problem:
      'Aggregating and semantically querying millions of dynamic web documents across global endpoints requires resilient proxy management, anti-bot navigation, document deduplication, and low-latency search indexing without cluster saturation.',
    solution:
      'Designed a distributed, fault-tolerant crawler and neural indexing pipeline. The architecture distributes scraping tasks across ephemeral worker pools using headless browser automation, deduplicates text via MinHash LSH, and indexes documents into a hybrid lexical BM25 and dense vector search engine.',
    technologyStack: [
      'Go',
      'Python',
      'Elasticsearch',
      'Vector DB',
      'RabbitMQ',
      'Docker',
      'Redis',
      'Playwright',
    ],
    architecture: [
      { layer: 'Harvesting Engine', detail: 'Distributed worker clusters rotating proxy pools, managing rate limits, and parsing dynamic JavaScript payloads.' },
      { layer: 'Content Pipeline', detail: 'Automated document cleaning, boilerplate removal, canonical URL resolution, and near-duplicate hashing.' },
      { layer: 'Hybrid Search Index', detail: 'Unified search cluster indexing BM25 inverted text with high-dimensional dense neural embeddings.' },
      { layer: 'Query Services', detail: 'Sub-50ms search API supporting semantic similarity, facet aggregations, highlighting, and strict tenant isolation.' },
    ],
    impact: [
      { value: '10M+', label: 'Daily Processed Records', basis: 'Sustained daily document ingestion, normalization, and indexing capacity' },
      { value: '< 45ms', label: 'Search Query Latency', basis: '95th-percentile hybrid vector and keyword search response latency' },
      { value: '99.9%', label: 'Cluster Availability', basis: 'High-availability distributed message queues and automated worker failover' },
    ],
    featured: false,
    displayOrder: 5,
  },
  {
    id: 'clinical-healthcare-risk-prediction',
    slug: 'clinical-healthcare-risk-prediction',
    title: 'Applied Data Science for Clinical Healthcare Risk',
    category: 'Applied AI & Machine Learning',
    overview:
      'Machine learning decision-support platform delivering real-time patient physiological risk stratification for proactive cardiovascular and hemodynamic care.',
    problem:
      'Critical hemodynamic instability (acute hypertensive crises and hypotensive episodes) in clinical inpatient environments often develops silently. Care teams face alarm fatigue from static threshold monitors that fail to synthesize longitudinal vital trends and patient history.',
    solution:
      'Developed an explainable clinical decision-support pipeline trained on longitudinal physiological vital sign time-series, lab biomarkers, and clinical patient profiles. The system generates calibrated risk trajectory scores and provides SHAP-based feature attributions, alerting clinicians to impending hemodynamic deterioration hours before adverse events occur.',
    technologyStack: [
      'Python',
      'Scikit-Learn',
      'SHAP',
      'FastAPI',
      'PostgreSQL',
      'FHIR / HL7',
      'Docker',
      'Explainable AI',
    ],
    architecture: [
      { layer: 'Clinical Ingestion', detail: 'Standardized HL7/FHIR connectors extracting ambulatory blood pressure, telemetry, and EHR vitals.' },
      { layer: 'Signal Preprocessing', detail: 'Vital signal filtering, artifact removal, and physiological feature engineering (MAP, pulse pressure, diurnal dipping).' },
      { layer: 'Calibrated ML Engine', detail: 'Tree-based probabilistic risk classifier predicting 4-to-12 hour hemodynamic instability windows.' },
      { layer: 'Care Team Interface', detail: 'HIPAA-aligned responsive clinical dashboard presenting patient risk heatmaps and SHAP explanations.' },
    ],
    impact: [
      { value: '0.89', label: 'Area Under ROC (AUC)', basis: 'Predictive discrimination for acute hemodynamic deterioration episodes' },
      { value: '4.2 hrs', label: 'Early Warning Window', basis: 'Median advance notice prior to clinical threshold breach' },
      { value: '100%', label: 'Model Explainability', basis: 'Every alert accompanied by ranked SHAP contributory biomarker attributions' },
    ],
    featured: true,
    displayOrder: 6,
  },
]
