import MatrixRain from "./MatrixRain.jsx"

export default function LandingPage({ enterKitchen }) {
    return (
        <>  
            <MatrixRain />
            <button type="button" className="btn" onClick={enterKitchen}>ENTER_THE_KITCHEN</button>
        </>
    )
}