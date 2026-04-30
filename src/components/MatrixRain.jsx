import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadImageShape } from "@tsparticles/shape-image";
import appleSvg from '../assets/icons/apple.svg?url';
import carrotSvg from '../assets/icons/carrot.svg?url';
import chefHatSvg from '../assets/icons/chef-hat.svg?url';
import bananaSvg from '../assets/icons/banana.svg?url';
import citrusSvg from '../assets/icons/citrus.svg?url';

export default function MatrixRain() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
            await loadImageShape(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options = {
        particles: {
            number: {
                value: 80, // Adjust density of icons
                density: { enable: true },
            },
            shape: {
                type: "image",
                options: {
                    image: [
                        {
                            src: appleSvg,
                            width: 24,
                            height: 24,
                        },
                        {
                            src: carrotSvg,
                            width: 24,
                            height: 24,
                        },
                        {
                            src: chefHatSvg,
                            width: 24,
                            height: 24,
                        },
                        {
                            src: bananaSvg,
                            width: 24,
                            height: 24,
                        },
                        {
                            src: citrusSvg,
                            width: 24,
                            height: 24,
                        },
                    ],
                },
            },
            opacity: {
                value: { min: 0.5, max: 0.8 }, //vary fade
                animation: {
                    enable: true,
                    speed: 1,
                    sync: false,
                },
            },
            size: {
                value: { min: 15, max: 30 }, // random sizes 
            },
            move: {
                enable: true,
                speed: { min: 1, max: 3 }, // speed
                direction: "bottom",
                straight: true,
                outModes: {
                    default: "out",
                },
            },
        },
        background: {
            color: "transparent",
        },
        fullScreen: {
            enable: true,
            zIndex: -1,
        },
        fpsLimit: 120,
        detectRetina: true,
    };

    return (
        init ? <Particles id="tsparticles" options={options} aria-hidden="true" /> : null
    )
};
