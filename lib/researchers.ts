export type Tier = "S" | "A" | "B" | "C";

export interface Researcher {
  id: string;
  name: string;
  role: string;
  company: string;
  joined: string; // "YYYY-MM"
  prevCompany: string;
  prevTenure: number; // months at previous
  tier: Tier;
  notable: string[];
  hIndex: number;
  citations: number;
  papers: number;
  twitter?: string;
  linkedin?: string;
  scholar?: string;
  website?: string;
}

export interface TransferMove {
  name: string;
  from: string;
  to: string;
  date: string;
  type: "hired" | "departed" | "founded";
}

export interface CompanyStats {
  name: string;
  count: number;
  avgHIndex: number;
  totalCitations: number;
  netFlow: number;
}

// ── Company display colors ─────────────────────────────────

export const COMPANY_COLORS: Record<string, string> = {
  "OpenAI": "#10A37F",
  "Anthropic": "#D4A574",
  "Google DeepMind": "#4285F4",
  "Google": "#4285F4",
  "Meta": "#0668E1",
  "xAI": "#AAAAAA",
  "Tesla": "#CC0000",
  "Mistral": "#FF7000",
  "Microsoft": "#00A4EF",
  "Apple": "#A2AAAD",
  "NVIDIA": "#76B900",
  "Amazon": "#FF9900",
  "Cohere": "#D18EE2",
  "SSI": "#FFD700",
  "Stanford": "#8C1515",
  "UC Berkeley": "#003262",
  "MIT": "#A31F34",
  "Mila": "#E84855",
  "Together AI": "#6366F1",
  "Black Forest Labs": "#BC83E6",
  "Essential AI": "#FF6B6B",
  "Sakana AI": "#FF8C42",
  "Reka AI": "#00C9FF",
  "Character.AI": "#B4FF00",
  "Inflection AI": "#7C3AED",
  "Independent": "#888888",
  "Princeton": "#FF6600",
  "CMU": "#C41230",
  "UofToronto": "#002A5C",
  "DeepLearning.AI": "#00B4D8",
  "Ineffable Intelligence": "#38BDF8",
  "Adept AI": "#F472B6",
  "AI2": "#22D3EE",
  "Hugging Face": "#FFD21E",
  "Perplexity AI": "#20B8CD",
  "Thinking Machines Lab": "#E040FB",
  "Boson AI": "#FF6F61",
  "Caltech": "#FF6C0C",
  "Center for AI Safety": "#34D399",
  "Contextual AI": "#94A3B8",
};

export const COMPANY_FILTER_LIST = [
  "OpenAI",
  "Anthropic",
  "Google DeepMind",
  "Meta",
  "Thinking Machines Lab",
  "xAI",
  "Mistral",
  "Microsoft",
  "Apple",
  "NVIDIA",
] as const;

// ── Seed dataset ───────────────────────────────────────────
// All data from public sources: press coverage, arXiv papers,
// announced moves, public profiles. Citation metrics are
// approximate and will be refined via Semantic Scholar API.

