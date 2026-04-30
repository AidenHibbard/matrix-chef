import { useState, useEffect } from "react";
import ChefFace from "./ChefFace.jsx"

const MESSAGES = [
    "INITIALISING_CHEF_CLAUDE...",
    "SCANNING_INGREDIENT_DATABASE...",
    "ANALYSING_FLAVOUR_PROFILES...",
    "SIMULATING_HEAT_DISTRIBUTION...",
    "CROSS_REFERENCING_RECIPE_VAULT...",
    "CALCULATING_COOK_TIME...",
    "OPTIMISING_SEASONING_RATIOS...",
    "RECIPE_FOUND. COMPILING OUTPUT...",
];

const SPINNER = ["◐", "◓", "◑", "◒"];

export default function LoadingPage() {
    const [lines, setLines] = useState([]);
    const [progress, setProgress] = useState(0);
    const [spinnerFrame, setSpinner] = useState(0);
    const expectedMs = 2000;

    // message drip
    useEffect(() => {
        const delay = expectedMs / MESSAGES.length;
        const timeouts = [];

        MESSAGES.forEach((msg, i) => {
            const t = setTimeout(() => {
                setLines(prev => [...prev, msg]);

                // progress based on message index, snaps to 100 on last one
                const pct = i === MESSAGES.length - 1
                    ? 99
                    : Math.round(((i + 1) / MESSAGES.length) * 90);

                setProgress(pct);

            }, delay * i);

            timeouts.push(t);
        });

        return () => timeouts.forEach(clearTimeout);
    }, []);

    // spinner
    useEffect(() => {
        const spin = setInterval(() => {
            setSpinner(f => (f + 1) % 4);
        }, 120);
        return () => clearInterval(spin);
    }, []);

    const filled = Math.round((progress / 100) * 10);
    const progressBar = "█".repeat(filled) + "░".repeat(10 - filled);

    return (
        <section>
            <ChefFace type="loading" />
            <div className="terminal">
                {lines.map((line, index) => (
                    <div className="loading-message" key={index}>
                        <span className="prompt">[{index}] &gt; </span>
                        {line}
                    </div>
                ))}
                <p>{progress}%</p>
                <p>{progressBar} {SPINNER[spinnerFrame]}</p>
            </div>
        </section>
    )
}