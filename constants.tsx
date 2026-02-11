
import React from 'react';
import { Category, Business } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Restaurantes', icon: '🍽️' },
  { id: '2', name: 'Mercados', icon: '🛒' },
  { id: '3', name: 'Serviços', icon: '🛠️' },
  { id: '4', name: 'Lojas', icon: '🛍️' },
  { id: '5', name: 'Saúde', icon: '🏥' },
  { id: '6', name: 'Educação', icon: '🎓' },
  { id: '7', name: 'Turismo', icon: '✈️' },
  { id: '8', name: 'Beleza', icon: '💇' },
];

export const MOCK_BUSINESSES: Business[] = [
  {
    id: 'b1',
    name: 'Pizzaria Bella Itupeva',
    ownerName: 'José Silva',
    cnpj: '12.345.678/0001-90',
    phone: '(11) 4591-1234',
    whatsapp: '5511999999999',
    email: 'bella@pizzaria.com',
    address: 'Av. Brasil, 100 - Centro, Itupeva - SP',
    category: 'Restaurantes',
    description: 'A melhor pizza no forno a lenha da cidade. Ingredientes frescos e massa artesanal.',
    imageUrl: 'https://picsum.photos/seed/pizza/800/600',
    instagram: 'pizzariabella_itupeva',
    rating: 4.8,
    status: 'APPROVED',
    createdAt: '2023-10-01',
    promotions: 'Combo Família: 2 Pizzas Grandes + Refri por R$ 89,90'
  },
  {
    id: 'b2',
    name: 'Mercado do Bairro',
    ownerName: 'Maria Oliveira',
    phone: '(11) 4591-5678',
    whatsapp: '5511988888888',
    email: 'contato@mercadobairro.com',
    address: 'Rua São Paulo, 50 - Jd. Alegria, Itupeva - SP',
    category: 'Mercados',
    description: 'Tudo o que sua família precisa com os melhores preços de Itupeva.',
    imageUrl: 'https://picsum.photos/seed/market/800/600',
    rating: 4.2,
    status: 'APPROVED',
    createdAt: '2023-11-15'
  }
];
