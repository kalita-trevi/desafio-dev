import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { productsAPI } from "../../services/api";
import type { Product } from "../../services/api";
// Make sure the path is correct and the file exists
import ProductCard from "../../components/ProductCard";

const Container = styled.div`
  padding: 2rem 4rem;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  background-color: var(--purple);
  border-radius: 16px;
  margin-bottom: 4rem;
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  position: relative;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 300px;
`;

const SearchInput = styled.input`
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 2px solid #e1e8ed;
  background-color: var(--white);
  color: var(--dark-text);
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  max-width: 300px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: var(--purple);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 1rem;
  color: #9e9e9e;
`;

const SelectContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Select = styled.select`
  padding: 0.8rem 2.5rem 0.8rem 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--white);
  color: var(--dark-text);
  cursor: pointer;
  transition: border-color 0.2s;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &:focus {
    outline: none;
    border-color: var(--purple);
  }
`;

const SelectIcon = styled(FaChevronDown)`
  position: absolute;
  right: 1rem;
  color: #9e9e9e;
  pointer-events: none;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.5rem;
  color: #6c757d;
`;

const NoResultsContainer = styled.div`
  text-align: center;
  padding: 4rem;
  color: #6c757d;
`;

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProvider, setFilterProvider] = useState<
    "all" | "brazilian" | "european"
  >("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getAll();
        setProducts(response.data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesProvider =
      filterProvider === "all" || product.provider === filterProvider;
    return matchesSearch && matchesProvider;
  });

  if (loading) {
    return (
      <LoadingContainer>
        <h2>Carregando produtos...</h2>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <HeroSection>
        <HeroTitle>Descubra Nossos Produtos</HeroTitle>
        <HeroSubtitle>Qualidade e variedade que você encontra aqui.</HeroSubtitle>
      </HeroSection>

      <FiltersContainer>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        <SelectContainer>
          <Select
            value={filterProvider}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFilterProvider(
                e.target.value as "all" | "brazilian" | "european"
              )
            }
          >
            <option value="all">Todos os fornecedores</option>
            <option value="brazilian">Brasil</option>
            <option value="european">Europa</option>
          </Select>
          <SelectIcon />
        </SelectContainer>
      </FiltersContainer>

      <ProductGrid>
        {filteredProducts.map((product) => (
          <ProductCard
            key={`${product.provider}-${product.id}`}
            product={product}
          />
        ))}
      </ProductGrid>

      {filteredProducts.length === 0 && (
        <NoResultsContainer>
          <h3>Nenhum produto encontrado</h3>
        </NoResultsContainer>
      )}
    </Container>
  );
};

export default Home;
