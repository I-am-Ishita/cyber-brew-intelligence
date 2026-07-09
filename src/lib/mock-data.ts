// Realistic mock data for Cyber Brew. Kept in one place so real APIs
// (NVD, CISA, MITRE, vendor feeds) can replace these fetchers later
// without touching UI components.

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type Article = {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  severity: Severity;
  riskScore: number; // 0-10
  readingTime: number; // minutes
  source: string;
  sourceUrl: string;
  publishedAt: string; // ISO
  thumbnail: string; // gradient key
  excerpt: string;
  body: string;
  summary30s: string;
  summary2min: string;
  technicalDeepDive: string;
  whyItMatters: string;
  whoIsAffected: string;
  recommendedActions: string[];
  originalSources: { label: string; url: string }[];
};

export type CVE = {
  id: string;
  title: string;
  cvss: number;
  severity: Severity;
  vendor: string;
  product: string;
  os: string[];
  publishedAt: string;
  updatedAt: string;
  attackVector: "Network" | "Adjacent" | "Local" | "Physical";
  authRequired: boolean;
  rce: boolean;
  privEsc: boolean;
  dos: boolean;
  exploitedInWild: boolean;
  cisaKev: boolean;
  ransomware: boolean;
  riskScore: number;
  description: string;
};

export type ThreatEvent = {
  id: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  industry: string;
  severity: Severity;
  title: string;
  time: string;
};

export type ThreatActor = {
  id: string;
  name: string;
  aliases: string[];
  origin: string;
  motivation: string;
  activeSince: string;
  targets: string[];
  recentActivity: string;
};

export type Malware = {
  id: string;
  name: string;
  family: string;
  type: string;
  firstSeen: string;
  description: string;
};

const gradients = [
  "from-blue-500/30 via-cyan-500/20 to-transparent",
  "from-violet-500/30 via-blue-500/20 to-transparent",
  "from-cyan-500/30 via-teal-500/20 to-transparent",
  "from-rose-500/30 via-orange-500/20 to-transparent",
  "from-emerald-500/30 via-cyan-500/20 to-transparent",
  "from-amber-500/30 via-rose-500/20 to-transparent",
];

function daysAgo(d: number) {
  const t = new Date();
  t.setDate(t.getDate() - d);
  return t.toISOString();
}

