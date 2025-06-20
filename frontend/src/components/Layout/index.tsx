import React from "react";
import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";
import { useCart } from "../../contexts/CartContext";
import { FaShoppingCart, FaBoxOpen, FaStore } from "react-icons/fa";

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.nav`
  background: var(--light-gray);
  padding: 1rem 2.5rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Logo = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.8rem;
  font-weight: bold;
  transition: color 0.2s;

  &:hover {
    color: var(--purple);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: var(--purple);
  }
`;

const CartLink = styled(Link)`
  color: white;
  text-decoration: none;
  position: relative;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &:hover {
    color: var(--purple);
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -12px;
  background-color: var(--purple);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
`;

const Main = styled.main`
  flex-grow: 1;
  background-color: var(--content-bg);
  color: var(--dark-text);
  padding: 2rem;
`;

const Layout: React.FC = () => {
  const { getTotalItems } = useCart();

  return (
    <LayoutContainer>
      <Header>
        <Logo to="/">
          <FaStore /> DevShop
        </Logo>
        <NavLinks>
          <NavLink to="/">
            <FaStore /> Produtos
          </NavLink>
          <NavLink to="/orders">
            <FaBoxOpen /> Pedidos
          </NavLink>
          <CartLink to="/cart">
            <FaShoppingCart />
            {getTotalItems() > 0 && <CartBadge>{getTotalItems()}</CartBadge>}
          </CartLink>
        </NavLinks>
      </Header>
      <Main>
        <Outlet />
      </Main>
    </LayoutContainer>
  );
};

export default Layout;
