import { useState } from "react"
import LandingPage from "./components/LandingPage.jsx"
import MainPage from "./components/MainPage.jsx"

export default function Main() {
    const [hasEnteredKitchen, setHasEnteredKitchen] = useState(false)

    function enterKitchen() {
        setHasEnteredKitchen(!hasEnteredKitchen)
    }

    return (
        <>
            { !hasEnteredKitchen && <LandingPage enterKitchen={enterKitchen} /> }
            { hasEnteredKitchen && <MainPage leaveKitchen={enterKitchen} /> }
        </>
    )
}