export const ARTICLES: Article[] = [
  {
    id: "a1",
    slug: "critical-openssh-rce-regresshion",
    title: "Critical OpenSSH RCE ‘regreSSHion’ exposes millions of servers",
    category: "Zero Days",
    tags: ["Linux", "OpenSSH", "RCE", "Zero Day"],
    severity: "critical",
    riskScore: 9.6,
    readingTime: 6,
    source: "The Hacker News",
    sourceUrl: "https://example.com/regresshion",
    publishedAt: daysAgo(0),
    thumbnail: gradients[0],
    excerpt:
      "A signal handler race condition in OpenSSH server on glibc-based Linux allows unauthenticated remote code execution as root.",
    body:
      "Researchers disclosed CVE-2026-6387, a Buffer Overflow style race condition in OpenSSH's sshd. Successful exploitation grants full RCE as root without authentication. Millions of internet-facing servers are exposed. Patches are available in OpenSSH 9.8p1.",
    summary30s:
      "OpenSSH has a critical unauthenticated RCE affecting most Linux servers. Patch to 9.8p1 now or restrict SSH exposure.",
    summary2min:
      "A newly disclosed vulnerability in OpenSSH's sshd, dubbed regreSSHion, reintroduces a signal-handler race condition first patched in 2006. On glibc Linux systems this allows unauthenticated attackers to execute code as root over the network. Exploitation is slow (~6-8 hours in labs) but reliable, and public PoCs are expected within days. Immediate mitigations: upgrade OpenSSH, limit LoginGraceTime, and restrict SSH ingress via a bastion or WireGuard.",
    technicalDeepDive:
      "The bug lives in sshd's SIGALRM handler which calls async-signal-unsafe functions (syslog, malloc). By timing authentication messages against LoginGraceTime, an attacker corrupts heap state during signal handling. Reliable RCE was demonstrated on 32-bit i386 glibc; 64-bit exploitation is memory-hungry but feasible.",
    whyItMatters:
      "SSH is the backbone of remote administration on Linux. A pre-auth RCE means fleet-wide compromise is possible without any credentials, insider access, or user interaction.",
    whoIsAffected:
      "Any organization running OpenSSH between 8.5p1 and 9.7p1 on glibc-based Linux (Debian, Ubuntu, RHEL, Amazon Linux). OpenBSD is not vulnerable.",
    recommendedActions: [
      "Upgrade sshd to OpenSSH 9.8p1 or your distro's patched build",
      "Temporarily set LoginGraceTime 0 as a mitigation",
      "Restrict SSH exposure to bastion hosts or WireGuard",
      "Hunt for unusual sshd child processes and outbound connections",
    ],
    originalSources: [
      { label: "Qualys Advisory", url: "https://example.com/qualys" },
      { label: "OpenSSH Release Notes", url: "https://example.com/openssh" },
    ],
  },
  {
    id: "a2",
    slug: "lockbit-4-ransomware-healthcare",
    title: "LockBit 4.0 resurfaces with targeted healthcare campaign",
    category: "Ransomware",
    tags: ["Ransomware", "Healthcare", "LockBit"],
    severity: "high",
    riskScore: 8.4,
    readingTime: 5,
    source: "BleepingComputer",
    sourceUrl: "https://example.com/lockbit",
    publishedAt: daysAgo(0),
    thumbnail: gradients[3],
    excerpt:
      "Despite last year's takedown, LockBit affiliates are actively hitting hospitals in Europe with a rebuilt 4.0 payload.",
    body:
      "The rebuilt LockBit 4.0 uses a faster hybrid encryption scheme and abuses legitimate remote management tooling (ScreenConnect, AnyDesk) for lateral movement. Three European hospital networks confirmed encryption events this week.",
    summary30s:
      "LockBit is back with version 4.0, targeting hospitals via legitimate RMM tools. Audit RMM usage now.",
    summary2min:
      "Following Operation Cronos, LockBit affiliates rebuilt infrastructure and released 4.0. Initial access is bought from IABs or via unpatched Citrix and Fortinet devices. Once inside, operators abuse ScreenConnect and AnyDesk for lateral movement, then deploy the ransomware from a domain controller. Hospitals in Germany, France and the UK are the current focus.",
    technicalDeepDive:
      "4.0 uses ChaCha20 for bulk encryption with per-file Curve25519 key exchange. The loader is a signed .NET binary abusing DLL side-loading via a legitimate Kaspersky utility. Persistence via a scheduled task disguised as 'GoogleUpdateCheck'.",
    whyItMatters:
      "Healthcare downtime translates directly to patient harm. Regulators are increasing fines for repeat incidents involving unpatched perimeter devices.",
    whoIsAffected:
      "Hospitals, clinics, and healthcare SaaS operating aging Citrix Netscaler or Fortinet SSL VPN appliances.",
    recommendedActions: [
      "Enforce MFA on all VPN and RMM tooling",
      "Alert on new ScreenConnect / AnyDesk installations",
      "Segment clinical networks from corporate IT",
      "Test offline backups this week",
    ],
    originalSources: [
      { label: "CISA Advisory", url: "https://example.com/cisa-lockbit" },
    ],
  },
  {
    id: "a3",
    slug: "gpt-shield-prompt-injection-agents",
    title: "New research shows AI agents remain trivially prompt-injectable",
    category: "AI Security",
    tags: ["AI Security", "Prompt Injection", "LLM"],
    severity: "medium",
    riskScore: 6.5,
    readingTime: 4,
    source: "arXiv",
    sourceUrl: "https://example.com/arxiv",
    publishedAt: daysAgo(1),
    thumbnail: gradients[1],
    excerpt:
      "A team at ETH Zurich shows that leading agent frameworks still leak tools and data through indirect prompt injection.",
    body:
      "The paper evaluates 12 popular agent frameworks against 40 indirect prompt injection payloads embedded in web pages, PDFs and emails. Success rates range from 34% to 91%.",
    summary30s:
      "Popular AI agents can still be hijacked by hidden instructions in web pages. Treat LLM output as untrusted input.",
    summary2min:
      "The researchers built an evaluation harness that measures whether an agent will exfiltrate secrets, call unintended tools, or click malicious links when reading attacker-controlled content. Even guarded frameworks fail on multi-step tasks. The paper proposes a capability-scoping middleware inspired by browser CSP.",
    technicalDeepDive:
      "Attack primitives include ANSI escape smuggling, invisible unicode tags, and OCR-only overlays. Defenses require deterministic action allow-lists per data source, not model-side heuristics.",
    whyItMatters:
      "Agents are being deployed into production workflows (email triage, code review, DevOps). Prompt injection is now a supply-chain concern.",
    whoIsAffected:
      "Any team deploying LLM agents that read untrusted content.",
    recommendedActions: [
      "Scope tools per data source",
      "Sandbox browsing agents in disposable profiles",
      "Log and review every tool call",
    ],
    originalSources: [{ label: "arXiv paper", url: "https://example.com/paper" }],
  },
  {
    id: "a4",
    slug: "cloudflare-mitigates-record-ddos",
    title: "Cloudflare mitigates record 5.6 Tbps DDoS from Mirai variant",
    category: "Threat Intelligence",
    tags: ["DDoS", "Botnet", "Cloudflare"],
    severity: "high",
    riskScore: 7.8,
    readingTime: 3,
    source: "Cloudflare Blog",
    sourceUrl: "https://example.com/cf",
    publishedAt: daysAgo(1),
    thumbnail: gradients[2],
    excerpt:
      "The 80-second attack peaked at 5.6 Tbps and involved 13,000 IoT devices infected with a new Mirai fork.",
    body: "Attack traffic originated primarily from routers and DVRs across South and Southeast Asia.",
    summary30s: "A new IoT botnet launched a record-setting DDoS. Update your edge routers and DVRs.",
    summary2min:
      "Cloudflare disclosed a hyper-volumetric UDP flood targeting an ISP customer. The Mirai variant, tracked as 'AISURU', uses default credentials and CVE-2023-1389 on TP-Link Archer routers. Peak throughput was 5.6 Tbps sustained for 80 seconds.",
    technicalDeepDive:
      "Payload is a stripped ARM ELF with hardcoded C2 rotation and DNS-over-HTTPS for beaconing.",
    whyItMatters: "Volumetric attacks at this scale saturate regional peering — collateral damage is significant.",
    whoIsAffected: "ISPs, gaming platforms, and any exposed origin without upstream scrubbing.",
    recommendedActions: [
      "Enable Anycast scrubbing at the edge",
      "Rate-limit UDP by default",
      "Patch consumer routers on your network",
    ],
    originalSources: [{ label: "Cloudflare Report", url: "https://example.com/cf-report" }],
  },
  {
    id: "a5",
    slug: "apple-ios-18-privacy-features",
    title: "iOS 18.4 ships private cloud compute and stricter clipboard rules",
    category: "Privacy",
    tags: ["Apple", "iOS", "Privacy", "Mobile Security"],
    severity: "low",
    riskScore: 3.2,
    readingTime: 4,
    source: "Apple Security",
    sourceUrl: "https://example.com/apple",
    publishedAt: daysAgo(2),
    thumbnail: gradients[4],
    excerpt:
      "Apple ties on-device AI to attested server enclaves and requires user consent on every cross-app clipboard read.",
    body: "The Private Cloud Compute architecture uses attested Apple silicon servers with public transparency logs.",
    summary30s: "iOS 18.4 improves AI privacy and clipboard protections. Update your devices.",
    summary2min:
      "Private Cloud Compute extends Secure Enclave guarantees to Apple's server-side AI. All requests are stateless, keyed to ephemeral attestation, and published to a transparency log for external audit. Clipboard reads now require per-app permission and produce a banner.",
    technicalDeepDive:
      "PCC nodes run a hardened variant of iOS with all persistent storage disabled at boot. Attestation quotes are pinned by the client.",
    whyItMatters: "Sets a new bar for cloud AI privacy — expect regulators to reference this architecture.",
    whoIsAffected: "All iOS and iPadOS users on eligible hardware.",
    recommendedActions: ["Update to 18.4", "Review new clipboard prompts in Settings"],
    originalSources: [{ label: "Apple PCC Paper", url: "https://example.com/pcc" }],
  },
  {
    id: "a6",
    slug: "cisa-kev-adds-fortinet-vmware",
    title: "CISA KEV adds Fortinet and VMware bugs under active exploitation",
    category: "Threat Intelligence",
    tags: ["CISA KEV", "Fortinet", "VMware"],
    severity: "critical",
    riskScore: 9.1,
    readingTime: 3,
    source: "CISA",
    sourceUrl: "https://example.com/cisa",
    publishedAt: daysAgo(2),
    thumbnail: gradients[5],
    excerpt: "Federal agencies have 7 days to patch three actively exploited vulnerabilities.",
    body: "Three new entries in the Known Exploited Vulnerabilities catalog affect Fortinet FortiOS, VMware vCenter, and Ivanti EPMM.",
    summary30s: "CISA added 3 actively exploited bugs to KEV. Patch this week.",
    summary2min:
      "The additions include CVE-2026-4877 (FortiOS SSL VPN pre-auth RCE), CVE-2026-3120 (vCenter unauthenticated deserialization), and CVE-2026-5588 (Ivanti EPMM auth bypass). All are being used in targeted intrusions.",
    technicalDeepDive: "Pre-auth attack surfaces on internet-facing appliances remain the dominant initial access vector in 2026.",
    whyItMatters: "KEV additions are a strong signal — these are being exploited right now, not theoretically.",
    whoIsAffected: "Any organization exposing Fortinet SSL VPN, vCenter, or Ivanti EPMM to the internet.",
    recommendedActions: [
      "Apply vendor patches immediately",
      "Hunt for indicators from CISA advisories",
      "Rotate credentials for exposed appliances",
    ],
    originalSources: [{ label: "CISA KEV Catalog", url: "https://example.com/kev" }],
  },
  {
    id: "a7",
    slug: "gh-actions-supply-chain",
    title: "Popular GitHub Action compromised, secrets leaked from 23,000 repos",
    category: "Supply Chain",
    tags: ["GitHub", "Supply Chain", "CI/CD"],
    severity: "high",
    riskScore: 8.7,
    readingTime: 5,
    source: "StepSecurity",
    sourceUrl: "https://example.com/step",
    publishedAt: daysAgo(3),
    thumbnail: gradients[1],
    excerpt:
      "Attackers pushed a malicious version of tj-actions/changed-files that dumped runner memory to public logs.",
    body: "The malicious commit was live for 14 hours. Any secret used during workflows that ran in that window should be considered exposed.",
    summary30s: "A popular GitHub Action was hijacked and leaked repo secrets. Rotate anything used in CI in the last 24h.",
    summary2min:
      "The attacker rewrote tag references to point to a commit containing a Python payload that dumps /proc/self/mem for the runner, then base64-prints matches for AWS, GCP, npm and PyPI tokens into the public build log. GitHub reverted the tags and yanked the release.",
    technicalDeepDive:
      "Rotating tags is a well-known supply chain risk. Pin actions by commit SHA, never tag. GitHub's OIDC issuer is a safer alternative to long-lived secrets.",
    whyItMatters: "CI runners hold the crown jewels — this incident is a template that will be reused.",
    whoIsAffected: "Any repo using tj-actions/changed-files without SHA pinning.",
    recommendedActions: [
      "Rotate all secrets exposed to CI in the last 48h",
      "Pin actions by SHA in every workflow",
      "Enable required workflow reviews for third-party actions",
    ],
    originalSources: [{ label: "StepSecurity Writeup", url: "https://example.com/writeup" }],
  },
  {
    id: "a8",
    slug: "microsoft-patch-tuesday",
    title: "Patch Tuesday: 91 vulnerabilities, 6 zero-days exploited in wild",
    category: "Cyber News",
    tags: ["Microsoft", "Patch Tuesday", "Zero Day"],
    severity: "high",
    riskScore: 8.2,
    readingTime: 4,
    source: "MSRC",
    sourceUrl: "https://example.com/msrc",
    publishedAt: daysAgo(4),
    thumbnail: gradients[0],
    excerpt: "Six zero-days include an Outlook preview-pane RCE and a kernel privilege escalation being used by ransomware crews.",
    body: "Prioritize the Outlook, Windows Kernel, and MSHTML fixes.",
    summary30s: "91 patches, 6 zero-days — patch Outlook and Windows Kernel this week.",
    summary2min: "Notable items include CVE-2026-2110 (Outlook preview-pane RCE, no click required) and CVE-2026-2115 (Windows Kernel LPE, used in Play ransomware intrusions).",
    technicalDeepDive: "Preview-pane RCE bypasses require no user interaction beyond receiving mail. Block RTF attachments if patching is delayed.",
    whyItMatters: "Outlook attacks route around most user training programs.",
    whoIsAffected: "All Windows and Microsoft 365 environments.",
    recommendedActions: ["Apply updates", "Restrict RTF via Group Policy", "Hunt for CobaltStrike beacons"],
    originalSources: [{ label: "MSRC Release", url: "https://example.com/msrc-rel" }],
  },
];

