import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { productsAPI } from "../../services/api";
import type { Product } from "../../services/api";
import { useCart } from "../../contexts/CartContext";
import { FaArrowLeft } from "react-icons/fa";

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const BackButton = styled.button`
  background: transparent;
  border: 2px solid var(--purple);
  color: var(--purple);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 2rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--purple);
    color: white;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 4rem;
  align-items: flex-start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageContainer = styled.div`
  background-color: transparent;
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--dark-text);
  margin: 0 0 0.5rem 0;
`;

const Provider = styled.p`
  font-size: 1.1rem;
  color: var(--dark-text);
  margin: 0 0 1.5rem 0;
  opacity: 0.8;
`;

const Price = styled.p`
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--purple);
  margin: 0 0 1.5rem 0;
`;

const Description = styled.div`
  margin: 2rem 0;
  color: var(--dark-text);
  line-height: 1.6;

  h3 {
    margin-bottom: 0.75rem;
    font-size: 1.2rem;
    color: var(--dark-text);
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  background: transparent;
  border: none;
  color: var(--dark-text);
  padding: 0.75rem;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f3f5;
  }
`;

const QuantityDisplay = styled.span`
  padding: 0 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
  border-left: 1px solid #e1e8ed;
  border-right: 1px solid #e1e8ed;
`;

const AddToCartButton = styled.button`
  background-color: var(--purple);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--purple-hover);
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.5rem;
  color: #6c757d;
`;

const ProductDetail: React.FC = () => {
  const { provider, id } = useParams<{ provider: string; id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!provider || !id) return;

      try {
        const response = await productsAPI.getById(id, provider);
        setProduct(response.data);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [provider, id]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      provider: product.provider,
      image: product.image,
    });

  };

  if (loading) return <LoadingState>Carregando produto...</LoadingState>;
  if (!product) return <LoadingState>Produto não encontrado</LoadingState>;

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <FaArrowLeft />
        Voltar
      </BackButton>

      <ProductGrid>
        <ImageContainer>
          <ProductImage src={product.image} alt={product.name} />
        </ImageContainer>

        <ProductInfo>
          <ProductName>{product.name}</ProductName>
          <Provider>
            Fornecedor: {product.provider === "brazilian" ? "Brasil" : "Europa"}
          </Provider>
          <Price>R$ {product.price.toFixed(2)}</Price>

          {product.description && (
            <Description>
              <h3>Descrição</h3>
              <p>{product.description}</p>
            </Description>
          )}

          <Actions>
            <QuantitySelector>
              <QuantityButton onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                -
              </QuantityButton>
              <QuantityDisplay>{quantity}</QuantityDisplay>
              <QuantityButton onClick={() => setQuantity(quantity + 1)}>+</QuantityButton>
            </QuantitySelector>
            <AddToCartButton onClick={handleAddToCart}>
              Adicionar ao Carrinho
            </AddToCartButton>
          </Actions>
        </ProductInfo>
      </ProductGrid>
    </Container>
  );
};

export default ProductDetail; 