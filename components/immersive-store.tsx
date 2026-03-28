'use client';

import Image from 'next/image';
import type { Product as CartProduct } from '@/types/cart';
import { useEffect, useMemo, useRef, useState } from 'react';

type Product = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  priceLabel: string;
  priceValue: number;
  images: string[];
  accent: 'pink' | 'cyan';
};

type Faq = {
  question: string;
  answer: string;
};

type CustomerDetails = {
  name: string;
  address: string;
  pickupDate: string;
  notes: string;
};

const basePath = '/DulcesCubanitos';
const cartStorageKey = 'cubanitos-dulces-cart';
const customerStorageKey = 'cubanitos-dulces-customer';

const withBasePath = (path: string) => `${basePath}${path}`;

const products: Product[] = [
  {
    id: 'clasicos',
    category: 'Los Clasicos',
    title: 'Dulce de Leche Rush',
    subtitle: 'Crujiente fino, relleno al instante y golpe final de azucar glass.',
    priceLabel: '$3.200',
    priceValue: 3200,
    images: [withBasePath('/images/cubanito-neon-1.svg'), withBasePath('/images/cubanito-neon-2.svg'), withBasePath('/images/cubanito-neon-3.svg')],
    accent: 'pink',
  },
  {
    id: 'nocciola',
    category: 'Premium Nocciola',
    title: 'Hazelnut Pulse',
    subtitle: 'Nocciola intensa con textura cremosa y remate de cacao oscuro.',
    priceLabel: '$4.100',
    priceValue: 4100,
    images: [withBasePath('/images/cubanito-neon-2.svg'), withBasePath('/images/cubanito-neon-3.svg'), withBasePath('/images/cubanito-neon-1.svg')],
    accent: 'cyan',
  },
  {
    id: 'edicion-limitada',
    category: 'Edicion Limitada',
    title: 'Pink Citrus Voltage',
    subtitle: 'Crema citrica brillante con un acabado fresco y electrico.',
    priceLabel: '$4.600',
    priceValue: 4600,
    images: [withBasePath('/images/cubanito-neon-3.svg'), withBasePath('/images/cubanito-neon-1.svg'), withBasePath('/images/cubanito-neon-2.svg')],
    accent: 'pink',
  },
  {
    id: 'black-label',
    category: 'Black Label',
    title: 'Cacao Obsidiana',
    subtitle: 'Chocolate amargo sedoso, capas finas y un contraste profundo.',
    priceLabel: '$4.500',
    priceValue: 4500,
    images: [withBasePath('/images/cubanito-neon-1.svg'), withBasePath('/images/cubanito-neon-3.svg'), withBasePath('/images/cubanito-neon-2.svg')],
    accent: 'cyan',
  },
  {
    id: 'eco-sweet',
    category: 'Eco-Sweet',
    title: 'Plant Based Glow',
    subtitle: 'Version vegana con crema de coco tostado y vainilla limpia.',
    priceLabel: '$4.000',
    priceValue: 4000,
    images: [withBasePath('/images/cubanito-neon-2.svg'), withBasePath('/images/cubanito-neon-1.svg'), withBasePath('/images/cubanito-neon-3.svg')],
    accent: 'pink',
  },
  {
    id: 'mini-bites',
    category: 'Mini Bites',
    title: 'Pocket Crunch',
    subtitle: 'Pack de mini cubanitos para mesa dulce, eventos y antojos serios.',
    priceLabel: '$2.700',
    priceValue: 2700,
    images: [withBasePath('/images/cubanito-neon-3.svg'), withBasePath('/images/cubanito-neon-2.svg'), withBasePath('/images/cubanito-neon-1.svg')],
    accent: 'cyan',
  },
  {
    id: 'signature',
    category: 'Signature Drops',
    title: 'Neon Signature Box',
    subtitle: 'Seleccion del taller con rellenos premium y acabado de temporada.',
    priceLabel: '$5.200',
    priceValue: 5200,
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

const initialCustomerDetails: CustomerDetails = {
  name: '',
  address: '',
  pickupDate: '',
  notes: '',
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const isCartProduct = (value: unknown): value is CartProduct => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<CartProduct>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.price === 'number' &&
    typeof candidate.quantity === 'number'
  );
};

const isCustomerDetails = (value: unknown): value is CustomerDetails => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<CustomerDetails>;

  return (
    typeof candidate.name === 'string' &&
    typeof candidate.address === 'string' &&
    typeof candidate.pickupDate === 'string' &&
    typeof candidate.notes === 'string'
  );
};