export const CVES: CVE[] = [
  {
    id: "CVE-2026-6387",
    title: "OpenSSH signal-handler race condition (regreSSHion)",
    cvss: 9.8,
    severity: "critical",
    vendor: "OpenSSH",
    product: "sshd",
    os: ["Linux"],
    publishedAt: daysAgo(0),
    updatedAt: daysAgo(0),
    attackVector: "Network",
    authRequired: false,
    rce: true,
    privEsc: false,
    dos: true,
    exploitedInWild: true,
    cisaKev: true,
    ransomware: false,
    riskScore: 9.6,
    description: "A race condition in sshd's SIGALRM handler enables unauthenticated RCE as root on glibc Linux.",
  },
  {
    id: "CVE-2026-4877",
    title: "FortiOS SSL VPN pre-auth RCE",
    cvss: 9.6,
    severity: "critical",
    vendor: "Fortinet",
    product: "FortiOS",
    os: ["FortiOS"],
    publishedAt: daysAgo(2),
    updatedAt: daysAgo(1),
    attackVector: "Network",
    authRequired: false,
    rce: true,
    privEsc: false,
    dos: false,
    exploitedInWild: true,
    cisaKev: true,
    ransomware: true,
    riskScore: 9.4,
    description: "Heap overflow in SSL VPN portal permits unauthenticated code execution.",
  },
  {
    id: "CVE-2026-3120",
    title: "VMware vCenter unauthenticated deserialization",
    cvss: 9.4,
    severity: "critical",
    vendor: "VMware",
    product: "vCenter Server",
    os: ["Linux", "Windows"],
    publishedAt: daysAgo(3),
    updatedAt: daysAgo(2),
    attackVector: "Network",
    authRequired: false,
    rce: true,
    privEsc: false,
    dos: false,
    exploitedInWild: true,
    cisaKev: true,
    ransomware: true,
    riskScore: 9.1,
    description: "Unsafe Java deserialization in the vCenter management API enables RCE.",
  },
  {
    id: "CVE-2026-2110",
    title: "Microsoft Outlook preview-pane RCE",
    cvss: 9.1,
    severity: "critical",
    vendor: "Microsoft",
    product: "Outlook",
    os: ["Windows", "macOS"],
    publishedAt: daysAgo(4),
    updatedAt: daysAgo(4),
    attackVector: "Network",
    authRequired: false,
    rce: true,
    privEsc: false,
    dos: false,
    exploitedInWild: true,
    cisaKev: false,
    ransomware: false,
    riskScore: 8.9,
    description: "Zero-click RCE triggered by rendering a malicious RTF message in the preview pane.",
  },
  {
    id: "CVE-2026-2115",
    title: "Windows Kernel privilege escalation",
    cvss: 8.1,
    severity: "high",
    vendor: "Microsoft",
    product: "Windows",
    os: ["Windows"],
    publishedAt: daysAgo(4),
    updatedAt: daysAgo(4),
    attackVector: "Local",
    authRequired: true,
    rce: false,
    privEsc: true,
    dos: false,
    exploitedInWild: true,
    cisaKev: true,
    ransomware: true,
    riskScore: 8.3,
    description: "CLFS driver flaw grants SYSTEM privileges to any local user.",
  },
  {
    id: "CVE-2026-5588",
    title: "Ivanti EPMM authentication bypass",
    cvss: 9.1,
    severity: "critical",
    vendor: "Ivanti",
    product: "EPMM",
    os: ["Linux"],
    publishedAt: daysAgo(2),
    updatedAt: daysAgo(2),
    attackVector: "Network",
    authRequired: false,
    rce: true,
    privEsc: true,
    dos: false,
    exploitedInWild: true,
    cisaKev: true,
    ransomware: false,
    riskScore: 9.0,
    description: "Authentication bypass allows administrative access to EPMM.",
  },
  {
    id: "CVE-2026-1055",
    title: "Chrome V8 type confusion",
    cvss: 8.8,
    severity: "high",
    vendor: "Google",
    product: "Chrome",
    os: ["Windows", "macOS", "Linux", "Android"],
    publishedAt: daysAgo(5),
    updatedAt: daysAgo(4),
    attackVector: "Network",
    authRequired: false,
    rce: true,
    privEsc: false,
    dos: false,
    exploitedInWild: true,
    cisaKev: true,
    ransomware: false,
    riskScore: 8.6,
    description: "Type confusion in V8 allows in-sandbox RCE via a crafted page.",
  },
  {
    id: "CVE-2026-9902",
    title: "PostgreSQL role privilege escalation",
    cvss: 7.2,
    severity: "high",
    vendor: "PostgreSQL",
    product: "PostgreSQL",
    os: ["Linux", "Windows"],
    publishedAt: daysAgo(6),
    updatedAt: daysAgo(6),
    attackVector: "Network",
    authRequired: true,
    rce: false,
    privEsc: true,
    dos: false,
    exploitedInWild: false,
    cisaKev: false,
    ransomware: false,
    riskScore: 6.8,
    description: "SET ROLE bypass allows escalation to superuser under specific search_path conditions.",
  },
  {
    id: "CVE-2026-7412",
    title: "iOS WebKit sandbox escape",
    cvss: 8.6,
    severity: "high",
    vendor: "Apple",
    product: "iOS",
    os: ["iOS", "iPadOS"],
    publishedAt: daysAgo(7),
    updatedAt: daysAgo(7),
    attackVector: "Network",
    authRequired: false,
    rce: true,
    privEsc: true,
    dos: false,
    exploitedInWild: true,
    cisaKev: true,
    ransomware: false,
    riskScore: 8.5,
    description: "Use-after-free in WebKit renderer chained to sandbox escape.",
  },
  {
    id: "CVE-2026-3301",
    title: "Cisco IOS XE web UI privilege escalation",
    cvss: 8.1,
    severity: "high",
    vendor: "Cisco",
    product: "IOS XE",
    os: ["IOS XE"],
    publishedAt: daysAgo(8),
    updatedAt: daysAgo(8),
    attackVector: "Network",
    authRequired: false,
    rce: false,
    privEsc: true,
    dos: false,
    exploitedInWild: false,
    cisaKev: false,
    ransomware: false,
    riskScore: 7.5,
    description: "Web management interface allows privilege escalation via crafted request.",
  },
];

