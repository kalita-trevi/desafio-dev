import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { ordersAPI } from "../../services/api";
import type { Order } from "../../services/api";
import { FaCheckCircle } from "react-icons/fa";

const Container = styled.div`
  max-width: 650px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
`;

const SuccessBox = styled.div`
  background: var(--white);
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: var(--purple);
`;

const Title = styled.h1`
  color: var(--dark-text);
  margin-bottom: 1rem;
  font-size: 2.2rem;
  font-weight: 700;
`;

const Description = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  color: var(--dark-text);
  opacity: 0.8;
  line-height: 1.6;
`;

const OrderDetails = styled.div`
  text-align: left;
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e1e8ed;

  h3 {
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
    color: var(--dark-text);
  }
  
  p {
    margin-bottom: 0.75rem;
    color: var(--dark-text);
    opacity: 0.9;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  border: 1px solid transparent;
`;

const PrimaryLink = styled(StyledLink)`
  background-color: var(--purple);
  color: white;

  &:hover {
    background-color: var(--purple-hover);
  }
`;

const SecondaryLink = styled(StyledLink)`
  background-color: transparent;
  color: var(--dark-text);
  border-color: #e1e8ed;

  &:hover {
    background-color: #f8f9fa;
    border-color: #e1e8ed;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.5rem;
  color: #6c757d;
`;

const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const response = await ordersAPI.getById(parseInt(orderId));
        setOrder(response.data);
      } catch (error) {
        console.error("Erro ao carregar pedido:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <LoadingState>Carregando...</LoadingState>;
  }

  if (!order) {
    return <LoadingState>Pedido não encontrado</LoadingState>;
  }

  return (
    <Container>
      <SuccessBox>
        <SuccessIcon>
          <FaCheckCircle />
        </SuccessIcon>
        <Title>Pedido Realizado com Sucesso!</Title>
        <Description>
          Seu pedido #{order.id} foi processado e você receberá um e-mail de confirmação em breve.
        </Description>

        <OrderDetails>
          <h3>Detalhes do Pedido</h3>
          <p><strong>Cliente:</strong> {order.customerName}</p>
          <p><strong>E-mail:</strong> {order.customerEmail}</p>
          <p><strong>Total:</strong> R$ {order.total.toFixed(2)}</p>
          <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleString("pt-BR")}</p>
        </OrderDetails>

        <Actions>
          <PrimaryLink to="/">Continuar Comprando</PrimaryLink>
          <SecondaryLink to="/orders">Ver Meus Pedidos</SecondaryLink>
        </Actions>
      </SuccessBox>
    </Container>
  );
};

export default OrderSuccess;
