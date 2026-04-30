import { useState } from "react"
import styles from '../styles/MainPage.module.css'
import ClaudeRecipe from "./ClaudeRecipe.jsx"
import ChefFace from "./ChefFace.jsx"
import LoadingPage from "./LoadingPage.jsx"
import { getRecipeFromChefClaude } from "../services/recipeService.js"

export default function MainPage({ leaveKitchen }) {
    const defaultStatusMessage = "awaiting ingredients... add some to wake me up.";

    const [ingredients, setIngredients] = useState([])
    const [recipe, setRecipe] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [statusMessage, setStatusMessage] = useState(defaultStatusMessage)

    const ingredientTags = ingredients.map((ingredient, index) => (
        <button key={index} className={styles['ingredient-btn']} onClick={() => deleteIngredient(index)}>
            {ingredient}
        </button>
    ))

    async function getRecipe() {
        if (ingredients.length === 0) {
            handleError("add some ingredients before executing the recipe!")
            return;
        }

        try {
            setIsLoading(true)
            const recipeJson = await getRecipeFromChefClaude(ingredients)
            setRecipe(recipeJson)
            setIsLoading(false)
        }
        catch (error) {
            setIsLoading(false)
            handleError(error.message);
            return;
        }
    }

    function setColourTheme(theme) {
        document.documentElement.style.setProperty('--matrix-color', `var(--matrix-${theme}-color)`);
        document.documentElement.style.setProperty('--matrix-border-color', `var(--matrix-${theme}-border)`);
        document.documentElement.style.setProperty('--matrix-border-color2', `var(--matrix-${theme}-border2)`);
    }

    function handleError(message) {
        setIsError(true)
        setColourTheme("red");
        setStatusMessage(message);

        setTimeout(() => {
            setIsError(false);
            setColourTheme("green");
            setStatusMessage(defaultStatusMessage);
            leaveKitchen();
        }, 2000);
    }

    function addIngredient(e) {
        e.preventDefault();
        const newIngredient = new FormData(e.target).get("ingredient")

        if (newIngredient.trim() === "") 
            return;
        else if (ingredients.includes(newIngredient.trim())) 
            return;
        else
            setIngredients(prevIngredients => [...prevIngredients, newIngredient.trim()])
        e.target.reset();
    }

    function deleteIngredient(index) {
        if (index === -1) {
            setRecipe("")
            setIngredients([])
        }
        else
            setIngredients(prevIngredients => prevIngredients.filter((_, i) => i !== index))
    }

    return (
        <main>
            {isLoading && <LoadingPage />}
            {!isLoading && recipe === "" &&
                <section>
                    <ChefFace ingredientCount={ingredients.length} type={isError ? "error" : null} />
                    <div className="terminal">
                        <form onSubmit={addIngredient} autoComplete="off">
                            <div className={styles['ingredient-line']}>
                                <span className="prompt">&gt;_</span>
                                <input className={styles['ingredient-input']}
                                    autoFocus
                                    type="text"
                                    aria-label="Add ingredient"
                                    name="ingredient"
                                    autoComplete="off"
                                    disabled={isError}
                                />
                            </div>
                        </form>
                        {(ingredients.length === 0 || isError) && <p>{statusMessage}</p>}
                        {ingredients.length > 0 && !isError && (
                            <div className={styles['ingredients-container']}>
                                {ingredientTags}
                            </div>
                        )}
                    </div>
                    {!isError && <button type="button" className="btn" onClick={getRecipe}>EXECUTE_RECIPE</button>}
                </section>
            }
            {recipe !== "" && <ClaudeRecipe recipe={recipe} deleteIngredient={deleteIngredient} />}
        </main>
    )
}