export const RESEARCHERS: Researcher[] = [
  // ── OpenAI ──────────────────────────────────────────────
  { id: "sam-altman", name: "Sam Altman", role: "CEO", company: "OpenAI", joined: "2015-12", prevCompany: "Y Combinator", prevTenure: 60, tier: "S", notable: ["OpenAI co-founder", "GPT-4 launch"], hIndex: 3, citations: 800, papers: 2, twitter: "sama", linkedin: "samaltman" },
  { id: "greg-brockman", name: "Greg Brockman", role: "President", company: "OpenAI", joined: "2015-12", prevCompany: "Stripe", prevTenure: 48, tier: "A", notable: ["OpenAI co-founder", "CTO then President"], hIndex: 5, citations: 2000, papers: 4, twitter: "gabordb", linkedin: "thegdb" },
  { id: "jakub-pachocki", name: "Jakub Pachocki", role: "Chief Scientist", company: "OpenAI", joined: "2017-01", prevCompany: "CMU", prevTenure: 24, tier: "A", notable: ["GPT-4 technical lead", "Chief Scientist post-Ilya"], hIndex: 18, citations: 8000, papers: 25 },
  { id: "mark-chen", name: "Mark Chen", role: "SVP Research", company: "OpenAI", joined: "2018-06", prevCompany: "MIT", prevTenure: 24, tier: "A", notable: ["Codex", "GPT-4V", "SVP Research"], hIndex: 22, citations: 15000, papers: 20, twitter: "markchen90" },
  { id: "alec-radford", name: "Alec Radford", role: "Research Scientist", company: "OpenAI", joined: "2016-06", prevCompany: "Indico Data", prevTenure: 24, tier: "A", notable: ["GPT-1/2", "CLIP", "DALL-E", "Whisper"], hIndex: 30, citations: 120000, papers: 18 },
  { id: "lilian-weng", name: "Lilian Weng", role: "Co-Founder", company: "Thinking Machines Lab", joined: "2025-02", prevCompany: "OpenAI", prevTenure: 78, tier: "B", notable: ["Safety systems lead", "lilianweng.github.io blog", "TML co-founder"], hIndex: 15, citations: 5000, papers: 15, twitter: "lilianweng" },
  { id: "barret-zoph", name: "Barret Zoph", role: "CTO", company: "Thinking Machines Lab", joined: "2025-02", prevCompany: "OpenAI", prevTenure: 60, tier: "B", notable: ["Neural architecture search", "Post-training lead", "TML CTO"], hIndex: 28, citations: 35000, papers: 22 },
  { id: "noam-brown", name: "Noam Brown", role: "Research Scientist", company: "OpenAI", joined: "2022-07", prevCompany: "Meta FAIR", prevTenure: 48, tier: "B", notable: ["Libratus poker AI", "o1 reasoning"], hIndex: 20, citations: 8000, papers: 25, twitter: "polynoamuth" },
  { id: "jason-wei", name: "Jason Wei", role: "Research Scientist", company: "OpenAI", joined: "2023-06", prevCompany: "Google Brain", prevTenure: 36, tier: "B", notable: ["Chain-of-thought prompting", "Scaling analysis"], hIndex: 32, citations: 25000, papers: 40 },
  { id: "hyung-won-chung", name: "Hyung Won Chung", role: "Research Scientist", company: "OpenAI", joined: "2023-08", prevCompany: "Google Brain", prevTenure: 36, tier: "B", notable: ["Flan-T5", "Scaling instruction tuning"], hIndex: 22, citations: 18000, papers: 28 },
  { id: "wojciech-zaremba", name: "Wojciech Zaremba", role: "Co-founder & Head of Codex", company: "OpenAI", joined: "2015-12", prevCompany: "NYU / Facebook AI", prevTenure: 24, tier: "A", notable: ["OpenAI co-founder", "Codex/code generation lead"], hIndex: 25, citations: 20000, papers: 22 },
  { id: "bob-mcgrew", name: "Bob McGrew", role: "Research", company: "Thinking Machines Lab", joined: "2025-04", prevCompany: "OpenAI", prevTenure: 101, tier: "A", notable: ["Former OpenAI CRO", "Scaled research org to 200+"], hIndex: 5, citations: 1000, papers: 5 },

  // ── Anthropic ───────────────────────────────────────────
  { id: "dario-amodei", name: "Dario Amodei", role: "CEO", company: "Anthropic", joined: "2021-01", prevCompany: "OpenAI", prevTenure: 48, tier: "S", notable: ["Anthropic founder", "Claude series", "Scaling laws"], hIndex: 35, citations: 45000, papers: 30, twitter: "DarioAmodei", linkedin: "dario-amodei" },
  { id: "daniela-amodei", name: "Daniela Amodei", role: "President", company: "Anthropic", joined: "2021-01", prevCompany: "OpenAI", prevTenure: 36, tier: "A", notable: ["Anthropic co-founder", "Business operations"], hIndex: 0, citations: 0, papers: 0, linkedin: "danielaamodei" },
  { id: "chris-olah", name: "Chris Olah", role: "Co-founder", company: "Anthropic", joined: "2021-01", prevCompany: "OpenAI", prevTenure: 24, tier: "A", notable: ["Mechanistic interpretability pioneer", "Distill.pub"], hIndex: 30, citations: 40000, papers: 25, twitter: "ch402" },
  { id: "tom-brown", name: "Tom Brown", role: "Co-founder", company: "Anthropic", joined: "2021-01", prevCompany: "OpenAI", prevTenure: 36, tier: "A", notable: ["GPT-3 first author", "Language models are few-shot learners"], hIndex: 22, citations: 60000, papers: 15 },
  { id: "jared-kaplan", name: "Jared Kaplan", role: "Co-founder", company: "Anthropic", joined: "2021-01", prevCompany: "Johns Hopkins", prevTenure: 48, tier: "A", notable: ["Neural scaling laws", "Anthropic co-founder"], hIndex: 35, citations: 30000, papers: 45, twitter: "jaredkaplan" },
  { id: "sam-mccandlish", name: "Sam McCandlish", role: "Co-founder", company: "Anthropic", joined: "2021-01", prevCompany: "OpenAI", prevTenure: 36, tier: "A", notable: ["Scaling laws co-author", "Anthropic co-founder"], hIndex: 18, citations: 15000, papers: 12 },
  { id: "jack-clark", name: "Jack Clark", role: "Co-founder & Head of Policy", company: "Anthropic", joined: "2021-01", prevCompany: "OpenAI", prevTenure: 36, tier: "A", notable: ["AI Index Report", "Policy leadership"], hIndex: 8, citations: 3000, papers: 10, twitter: "jackclarkSF" },
  { id: "jan-leike", name: "Jan Leike", role: "Head of Alignment", company: "Anthropic", joined: "2024-05", prevCompany: "OpenAI", prevTenure: 48, tier: "A", notable: ["Superalignment co-lead", "RLHF research"], hIndex: 25, citations: 12000, papers: 30, twitter: "janleike" },
  { id: "john-schulman", name: "John Schulman", role: "Chief Scientist", company: "Thinking Machines Lab", joined: "2025-02", prevCompany: "Anthropic", prevTenure: 5, tier: "A", notable: ["PPO algorithm", "OpenAI co-founder", "RLHF pioneer"], hIndex: 40, citations: 90000, papers: 30 },
  { id: "durk-kingma", name: "Durk Kingma", role: "Research Scientist", company: "Anthropic", joined: "2024-10", prevCompany: "Google DeepMind", prevTenure: 72, tier: "A", notable: ["VAE co-inventor", "Adam optimizer", "Glow"], hIndex: 35, citations: 120000, papers: 20 },
  { id: "nicholas-carlini", name: "Nicholas Carlini", role: "Research Scientist", company: "Anthropic", joined: "2025-01", prevCompany: "Google DeepMind", prevTenure: 84, tier: "B", notable: ["Adversarial ML", "LLM security research"], hIndex: 55, citations: 35000, papers: 80, twitter: "nicholas_carlini", website: "https://nicholas.carlini.com" },
  { id: "julian-schrittwieser", name: "Julian Schrittwieser", role: "Research Scientist", company: "Anthropic", joined: "2024-10", prevCompany: "Google DeepMind", prevTenure: 120, tier: "B", notable: ["MuZero first author", "AlphaZero", "AlphaGo"], hIndex: 18, citations: 20000, papers: 12 },
  { id: "andrea-vallone", name: "Andrea Vallone", role: "Alignment Research", company: "Anthropic", joined: "2026-01", prevCompany: "OpenAI", prevTenure: 36, tier: "B", notable: ["Model policy lead at OpenAI", "Safety research"], hIndex: 8, citations: 2000, papers: 8 },
  { id: "david-duvenaud", name: "David Duvenaud", role: "Research Scientist", company: "Anthropic", joined: "2024-01", prevCompany: "UofToronto", prevTenure: 84, tier: "B", notable: ["Neural ODEs", "Hyperparameter optimization"], hIndex: 38, citations: 25000, papers: 50 },

  // ── Google DeepMind ─────────────────────────────────────
  { id: "demis-hassabis", name: "Demis Hassabis", role: "CEO, Google DeepMind", company: "Google DeepMind", joined: "2010-11", prevCompany: "Founded DeepMind", prevTenure: 0, tier: "S", notable: ["AlphaGo", "AlphaFold", "Nobel Prize 2024"], hIndex: 78, citations: 130000, papers: 85, twitter: "demishassabis", linkedin: "demis-hassabis" },
  { id: "jeff-dean", name: "Jeff Dean", role: "Chief Scientist, Google", company: "Google DeepMind", joined: "1999-08", prevCompany: "DEC/Compaq", prevTenure: 36, tier: "S", notable: ["MapReduce", "TensorFlow", "Transformer team lead"], hIndex: 130, citations: 350000, papers: 150, twitter: "JeffDean" },
  { id: "shane-legg", name: "Shane Legg", role: "Co-founder & Chief AGI Scientist", company: "Google DeepMind", joined: "2010-11", prevCompany: "Founded DeepMind", prevTenure: 0, tier: "S", notable: ["DeepMind co-founder", "AGI research"], hIndex: 25, citations: 15000, papers: 30 },
  { id: "oriol-vinyals", name: "Oriol Vinyals", role: "VP Research", company: "Google DeepMind", joined: "2014-09", prevCompany: "Google Brain", prevTenure: 24, tier: "A", notable: ["AlphaStar", "Seq2Seq", "Pointer Networks"], hIndex: 75, citations: 150000, papers: 120 },
  { id: "koray-kavukcuoglu", name: "Koray Kavukcuoglu", role: "VP Research", company: "Google DeepMind", joined: "2013-03", prevCompany: "NEC Labs", prevTenure: 36, tier: "A", notable: ["DeepMind research leadership", "AlphaGo team"], hIndex: 45, citations: 60000, papers: 50 },
  { id: "pushmeet-kohli", name: "Pushmeet Kohli", role: "VP Research", company: "Google DeepMind", joined: "2017-01", prevCompany: "Microsoft Research", prevTenure: 96, tier: "A", notable: ["AI for Science", "AlphaFold program"], hIndex: 65, citations: 30000, papers: 150 },
  { id: "john-jumper", name: "John Jumper", role: "Research Director", company: "Google DeepMind", joined: "2017-10", prevCompany: "UChicago PhD", prevTenure: 48, tier: "A", notable: ["AlphaFold2 lead", "Nobel Prize 2024"], hIndex: 22, citations: 30000, papers: 15 },
  { id: "laurent-sifre", name: "Laurent Sifre", role: "Research Lead", company: "Google DeepMind", joined: "2015-01", prevCompany: "PhD Cambridge", prevTenure: 36, tier: "A", notable: ["Gemini technical lead", "AlphaGo"], hIndex: 25, citations: 15000, papers: 20 },
  { id: "noam-shazeer", name: "Noam Shazeer", role: "Research", company: "Google DeepMind", joined: "2023-08", prevCompany: "Character.AI", prevTenure: 24, tier: "S", notable: ["Transformer co-author", "Attention Is All You Need", "Character.AI founder"], hIndex: 55, citations: 200000, papers: 40 },
  { id: "raia-hadsell", name: "Raia Hadsell", role: "VP Research", company: "Google DeepMind", joined: "2014-06", prevCompany: "SRI International", prevTenure: 36, tier: "A", notable: ["Robotics research", "Continual learning"], hIndex: 40, citations: 35000, papers: 60 },
  { id: "ian-goodfellow", name: "Ian Goodfellow", role: "Research Scientist", company: "Google DeepMind", joined: "2023-03", prevCompany: "Apple", prevTenure: 36, tier: "A", notable: ["Invented GANs", "Deep Learning textbook"], hIndex: 70, citations: 250000, papers: 80, twitter: "goodfellow_ian" },
  { id: "quoc-le", name: "Quoc Le", role: "Research Scientist", company: "Google DeepMind", joined: "2013-01", prevCompany: "Stanford PhD", prevTenure: 48, tier: "A", notable: ["AutoML", "Seq2Seq", "EfficientNet"], hIndex: 85, citations: 180000, papers: 100 },

  // ── Meta FAIR ───────────────────────────────────────────
  { id: "yann-lecun", name: "Yann LeCun", role: "Chief AI Scientist", company: "Meta", joined: "2013-12", prevCompany: "NYU", prevTenure: 240, tier: "S", notable: ["Convolutional networks pioneer", "Turing Award 2018", "FAIR founder"], hIndex: 150, citations: 500000, papers: 350, twitter: "ylecun", website: "http://yann.lecun.com" },
  { id: "joelle-pineau", name: "Joelle Pineau", role: "VP AI Research", company: "Meta", joined: "2017-10", prevCompany: "McGill University", prevTenure: 144, tier: "A", notable: ["FAIR VP", "RL for healthcare", "Reproducibility advocate"], hIndex: 55, citations: 25000, papers: 120 },
  { id: "hugo-touvron", name: "Hugo Touvron", role: "Research Scientist", company: "Meta", joined: "2021-03", prevCompany: "Sorbonne PhD", prevTenure: 36, tier: "B", notable: ["Llama 1/2/3 lead author", "DeiT"], hIndex: 20, citations: 30000, papers: 15 },
  { id: "mike-lewis", name: "Mike Lewis", role: "Research Scientist", company: "Meta", joined: "2017-01", prevCompany: "PhD Cambridge", prevTenure: 36, tier: "B", notable: ["BART", "Deal or No Deal AI"], hIndex: 40, citations: 30000, papers: 50 },
  { id: "sergey-edunov", name: "Sergey Edunov", role: "Research Lead", company: "Meta", joined: "2016-06", prevCompany: "PhD NYU", prevTenure: 36, tier: "B", notable: ["Large-scale NLP", "Fairseq contributor"], hIndex: 25, citations: 15000, papers: 30 },
  { id: "ari-morcos", name: "Ari Morcos", role: "Research Lead", company: "Meta", joined: "2019-01", prevCompany: "PhD Harvard", prevTenure: 48, tier: "B", notable: ["Representation learning", "Model understanding"], hIndex: 22, citations: 8000, papers: 25 },

  // ── xAI ─────────────────────────────────────────────────
  { id: "igor-babuschkin", name: "Igor Babuschkin", role: "Co-founder & Research Lead", company: "xAI", joined: "2023-03", prevCompany: "Google DeepMind", prevTenure: 60, tier: "B", notable: ["Grok model lead", "xAI co-founder"], hIndex: 18, citations: 6000, papers: 20 },
  { id: "christian-szegedy", name: "Christian Szegedy", role: "Research", company: "xAI", joined: "2023-06", prevCompany: "Google Brain", prevTenure: 108, tier: "A", notable: ["Inception/GoogLeNet", "Batch normalization co-author"], hIndex: 45, citations: 200000, papers: 35 },
  { id: "jimmy-ba", name: "Jimmy Ba", role: "Research", company: "xAI", joined: "2023-03", prevCompany: "UofToronto", prevTenure: 84, tier: "B", notable: ["Layer normalization", "Adam optimizer co-author"], hIndex: 35, citations: 80000, papers: 40 },
  { id: "toby-pohlen", name: "Toby Pohlen", role: "Research", company: "xAI", joined: "2023-06", prevCompany: "Google DeepMind", prevTenure: 60, tier: "B", notable: ["Grok architecture", "V-trace algorithm"], hIndex: 12, citations: 3000, papers: 10 },

  // ── Mistral ─────────────────────────────────────────────
  { id: "arthur-mensch", name: "Arthur Mensch", role: "CEO", company: "Mistral", joined: "2023-04", prevCompany: "Google DeepMind", prevTenure: 36, tier: "A", notable: ["Mistral founder", "Chinchilla scaling team"], hIndex: 15, citations: 8000, papers: 12, twitter: "arthurmensch" },
  { id: "guillaume-lample", name: "Guillaume Lample", role: "Co-founder & Chief Scientist", company: "Mistral", joined: "2023-04", prevCompany: "Meta FAIR", prevTenure: 60, tier: "A", notable: ["Mistral co-founder", "Cross-lingual NLP"], hIndex: 30, citations: 25000, papers: 25 },
  { id: "timothee-lacroix", name: "Timothée Lacroix", role: "Co-founder & CTO", company: "Mistral", joined: "2023-04", prevCompany: "Meta FAIR", prevTenure: 60, tier: "A", notable: ["Mistral co-founder", "Efficient inference"], hIndex: 15, citations: 5000, papers: 12 },

  // ── Microsoft ───────────────────────────────────────────
  { id: "sebastien-bubeck", name: "Sébastien Bubeck", role: "VP GenAI", company: "Microsoft", joined: "2014-09", prevCompany: "Princeton", prevTenure: 36, tier: "A", notable: ["Sparks of AGI paper", "Phi model series", "VP of GenAI"], hIndex: 45, citations: 25000, papers: 90 },
  { id: "kevin-scott", name: "Kevin Scott", role: "CTO", company: "Microsoft", joined: "2017-02", prevCompany: "LinkedIn", prevTenure: 84, tier: "A", notable: ["Microsoft CTO", "Azure AI strategy", "Behind the Tech podcast"], hIndex: 5, citations: 500, papers: 3, twitter: "kevin_scott" },

  // ── Apple ───────────────────────────────────────────────
  { id: "john-giannandrea", name: "John Giannandrea", role: "SVP Machine Learning & AI", company: "Apple", joined: "2018-04", prevCompany: "Google", prevTenure: 108, tier: "A", notable: ["Apple ML lead", "Former Google Search/AI VP"], hIndex: 12, citations: 3000, papers: 10 },
  { id: "samy-bengio", name: "Samy Bengio", role: "Senior Director ML", company: "Apple", joined: "2021-04", prevCompany: "Google Brain", prevTenure: 108, tier: "A", notable: ["Yoshua's brother", "Google Brain research lead"], hIndex: 65, citations: 55000, papers: 120 },
  { id: "ruslan-salakhutdinov", name: "Ruslan Salakhutdinov", role: "VP AI Research", company: "Apple", joined: "2016-10", prevCompany: "CMU", prevTenure: 72, tier: "A", notable: ["Apple VP AI", "Deep generative models"], hIndex: 70, citations: 60000, papers: 130 },

  // ── NVIDIA ──────────────────────────────────────────────
  { id: "jim-fan", name: "Jim Fan", role: "Senior Research Lead", company: "NVIDIA", joined: "2022-01", prevCompany: "Stanford PhD", prevTenure: 48, tier: "B", notable: ["Voyager agent", "Foundation agents", "AI explainer"], hIndex: 18, citations: 8000, papers: 20, twitter: "DrJimFan" },
  { id: "bryan-catanzaro", name: "Bryan Catanzaro", role: "VP Applied Deep Learning", company: "NVIDIA", joined: "2014-01", prevCompany: "Baidu SVAIL", prevTenure: 24, tier: "B", notable: ["NVIDIA DL infra", "GPU computing for AI"], hIndex: 30, citations: 18000, papers: 35, twitter: "ctnzr" },
  { id: "anima-anandkumar", name: "Anima Anandkumar", role: "Bren Professor of Computing", company: "Caltech", joined: "2024-01", prevCompany: "NVIDIA", prevTenure: 66, tier: "A", notable: ["Tensor methods", "AI for science", "Open-source AI advocate"], hIndex: 60, citations: 30000, papers: 130, twitter: "AnimaAnandkumar" },

  // ── Independent & Startups ──────────────────────────────
  { id: "andrej-karpathy", name: "Andrej Karpathy", role: "Independent Researcher & Educator", company: "Independent", joined: "2024-02", prevCompany: "OpenAI", prevTenure: 12, tier: "S", notable: ["Tesla Autopilot lead", "OpenAI founding", "nanoGPT", "autoresearch"], hIndex: 40, citations: 100000, papers: 25, twitter: "karpathy", website: "https://karpathy.ai" },
  { id: "ilya-sutskever", name: "Ilya Sutskever", role: "Co-founder & Chief Scientist", company: "SSI", joined: "2024-06", prevCompany: "OpenAI", prevTenure: 96, tier: "S", notable: ["GPT series architect", "AlexNet co-author", "SSI founder"], hIndex: 90, citations: 400000, papers: 98, twitter: "ilyasut" },
  { id: "david-silver", name: "David Silver", role: "Founder", company: "Ineffable Intelligence", joined: "2026-01", prevCompany: "Google DeepMind", prevTenure: 156, tier: "S", notable: ["AlphaGo lead", "AlphaZero", "RL pioneer"], hIndex: 75, citations: 100000, papers: 80 },
  { id: "mira-murati", name: "Mira Murati", role: "CEO & Founder", company: "Thinking Machines Lab", joined: "2025-02", prevCompany: "OpenAI", prevTenure: 48, tier: "A", notable: ["OpenAI CTO", "ChatGPT/GPT-4 launch leader", "Thinking Machines Lab founder"], hIndex: 3, citations: 500, papers: 2 },
  { id: "ashish-vaswani", name: "Ashish Vaswani", role: "Co-founder & CEO", company: "Essential AI", joined: "2022-06", prevCompany: "Google Brain", prevTenure: 84, tier: "A", notable: ["Transformer co-inventor", "Attention Is All You Need"], hIndex: 35, citations: 180000, papers: 25 },
  { id: "niki-parmar", name: "Niki Parmar", role: "Co-founder & CTO", company: "Essential AI", joined: "2022-06", prevCompany: "Google Brain", prevTenure: 72, tier: "A", notable: ["Transformer co-inventor", "Attention Is All You Need"], hIndex: 20, citations: 100000, papers: 15 },
  { id: "llion-jones", name: "Llion Jones", role: "Co-founder & Chief Scientist", company: "Sakana AI", joined: "2023-07", prevCompany: "Google Brain", prevTenure: 96, tier: "A", notable: ["Transformer co-inventor", "Sakana AI founder"], hIndex: 18, citations: 95000, papers: 12 },
  { id: "jakob-uszkoreit", name: "Jakob Uszkoreit", role: "Co-founder & CEO", company: "Inceptive", joined: "2021-01", prevCompany: "Google Brain", prevTenure: 108, tier: "A", notable: ["Transformer co-inventor", "RNA design startup"], hIndex: 22, citations: 95000, papers: 18 },
  { id: "aidan-gomez", name: "Aidan Gomez", role: "Co-founder & CEO", company: "Cohere", joined: "2019-09", prevCompany: "Google Brain intern", prevTenure: 6, tier: "A", notable: ["Transformer co-author", "Cohere founder"], hIndex: 12, citations: 90000, papers: 8, twitter: "aidangomez" },
  { id: "tri-dao", name: "Tri Dao", role: "Chief Scientist", company: "Together AI", joined: "2023-06", prevCompany: "Stanford PhD", prevTenure: 48, tier: "B", notable: ["FlashAttention inventor", "Mamba architecture"], hIndex: 25, citations: 15000, papers: 20, twitter: "tri_dao" },
  { id: "percy-liang", name: "Percy Liang", role: "Co-founder & Chief Scientist", company: "Together AI", joined: "2022-06", prevCompany: "Stanford", prevTenure: 120, tier: "A", notable: ["HELM benchmark", "Stanford CRFM", "Foundation models report"], hIndex: 65, citations: 40000, papers: 150 },
  { id: "yi-tay", name: "Yi Tay", role: "Co-founder & CTO", company: "Reka AI", joined: "2023-06", prevCompany: "Google Brain", prevTenure: 48, tier: "B", notable: ["UL2", "Flan-PaLM", "Reka Flash/Core models"], hIndex: 35, citations: 18000, papers: 60 },
  { id: "robin-rombach", name: "Robin Rombach", role: "Co-founder", company: "Black Forest Labs", joined: "2024-08", prevCompany: "Stability AI", prevTenure: 24, tier: "B", notable: ["Stable Diffusion lead author", "Latent diffusion models", "FLUX"], hIndex: 22, citations: 25000, papers: 15 },
  { id: "rewon-child", name: "Rewon Child", role: "Research Scientist", company: "Microsoft", joined: "2024-03", prevCompany: "Inflection AI", prevTenure: 24, tier: "B", notable: ["Sparse Transformers", "GPT-2/3 contributor"], hIndex: 12, citations: 6000, papers: 8 },
  { id: "aravind-srinivas", name: "Aravind Srinivas", role: "CEO", company: "Perplexity AI", joined: "2022-08", prevCompany: "OpenAI", prevTenure: 12, tier: "A", notable: ["Perplexity AI founder", "AI search pioneer"], hIndex: 15, citations: 5000, papers: 12, twitter: "AravSrinivas" },

  // ── Academia ────────────────────────────────────────────
  { id: "geoffrey-hinton", name: "Geoffrey Hinton", role: "Professor Emeritus", company: "UofToronto", joined: "1987-01", prevCompany: "Google Brain", prevTenure: 120, tier: "S", notable: ["Backpropagation", "Deep learning godfather", "Nobel Prize 2024", "Turing Award 2018"], hIndex: 170, citations: 900000, papers: 350, twitter: "geoffreyhinton", website: "https://www.cs.toronto.edu/~hinton/" },
  { id: "yoshua-bengio", name: "Yoshua Bengio", role: "Founder & Scientific Director", company: "Mila", joined: "1993-01", prevCompany: "MIT/AT&T Bell Labs", prevTenure: 48, tier: "S", notable: ["Deep learning pioneer", "Turing Award 2018", "GFlowNets"], hIndex: 190, citations: 800000, papers: 600, twitter: "yoshuabengio", website: "https://yoshuabengio.org" },
  { id: "fei-fei-li", name: "Fei-Fei Li", role: "Professor & Co-Director HAI", company: "Stanford", joined: "2009-09", prevCompany: "Princeton", prevTenure: 48, tier: "S", notable: ["ImageNet creator", "Stanford HAI", "Google Cloud AI advisor"], hIndex: 110, citations: 400000, papers: 200, twitter: "drfeifei" },
  { id: "andrew-ng", name: "Andrew Ng", role: "Founder", company: "DeepLearning.AI", joined: "2017-06", prevCompany: "Baidu", prevTenure: 36, tier: "S", notable: ["Coursera ML course", "Google Brain co-founder", "Landing AI"], hIndex: 120, citations: 300000, papers: 200, twitter: "AndrewYNg", website: "https://www.andrewng.org" },
  { id: "sergey-levine", name: "Sergey Levine", role: "Professor", company: "UC Berkeley", joined: "2016-09", prevCompany: "Google Brain", prevTenure: 24, tier: "A", notable: ["Robot learning pioneer", "Offline RL"], hIndex: 80, citations: 80000, papers: 200 },
  { id: "chelsea-finn", name: "Chelsea Finn", role: "Assistant Professor", company: "Stanford", joined: "2019-09", prevCompany: "UC Berkeley PhD", prevTenure: 48, tier: "A", notable: ["MAML meta-learning", "Few-shot learning"], hIndex: 55, citations: 60000, papers: 80 },
  { id: "pieter-abbeel", name: "Pieter Abbeel", role: "Professor & Co-founder", company: "UC Berkeley", joined: "2008-07", prevCompany: "Stanford PhD", prevTenure: 48, tier: "A", notable: ["Robot learning", "Covariant AI co-founder", "Deep RL"], hIndex: 75, citations: 60000, papers: 150 },
  { id: "sasha-rush", name: "Sasha Rush", role: "Professor", company: "Cornell", joined: "2020-07", prevCompany: "Harvard", prevTenure: 60, tier: "B", notable: ["Annotated Transformer", "HuggingFace contributor", "NLP tools"], hIndex: 40, citations: 20000, papers: 70, twitter: "srush_nlp" },
  { id: "christopher-manning", name: "Christopher Manning", role: "Professor", company: "Stanford", joined: "1999-09", prevCompany: "Sydney/CMU", prevTenure: 60, tier: "A", notable: ["Stanford NLP Group", "GloVe embeddings", "NLP textbook"], hIndex: 120, citations: 250000, papers: 250 },
  { id: "dan-hendrycks", name: "Dan Hendrycks", role: "Executive Director", company: "Center for AI Safety", joined: "2022-01", prevCompany: "UC Berkeley PhD", prevTenure: 48, tier: "B", notable: ["MMLU benchmark", "AI safety benchmarks", "GELU activation"], hIndex: 40, citations: 30000, papers: 40, twitter: "DanHendrycks" },
  { id: "sanjeev-arora", name: "Sanjeev Arora", role: "Professor", company: "Princeton", joined: "2001-01", prevCompany: "IAS Princeton", prevTenure: 36, tier: "A", notable: ["Theoretical ML", "NLP theory", "Approximation algorithms"], hIndex: 65, citations: 30000, papers: 150 },
  { id: "jacob-steinhardt", name: "Jacob Steinhardt", role: "Assistant Professor", company: "UC Berkeley", joined: "2019-07", prevCompany: "Stanford PhD/OpenAI", prevTenure: 36, tier: "B", notable: ["AI forecasting", "Robustness research", "ML safety"], hIndex: 30, citations: 12000, papers: 45, twitter: "jsteinhardt" },

  // ── Hugging Face ────────────────────────────────────────
  { id: "clement-delangue", name: "Clément Delangue", role: "CEO", company: "Hugging Face", joined: "2016-01", prevCompany: "Mira (chatbot)", prevTenure: 24, tier: "A", notable: ["Hugging Face founder", "Open-source AI movement leader"], hIndex: 5, citations: 1000, papers: 3, twitter: "ClementDelangue" },
  { id: "thomas-wolf", name: "Thomas Wolf", role: "CSO & Co-founder", company: "Hugging Face", joined: "2016-01", prevCompany: "PhD", prevTenure: 24, tier: "B", notable: ["Transformers library architect", "HF co-founder"], hIndex: 15, citations: 30000, papers: 10, twitter: "Thom_Wolf" },

  // ── AI2 ─────────────────────────────────────────────────
  { id: "ali-farhadi", name: "Ali Farhadi", role: "CEO", company: "AI2", joined: "2018-09", prevCompany: "U Washington", prevTenure: 96, tier: "A", notable: ["AI2 CEO", "OLMo open models", "YOLO co-author"], hIndex: 65, citations: 60000, papers: 100 },
  { id: "hanna-hajishirzi", name: "Hanna Hajishirzi", role: "Research Director", company: "AI2", joined: "2018-01", prevCompany: "U Washington", prevTenure: 60, tier: "B", notable: ["OLMo", "Tulu models", "NLP research"], hIndex: 45, citations: 25000, papers: 80 },

  // ── Amazon ──────────────────────────────────────────────
  { id: "alex-smola", name: "Alex Smola", role: "CEO & Co-founder", company: "Boson AI", joined: "2023-06", prevCompany: "Amazon AWS", prevTenure: 60, tier: "A", notable: ["SVM kernel methods", "MXNet co-creator", "Foundation model startup"], hIndex: 100, citations: 150000, papers: 200 },

  // ── Additional notable researchers ──────────────────────
  { id: "luke-zettlemoyer", name: "Luke Zettlemoyer", role: "Research Director", company: "Meta", joined: "2018-01", prevCompany: "U Washington", prevTenure: 96, tier: "A", notable: ["RoBERTa", "BART co-author", "Semantic parsing"], hIndex: 70, citations: 60000, papers: 120 },
  { id: "douwe-kiela", name: "Douwe Kiela", role: "CEO", company: "Contextual AI", joined: "2022-09", prevCompany: "Meta / HuggingFace", prevTenure: 24, tier: "B", notable: ["RAG research", "Contextual AI founder", "Dynabench"], hIndex: 35, citations: 15000, papers: 60 },
  { id: "jason-weston", name: "Jason Weston", role: "Research Scientist", company: "Meta", joined: "2015-01", prevCompany: "Google", prevTenure: 24, tier: "A", notable: ["Memory networks", "bAbI tasks", "Dialog research pioneer"], hIndex: 80, citations: 80000, papers: 120 },
  { id: "mike-schroepfer", name: "Mike Schroepfer", role: "Senior Fellow", company: "Meta", joined: "2008-09", prevCompany: "Mozilla", prevTenure: 36, tier: "A", notable: ["Meta former CTO", "FAIR supporter", "Now climate tech"], hIndex: 3, citations: 500, papers: 2 },
  { id: "mustafa-suleyman", name: "Mustafa Suleyman", role: "CEO Microsoft AI", company: "Microsoft", joined: "2024-03", prevCompany: "Inflection AI", prevTenure: 24, tier: "S", notable: ["DeepMind co-founder", "Microsoft AI CEO", "Inflection AI founder"], hIndex: 10, citations: 5000, papers: 8, twitter: "mustafasuleyman" },
  { id: "emad-mostaque", name: "Emad Mostaque", role: "Former CEO", company: "Independent", joined: "2024-03", prevCompany: "Stability AI", prevTenure: 24, tier: "B", notable: ["Stability AI founder", "Open-source image generation advocate"], hIndex: 2, citations: 200, papers: 1, twitter: "EMostaque" },
];

