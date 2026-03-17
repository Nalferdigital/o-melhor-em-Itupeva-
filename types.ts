
export type UserRole = 'CONSUMER' | 'BUSINESS' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  favorites: string[]; // Business IDs
}

export type BusinessPlan = 'BRONZE' | 'PRATA' | 'OURO';

export interface Business {
  id: string;
  name: string;
  ownerName: string;
  cnpj?: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  category: string;
  description: string;
  imageUrl: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  promotions?: string;
  rating: number;
  status: 'PENDING' | 'APPROVED';
  isFeatured?: boolean;
  plan: BusinessPlan;
  gallery?: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
