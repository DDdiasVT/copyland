
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Home, Book, User, Settings, Star, LogOut, Tag } from 'lucide-react';
import { CATEGORIES } from '@/types';

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const menuItems = [
        { icon: Home, label: 'Início', href: '/' },
        { icon: Book, label: 'Biblioteca', href: '/library' },
        { icon: Star, label: 'Lendas da Copy', href: '/library?category=Lendas%20da%20Copy' },
        { icon: User, label: 'Autores', href: '/admin/authors' },
    ];

    const isLinkActive = (href: string) => {
        if (href === '/' && pathname === '/') return true;
        if (href !== '/' && pathname.startsWith(href)) return true;
        return false;
    };

    return (
        <aside className="sticky top-0 h-screen w-80 bg-white border-r border-gray-100 flex flex-col hidden lg:flex shrink-0 overflow-hidden">
            {/* Logo Area */}
            <div className="p-8 border-b border-gray-50 bg-white z-10">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Copy<span className="text-brand-red">land</span>
                    <span className="text-brand-red text-4xl">.</span>
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = isLinkActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-brand-red/5 text-brand-red font-semibold shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon
                                className={`w-5 h-5 transition-colors ${isActive ? 'text-brand-red' : 'text-gray-400 group-hover:text-gray-900'
                                    }`}
                            />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}

                {/* Categories Section */}
                <div className="pt-6 pb-2">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                        <Tag className="w-3 h-3 mr-1" /> Categorias
                    </p>
                </div>
                <div className="space-y-1">
                    {CATEGORIES.filter(c => c !== 'Todas').map((cat) => (
                        <Link
                            key={cat}
                            href={`/library?category=${encodeURIComponent(cat)}`}
                            className="block px-4 py-2 text-sm text-gray-500 hover:text-brand-red hover:bg-gray-50 rounded-lg transition-colors ml-2"
                        >
                            {cat}
                        </Link>
                    ))}
                </div>

                {/* Admin Section */}
                <div className="pt-6 pb-2">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Admin</p>
                </div>

                <Link
                    href="/admin"
                    className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${pathname.startsWith('/admin') && !pathname.startsWith('/admin/authors')
                        ? 'bg-brand-red/5 text-brand-red font-semibold shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    <Settings
                        className={`w-5 h-5 transition-colors ${pathname.startsWith('/admin') && !pathname.startsWith('/admin/authors')
                            ? 'text-brand-red'
                            : 'text-gray-400 group-hover:text-gray-900'
                            }`}
                    />
                    <span>Painel Admin</span>
                </Link>
            </nav>

            {/* User Profile / Footer */}
            <div className="p-6 border-t border-gray-50">
                {status === 'loading' ? (
                    <div className="animate-pulse flex items-center space-x-3 p-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                            <div className="h-2 bg-gray-200 rounded w-16"></div>
                        </div>
                    </div>
                ) : session?.user ? (
                    <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition group">
                        <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-lg">
                            {session.user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {session.user.name || 'Usuário'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {session.user.email}
                            </p>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            title="Sair"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition w-full"
                    >
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">Entrar</p>
                            <p className="text-xs text-gray-500">Acesse sua conta</p>
                        </div>
                    </Link>
                )}
            </div>
        </aside>
    );
}