// ── Recent high-profile moves ──────────────────────────────

export const RECENT_MOVES: TransferMove[] = [
  { name: "Andrea Vallone", from: "OpenAI", to: "Anthropic", date: "Jan 2026", type: "hired" },
  { name: "David Silver", from: "Google DeepMind", to: "Ineffable Intelligence", date: "Jan 2026", type: "founded" },
  { name: "Bob McGrew", from: "OpenAI", to: "Thinking Machines Lab", date: "Apr 2025", type: "hired" },
  { name: "Mira Murati", from: "OpenAI", to: "Thinking Machines Lab", date: "Feb 2025", type: "founded" },
  { name: "Barret Zoph", from: "OpenAI", to: "Thinking Machines Lab", date: "Feb 2025", type: "hired" },
  { name: "Lilian Weng", from: "OpenAI", to: "Thinking Machines Lab", date: "Feb 2025", type: "hired" },
  { name: "John Schulman", from: "Anthropic", to: "Thinking Machines Lab", date: "Feb 2025", type: "hired" },
  { name: "Nicholas Carlini", from: "Google DeepMind", to: "Anthropic", date: "2025", type: "hired" },
  { name: "Durk Kingma", from: "Google DeepMind", to: "Anthropic", date: "Oct 2024", type: "hired" },
  { name: "Julian Schrittwieser", from: "Google DeepMind", to: "Anthropic", date: "Oct 2024", type: "hired" },
  { name: "John Schulman", from: "OpenAI", to: "Anthropic", date: "Aug 2024", type: "hired" },
  { name: "Jan Leike", from: "OpenAI", to: "Anthropic", date: "May 2024", type: "hired" },
  { name: "Mustafa Suleyman", from: "Inflection AI", to: "Microsoft", date: "Mar 2024", type: "hired" },
  { name: "Robin Rombach", from: "Stability AI", to: "Black Forest Labs", date: "Aug 2024", type: "founded" },
  { name: "Ilya Sutskever", from: "OpenAI", to: "SSI", date: "Jun 2024", type: "founded" },
  { name: "Noam Shazeer", from: "Character.AI", to: "Google DeepMind", date: "Aug 2023", type: "hired" },
  { name: "Ian Goodfellow", from: "Apple", to: "Google DeepMind", date: "Mar 2023", type: "hired" },
];