export const THREAT_EVENTS: ThreatEvent[] = [
  { id: "t1", country: "United States", countryCode: "US", lat: 39, lng: -98, industry: "Finance", severity: "critical", title: "Ransomware on regional bank", time: "2m ago" },
  { id: "t2", country: "Germany", countryCode: "DE", lat: 51, lng: 10, industry: "Healthcare", severity: "high", title: "LockBit 4.0 hospital intrusion", time: "12m ago" },
  { id: "t3", country: "United Kingdom", countryCode: "GB", lat: 54, lng: -2, industry: "Retail", severity: "medium", title: "Credential stuffing wave", time: "20m ago" },
  { id: "t4", country: "Brazil", countryCode: "BR", lat: -10, lng: -55, industry: "Government", severity: "high", title: "Phishing campaign vs. ministries", time: "34m ago" },
  { id: "t5", country: "India", countryCode: "IN", lat: 22, lng: 78, industry: "Telecom", severity: "medium", title: "Mirai variant DDoS", time: "42m ago" },
  { id: "t6", country: "Japan", countryCode: "JP", lat: 36, lng: 138, industry: "Automotive", severity: "high", title: "Supply-chain attack on OEM", time: "1h ago" },
  { id: "t7", country: "Australia", countryCode: "AU", lat: -25, lng: 133, industry: "Energy", severity: "critical", title: "Zero-day exploited at grid operator", time: "1h ago" },
  { id: "t8", country: "France", countryCode: "FR", lat: 46, lng: 2, industry: "Aerospace", severity: "medium", title: "Espionage-linked spearphishing", time: "2h ago" },
  { id: "t9", country: "South Africa", countryCode: "ZA", lat: -30, lng: 25, industry: "Banking", severity: "high", title: "Card skimmer network dismantled", time: "3h ago" },
  { id: "t10", country: "Canada", countryCode: "CA", lat: 56, lng: -106, industry: "Education", severity: "low", title: "Defaced university portals", time: "3h ago" },
  { id: "t11", country: "Singapore", countryCode: "SG", lat: 1.3, lng: 103.8, industry: "Fintech", severity: "medium", title: "API abuse against payments provider", time: "4h ago" },
  { id: "t12", country: "Ukraine", countryCode: "UA", lat: 49, lng: 32, industry: "Government", severity: "critical", title: "Wiper malware detected", time: "5h ago" },
];

