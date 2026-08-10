export type Stat = { num: string; label: string };
export type Service = {
  name: string;
  desc: string;
  price: string;
  slug: string;
  blocks: Block[];
  notes?: string;
};
export type ProcessStep = { step: string; name: string; desc: string };
export type WorkItem = {
  name: string;
  desc: string;
  tags: string[];
  href: string;
  thumb: string;
  slug: string;
  blocks: Block[];
  notes?: string;
};
export type FooterLink = { label: string; href: string };
export type FooterCol = { heading: string; links: FooterLink[] };
export type ServicesFoot = { pre: string; link: string; post: string };

/** A single content block used to compose /work/[slug] and /services/[slug] detail pages. */
export type Block =
  | { id: string; type: 'heading'; text: string; level?: 2 | 3 }
  | { id: string; type: 'paragraph'; text: string }
  | { id: string; type: 'image'; src: string; alt: string; caption?: string }
  | { id: string; type: 'link'; label: string; href: string }
  | { id: string; type: 'slideshow'; images: { src: string; alt: string }[] }
  | { id: string; type: 'gallery'; images: { src: string; alt: string }[]; cols?: 2 | 3 }
  | { id: string; type: 'checklist'; items: string[] }
  | { id: string; type: 'quote'; text: string; cite?: string }
  | { id: string; type: 'list'; items: string[] }
  | { id: string; type: 'divider' }
  | { id: string; type: 'video'; url: string }
  | { id: string; type: 'code'; code: string; lang?: string }
  | { id: string; type: 'cta'; label: string; href: string }
  | { id: string; type: 'note'; text: string }
  | { id: string; type: 'comment'; text: string; author?: string }
  | { id: string; type: 'stat'; num: string; label: string }
  | { id: string; type: 'columns'; cols: 2 | 3; columns: Block[][] };

export const BLOCK_TYPES: { type: Block['type']; label: string }[] = [
  { type: 'heading', label: 'Heading' },
  { type: 'paragraph', label: 'Paragraph' },
  { type: 'image', label: 'Image' },
  { type: 'link', label: 'Link' },
  { type: 'slideshow', label: 'Slideshow' },
  { type: 'gallery', label: 'Gallery' },
  { type: 'checklist', label: 'Checklist' },
  { type: 'quote', label: 'Quote' },
  { type: 'list', label: 'List' },
  { type: 'divider', label: 'Divider' },
  { type: 'video', label: 'Video' },
  { type: 'code', label: 'Code' },
  { type: 'cta', label: 'Button (CTA)' },
  { type: 'note', label: 'Note' },
  { type: 'comment', label: 'Comment' },
  { type: 'stat', label: 'Stat' },
  { type: 'columns', label: 'Columns (2–3)' },
];

