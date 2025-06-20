import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCart } from "../../contexts/CartContext";
import { FaTrashAlt } from "react-icons/fa";

const Container = styled.div`
  max-width: 960px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--white);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const EmptyCartContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyCartTitle = styled.h2`
  font-size: 2rem;
  color: var(--dark-text);
  margin-bottom: 1rem;
`;

const EmptyCartMessage = styled.p`
  color: var(--dark-text);
  opacity: 0.8;
  margin-bottom: 2rem;
`;

const BackToShopButton = styled(Link)`
  background-color: var(--purple);
  color: white;
  text-decoration: none;
  padding: 1rem 2.5rem;
  border-radius: 8px;
  display: inline-block;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--purple-hover);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e1e8ed;
`;

const Title = styled.h1`
  color: var(--dark-text);
  font-size: 2.5rem;
  font-weight: 700;
`;

const ClearCartButton = styled.button`
  background-color: transparent;
  color: #e74c3c;
  border: 2px solid #e74c3c;
  padding: 0.6rem 1.3rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #e74c3c;
    color: white;
  }
`;

const CartItemsList = styled.div`
  margin-bottom: 2rem;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e1e8ed;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: var(--dark-text);
  font-weight: 600;
`;

const ItemProvider = styled.p`
  margin: 0;
  color: var(--dark-text);
  opacity: 0.8;
  font-size: 0.95rem;
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const ItemQuantity = styled.span`
  font-size: 1.1rem;
  color: var(--dark-text);
`;

const ItemPrice = styled.span`
  font-weight: bold;
  color: var(--dark-text);
  font-size: 1.2rem;
  min-width: 100px;
  text-align: right;
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    color: #c0392b;
  }
`;

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 2rem;
  border-top: 2px solid var(--dark-text);
`;

const TotalItems = styled.p`
  font-size: 1.1rem;
  color: var(--dark-text);
  opacity: 0.8;
  margin-bottom: 1rem;
`;

const CheckoutSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const TotalPrice = styled.p`
  margin: 0;
  font-size: 1.8rem;
  color: var(--dark-text);
  font-weight: bold;
`;

const CheckoutButton = styled.button`
  background-color: var(--purple);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--purple-hover);
  }
`;

const Cart: React.FC = () => {
  const { items, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <Container>
        <EmptyCartContainer>
          <EmptyCartTitle>Seu carrinho está vazio</EmptyCartTitle>
          <EmptyCartMessage>Adicione alguns produtos para continuar</EmptyCartMessage>
          <BackToShopButton to="/">Ver Produtos</BackToShopButton>
        </EmptyCartContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Carrinho de Compras</Title>
        <ClearCartButton onClick={clearCart}><FaTrashAlt /> Limpar Carrinho</ClearCartButton>
      </Header>

      <CartItemsList>
        {items.map((item) => (
          <CartItem key={`${item.provider}-${item.productId}`}>
            <ItemInfo>
              <ItemName>{item.productName}</ItemName>
              <ItemProvider>Fornecedor: {item.provider === "brazilian" ? "Brasil" : "Europa"}</ItemProvider>
            </ItemInfo>
            <ItemActions>
              <ItemQuantity>Qtd: {item.quantity}</ItemQuantity>
              <ItemPrice>R$ {(item.price * item.quantity).toFixed(2)}</ItemPrice>
              <RemoveButton onClick={() => removeFromCart(item.productId, item.provider)}>
                <FaTrashAlt />
              </RemoveButton>
            </ItemActions>
          </CartItem>
        ))}
      </CartItemsList>

      <Summary>
        <TotalItems>Total de itens: {getTotalItems()}</TotalItems>
        <CheckoutSection>
          <TotalPrice>Total: R$ {getTotalPrice().toFixed(2)}</TotalPrice>
          <CheckoutButton onClick={handleCheckout}>Finalizar Compra</CheckoutButton>
        </CheckoutSection>
      </Summary>
    </Container>
  );
};

export default Cart;
