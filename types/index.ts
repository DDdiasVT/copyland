export interface Copy {
    id: string;
    title: string;
    author: string;
    category: string;
    rating: number;
    imageUrl?: string;
    pdfUrl?: string;
    videoUrl?: string;
    description?: string;
    notes?: string;
    lessons?: string;
    translation?: string;
    isPremium?: boolean;
    createdAt: string;
    comments?: Comment[];
}

export interface Comment {
    id: string;
    content: string;
    rating: number;
    authorName: string;
    avatarUrl?: string;
    createdAt: string;
    parentId?: string | null;
    replies?: Comment[];
}

export interface Author {
    id: string;
    name: string;
    bio?: string;
    imageUrl?: string;
}

export const CATEGORIES = [
    "Todas",
    "Páginas de Vendas",
    "VSL",
    "Carta de Vendas",
    "Redes Sociais",
    "Lendas da Copy",
    "Ads",
    "Email"
];


