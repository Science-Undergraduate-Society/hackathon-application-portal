"use client";

import './Navbar.css';

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <a href="/" className="navbar-logo">
                    <img src="/logo.png" alt="Hack the Coast Logo" />
                </a>
                
                <div className="navbar-links">
                    <a 
                        href="https://hackathon.susubc.ca" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="navbar-link"
                    >
                        Hackathon Info
                    </a>
                    <a 
                        href="https://susubc.ca" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="navbar-link"
                    >
                        susubc.ca
                    </a>
                </div>
            </div>
        </nav>
    );
}
