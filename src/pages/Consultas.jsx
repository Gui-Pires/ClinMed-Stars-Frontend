// src/Consultas.js
import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Table } from 'react-bootstrap';

function Consultas({ usuario }) {
    const [consultas, setConsultas] = useState([]);
    
    useEffect(() => {
        // Fazendo uma requisição para o backend para pegar as consultas
        const fetchConsultas = async () => {
            try {
                // const resposta = await fetch('http://localhost:3000/chat/consultas');
                console.log(usuario)
                const resposta = await fetch('https://clinmed-stars-backend-production.up.railway.app/chat/consultas', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ cpf: usuario.cpf, tipo: usuario.tipo }),
                    });
                const dados = await resposta.json();
                setConsultas(dados);
            } catch (error) {
                setConsultas(['Erro: ' + error]);
            }
        };
        
        fetchConsultas()
        setInterval(fetchConsultas, 2000)
    }, [usuario]);

    return (
        <Container className='nav-space'>
            <Row>
                <Col className='mt-2'>
                    <h2>Consultas Marcadas</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Id</th>
                                {usuario.tipo === 'admin' ? <th>Cliente</th> : ''}
                                <th>Especialidade</th>
                                <th>Doutor</th>
                                <th>Data</th>
                                <th>Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consultas.map((consulta, i) => (
                                <tr key={i} className='align-middle'>
                                    <td>{consulta.id}</td>
                                    {usuario.tipo === 'admin' ? <td>{consulta.nome_cliente}</td> : ''}
                                    <td>{consulta.especialidade}</td>
                                    <td>{usuario.tipo === 'admin' ? consulta.nome_doutor : consulta.nome}</td>
                                    <td>{consulta.data}</td>
                                    <td>{consulta.hora}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default Consultas;