export type GenerateLetterInput = {
  creatorName: string;
  partnerName: string;
  coupleName: string;
  importantMoments: string;
};

const MIN_LENGTH = 800;
const MAX_LENGTH = 1200;

const NAME_PARTICLES = new Set(["de", "da", "do", "dos", "das", "e"]);

const LETTER_SYSTEM_PROMPT = `Você escreve cartas de amor em português do Brasil, como uma pessoa real escreveria para quem ama — íntima, sincera e emocional, sem soar como texto de IA ou cartão pronto.

ESTILO:
- Tom conversacional e humano: frases que alguém de fato diria ou escreveria, não poemas artificiais.
- Romântico com moderação: evite superlativos vazios, metáforas forçadas e clichês ("alma gêmea", "destino", "universo conspira").
- Varie o ritmo com frases curtas e longas; parágrafos naturais.

NOMES:
- Capitalize corretamente nomes próprios (ex.: Maria, João, Ana Paula; partículas "de", "da", "do" em minúscula no meio do nome).
- Primeira linha: nome da pessoa amada + vírgula (ex.: "Maria,").
- Nome da pessoa amada: no máximo 1–2 vezes no corpo; depois prefira "você", "nós", "a gente".
- Nome do criador: só na assinatura final, capitalizado.
- Nome do casal: no máximo uma menção breve e natural, se couber — nunca como rótulo da relação.

PROIBIDO:
- Frases como "entre [criador] e você nasceu uma história que chamo de [casal]"
- Repetir os mesmos nomes em sequência ou em quase todo parágrafo
- Apresentar o nome do casal como título ou fórmula da história
- Tom publicitário, poemas genéricos ou texto "perfeito demais"

ESTRUTURA:
1. Saudação com o nome da pessoa amada
2. Corpo: sentimentos autênticos + momentos importantes entrelaçados na narrativa (não em lista)
3. Fechamento emocional breve
4. Assinatura carinhosa com o nome do criador (ex.: "Com amor," / "Para sempre seu," + nome)

FORMATO:
- Entre 800 e 1200 caracteres (com espaços)
- Sem título, hashtags ou emojis`;

function capitalizeName(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index > 0 && NAME_PARTICLES.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function buildLetterUserPrompt(input: GenerateLetterInput): string {
  const creator = capitalizeName(input.creatorName);
  const partner = capitalizeName(input.partnerName);
  const couple = capitalizeName(input.coupleName);

  return `Escreva uma carta de amor personalizada com estes dados:

Quem escreve: ${creator}
Pessoa amada (saudação no início): ${partner}
Nome do casal (opcional, uma menção no máximo): ${couple}

Momentos importantes para entrelaçar na narrativa (cite de forma fluida, não em lista):
${input.importantMoments.trim()}

Checklist obrigatório:
- Primeira linha: "${partner},"
- 800 a 1200 caracteres
- Português do Brasil, tom íntimo e natural
- Momentos citados organicamente no texto
- Evitar repetir "${partner}" e "${creator}"; priorizar "você" e "nós"
- Não usar a construção "entre X e você nasceu uma história que chamo de..."
- Encerrar com assinatura bonita usando apenas "${creator}"`;
}

function trimToSentence(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf("."), cut.lastIndexOf("!"), cut.lastIndexOf("?"));
  if (lastStop > max * 0.75) return cut.slice(0, lastStop + 1).trim();
  return cut.trim();
}

export function normalizeLetterLength(text: string): string {
  let letter = text.replace(/\s+/g, " ").trim();

  if (letter.length > MAX_LENGTH) {
    letter = trimToSentence(letter, MAX_LENGTH);
  }

  if (letter.length < MIN_LENGTH) {
    const padding =
      " Cada dia ao seu lado me lembra que o amor verdadeiro não é perfeito, é escolhido: escolhemos rir juntos, cuidar um do outro e transformar os dias comuns em memórias que valem a pena guardar para sempre.";
    while (letter.length < MIN_LENGTH && letter.length < MAX_LENGTH) {
      letter = `${letter}${padding}`;
    }
    letter = trimToSentence(letter, MAX_LENGTH);
  }

  return letter.slice(0, MAX_LENGTH).trim();
}

function weaveMoments(moments: string): string {
  const parts = moments
    .split(/[,;.\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (!parts.length) return moments.trim();

  if (parts.length === 1) {
    return `Lembro com carinho de quando ${parts[0].toLowerCase().replace(/^./, (c) => c)}.`;
  }

  const last = parts.pop();
  const head = parts
    .map((part) => {
      const normalized = part.toLowerCase().replace(/^./, (c) => c);
      return `quando ${normalized}`;
    })
    .join(", ");

  return `Guardo no coração ${head} e, principalmente, quando ${last?.toLowerCase().replace(/^./, (c) => c)}.`;
}

export function generateLetterFallback(input: GenerateLetterInput): string {
  const creator = capitalizeName(input.creatorName);
  const partner = capitalizeName(input.partnerName);
  const couple = capitalizeName(input.coupleName);
  const moments = input.importantMoments.trim();
  const momentsWeave = weaveMoments(moments);

  const letter = [
    `${partner},`,
    "",
    `Resolvi escrever o que sinto, porque olhar para trás me mostra uma história feita de detalhes simples — risadas sinceras, silêncios confortáveis e um carinho que não precisa de palavras grandiosas para ser verdadeiro.`,
    "",
    momentsWeave,
    "São essas lembranças que me lembram que o nosso amor não é só sentimento: é presença, é cuidado, é poder ser eu mesmo ao seu lado.",
    "",
    `Você transformou dias comuns em memórias que eu quero viver de novo. Quando penso no que ainda vem, imagino mais conversas até tarde, mais abraços que acalmam e mais planos que começam com o seu sorriso.`,
    "",
    `Obrigado por estar comigo e por escolher isso todo dia. O que construímos como ${couple} é único, e esta carta é só outro jeito de dizer o que o coração já sabe: eu te amo, e quero seguir ao seu lado cada capítulo que ainda virá.`,
    "",
    `Com todo o meu amor,`,
    creator
  ].join("\n");

  return normalizeLetterLength(letter);
}

export async function generateLetterWithOpenAI(input: GenerateLetterInput): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY não configurada.");
  }

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content: LETTER_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: buildLetterUserPrompt(input)
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error("Falha ao gerar carta com OpenAI.");
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("Resposta vazia da OpenAI.");
  }

  return normalizeLetterLength(content);
}

export async function generateLetter(input: GenerateLetterInput): Promise<{
  letter: string;
  source: "openai" | "fallback";
}> {
  if (process.env.OPENAI_API_KEY?.trim()) {
    try {
      const letter = await generateLetterWithOpenAI(input);
      return { letter, source: "openai" };
    } catch {
      return { letter: generateLetterFallback(input), source: "fallback" };
    }
  }

  return { letter: generateLetterFallback(input), source: "fallback" };
}
