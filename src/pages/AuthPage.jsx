import React, { useState } from 'react';

function AuthPage({ onLoginSuccess }) {
    const [modo, setModo] = useState('login');
    const [form, setForm] = useState({
        cpf: '',
        senha: '',
        nome: '',
        idade: ''
    });
    const [mensagem, setMensagem] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const API_BASE = 'http://localhost:3000';
        const url = modo === 'login' ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;

        try {
            const resposta = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.erro || 'Erro ao processar requisição.');
            }

            if (modo === 'login') {
                setMensagem(`✅ Bem-vindo(a), ${dados.usuario.nome}!`);
                onLoginSuccess(dados.usuario); // dispara evento pro App.jsx
            } else {
                setMensagem('✅ Cadastro realizado com sucesso!');
                setModo('login');
            }

        } catch (err) {
            setMensagem(err.message || 'Erro inesperado.');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: 400 }}>
            <h2 className="text-center mb-4">{modo === 'login' ? 'Login' : 'Cadastro'}</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">CPF</label>
                    <input type="text" name="cpf" className="form-control" value={form.cpf} onChange={handleChange} required />
                </div>

                {modo === 'register' && (
                    <>
                        <div className="mb-3">
                            <label className="form-label">Nome completo</label>
                            <input type="text" name="nome" className="form-control" value={form.nome} onChange={handleChange} required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Idade</label>
                            <input type="number" name="idade" className="form-control" value={form.idade} onChange={handleChange} required />
                        </div>
                    </>
                )}

                <div className="mb-3">
                    <label className="form-label">Senha</label>
                    <input type="password" name="senha" className="form-control" value={form.senha} onChange={handleChange} required />
                </div>

                {mensagem && <div className="alert alert-info">{mensagem}</div>}

                <button className="btn btn-primary w-100" type="submit">
                    {modo === 'login' ? 'Entrar' : 'Cadastrar'}
                </button>

                <div className="mt-3 text-center">
                    {modo === 'login' ? (
                        <p className='align-middle'>Não tem conta? <button type="button" className="btn btn-link ms-3" onClick={() => setModo('register')}>Cadastre-se</button></p>
                    ) : (
                        <p className='align-middle'>Já tem conta? <button type="button" className="btn btn-link ms-3" onClick={() => setModo('login')}>Entrar</button></p>
                    )}
                </div>
            </form>
        </div>
    );
}

export default AuthPage;