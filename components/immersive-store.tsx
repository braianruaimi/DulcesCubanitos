'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

type Product = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  price: string;
  images: string[];
  accent: 'pink' | 'cyan';
};

type Faq = {
  question: string;
  answer: string;
};

const basePath = '/CubanitosDulces';

const withBasePath = (path: string) => `${basePath}${path}`;

const products: Product[] = [
  {
    id: 'clasicos',
    category: 'Los Clasicos',
    title: 'Dulce de Leche Rush',
    subtitle: 'Crujiente fino, relleno al instante y golpe final de azucar glass.',
    price: '$3.200',
    images: [withBasePath('/images/cubanito-neon-1.svg'), withBasePath('/images/cubanito-neon-2.svg'), withBasePath('/images/cubanito-neon-3.svg')],
    accent: 'pink',
  },
  {
    id: 'nocciola',
    category: 'Premium Nocciola',
    title: 'Hazelnut Pulse',
    subtitle: 'Nocciola intensa con textura cremosa y remate de cacao oscuro.',
    price: '$4.100',
    images: [withBasePath('/images/cubanito-neon-2.svg'), withBasePath('/images/cubanito-neon-3.svg'), withBasePath('/images/cubanito-neon-1.svg')],
    accent: 'cyan',
  },
  {
    id: 'edicion-limitada',
    category: 'Edicion Limitada',
    title: 'Pink Citrus Voltage',
    subtitle: 'Crema citrica brillante con un acabado fresco y electrico.',
    price: '$4.600',
    images: [withBasePath('/images/cubanito-neon-3.svg'), withBasePath('/images/cubanito-neon-1.svg'), withBasePath('/images/cubanito-neon-2.svg')],
    accent: 'pink',
  },
  {
    id: 'black-label',
    category: 'Black Label',
    title: 'Cacao Obsidiana',
    subtitle: 'Chocolate amargo sedoso, capas finas y un contraste profundo.',
    price: '$4.500',
    images: [withBasePath('/images/cubanito-neon-1.svg'), withBasePath('/images/cubanito-neon-3.svg'), withBasePath('/images/cubanito-neon-2.svg')],
    accent: 'cyan',
  },
  {
    id: 'eco-sweet',
    category: 'Eco-Sweet',
    title: 'Plant Based Glow',
    subtitle: 'Version vegana con crema de coco tostado y vainilla limpia.',
    price: '$4.000',
    images: [withBasePath('/images/cubanito-neon-2.svg'), withBasePath('/images/cubanito-neon-1.svg'), withBasePath('/images/cubanito-neon-3.svg')],
    accent: 'pink',
  },
  {
    id: 'mini-bites',
    category: 'Mini Bites',
    title: 'Pocket Crunch',
    subtitle: 'Pack de mini cubanitos para mesa dulce, eventos y antojos serios.',
    price: '$2.700',
    images: [withBasePath('/images/cubanito-neon-3.svg'), withBasePath('/images/cubanito-neon-2.svg'), withBasePath('/images/cubanito-neon-1.svg')],
    accent: 'cyan',
  },
  {
    id: 'signature',
    category: 'Signature Drops',
    title: 'Neon Signature Box',
    subtitle: 'Seleccion del taller con rellenos premium y acabado de temporada.',
    price: '$5.200',
    images: [withBasePath('/images/cubanito-neon-1.svg'), withBasePath('/images/cubanito-neon-2.svg'), withBasePath('/images/cubanito-neon-3.svg')],
    accent: 'pink',
  },
];

const faqs: Faq[] = [
  {
    question: '¿Hacen envios?',
    answer: '¡Si! Llegamos a [Tu Zona] los martes y jueves. Consulta costo segun tu direccion.',
  },
  {
    question: '¿Son frescos?',
    answer: '¡Totalmente! Los rellenamos en el momento de armar tu pedido para que mantengan el crocante perfecto.',
  },
  {
    question: '¿Tienen opciones Veganas?',
    answer: '¡Claro! Nuestra linea Eco-Sweet es 100% plant-based y deliciosa.',
  },
  {
    question: '¿Como reservo para un evento?',
    answer: '¡Genial! Toca el boton de WhatsApp y coordinamos cantidad, sabores y fecha.',
  },
  {
    question: '¿Tienen local fisico?',
    answer: 'Somos un taller artesanal. Trabajamos solo con envios y puntos de retiro programados.',
  },
];