export function defaultBlockFor(type: Block['type']): Block {
  const id = newBlockId();
  switch (type) {
    case 'heading': return { id, type, text: 'New heading', level: 2 };
    case 'paragraph': return { id, type, text: 'New paragraph text.' };
    case 'image': return { id, type, src: '', alt: '' };
    case 'link': return { id, type, label: 'Link label', href: '' };
    case 'slideshow': return { id, type, images: [] };
    case 'gallery': return { id, type, images: [], cols: 2 };
    case 'checklist': return { id, type, items: ['New item'] };
    case 'quote': return { id, type, text: 'Quote text' };
    case 'list': return { id, type, items: ['New item'] };
    case 'divider': return { id, type };
    case 'video': return { id, type, url: '' };
    case 'code': return { id, type, code: '', lang: '' };
    case 'cta': return { id, type, label: 'Get in touch', href: '/#contact' };
    case 'note': return { id, type, text: 'Note text' };
    case 'comment': return { id, type, text: 'Comment text', author: '' };
    case 'stat': return { id, type, num: '100%', label: 'label' };
    case 'columns': return { id, type: 'columns', cols: 2, columns: [[], []] };
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled';
}

export function newBlockId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export type SiteContent = {
  heroName: string;
  heroRole: string[];
  heroBio: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  skills: string[];
  stats: Stat[];
  workTitle: string;
  work: WorkItem[];
  servicesEyebrow: string;
  servicesTitle: string;
  servicesIntro: string;
  services: Service[];
  servicesFoot: ServicesFoot;
  processTitle: string;
  process: ProcessStep[];
  contactTitle: string;
  contactSub: string;
  phone: string;
  phoneHref: string;
  email: string;
  footerCols: FooterCol[];
  footerCopy: string;
};

export const CONTENT_KEY = 'portfolio-content-v1';
export const ADMIN_PASSWORD = 'admin';

export const DEFAULT_CONTENT: SiteContent = {
  heroName: 'Youssef Sabry',
  heroRole: ['<full-stack developer>', '<Ui/Ux designer>'],
  heroBio:
    '- Student & part-time web developer with 5 years of coding and freelance experience.\n- WordPress specialist — building custom themes, plugins, and full CMS solutions alongside modern Next.js applications.\n- I also build games with Unity and Next.js in my free time.',
  heroCtaPrimary: 'Check out my work',
  heroCtaSecondary: 'get in touch',
  skills: [
    'Secure Payment Webhooks',
    'Authentication systems',
    'SEO & Meta tagging',
    'Database & Webhook Setup',
    'Responsive mobile design',
    'Automated Emails & Receipts',
    'Custom Admin Dashboards',
    'Domain & DNS Configuration',
    'Custom UI & Micro-animations',
  ],
  stats: [
    { num: '5+', label: 'years coding & freelance' },
    { num: '3', label: 'stacks — WordPress · Next.js · Unity' },
    { num: '100%', label: 'custom builds, no templates' },
  ],
  workTitle: 'My Work',
  work: [
    {
      name: 'The Rising Times',
      desc: 'A fully functional digital magazine platform for I-Tech School, built from the ground up with a custom admin dashboard, dynamic content management, and a structured database. The site delivers articles and updates to the school community with a clean, student-friendly interface.',
      tags: ['JavaScript', 'HTML/CSS', 'Database', 'Admin Dashboard'],
      href: 'https://therisingtimes.vercel.app',
      thumb: '/projects/rising-times.webp',
      slug: 'therising-times',
      blocks: [
        { id: 'b1', type: 'heading', text: 'The brief' },
        {
          id: 'b2',
          type: 'paragraph',
          text: 'I-Tech School needed a digital magazine their student journalists could actually run themselves — publish articles, manage sections, and keep a clean archive without touching code.',
        },
        { id: 'b3', type: 'image', src: '/projects/rising-times.webp', alt: 'The Rising Times homepage', caption: 'The public-facing homepage' },
        { id: 'b4', type: 'heading', text: 'What I built' },
        {
          id: 'b5',
          type: 'list',
          items: [
            'Custom admin dashboard for drafting, editing and publishing articles',
            'Structured database for articles, sections and authors',
            'Responsive, student-friendly reading experience',
            'Role-based access so editors and writers see only what they need',
          ],
        },
        {
          id: 'b6',
          type: 'quote',
          text: 'It finally feels like our own newsroom instead of a shared document.',
          cite: 'I-Tech School staff',
        },
      ],
      notes: '',
    },
  ],
  servicesEyebrow: 'Services & Pricing',
  servicesTitle: 'I can make you a ...',
  servicesIntro:
    'From full-stack development to pixel-perfect UI/UX — I build digital experiences that work and look great.',
  services: [
    {
      name: 'E-Commerce Site',
      desc: 'Fully custom online store built with secure checkout, automated shipping calculators, inventory management, and payment gateway integration',
      price: '4000–10000 EGP',
      slug: 'e-commerce-site',
      blocks: [
        { id: 's1', type: 'heading', text: "What's included" },
        {
          id: 's2',
          type: 'paragraph',
          text: 'A fully custom storefront — not a locked-down template. You get a secure checkout flow, inventory that stays in sync, and a backend that scales with your catalogue.',
        },
        {
          id: 's3',
          type: 'list',
          items: [
            'Custom checkout with secure payment gateway integration',
            'Automated shipping calculators & order tracking',
            'Inventory & product management dashboard',
            'Mobile-first, fast-loading storefront',
          ],
        },
        { id: 's4', type: 'heading', text: 'Typical timeline' },
        { id: 's5', type: 'paragraph', text: '2–5 weeks depending on catalogue size and integrations required.' },
      ],
      notes: '',
    },
    {
      name: 'Personal Portfolio',
      desc: 'An interactive digital showcase designed to highlight your work, experience, and personal brand with modern animations and seamless navigation',
      price: '1500–5000 EGP',
      slug: 'personal-portfolio',
      blocks: [
        { id: 's1', type: 'heading', text: "What's included" },
        {
          id: 's2',
          type: 'paragraph',
          text: 'A portfolio site built around you — your work, your voice, your brand — with the kind of polish and motion design that makes people stop scrolling.',
        },
        {
          id: 's3',
          type: 'list',
          items: [
            'Custom design matched to your personal brand',
            'Smooth scroll-triggered animations',
            'Project & case-study pages',
            'Contact form / booking integration',
          ],
        },
      ],
      notes: '',
    },
    {
      name: 'Booking & Scheduling',
      desc: 'Automated appointment booking with calendar sync, custom forms, and instant dual-routing notifications to streamline your business',
      price: '6000–11000 EGP',
      slug: 'booking-scheduling',
      blocks: [
        { id: 's1', type: 'heading', text: "What's included" },
        {
          id: 's2',
          type: 'paragraph',
          text: 'Stop juggling DMs and spreadsheets. Clients book straight into your calendar, and both of you get instant confirmations.',
        },
        {
          id: 's3',
          type: 'list',
          items: [
            'Live calendar sync (Google Calendar / Outlook)',
            'Custom intake forms per service',
            'Automatic email/SMS confirmations for you and the client',
            'Reschedule & cancellation handling',
          ],
        },
      ],
      notes: '',
    },
    {
      name: 'Promotional Website',
      desc: 'A clean, fast site built to showcase your business, highlight your services, and convert visitors into clients',
      price: '3000–5000 EGP',
      slug: 'promotional-website',
      blocks: [
        { id: 's1', type: 'heading', text: "What's included" },
        {
          id: 's2',
          type: 'paragraph',
          text: 'A focused, fast-loading site whose only job is turning visitors into leads — clear messaging, clear services, clear call-to-action.',
        },
        {
          id: 's3',
          type: 'list',
          items: [
            'Conversion-focused layout & copy structure',
            'Fast load times, optimised images',
            'Basic SEO & meta tagging',
            'Contact / lead-capture form',
          ],
        },
      ],
      notes: '',
    },
    {
      name: 'Optimization & Maintenance',
      desc: 'Speed up your existing site, fix broken layouts and bugs, boost your search ranking, and keep everything secure',
      price: '2000–4000 EGP',
      slug: 'optimization-maintenance',
      blocks: [
        { id: 's1', type: 'heading', text: "What's included" },
        {
          id: 's2',
          type: 'paragraph',
          text: "Already have a site that's slow, broken, or falling in search rankings? I audit it, fix what's wrong, and keep it healthy going forward.",
        },
        {
          id: 's3',
          type: 'list',
          items: [
            'Performance & Core Web Vitals audit',
            'Bug fixes & broken-layout repairs',
            'Basic SEO improvements',
            'Ongoing maintenance & security updates',
          ],
        },
      ],
      notes: '',
    },
    {
      name: 'Custom Web App',
      desc: 'Have a unique web project or app idea in mind? Bring your concept, and we’ll scope, design, and build a custom solution fitted to your exact needs',
      price: 'Varies',
      slug: 'custom-web-app',
      blocks: [
        { id: 's1', type: 'heading', text: 'How it works' },
        {
          id: 's2',
          type: 'paragraph',
          text: "Every idea is different, so this one starts with a conversation. We'll scope out exactly what you need, agree on a price, and I'll build it from the ground up.",
        },
        {
          id: 's3',
          type: 'list',
          items: [
            'Free scoping call to discuss your idea',
            'Fixed-price quote once scope is agreed',
            'Custom design & development, no templates',
            'Ongoing support after launch',
          ],
        },
      ],
      notes: '',
    },
  ],
  servicesFoot: {
    pre: 'None from this list? No problem, just ',
    link: 'Contact Me',
    post: ' with the details',
  },
  processTitle: 'How I work',
  process: [
    { step: 'Step 01', name: 'Discussion', desc: 'We negotiate the idea and the price' },
    { step: 'Step 02', name: 'Prototyping', desc: 'I make an illustration of your idea' },
    {
      step: 'Step 03',
      name: 'Updates',
      desc: 'I keep updating you on the progress, where you can still make changes',
    },
    { step: 'Step 04', name: 'Handoff', desc: 'I give you all control over the finished product' },
  ],
  contactTitle: 'Get in touch',
  contactSub: 'Let’s build something great together',
  phone: '01001271917',
  phoneHref: 'https://wa.me/201001271917',
  email: 'youssefasabry@outlook.com',
  footerCols: [
    {
      heading: 'Services',
      links: [
        { label: 'Web Development', href: '#services' },
        { label: 'UI/UX Design', href: '#services' },
        { label: 'WordPress Solutions', href: '#services' },
        { label: 'Next.js Apps', href: '#services' },
      ],
    },
    {
      heading: 'Youssef Sabry',
      links: [
        { label: 'Home', href: '#home' },
        { label: 'Portfolio', href: '#work' },
        { label: 'Process', href: '#about' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    {
      heading: 'Let’s Connect',
      links: [
        { label: 'GitHub', href: 'https://github.com/YoussefASabry' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/youssef-sabry-7a9561389/' },
        { label: 'Email Me', href: 'mailto:youssefasabry@outlook.com' },
      ],
    },
  ],
  footerCopy: '© 2026 Youssef Sabry.',
};