export const THREAT_ACTORS: ThreatActor[] = [
  { id: "ta1", name: "APT29", aliases: ["Cozy Bear", "Midnight Blizzard"], origin: "Russia", motivation: "Espionage", activeSince: "2008", targets: ["Government", "Tech", "NGOs"], recentActivity: "Cloud-based token theft against Microsoft 365 tenants" },
  { id: "ta2", name: "Lazarus Group", aliases: ["Hidden Cobra"], origin: "North Korea", motivation: "Financial + Espionage", activeSince: "2009", targets: ["Crypto", "Defense", "Media"], recentActivity: "Fake recruiter campaigns targeting blockchain engineers" },
  { id: "ta3", name: "Scattered Spider", aliases: ["UNC3944", "Octo Tempest"], origin: "US/UK", motivation: "Financial", activeSince: "2022", targets: ["Hospitality", "Insurance", "Retail"], recentActivity: "SIM swap and vishing against helpdesks" },
  { id: "ta4", name: "Volt Typhoon", aliases: ["BRONZE SILHOUETTE"], origin: "China", motivation: "Pre-positioning", activeSince: "2021", targets: ["Critical Infrastructure"], recentActivity: "Living-off-the-land in US utility networks" },
];

export const MALWARE: Malware[] = [
  { id: "m1", name: "LockBit 4.0", family: "LockBit", type: "Ransomware", firstSeen: "2026-Q1", description: "Rebuilt after Operation Cronos with ChaCha20 encryption." },
  { id: "m2", name: "AISURU", family: "Mirai", type: "Botnet", firstSeen: "2026", description: "IoT botnet abusing default credentials and CVE-2023-1389." },
  { id: "m3", name: "PlugX", family: "PlugX", type: "RAT", firstSeen: "2008", description: "Long-standing modular RAT used by Chinese groups." },
  { id: "m4", name: "RedLine", family: "RedLine", type: "Infostealer", firstSeen: "2020", description: "Credential and wallet stealer sold as MaaS." },
];

