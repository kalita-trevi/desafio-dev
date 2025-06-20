import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useCart } from "../../contexts/CartContext";
import type { Product } from "../../services/api";

interface ProductCardProps {
  product: Product;
}

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const ImageWrapper = styled(Link)`
  display: block;
  text-align: center;
  overflow: hidden;
  aspect-ratio: 1 / 1;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const CardBody = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--dark-text);

  a {
    text-decoration: none;
    color: inherit;
  }

  a:hover {
    color: var(--purple);
  }
`;

const ProviderInfo = styled.p`
  margin: 0 0 1.5rem 0;
  color: #6c757d;
  font-size: 0.9rem;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1.5rem;
`;

const Price = styled.span`
  font-weight: bold;
  color: var(--dark-text);
  font-size: 1.3rem;
`;

const AddToCartButton = styled.button<{ added: boolean }>`
  background-color: ${(props) => (props.added ? "#28a745" : "var(--purple)")};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.added ? "#218838" : "var(--purple-hover)")};
  }
`;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      provider: product.provider,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Card>
      <ImageWrapper to={`/product/${product.provider}/${product.id}`}>
        <ProductImage src={product.image} alt={product.name} />
      </ImageWrapper>
      <CardBody>
        <ProductName>
          <Link to={`/product/${product.provider}/${product.id}`}>{product.name}</Link>
        </ProductName>
        <ProviderInfo>
          {product.provider === "brazilian" ? "Origem: Brasil" : "Origem: Europa"}
        </ProviderInfo>
        <CardFooter>
          <Price>R$ {product.price.toFixed(2)}</Price>
          <AddToCartButton onClick={handleAddToCart} added={added} aria-label="Adicionar ao carrinho">
            {added ? "Adicionado!" : "Adicionar"}
          </AddToCartButton>
        </CardFooter>
      </CardBody>
    </Card>
  );
};

export default ProductCard;
