import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  provider: "brazilian" | "european";
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  provider: string;
}

export const productsAPI = {
  getAll: () => api.get<Product[]>("/products"),
  getById: (id: string, provider: string) =>
    api.get<Product>(`/products/${provider}/${id}`),
};

export interface CreateOrderData {
  customerName: string;
  customerEmail: string;
  items: {
    productId: string;
    quantity: number;
    provider: string;
  }[];
}

export const ordersAPI = {
  create: (orderData: CreateOrderData) => api.post<Order>("/orders", orderData),
  getAll: () => api.get<Order[]>("/orders"),
  getById: (id: number) => api.get<Order>(`/orders/${id}`),
};

export default api;