export const FOLLOW_CATALOG = {
  Topics: ["AI Security", "Cloud Security", "Mobile Security", "Privacy", "Threat Intelligence", "Bug Bounty", "Penetration Testing", "Digital Forensics", "OSINT", "Ransomware", "Zero Days", "Security Tools"],
  Companies: ["Microsoft", "Apple", "Google", "Meta", "Amazon", "Cloudflare", "CrowdStrike"],
  Vendors: ["Fortinet", "Palo Alto", "Cisco", "Ivanti", "VMware", "Citrix"],
  Products: ["OpenSSH", "vCenter", "FortiOS", "Outlook", "Chrome", "iOS"],
  Technologies: ["Kubernetes", "Docker", "Terraform", "AWS", "Azure", "GCP"],
  OperatingSystems: ["Windows", "Linux", "macOS", "iOS", "Android"],
  ThreatActors: ["APT29", "Lazarus Group", "Scattered Spider", "Volt Typhoon"],
  MalwareFamilies: ["LockBit", "Mirai", "PlugX", "RedLine"],
  CVEs: ["CVE-2026-6387", "CVE-2026-4877", "CVE-2026-3120"],
};

export const ROLES = [
  { id: "beginner", label: "Beginner", desc: "New to cybersecurity" },
  { id: "student", label: "Student", desc: "Studying security formally or independently" },
  { id: "soc", label: "SOC Analyst", desc: "Day-to-day triage and detection" },
  { id: "pentester", label: "Pentester", desc: "Offensive security engagements" },
  { id: "researcher", label: "Security Researcher", desc: "Vulnerability & threat research" },
  { id: "developer", label: "Developer", desc: "Build secure software" },
  { id: "seceng", label: "Security Engineer", desc: "Design & implement security" },
  { id: "itadmin", label: "IT Administrator", desc: "Manage infrastructure" },
  { id: "manager", label: "Manager", desc: "Lead a security team" },
  { id: "exec", label: "Executive", desc: "Business-level risk oversight" },
  { id: "ciso", label: "CISO", desc: "Own the security program" },
] as const;

