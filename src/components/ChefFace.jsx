import styles from "../styles/ChefFace.module.css"

export default function ChefFace({ ingredientCount, type }) {
    const FACES = {
        error:   { id: "error", ascii: "x_x", label: "error: no ingredients detected" },
        idle:    { id: "idle", ascii: "-_-", label: "idle..." },
        curious: { id: "curious", ascii: "o_o", label: "curious..." },
        thinking: { id: "thinking", ascii: ">_<", label: "thinking..." },
        happy:   { id: "happy", ascii: "^.^", label: "lets cook!" },
    };

    function getMood(ingredientCount, type) {
        if (type === "error")
            return FACES.error;
        else if (type === "loading")
            return FACES.happy;
        else if (ingredientCount === 0) 
            return FACES.idle;
        else if (ingredientCount <= 2) 
            return FACES.curious;
        else if (ingredientCount <= 4)
            return FACES.thinking;
        else 
            return FACES.happy;
    }
    const mood = getMood(ingredientCount, type)
    return (
        <div>
            <div className={styles['chef-label']}>{mood.label}</div>
            <div className={`${styles['chef-face']} ${styles[`mood-${mood.id}`]}`}>{mood.ascii}</div>
        </div>
    )
}