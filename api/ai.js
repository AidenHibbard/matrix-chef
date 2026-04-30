import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `
    You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make using some or all of those ingredients.

    You do NOT need to use every ingredient, but try to prioritise the ones provided. You may include a small number of additional ingredients if necessary, but keep them minimal.

    You MUST return your response as valid JSON only.

    Do NOT include any markdown, explanations, or text outside the JSON.
    Do NOT wrap the JSON in backticks.

    The JSON format must be exactly:

    {
    "title": "Recipe name",
    "description": "A short, appealing description of the dish",
    "difficulty": "easy" | "medium" | "hard",
    "cook_time": "e.g. 30 mins",
    "ingredients": [
        "ingredient 1",
        "ingredient 2"
    ],
    "instructions": [
        "step 1",
        "step 2"
    ],
    "tips": []
    }

    Ensure:
    - All fields are present
    - difficulty is always one of: easy, medium, hard
    - cook_time is a short human-readable string
    - Arrays contain plain strings only
    - Instructions are clear and step-by-step
    - tips can be an empty array if none are relevant
    - Output is valid JSON that can be parsed with JSON.parse()
    - Return ONLY the JSON object. Nothing before it, nothing after it.
`;

const rateLimit = new Map();

export default async function handler(req, res) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 3;

    const entry = rateLimit.get(ip) || { count: 0, start: now };

    if (now - entry.start > windowMs) {
        entry.count = 0;
        entry.start = now;
    }

    entry.count++;
    rateLimit.set(ip, entry);

    if (entry.count > maxRequests) {
        return res.status(429).json({ error: "Too many requests, please try again later." });
    }
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { ingredients } = req.body;

    try {
        const ingredientsList = ingredients.join(', ');

        const message = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001", //claude-sonnet-4-20250514
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: [
                {
                    role: "user",
                    content: `Ingredients: ${ingredientsList}`
                }
            ]
        });

        const recipe = message.content[0].text;
        res.status(200).json({ recipe });
    }
    catch (error) {
        console.error("Anthropic API error:", error);
        if (error.status === 429)
            return res.status(429).json({ error: "Too many requests, please try again later." });
        res.status(500).json({ error: "Failed to generate recipe" });
    }
}