export const LEARNING_TERMS: Record<string, { title: string; simple: string; example: string; related: string[] }> = {
  "Buffer Overflow": {
    title: "Buffer Overflow",
    simple:
      "A buffer overflow happens when a program writes more data into memory than the space it reserved. That extra data can overwrite nearby memory and let an attacker take control.",
    example: "The 1988 Morris Worm and many modern browser exploits chain buffer overflows to run attacker code.",
    related: ["RCE", "Zero Day", "Privilege Escalation"],
  },
  RCE: {
    title: "Remote Code Execution",
    simple: "Any vulnerability that lets an attacker run their own code on a target machine over the network.",
    example: "regreSSHion (CVE-2026-6387) is a pre-auth RCE in OpenSSH.",
    related: ["Buffer Overflow", "Zero Day"],
  },
  XSS: {
    title: "Cross-Site Scripting",
    simple: "A web bug where attacker-controlled JavaScript runs inside another user's browser session on a legitimate site.",
    example: "Stored XSS in a comment field can hijack every visitor who reads the comment.",
    related: ["CSRF", "SQL Injection"],
  },
  CSRF: {
    title: "Cross-Site Request Forgery",
    simple: "Tricks an already-logged-in user into unknowingly making requests to a site they trust.",
    example: "A hidden image that triggers a 'transfer funds' request on a banking site.",
    related: ["XSS"],
  },
  "SQL Injection": {
    title: "SQL Injection",
    simple: "Injecting database commands into an app's input to read or modify data you should not.",
    example: "' OR 1=1 -- turned a login form into 'return the first user, no password needed'.",
    related: ["RCE", "Privilege Escalation"],
  },
  "Zero Day": {
    title: "Zero Day",
    simple: "A vulnerability being exploited before the vendor has released a patch — defenders had zero days to prepare.",
    example: "Multiple iOS WebKit bugs each year are discovered mid-attack.",
    related: ["RCE", "MITRE ATT&CK"],
  },
  "Privilege Escalation": {
    title: "Privilege Escalation",
    simple: "Going from a low-privileged account to a higher one, like from a normal user to root or SYSTEM.",
    example: "CVE-2026-2115 escalates any Windows user to SYSTEM via the CLFS driver.",
    related: ["RCE", "Buffer Overflow"],
  },
  "MITRE ATT&CK": {
    title: "MITRE ATT&CK",
    simple: "A public knowledge base that names and organizes the techniques real attackers use.",
    example: "T1566 = 'Phishing'. Detection engineers write rules by ATT&CK ID.",
    related: ["IOC", "C2 Server"],
  },
  CVSS: {
    title: "CVSS",
    simple: "A 0–10 scoring system for how bad a vulnerability is, based on how it can be attacked and its impact.",
    example: "A pre-auth network RCE with high impact scores in the 9-10 range.",
    related: ["Zero Day"],
  },
  Malware: {
    title: "Malware",
    simple: "Software written with malicious intent — includes viruses, ransomware, spyware, and RATs.",
    example: "LockBit encrypts files and demands a ransom in cryptocurrency.",
    related: ["IOC", "C2 Server"],
  },
  Sandbox: {
    title: "Sandbox",
    simple: "An isolated environment where suspicious code is executed so it cannot harm the real system.",
    example: "Browsers run each tab's JavaScript inside a sandbox.",
    related: ["Zero Day"],
  },
  IOC: {
    title: "Indicator of Compromise",
    simple: "A piece of evidence — file hash, IP, domain — that suggests a system has been compromised.",
    example: "Sharing IOCs helps other teams detect the same attacker quickly.",
    related: ["C2 Server", "MITRE ATT&CK"],
  },
  "C2 Server": {
    title: "Command and Control (C2)",
    simple: "The attacker-controlled server that malware calls home to for instructions.",
    example: "Beacons from CobaltStrike phone home to a C2 every few minutes.",
    related: ["Malware", "IOC"],
  },
};