const whatsappMessage =
  '¡Hola Cubanitos Dulces! Quiero reservar un pack personalizado. ¿Me ayudan?';

const whatsappNumber = '2215047962';

const cartIndicatorBase =
  'inline-flex min-w-10 items-center justify-center rounded-full border px-3 py-1 text-sm font-semibold';

export function ImmersiveStore() {
  const [activeIndexes, setActiveIndexes] = useState<number[]>(() => products.map(() => 0));
  const [parallaxOffsets, setParallaxOffsets] = useState<number[]>(() => products.map(() => 0));
  const [cartCount, setCartCount] = useState(0);
  const [cartPulse, setCartPulse] = useState(false);
  const [activePulseId, setActivePulseId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<Faq>(faqs[0]);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndexes((current) => current.map((value) => (value + 1) % 3));
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let animationFrame = 0;

    const updateParallax = () => {
      setParallaxOffsets(
        products.map((_, index) => {
          const element = cardRefs.current[index];

          if (!element) {
            return 0;
          }

          const rect = element.getBoundingClientRect();
          const viewportCenter = window.innerHeight / 2;
          const cardCenter = rect.top + rect.height / 2;
          const distance = (cardCenter - viewportCenter) / window.innerHeight;

          return distance * -26;
        }),
      );
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!chatOpen) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setChatOpen(false);
      }
    };

    window.addEventListener('keydown', onEscape);

    return () => window.removeEventListener('keydown', onEscape);
  }, [chatOpen]);

  const cartClassName = useMemo(() => {
    const pulseClass = cartPulse ? 'animate-pulseGlow' : '';
    return `${cartIndicatorBase} border-neonCyan/50 bg-black/80 text-white shadow-neon ${pulseClass}`.trim();
  }, [cartPulse]);

  const addToCart = (productId: string) => {
    setCartCount((current) => current + 1);
    setActivePulseId(productId);
    setCartPulse(true);

    window.setTimeout(() => setActivePulseId((current) => (current === productId ? null : current)), 700);
    window.setTimeout(() => setCartPulse(false), 900);
  };

  return (
    <main className="relative overflow-x-hidden pb-28 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-30 mb-8 rounded-[28px] border border-white/10 bg-black/75 px-4 py-4 backdrop-blur-xl sm:px-6 panel-border brutalist-shadow">
          <div className="flex items-center justify-between gap-4">
            <div className="max-w-[14rem] sm:max-w-none">
              <p className="text-[0.7rem] uppercase tracking-[0.5em] text-white/50">Dark Sugar Neon</p>
              <h1 className="text-balance neon-text mt-2 text-2xl font-black uppercase tracking-[0.22em] sm:text-4xl">
                Cubanitos Dulces
              </h1>
            </div>
            <div className={cartClassName}>
              Carrito {cartCount}
            </div>
          </div>
          <div className="mt-5 grid gap-3 border-t border-white/10 pt-4 text-sm text-white/70 sm:grid-cols-[1.4fr,1fr,1fr]">
            <p className="text-balance max-w-xl">
              Venta inmersiva para elegir, sumar y reservar cubanitos con una vibra nocturna, brutalista y hecha para mobile.
            </p>
            <p className="border-l border-neonPink/40 pl-3 uppercase tracking-[0.35em] text-neonPink/90">
              7 categorias en rotacion automatica
            </p>
            <p className="border-l border-neonCyan/40 pl-3 uppercase tracking-[0.35em] text-neonCyan/90">
              Reservas, carrito y PWA instalable
            </p>
          </div>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-[30px] border border-white/10 bg-white/[0.03] p-5 panel-border brutalist-shadow md:col-span-2 xl:col-span-2">
            <p className="text-sm uppercase tracking-[0.55em] text-neonCyan/75">Taller Artesanal</p>
            <h2 className="text-balance mt-3 max-w-3xl text-3xl font-black uppercase tracking-[0.18em] sm:text-5xl">
              El antojo entra con luz baja y sale en formato reserva.
            </h2>
            <div className="mt-5 h-px w-full bg-gradient-to-r from-neonPink/70 via-white/10 to-neonCyan/70" />
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/[0.03] p-5 panel-border brutalist-shadow">
            <p className="text-sm uppercase tracking-[0.5em] text-white/55">Compra Rapida</p>
            <p className="mt-3 text-balance text-lg text-white/80">
              Tocá el boton neón de cada bloque para sumar productos y cerrá la reserva por WhatsApp cuando quieras.
            </p>
          </article>
        </section>

        <section className="grid gap-6 sm:gap-7 lg:grid-cols-2 2xl:grid-cols-3">
          {products.map((product, index) => {
            const isPink = product.accent === 'pink';
            const activeIndex = activeIndexes[index];
            const pulse = activePulseId === product.id ? 'animate-pulseGlow' : '';

            return (
              <article
                key={product.id}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(12,12,12,0.88)] p-4 panel-border brutalist-shadow"
              >
                <div className="relative h-[380px] overflow-hidden rounded-[26px] border border-white/10 bg-black sm:h-[430px]">
                  {product.images.map((src, imageIndex) => {
                    const isActive = imageIndex === activeIndex;

                    return (
                      <div
                        key={src}
                        className={`absolute inset-0 transition-all duration-1000 ${isActive ? 'opacity-100' : 'opacity-0 scale-[1.04]'}`}
                      >
                        <Image
                          src={src}
                          alt={`${product.title} vista ${imageIndex + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out"
                          style={{
                            transform: `scale(1.1) translate3d(0, ${parallaxOffsets[index]}px, 0)`,
                          }}
                          priority={index < 2 && imageIndex === 0}
                        />
                      </div>
                    );
                  })}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs uppercase tracking-[0.4em] text-white/70 backdrop-blur-md">
                    <span className={`inline-block h-2 w-2 rounded-full ${isPink ? 'bg-neonPink shadow-[0_0_12px_rgba(255,105,180,0.9)]' : 'bg-neonCyan shadow-[0_0_12px_rgba(0,255,255,0.9)]'}`} />
                    {product.category}
                  </div>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {product.images.map((_, bulletIndex) => (
                      <span
                        key={`${product.id}-${bulletIndex}`}
                        className={`h-1.5 rounded-full transition-all duration-500 ${bulletIndex === activeIndex ? 'w-8 bg-white' : 'w-3 bg-white/30'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-balance text-2xl font-black uppercase tracking-[0.16em] text-white">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/70">{product.subtitle}</p>
                    <div className="mt-4 h-px w-20 bg-gradient-to-r from-neonPink/60 to-neonCyan/60" />
                    <p className="mt-4 text-xl font-semibold text-white">{product.price}</p>
                  </div>

                  <button
                    type="button"
                    aria-label={`Agregar ${product.title} al carrito`}
                    onClick={() => addToCart(product.id)}
                    className={`mt-1 inline-flex h-14 w-14 flex-none items-center justify-center rounded-full border text-3xl font-light leading-none transition duration-300 hover:-translate-y-1 hover:scale-105 ${pulse} ${
                      isPink
                        ? 'border-neonPink/80 text-neonPink shadow-button hover:bg-neonPink/10'
                        : 'border-neonCyan/80 text-neonCyan shadow-button hover:bg-neonCyan/10'
                    }`}
                  >
                    +
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </div>

      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Reservar por WhatsApp"
        className="fixed bottom-5 right-4 z-40 flex h-16 w-16 items-center justify-center rounded-full border border-[#25D366]/70 bg-black/90 shadow-[0_0_0_1px_rgba(37,211,102,0.7),0_0_18px_rgba(37,211,102,0.25)] transition duration-300 hover:-translate-y-1 hover:scale-105 sm:right-6"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-[#25D366]" aria-hidden="true">
          <path d="M19.05 4.94A9.87 9.87 0 0 0 12.04 2C6.56 2 2.1 6.46 2.1 11.94c0 1.75.46 3.47 1.33 4.99L2 22l5.23-1.37a9.92 9.92 0 0 0 4.8 1.23h.01c5.48 0 9.94-4.46 9.95-9.94A9.86 9.86 0 0 0 19.05 4.94Zm-7 15.24h-.01a8.23 8.23 0 0 1-4.18-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.23 8.23 0 0 1-1.27-4.4c0-4.56 3.71-8.27 8.28-8.27a8.2 8.2 0 0 1 5.85 2.42 8.2 8.2 0 0 1 2.42 5.86c0 4.56-3.71 8.27-8.27 8.27Zm4.54-6.16c-.25-.13-1.47-.73-1.69-.82-.23-.08-.39-.13-.56.13-.17.25-.65.82-.8.99-.15.17-.29.19-.54.06-.25-.13-1.04-.38-1.98-1.2-.73-.65-1.22-1.44-1.37-1.68-.15-.25-.02-.38.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.76-1.84-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.45 1.03 2.62c.13.17 1.76 2.68 4.26 3.76.6.26 1.07.41 1.44.53.61.19 1.16.16 1.59.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.15-.48-.28Z" />
        </svg>
      </a>

      <button
        type="button"
        aria-label="Abrir CubanitoBot AI"
        onClick={() => setChatOpen(true)}
        className="fixed bottom-5 left-4 z-40 flex h-16 w-16 items-center justify-center rounded-full border border-neonCyan/70 bg-black/90 shadow-[0_0_0_1px_rgba(0,255,255,0.7),0_0_18px_rgba(0,255,255,0.2)] transition duration-300 hover:-translate-y-1 hover:scale-105 sm:left-6"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 stroke-neonCyan" fill="none" strokeWidth="1.8" aria-hidden="true">
          <path d="M12 3v2" strokeLinecap="round" />
          <path d="M8 8.5h8" strokeLinecap="round" />
          <rect x="5" y="6" width="14" height="11" rx="4" />
          <path d="M9 12h.01M15 12h.01" strokeLinecap="round" />
          <path d="M9.5 15c.73.67 1.51 1 2.5 1 1 0 1.77-.33 2.5-1" strokeLinecap="round" />
          <path d="M8 17v4l3-2h2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {chatOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-4 backdrop-blur-md sm:items-center">
          <div className="relative w-full max-w-xl overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(7,7,7,0.98)] p-5 panel-border brutalist-shadow">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-neonCyan/70">Asistente Instantaneo</p>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.18em] text-white">
                  CubanitoBot AI
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-xl text-white/70 transition hover:border-neonPink/70 hover:text-white"
                aria-label="Cerrar modal"
              >
                ×
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              {faqs.map((faq) => {
                const active = faq.question === activeFaq.question;

                return (
                  <button
                    key={faq.question}
                    type="button"
                    onClick={() => setActiveFaq(faq)}
                    className={`rounded-[20px] border px-4 py-4 text-left text-sm uppercase tracking-[0.16em] transition ${
                      active
                        ? 'border-neonPink/80 bg-neonPink/10 text-white shadow-button'
                        : 'border-white/10 bg-white/[0.03] text-white/75 hover:border-neonCyan/50 hover:bg-neonCyan/5 hover:text-white'
                    }`}
                  >
                    {faq.question}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-[24px] border border-neonCyan/25 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.45em] text-neonPink/70">Respuesta inmediata</p>
              <p className="mt-3 text-balance text-base leading-7 text-white/88">{activeFaq.answer}</p>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