// ── Helper functions ───────────────────────────────────────

export function computeTenureMonths(joined: string): number {
  const now = new Date();
  const d = new Date(joined + "-01");
  return (
    (now.getFullYear() - d.getFullYear()) * 12 +
    (now.getMonth() - d.getMonth())
  );
}

export function computeHeat(r: Researcher): number {
  const tenure = computeTenureMonths(r.joined);
  if (tenure < 6) return 1;
  if (tenure < 14) return 2;
  if (tenure < 28) return 3;
  if (tenure < 42) return 4;
  return 5;
}

export function computeInfluence(r: Researcher): number {
  const tierScore: Record<Tier, number> = { S: 100, A: 70, B: 45, C: 25 };
  const academic =
    r.hIndex * 2 + Math.log10(Math.max(r.citations, 1)) * 10;
  return Math.round(tierScore[r.tier] + academic);
}

export function getCompanyStats(
  researchers: Researcher[],
): CompanyStats[] {
  const map = new Map<
    string,
    { count: number; hSum: number; citSum: number }
  >();

  for (const r of researchers) {
    const entry = map.get(r.company) || { count: 0, hSum: 0, citSum: 0 };
    entry.count++;
    entry.hSum += r.hIndex;
    entry.citSum += r.citations;
    map.set(r.company, entry);
  }

  const netFlow = new Map<string, number>();
  for (const m of RECENT_MOVES) {
    netFlow.set(m.to, (netFlow.get(m.to) || 0) + 1);
    netFlow.set(m.from, (netFlow.get(m.from) || 0) - 1);
  }

  return Array.from(map.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      avgHIndex: Math.round(data.hSum / data.count),
      totalCitations: data.citSum,
      netFlow: netFlow.get(name) || 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function formatTenure(months: number): string {
  if (months < 1) return "<1mo";
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `${years}y ${rem}mo` : `${years}y`;
}
