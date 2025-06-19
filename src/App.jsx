import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Chat from './pages/Chat';
import Consultas from './pages/Consultas';
import AuthPage from './pages/AuthPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    const [usuario, setUsuario] = useState(null);

    // Recupera usuário salvo no localStorage ao carregar o app
    useEffect(() => {
        const salvo = localStorage.getItem('usuario');
        if (salvo) {
            setUsuario(JSON.parse(salvo));
        }
    }, []);

    // Quando o usuário fizer login, salva no localStorage
    const handleLoginSuccess = (usuarioLogado) => {
        setUsuario(usuarioLogado);
        localStorage.setItem('usuario', JSON.stringify(usuarioLogado));
    };

    return (
        <Router basename="/ClinMed-Stars-Frontend">
            {usuario && <AppNavbar onLogout={() => {
                setUsuario(null);
                localStorage.removeItem('usuario'); // caso esteja salvando no localStorage
                localStorage.removeItem('historico');
            }} />}
            <Routes>
                {/* Página inicial (login ou redirecionamento para chat) */}
                <Route
                    path="/"
                    element={
                        usuario ? <Navigate to="/chat" /> : <AuthPage onLoginSuccess={handleLoginSuccess} />
                    }
                />

                {/* Chat com saudação personalizada */}
                <Route
                    path="/chat"
                    element={
                        usuario ? <Chat usuario={usuario} /> : <Navigate to="/" />
                    }
                />

                {/* Página de consultas */}
                <Route
                    path="/consultas"
                    element={
                        usuario ? <Consultas usuario={usuario} /> : <Navigate to="/" />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;