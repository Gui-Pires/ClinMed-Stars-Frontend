import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import Logo from "../assets/Star-Logo.png";

function AppNavbar({ onLogout }) {
    const [myNav, setMyNav] = useState("")

    function handleToggleNav() {
        if (myNav === '') {
            setMyNav('nav-mobile')
        } else {
            setMyNav('')
        }
    }

    return (
        <>
            <Navbar variant="dark" expand="lg" fixed="top" className={`navbar ${myNav}`} onToggle={handleToggleNav}>
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fs-2">
                        ClinMed
                        <span className="text-warning ms-2">Stars</span>
                        <img src={Logo} className="img-logo ms-2" alt="ClinMed Stars" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto d-flex flex-column flex-lg-row align-items-lg-center justify-content-center gap-2">
                            <Nav.Link as={Link} to="/"><Button variant="outline-light w-100">Chat</Button></Nav.Link>
                            <Nav.Link as={Link} to="/consultas"><Button variant="outline-light w-100">Consultas</Button></Nav.Link>
                            <Button variant="outline-danger w-100" onClick={onLogout}>Sair <i className="bi bi-box-arrow-right"></i></Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default AppNavbar;