import styles from "../styles/ClaudeRecipe.module.css"

export default function ClaudeRecipe(props) {

    const DIFFICULTY_BARS = {
        easy: '██░░░░',
        medium: '████░░',
        hard: '██████',
    };
    return (
        <section className={styles['recipe-section']}>
            <div className="terminal">
                <div className={styles['recipe-line']}>
                    <span className="prompt">&gt;_</span>
                    <h2 className={styles['recipe-title']}>{props.recipe.title}</h2>
                </div>
                <div className={styles['recipe-time']}>
                    <p><strong>Difficulty:</strong> {DIFFICULTY_BARS[props.recipe.difficulty] + " " + props.recipe.difficulty.toUpperCase()}</p>
                    <p><strong>Cook Time:</strong> {props.recipe.cook_time}</p>
                </div>
                <p className={styles['recipe-description']}>{props.recipe.description}</p>


                <details>
                    <summary>Ingredients</summary>
                    {props.recipe.ingredients.map((ingredient, index) => (
                        <p className={styles['recipe-ingredients']} key={index}>{ingredient}</p>
                    ))}
                </details>

                <details>
                    <summary>Instructions</summary>
                    <ol>
                        {props.recipe.instructions.map((step, index) => (
                            <li className={styles['recipe-instructions']} key={index}>{step}</li>
                        ))}
                    </ol>
                </details>
                <details>
                    <summary>Tips</summary>
                    {props.recipe.tips.map((tip, index) => (
                        <p className={styles['recipe-tips']} key={index}>{tip}</p>
                    ))}
                </details>
            </div>
            <button type="button" className={`btn ${styles['cook-again']}`} onClick={() => props.deleteIngredient(-1)}>COOK_AGAIN</button>
        </section>
    )
}