export function todaysWeather(): { level: Severity; label: string; reasons: string[] } {
  return {
    level: "critical",
    label: "Critical",
    reasons: [
      "Pre-auth OpenSSH RCE (regreSSHion) with imminent public PoC",
      "Active LockBit 4.0 campaign against healthcare",
      "3 new CISA KEV additions being exploited",
    ],
  };
}

export function severityColor(s: Severity) {
  return {
    critical: "text-rose-400 border-rose-400/30 bg-rose-500/10",
    high: "text-orange-400 border-orange-400/30 bg-orange-500/10",
    medium: "text-amber-400 border-amber-400/30 bg-amber-500/10",
    low: "text-emerald-400 border-emerald-400/30 bg-emerald-500/10",
    info: "text-sky-400 border-sky-400/30 bg-sky-500/10",
  }[s];
}

export function riskColor(score: number) {
  if (score >= 9) return "text-rose-400 border-rose-400/30 bg-rose-500/10";
  if (score >= 7) return "text-orange-400 border-orange-400/30 bg-orange-500/10";
  if (score >= 5) return "text-amber-400 border-amber-400/30 bg-amber-500/10";
  if (score >= 3) return "text-sky-400 border-sky-400/30 bg-sky-500/10";
  return "text-emerald-400 border-emerald-400/30 bg-emerald-500/10";
}