import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-brand-red text-white py-16 text-center mt-20">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Acesso Total à Biblioteca</h2>
                <p className="text-gray-200 mb-8 max-w-2xl mx-auto text-sm md:text-base">
                    Desbloqueie centenas de copys clássicas e modernas com análises detalhadas.
                </p>

                <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-gray-300 mb-10">
                    <span className="flex items-center">✓ Análises completas</span>
                    <span className="flex items-center">✓ Filtros avançados</span>
                    <span className="flex items-center">✓ Atualizações semanais</span>
                </div>

                <Link
                    href="/pricing"
                    className="inline-block bg-[#FDFBF7] text-brand-red font-bold px-10 py-3 rounded-md shadow-lg hover:bg-white transition-all transform hover:-translate-y-1"
                >
                    Ver Planos
                </Link>
            </div>
        </footer>
    );
}
