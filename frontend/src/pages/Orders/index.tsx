import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ordersAPI } from "../../services/api";
import type { Order } from "../../services/api";

const Container = styled.div`
  max-width: 960px;
  margin: 2rem auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--dark-text);
  margin-bottom: 3rem;
  text-align: center;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.5rem;
  color: #6c757d;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  background-color: var(--white);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  h2 {
    font-size: 1.8rem;
    color: var(--dark-text);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--dark-text);
    opacity: 0.8;
  }
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e1e8ed;
`;

const OrderId = styled.h3`
  margin: 0 0 0.5rem 0;
  color: var(--dark-text);
  font-size: 1.4rem;
`;

const OrderDate = styled.p`
  margin: 0;
  color: var(--dark-text);
  opacity: 0.8;
  font-size: 0.95rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  background-color: ${({ status }) =>
    status === "pending" ? "var(--status-pending)" : "var(--purple)"};
`;

const OrderCustomer = styled.div`
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  color: var(--dark-text);
`;

const OrderItems = styled.div`
  h4 {
    margin: 0 0 1rem 0;
    color: var(--dark-text);
    font-size: 1.1rem;
  }
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e1e8ed;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemDetails = styled.div``;

const ItemName = styled.span`
  font-weight: 600;
  color: var(--dark-text);
`;

const ItemProvider = styled.span`
  color: var(--dark-text);
  opacity: 0.8;
  margin-left: 0.5rem;
  font-size: 0.9rem;
`;

const ItemPriceInfo = styled.div`
  text-align: right;
  color: var(--dark-text);
`;

const ItemTotal = styled.span`
  font-weight: bold;
  color: var(--dark-text);
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  margin-top: 1rem;
  border-top: 2px solid #e1e8ed;
  font-size: 1.1rem;
`;

const TotalItems = styled.span`
  color: var(--dark-text);
  opacity: 0.8;
`;

const OrderTotal = styled.span`
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--purple);
`;

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getAll();
        setOrders(response.data);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <LoadingState>Carregando pedidos...</LoadingState>;
  }

  if (orders.length === 0) {
    return (
      <Container>
        <EmptyState>
          <h2>Nenhum pedido encontrado</h2>
          <p>Você ainda não fez nenhum pedido.</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Histórico de Pedidos</Title>

      <OrdersList>
        {orders.map((order) => (
          <OrderCard key={order.id}>
            <OrderHeader>
              <div>
                <OrderId>Pedido #{order.id}</OrderId>
                <OrderDate>{new Date(order.createdAt).toLocaleString("pt-BR")}</OrderDate>
              </div>
              <StatusBadge status={order.status}>
                {order.status === "pending" ? "Pendente" : "Concluído"}
              </StatusBadge>
            </OrderHeader>

            <OrderCustomer>
              <p><strong>Cliente:</strong> {order.customerName}</p>
              <p><strong>E-mail:</strong> {order.customerEmail}</p>
            </OrderCustomer>

            <OrderItems>
              <h4>Itens do Pedido:</h4>
              {order.items.map((item) => (
                <OrderItem key={item.id}>
                  <ItemDetails>
                    <ItemName>{item.productName}</ItemName>
                    <ItemProvider>({item.provider === "brazilian" ? "Brasil" : "Europa"})</ItemProvider>
                  </ItemDetails>
                  <ItemPriceInfo>
                    <span>{item.quantity} × R$ {item.price.toFixed(2)} = </span>
                    <ItemTotal>R$ {(item.price * item.quantity).toFixed(2)}</ItemTotal>
                  </ItemPriceInfo>
                </OrderItem>
              ))}
            </OrderItems>

            <OrderFooter>
              <TotalItems>
                Total de itens: {order.items.reduce((sum, item) => sum + item.quantity, 0)}
              </TotalItems>
              <OrderTotal>Total do Pedido: R$ {order.total.toFixed(2)}</OrderTotal>
            </OrderFooter>
          </OrderCard>
        ))}
      </OrdersList>
    </Container>
  );
};

export default Orders;
