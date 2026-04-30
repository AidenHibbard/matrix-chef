export async function getRecipeFromChefClaude(ingredients) {
    let res;
    try {
        res = await fetch("/api/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredients }),
        });
    } catch {
        throw new Error("Network error, please check your connection.");
    }

    if (!res.ok) {
        if (res.status === 429) throw new Error("Too many requests, please try again later.");
        if (res.status === 500) throw new Error("Server error, please try again.");
        if (res.status === 401) throw new Error("Unauthorised API request.");

        throw new Error(`Unexpected error: ${res.status}`);
    }

    const data = await res.json();
    const recipe = parseRecipe(data.recipe);
    
    if (!recipe) {
        throw new Error("Failed to parse recipe");
    }
    return recipe;
}

const parseRecipe = (raw) => {
    try {
        const cleaned = raw
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();
        return JSON.parse(cleaned.recipe || cleaned);
    } catch {
        return null;
    }
}