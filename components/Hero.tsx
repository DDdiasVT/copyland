import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
    return (
        <div className="bg-brand-red text-white pt-16 -mb-1 px-4 md:px-8 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-end justify-between">

                {/* Left Content */}
                <div className="md:w-1/2 mb-8 md:mb-20 z-10 md:self-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-tight tracking-tight mb-4">
                        Nunca mais <br />
                        comece uma <br />
                        copy do zero
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-md">
                        Biblioteca de clássicos e copys modernas para destravar sua escrita.
                    </p>
                    <Link
                        href="/library"
                        className="inline-block bg-[#FDFBF7] text-brand-red font-bold px-8 py-3 rounded-md shadow-md hover:bg-white transition-colors uppercase text-sm tracking-wide"
                    >
                        Ver Biblioteca →
                    </Link>
                </div>

                {/* Right Content - Fox Illustration */}
                <div className="md:w-1/2 flex justify-center md:justify-end relative -mb-4 md:-mb-8">
                    <div className="relative w-80 h-80 md:w-[34rem] md:h-[34rem]">
                        <Image
                            src="/hero.png"
                            alt="Raposa escritora mascote do Copyland"
                            fill
                            className="object-contain drop-shadow-2xl hover:scale-105 transition-transform origin-bottom"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
