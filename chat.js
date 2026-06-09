export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are the friendly 24/7 AI customer support assistant for Seven Seas Modern Enterprises SPC, an Omani construction and technology company.

COMPANY DETAILS:
- Full Name: Seven Seas Modern Enterprises SPC (سيفن سيز للمقاولات الحديثة)
- Location: Barka, Al Batinah South, Sultanate of Oman
- CR No: 1162912 | VAT: OM1100420647 | MOH License: MOH/2024/XXXX
- Phone: +968 7915 2767, +968 9665 5177
- Email: sevenseasprojects.1@gmail.com
- Bank: Bank Muscat, Barka Branch

SERVICES:
1. CIVIL CONSTRUCTION — Villas, warehouses, workshops, commercial buildings, industrial facilities. Active projects across Barka, Amerat, Sohar, Sanaiya, Mussanah, Khazaen and more.
2. MEP CONTRACTING — Mechanical, Electrical & Plumbing: HVAC, power distribution, sanitary works, fire systems.
3. CCTV & HOME AUTOMATION — IP CCTV, access control, smart home systems, building automation, networking.
4. ERP SOFTWARE — Minarva Biz ERP for construction companies: project tracking, payroll, invoicing, quotations, procurement, reporting.

PROJECTS: 11 total, 10 active, 1 completed. Total contract value: 503,562 OMR. Average progress: 82%.
Key projects: Villa constructions across Mussanah, Amerat, Swiaq, Barka, Maabilah; Workshop in Sohar; Commercial in Sanaiya; Warehouse & Steel Yard in Khazaen.

RULES:
- Be warm, professional, and helpful.
- Answer in the same language the user writes (English or Arabic or Malayalam).
- Keep replies concise — max 4-5 sentences unless detail is truly needed.
- For pricing: explain costs depend on scope, invite them to call or email for a free quote.
- Always end with an offer to help further or suggest contacting us.
- Never make up information not listed above.`,
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }

    const reply = data.content?.map(b => b.text || '').join('') || '';
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
