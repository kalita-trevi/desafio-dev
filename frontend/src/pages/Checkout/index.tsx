import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCart } from "../../contexts/CartContext";
import { ordersAPI } from "../../services/api";

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 3rem;
  text-align: center;
`;

const CheckoutLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const FormContainer = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SummaryContainer = styled.div`
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 2.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #495057;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #ced4da;
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2.5rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  border: 2px solid #6c757d;
  color: #6c757d;

  &:hover {
    background-color: #6c757d;
    color: white;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: #28a745;
  color: white;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const Checkout: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerEmail) {
      alert("Preencha todos os campos!");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        total: getTotalPrice(),
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          provider: item.provider,
        })),
      };

      const response = await ordersAPI.create(orderData);

      clearCart();
      navigate(`/order-success/${response.data.id}`);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      alert("Erro ao finalizar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <Container>
      <Title>Finalizar Compra</Title>
      <CheckoutLayout>
        <FormContainer>
          <SectionTitle>Dados do Cliente</SectionTitle>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Nome Completo:</Label>
              <Input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>E-mail:</Label>
              <Input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                required
              />
            </FormGroup>
            <ButtonContainer>
              <CancelButton type="button" onClick={() => navigate("/cart")}>
                Voltar ao Carrinho
              </CancelButton>
              <ConfirmButton type="submit" disabled={loading}>
                {loading ? "Processando..." : "Confirmar Pedido"}
              </ConfirmButton>
            </ButtonContainer>
          </form>
        </FormContainer>
        <SummaryContainer>
          <SectionTitle>Resumo do Pedido</SectionTitle>
          {items.map((item) => (
            <SummaryItem key={`${item.provider}-${item.productId}`}>
              <span>{item.productName} (x{item.quantity})</span>
              <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
            </SummaryItem>
          ))}
          <SummaryTotal>
            <span>Total:</span>
            <span>R$ {getTotalPrice().toFixed(2)}</span>
          </SummaryTotal>
        </SummaryContainer>
      </CheckoutLayout>
    </Container>
  );
};

export default Checkout;
