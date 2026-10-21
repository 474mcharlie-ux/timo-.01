import { createServer, IncomingMessage, ServerResponse } from 'http';
import { readFile } from 'fs/promises';
import { extname, join, normalize } from 'path';

/** A dependency-free, firm-local Verity demonstration server. */
type ReviewState = 'requires_review' | 'reviewed';

interface OpportunityBrief {
  id: string; company: string; title: string; confidence: number; value: string;
  status: 'new' | 'watching' | 'priority'; trigger: string; owner: string; createdAt: string;
  evidence: Array<{ source: string; timestamp: string; detail: string; reliability: 'Verified' | 'Corroborated' }>;
  conflict: { state: ReviewState; detail: string; signals: string[] };
  suggestedApproach: string;
}

const briefs: OpportunityBrief[] = [
  {
    id: 'opp-2408', company: 'Lumina Health', title: 'Series B financing creates a healthcare-growth mandate', confidence: 91,
    value: '$420k–$680k', status: 'priority', trigger: 'Series B financing', owner: 'Maya Chen', createdAt: '18 min ago',
    evidence: [
      { source: 'Company announcement', timestamp: 'Today, 08:42', detail: 'Lumina Health announced a $38M Series B to expand clinical operations into three new markets.', reliability: 'Verified' },
      { source: 'Matter record · H-2241', timestamp: '2026-08-12', detail: 'The firm advised Lumina’s VP Operations, Aisha Mensah, while she was at Meridian Care.', reliability: 'Verified' },
      { source: 'Relationship graph', timestamp: 'Today, 08:46', detail: 'Partner Daniel Roth shares two direct relationships with Lumina’s board member and its new investor.', reliability: 'Corroborated' }
    ],
    conflict: { state: 'requires_review', detail: 'A related entity appears in a former healthcare matter. This is not legal clearance.', signals: ['Former matter: Meridian Care (closed 2024)', 'Investor relationship: Grove Capital', 'No active opposing-party match detected'] },
    suggestedApproach: 'Ask Daniel Roth to make a warm introduction to Aisha Mensah. Lead with the firm’s experience helping healthcare operators execute market-entry, employment and regulatory work after growth financing.'
  },
  {
    id: 'opp-2407', company: 'Apex Materials', title: 'Acquisition target identified through supplier network', confidence: 84,
    value: '$250k–$410k', status: 'new', trigger: 'Potential acquisition', owner: 'James Okoro', createdAt: '2 h ago',
    evidence: [{ source: 'Approved market source', timestamp: 'Today, 06:30', detail: 'Apex engaged an investment adviser after receiving inbound interest from strategic buyers.', reliability: 'Corroborated' }],
    conflict: { state: 'requires_review', detail: 'One counterparty is adjacent to an active client portfolio company.', signals: ['Portfolio adjacency detected'] },
    suggestedApproach: 'Validate the target’s mandate and route for conflict review before outreach.'
  },
  {
    id: 'opp-2406', company: 'Northstar Logistics', title: 'Cross-border expansion matches target profile', confidence: 78,
    value: '$175k–$290k', status: 'watching', trigger: 'Regional expansion', owner: 'Maya Chen', createdAt: 'Yesterday',
    evidence: [{ source: 'Corporate registry', timestamp: 'Yesterday', detail: 'New subsidiaries registered in Kenya and Tanzania.', reliability: 'Verified' }],
    conflict: { state: 'reviewed', detail: 'Preliminary commercial screen completed; standard matter-opening checks still apply.', signals: ['Reviewed by conflicts team'] },
    suggestedApproach: 'Connect the regional trade team with the company’s Chief Strategy Officer.'
  }
];

const network = {
  nodes: [
    { id: 'firm', label: 'Hawthorne & Vale', type: 'firm', x: 49, y: 50 }, { id: 'lumina', label: 'Lumina Health', type: 'company', x: 77, y: 30 },
    { id: 'aisha', label: 'Aisha Mensah', type: 'person', x: 69, y: 58 }, { id: 'daniel', label: 'Daniel Roth', type: 'person', x: 31, y: 31 },
    { id: 'grove', label: 'Grove Capital', type: 'company', x: 75, y: 78 }, { id: 'meridian', label: 'Meridian Care', type: 'client', x: 22, y: 72 }
  ],
  edges: [['firm', 'daniel', 'Partner'], ['firm', 'meridian', 'Client'], ['daniel', 'aisha', 'Prior matter'], ['aisha', 'lumina', 'VP Operations'], ['lumina', 'grove', 'Investor'], ['meridian', 'aisha', 'Former executive'], ['daniel', 'grove', 'Board relationship']]
};

const companies = [
  { name: 'Lumina Health', sector: 'Healthcare technology', score: 93, fit: 'Strong fit', reason: 'Growth event + connected decision maker' },
  { name: 'Apex Materials', sector: 'Advanced manufacturing', score: 82, fit: 'Strong fit', reason: 'Transaction signal + supply-chain adjacency' },
  { name: 'Northstar Logistics', sector: 'Logistics', score: 76, fit: 'Watch', reason: 'Regional expansion, lower relationship depth' },
  { name: 'Harbor Retail Group', sector: 'Consumer', score: 41, fit: 'Below criteria', reason: 'Outside priority sector and revenue band' }
];

const MIME: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
function json(response: ServerResponse, value: unknown, status = 200): void { response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); response.end(JSON.stringify(value)); }
async function body(request: IncomingMessage): Promise<Record<string, unknown>> { let raw = ''; for await (const chunk of request) raw += chunk; try { return JSON.parse(raw || '{}') as Record<string, unknown>; } catch { return {}; } }
async function serveFile(response: ServerResponse, pathname: string): Promise<void> {
  const requested = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const safe = normalize(requested).replace(/^(\.\.(\\|\/|$))+/, '');
  try { const file = await readFile(join(__dirname, '..', 'src', 'public', safe)); response.writeHead(200, { 'Content-Type': MIME[extname(safe)] ?? 'application/octet-stream' }); response.end(file); }
  catch { response.writeHead(404); response.end('Not found'); }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  if (url.pathname === '/api/overview') return json(response, { metrics: { activeBriefs: 12, reviewQueue: briefs.filter((brief) => brief.conflict.state === 'requires_review').length, relationshipPaths: 47, qualifiedPipeline: '$2.4M' }, brief: briefs[0], briefs, network, companies, generatedAt: new Date().toISOString() });
  if (url.pathname === '/api/briefs') return json(response, briefs);
  if (url.pathname === '/api/companies') return json(response, companies);
  const match = url.pathname.match(/^\/api\/briefs\/([^/]+)\/review$/);
  if (match && request.method === 'POST') { const brief = briefs.find((item) => item.id === match[1]); if (!brief) return json(response, { error: 'Brief not found' }, 404); const payload = await body(request); brief.conflict.state = payload.state === 'reviewed' ? 'reviewed' : 'requires_review'; return json(response, brief); }
  return serveFile(response, url.pathname);
});

const port = Number(process.env.PORT ?? 4173);
server.listen(port, () => console.log(`TIMO running at http://localhost:${port}`));