const generateWhatsAppMessage = (cart: CartProduct[], total: number, customerDetails: CustomerDetails) => {
  let message = '*🍦 NUEVO PEDIDO - CUBANITOS DULCES*\n';
  message += '--------------------------\n';

  cart.forEach((item) => {
    message += `• ${item.quantity}x ${item.name} (${formatPrice(item.price * item.quantity)})\n`;
  });

  message += '--------------------------\n';
  message += `*TOTAL A PAGAR: ${formatPrice(total)}*\n\n`;

  if (customerDetails.name.trim()) {
    message += `*Nombre:* ${customerDetails.name.trim()}\n`;
  }

  if (customerDetails.address.trim()) {
    message += `*Direccion:* ${customerDetails.address.trim()}\n`;
  }

  if (customerDetails.pickupDate.trim()) {
    message += `*Fecha de retiro:* ${customerDetails.pickupDate.trim()}\n`;
  }

  if (customerDetails.notes.trim()) {
    message += `*Notas extra:* ${customerDetails.notes.trim()}\n`;
  }

  if (
    customerDetails.name.trim() ||
    customerDetails.address.trim() ||
    customerDetails.pickupDate.trim() ||
    customerDetails.notes.trim()
  ) {
    message += '\n';
  }

  message += '¿Me confirman la disponibilidad para retirar? 🚀';

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

const cartIndicatorBase =
  'inline-flex min-w-10 items-center justify-center rounded-full border px-3 py-1 text-sm font-semibold';

export function ImmersiveStore() {
  const [activeIndexes, setActiveIndexes] = useState<number[]>(() => products.map(() => 0));
  const [parallaxOffsets, setParallaxOffsets] = useState<number[]>(() => products.map(() => 0));
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [activePulseId, setActivePulseId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>(initialCustomerDetails);
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
    try {
      const savedCart = window.localStorage.getItem(cartStorageKey);
      const savedCustomerDetails = window.localStorage.getItem(customerStorageKey);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as unknown;

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart.filter(isCartProduct));
        }
      }

      if (savedCustomerDetails) {
        const parsedCustomerDetails = JSON.parse(savedCustomerDetails) as unknown;

        if (isCustomerDetails(parsedCustomerDetails)) {
          setCustomerDetails(parsedCustomerDetails);
        }
      }
    } catch {
      window.localStorage.removeItem(cartStorageKey);
      window.localStorage.removeItem(customerStorageKey);
    } finally {
      setCartReady(true);
    }
  }, []);

  useEffect(() => {
    if (!cartReady) {
      return;
    }

    window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart, cartReady]);

  useEffect(() => {
    if (!cartReady) {
      return;
    }

    window.localStorage.setItem(customerStorageKey, JSON.stringify(customerDetails));
  }, [cartReady, customerDetails]);

  useEffect(() => {
    if (!chatOpen && !cartOpen) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setChatOpen(false);
        setCartOpen(false);
      }
    };

    window.addEventListener('keydown', onEscape);

    return () => window.removeEventListener('keydown', onEscape);
  }, [chatOpen, cartOpen]);

  const cartClassName = useMemo(() => {
    const pulseClass = cartPulse ? 'animate-pulseGlow' : '';
    return `${cartIndicatorBase} border-neonCyan/50 bg-black/80 text-white shadow-neon ${pulseClass}`.trim();
  }, [cartPulse]);

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

  const checkoutUrl = useMemo(() => {
    if (cart.length === 0) {
      return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    }

    return generateWhatsAppMessage(cart, cartTotal, customerDetails);
  }, [cart, cartTotal, customerDetails]);

  const updateCustomerDetail = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existingProduct = current.find((item) => item.id === product.id);

      if (existingProduct) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...current,
        {
          id: product.id,
          name: product.title,
          price: product.priceValue,
          quantity: 1,
        },
      ];
    });

    setActivePulseId(product.id);
    setCartPulse(true);

    window.setTimeout(() => setActivePulseId((current) => (current === product.id ? null : current)), 700);
    window.setTimeout(() => setCartPulse(false), 900);
  };

  const decreaseQuantity = (productId: string) => {
    setCart((current) =>
      current.flatMap((item) => {
        if (item.id !== productId) {
          return [item];
        }

        if (item.quantity <= 1) {
          return [];
        }

        return [{ ...item, quantity: item.quantity - 1 }];
      }),
    );
  };

  const increaseQuantity = (productId: string) => {
    const product = products.find((entry) => entry.id === productId);

    if (!product) {
      return;
    }

    addToCart(product);
  };

  const removeFromCart = (productId: string) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const openCart = () => {
    if (cartCount === 0) {
      return;
    }

    setCartOpen(true);
  };

  return (
    <main className="relative overflow-x-hidden pb-44 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-30 mb-8 rounded-[28px] border border-white/10 bg-black/75 px-4 py-4 backdrop-blur-xl sm:px-6 panel-border brutalist-shadow">
          <div className="flex items-center justify-between gap-4">
            <div className="max-w-[14rem] sm:max-w-none">
              <p className="text-[0.7rem] uppercase tracking-[0.5em] text-white/50">Dark Sugar Neon</p>
              <h1 className="text-balance neon-text mt-2 text-2xl font-black uppercase tracking-[0.22em] sm:text-4xl">
                Cubanitos Dulces
              </h1>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={openCart}
                disabled={cartCount === 0}
                aria-label="Abrir carrito"
                className={`${cartClassName} transition hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-80`}
              >
                Carrito {cartCount}
              </button>
              <p className="text-xs uppercase tracking-[0.32em] text-white/50">
                Total {formatPrice(cartTotal)}
              </p>
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
            const pulse = activePulseId === product.id ? 'animate-pulseGlow scale-105' : '';
            const quantityInCart = cart.find((item) => item.id === product.id)?.quantity ?? 0;

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
                    <p className="mt-4 text-xl font-semibold text-white">{product.priceLabel}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.34em] text-white/45">
                      {quantityInCart > 0 ? `En carrito x${quantityInCart}` : 'Listo para sumar'}
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label={`Agregar ${product.title} al carrito`}
                    onClick={() => addToCart(product)}
                    className={`mt-1 inline-flex h-14 w-14 flex-none items-center justify-center rounded-full border text-3xl font-light leading-none transition duration-300 hover:-translate-y-1 hover:scale-105 ${pulse} ${
                      isPink
                        ? 'border-neonPink/80 text-neonPink shadow-button hover:bg-neonPink/10 active:shadow-[0_0_0_1px_rgba(255,105,180,0.85),0_0_26px_rgba(255,105,180,0.75),0_0_42px_rgba(0,255,255,0.22)]'
                        : 'border-neonCyan/80 text-neonCyan shadow-button hover:bg-neonCyan/10 active:shadow-[0_0_0_1px_rgba(0,255,255,0.85),0_0_26px_rgba(0,255,255,0.65),0_0_36px_rgba(255,105,180,0.2)]'
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

      {cartCount > 0 ? (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          aria-label="Abrir modal de reserva"
          className="fixed bottom-24 left-1/2 z-40 flex w-[min(calc(100%-1.5rem),32rem)] -translate-x-1/2 items-center gap-3 rounded-full border border-neonPink/80 bg-black/90 px-4 py-3 text-neonPink shadow-[0_0_0_1px_rgba(255,105,180,0.8),0_0_22px_rgba(255,105,180,0.38)] backdrop-blur-xl transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(255,105,180,0.9),0_0_30px_rgba(255,105,180,0.48)] sm:bottom-6"
        >
          <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-neonPink px-3 py-1 text-sm font-black text-black">
            {cartCount}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-xs uppercase tracking-[0.32em] text-white/60">Brutalismo Neon</span>
            <span className="truncate text-sm font-black uppercase tracking-[0.12em] text-white">Revisar carrito y confirmar reserva</span>
          </span>
          <span className="text-right text-sm font-semibold text-white">
            {formatPrice(cartTotal)}
          </span>
        </button>
      ) : null}

      <a
        href={cartCount > 0 ? undefined : checkoutUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Reservar por WhatsApp"
        onClick={(event) => {
          if (cartCount > 0) {
            event.preventDefault();
            setCartOpen(true);
          }
        }}
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

      {cartOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-4 backdrop-blur-md sm:items-center">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(7,7,7,0.98)] p-5 panel-border brutalist-shadow">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-neonPink/70">Checkout Neon</p>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.16em] text-white">
                  Revisa tu reserva
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-xl text-white/70 transition hover:border-neonPink/70 hover:text-white"
                aria-label="Cerrar carrito"
              >
                ×
              </button>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr,0.9fr]">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.14em] text-white">{item.name}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/45">
                          Subtotal {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Eliminar ${item.name} del carrito`}
                        className="inline-flex rounded-full border border-white/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.28em] text-white/55 transition hover:border-neonPink/60 hover:text-white"
                      >
                        Quitar
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2 py-2">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          aria-label={`Restar cantidad de ${item.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xl text-white/80 transition hover:border-neonPink/60 hover:text-white"
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-sm font-black text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          aria-label={`Sumar cantidad de ${item.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xl text-white/80 transition hover:border-neonCyan/60 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-sm font-semibold text-white/80">Unitario {formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-[26px] border border-neonCyan/20 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.4em] text-neonCyan/70">Datos de retiro</p>

                <div className="mt-4 grid gap-3">
                  <label className="grid gap-2 text-xs uppercase tracking-[0.24em] text-white/55">
                    Nombre
                    <input
                      value={customerDetails.name}
                      onChange={(event) => updateCustomerDetail('name', event.target.value)}
                      placeholder="Tu nombre"
                      className="rounded-[18px] border border-white/10 bg-black/40 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-neonPink/60"
                    />
                  </label>

                  <label className="grid gap-2 text-xs uppercase tracking-[0.24em] text-white/55">
                    Direccion o punto de retiro
                    <input
                      value={customerDetails.address}
                      onChange={(event) => updateCustomerDetail('address', event.target.value)}
                      placeholder="Barrio, punto de entrega o retiro"
                      className="rounded-[18px] border border-white/10 bg-black/40 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-neonPink/60"
                    />
                  </label>

                  <label className="grid gap-2 text-xs uppercase tracking-[0.24em] text-white/55">
                    Fecha de retiro
                    <input
                      value={customerDetails.pickupDate}
                      onChange={(event) => updateCustomerDetail('pickupDate', event.target.value)}
                      placeholder="Ej: Sabado 18:00"
                      className="rounded-[18px] border border-white/10 bg-black/40 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-neonPink/60"
                    />
                  </label>

                  <label className="grid gap-2 text-xs uppercase tracking-[0.24em] text-white/55">
                    Notas extra
                    <textarea
                      value={customerDetails.notes}
                      onChange={(event) => updateCustomerDetail('notes', event.target.value)}
                      placeholder="Ej: sin azucar glass, para cumple, entrega urgente"
                      rows={4}
                      className="resize-none rounded-[18px] border border-white/10 bg-black/40 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-neonPink/60"
                    />
                  </label>
                </div>

                <div className="mt-5 rounded-[20px] border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-white/45">
                    <span>Productos</span>
                    <span>{cartCount}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-sm font-semibold text-white">
                    <span>Total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Confirmar reserva por WhatsApp"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-neonPink/80 bg-black px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-neonPink shadow-[0_0_0_1px_rgba(255,105,180,0.82),0_0_18px_rgba(255,105,180,0.34)] transition hover:scale-[1.01] hover:text-white"
                >
                  Confirmar reserva por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
