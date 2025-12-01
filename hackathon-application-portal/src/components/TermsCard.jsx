import "./TermsCard.css"

export function TermsCard({label, terms}) {
    return (

        <div className="terms-container">
            <h3>{label}</h3>
            <div className="terms">
                {terms}
            </div>
        </div>
    )
}