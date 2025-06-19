import React, { useState, useEffect, useRef } from 'react';
import { Card, Col, Container, Row, InputGroup, Form, Button } from 'react-bootstrap';

function Chat({ usuario }) {
    const [mensagem, setMensagem] = useState('');
    const menuPrincipal = {
        autor: 'Assistente',
        texto: `1. Ver consultas agendadas
        2. Agendar nova consulta
        3. Editar uma consulta
        4. Cancelar uma consulta`
    }
    const [historico, setHistorico] = useState([
        {
            autor: 'Assistente',
            texto: `Olá, ${usuario.nome.split(' ')[0]}! 👋
            Em que posso te ajudar hoje?\n
            1. Ver consultas agendadas
            2. Agendar nova consulta
            3. Editar uma consulta
            4. Cancelar uma consulta`
        },
    ]);
    const historicoRef = useRef(null);
    const getRegister = useRef(true)

    useEffect(() => {
        const salvo = localStorage.getItem('historico');
        if (salvo) {
            setHistorico(JSON.parse(salvo));
        }
    }, []);

    useEffect(() => {
        if (historicoRef.current) {
            historicoRef.current.scrollTop = historicoRef.current.scrollHeight;
        }
        if (getRegister.current){
            getRegister.current = false
            return
        }
        localStorage.setItem('historico', JSON.stringify(historico));
    }, [historico]);

    const enviarMensagem = async () => {
        if (!mensagem.trim()) return;

        const novaEntrada = { autor: 'Você', texto: mensagem };
        setHistorico((prev) => [...prev, novaEntrada]);

        try {
            console.log('Iniciando requisição ao back')
            const resposta = await fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: mensagem, cpf: usuario.cpf }),
            });

            console.log('Dados do back recebidos')
            const dados = await resposta.json();
            let respostaTexto = dados.reply || 'Sem resposta do assistente.';

            console.log('Fazendo análise do texto retornado')
            const isMenu = respostaTexto.endsWith('$MENU$')
            console.log(isMenu)

            console.log('Removendo $MENU$')
            respostaTexto = respostaTexto.replace('$MENU$', '')

            console.log('Armazenando resultado do histórico')
            setHistorico((prev) => [...prev, { autor: 'Assistente', texto: respostaTexto }]);
            if (isMenu) {
                console.log('Enviando menu principal')
                setHistorico((prev) => [...prev, menuPrincipal]);
            }
        } catch (err) {
            setHistorico((prev) => [...prev, { autor: 'Assistente', texto: 'Erro: Não foi possível conectar ao backend.' }]);
        }
        
        setMensagem('');
    };

    return (
        <div id='chat-container' className='overflow-y-auto nav-space' ref={historicoRef}>
            <Container>
                <Row className='justify-content-center'>
                    <Col sm='12' md='10' lg='8'>
                        <Card className='chat-style mb-3'>
                            <Card.Body>
                                {historico.map((msg, i) => (
                                    <Row key={i}
                                        className={`px-3 mb-2 position-relative ${msg.autor === 'Você' ? 'justify-content-end' : 'justify-content-start'}`}>
                                        <div className="p-3 rounded shadow-sm msg-style">
                                            <div className="small mb-1 fw-bold">{msg.autor}</div>
                                            <div>
                                                {msg.texto.split('\n').map((linha, i) => (
                                                    <div key={i}>{linha === '' ? <br /> : linha}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </Row>
                                ))}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className='fixed-bottom justify-content-center input-chat-style px-3'>
                    <Col sm='12' md='10' lg='8'>
                        <InputGroup className='border rounded-5'>
                            <Form.Control
                                id='input-msg-chat'
                                placeholder="Digite sua mensagem..."
                                value={mensagem}
                                aria-describedby="inputMsg"
                                onChange={(e) => setMensagem(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
                                className=''
                                autoFocus
                            />
                            <Button variant="primary" id="inputMsg" onClick={enviarMensagem}
                                className='rounded-circle d-block d-md-none ms-1'>
                                <i className="bi bi-send-fill"></i>
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Chat;