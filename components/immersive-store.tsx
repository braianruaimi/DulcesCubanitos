'use client';

import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { Product as CartProduct } from '@/types/cart';

type Product = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  primaryPriceLabel: string;
  secondaryPriceLabel: string;
  priceValue: number;
  images: string[];
  stockBadge: string;
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

const realCarouselImages = [
  withBasePath('/images/cubanito.jpg'),
  withBasePath('/images/cubanito%20noche.jpg'),
  withBasePath('/images/cubanito%20dulce.jpg'),
];

const rotatedCarouselImages = [
  realCarouselImages,
  [realCarouselImages[1], realCarouselImages[2], realCarouselImages[0]],
  [realCarouselImages[2], realCarouselImages[0], realCarouselImages[1]],
];

const wholesaleOffer = {
  title: 'Venta Mayorista',
  subtitle: 'Obleas de 18 cm por kilo para produccion, mesas dulces y reventa.',
  detail: 'Obleas de 18 cm x 1kg',
  units: 'Entran 45u aproximadamente',
  priceLabel: '$15.000',
};

const products: Product[] = [
  {
    id: 'clasicos',
    category: 'Clasicos',
    title: 'Cubanito Clasico',
    subtitle: 'Oblea de 18 cm sin baño, rellena de dulce de leche.',
    primaryPriceLabel: 'x12 u $10.000',
    secondaryPriceLabel: 'x6 u $5.000',
    priceValue: 10000,
    images: rotatedCarouselImages[0],
    stockBadge: '🔥 Sale en 1h',
    accent: 'pink',
  },
  {
    id: 'premium-nocciola',
    category: 'Premium Nocciola',
    title: 'Cubanitos Surtidos',
    subtitle: '18 cm bañados en chocolate blanco o negro y rellenos de dulce de leche. Toppin, crocante, cereal, coco, rockler, solo baño.',
    primaryPriceLabel: 'x12 u $15.000',
    secondaryPriceLabel: 'x6 u $7.500',
    priceValue: 15000,
    images: rotatedCarouselImages[1],
    stockBadge: 'Solo 10 unidades',
    accent: 'cyan',
  },
  {
    id: 'edicion-limitada',
    category: 'Edicion Limitada',
    title: 'Cubanitos Helados',
    subtitle: '10 cm, bañados en chocolate con leche y rellenos de helado.',
    primaryPriceLabel: 'x12 u $20.000',
    secondaryPriceLabel: 'x6 u $10.000',
    priceValue: 20000,
    images: rotatedCarouselImages[2],
    stockBadge: '🔥 Batch del dia',
    accent: 'pink',
  },
  {
    id: 'black-label',
    category: 'Black Label',
    title: 'Cacao Obsidiana',
    subtitle: 'Chocolate amargo sedoso, capas finas y contraste profundo.',
    primaryPriceLabel: '$4.500',
    secondaryPriceLabel: 'Pack especial',
    priceValue: 4500,
    images: rotatedCarouselImages[0],
    stockBadge: 'Solo hoy',
    accent: 'cyan',
  },
  {
    id: 'vegano',
    category: 'Veganos',
    title: 'Plant Based Glow',
    subtitle: 'Version vegetal con coco tostado y vainilla limpia, lista para envio rapido.',
    primaryPriceLabel: '$4.000',
    secondaryPriceLabel: 'Pack especial',
    priceValue: 4000,
    images: rotatedCarouselImages[1],
    stockBadge: '🌿 Sale en 2h',
    accent: 'pink',
  },
  {
    id: 'mini-bites',
    category: 'Mini Bites',
    title: 'Pocket Crunch',
    subtitle: 'Mini cubanitos para mesas dulces, eventos y antojos urgentes.',
    primaryPriceLabel: '$2.700',
    secondaryPriceLabel: 'Pack especial',
    priceValue: 2700,
    images: rotatedCarouselImages[2],
    stockBadge: 'Ultimos packs',
    accent: 'cyan',
  },
  {
    id: 'signature',
    category: 'Signature Drops',
    title: 'Neon Signature Box',
    subtitle: 'Curaduria premium del taller con acabados de temporada y textura glaseada.',
    primaryPriceLabel: '$5.200',
    secondaryPriceLabel: 'Pack premium',
    priceValue: 5200,
    images: rotatedCarouselImages[0],
    stockBadge: 'Reserva express',
    accent: 'pink',
  },
];

const faqs: Faq[] = [
  {
    question: '¿Hacen envios?',
    answer: 'Si. Coordinamos envios y puntos de retiro segun zona y horario disponible.',
  },
  {
    question: '¿Son frescos?',
    answer: 'Si. Trabajamos por tanda corta para mantener crocante, relleno y terminacion impecable.',
  },
  {
    question: '¿Tienen opciones Veganas?',
    answer: 'Si. La linea Plant Based Glow esta pensada para una experiencia vegana premium.',
  },
  {
    question: '¿Como reservo para un evento?',
    answer: 'Abre WhatsApp desde la reserva y te armamos cantidades, sabores y timing de entrega.',
  },
  {
    question: '¿Tienen local fisico?',
    answer: 'Trabajamos como taller artesanal con retiro coordinado y envios programados.',
  },
];

const whatsappFallbackMessage = '¡Hola DulcesCubanitos! Quiero reservar un pack personalizado. ¿Me confirman disponibilidad?';
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
  let message = '*🍦 NUEVO PEDIDO - DULCES CUBANITOS*\n';
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

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M7 9V7a5 5 0 0 1 10 0v2" strokeLinecap="round" />
      <path d="M5.5 9.5h13l-1.1 10.2a2 2 0 0 1-2 1.8H8.6a2 2 0 0 1-2-1.8L5.5 9.5Z" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-[#25D366]" aria-hidden="true">
      <path d="M19.05 4.94A9.87 9.87 0 0 0 12.04 2C6.56 2 2.1 6.46 2.1 11.94c0 1.75.46 3.47 1.33 4.99L2 22l5.23-1.37a9.92 9.92 0 0 0 4.8 1.23h.01c5.48 0 9.94-4.46 9.95-9.94A9.86 9.86 0 0 0 19.05 4.94Zm-7 15.24h-.01a8.23 8.23 0 0 1-4.18-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.23 8.23 0 0 1-1.27-4.4c0-4.56 3.71-8.27 8.28-8.27a8.2 8.2 0 0 1 5.85 2.42 8.2 8.2 0 0 1 2.42 5.86c0 4.56-3.71 8.27-8.27 8.27Zm4.54-6.16c-.25-.13-1.47-.73-1.69-.82-.23-.08-.39-.13-.56.13-.17.25-.65.82-.8.99-.15.17-.29.19-.54.06-.25-.13-1.04-.38-1.98-1.2-.73-.65-1.22-1.44-1.37-1.68-.15-.25-.02-.38.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.76-1.84-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.45 1.03 2.62c.13.17 1.76 2.68 4.26 3.76.6.26 1.07.41 1.44.53.61.19 1.16.16 1.59.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.15-.48-.28Z" />
    </svg>
  );
}

function BotIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 stroke-neonCyan" fill="none" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 3v2" strokeLinecap="round" />
      <path d="M8 8.5h8" strokeLinecap="round" />
      <rect x="5" y="6" width="14" height="11" rx="4" />
      <path d="M9 12h.01M15 12h.01" strokeLinecap="round" />
      <path d="M9.5 15c.73.67 1.51 1 2.5 1 1 0 1.77-.33 2.5-1" strokeLinecap="round" />
      <path d="M8 17v4l3-2h2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black splash-fade-out">
      <div className="flex flex-col items-center gap-5">
        <div className="cubanito-mask splash-logo h-28 w-28 rounded-full" />
        <p className="splash-copy text-xs uppercase tracking-[0.55em] text-neonPink/85">
          Dark Sugar Neon
        </p>
      </div>
    </div>
  );
}

function StockBadge({ label, accent }: { label: string; accent: Product['accent'] }) {
  return (
    <div
      className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.22em] backdrop-blur-md ${
        accent === 'pink'
          ? 'pulse-badge border-neonPink/50 bg-black/65 text-neonPink shadow-[0_0_18px_rgba(255,105,180,0.26)]'
          : 'pulse-badge border-neonCyan/50 bg-black/65 text-neonCyan shadow-[0_0_18px_rgba(0,255,255,0.2)]'
      }`}
    >
      {label}
    </div>
  );
}

export function ImmersiveStore() {
  const [splashVisible, setSplashVisible] = useState(() => process.env.NODE_ENV !== 'test');
  const [activeIndexes, setActiveIndexes] = useState<number[]>(() => products.map(() => 0));
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [activePulseId, setActivePulseId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>(initialCustomerDetails);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<Faq>(faqs[0]);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const trackRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!splashVisible) {
      return;
    }

    const timeout = window.setTimeout(() => setSplashVisible(false), 980);

    return () => window.clearTimeout(timeout);
  }, [splashVisible]);

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

  useEffect(() => {
    const syncTrack = (productIndex: number, imageIndex: number) => {
      const track = trackRefs.current[productIndex];

      if (!track) {
        return;
      }

      const nextLeft = track.clientWidth * imageIndex;

      if (typeof track.scrollTo === 'function') {
        track.scrollTo({
          left: nextLeft,
          behavior: 'smooth',
        });
        return;
      }

      track.scrollLeft = nextLeft;
    };

    const interval = window.setInterval(() => {
      setActiveIndexes((current) =>
        current.map((value, productIndex) => {
          const nextIndex = (value + 1) % 3;
          syncTrack(productIndex, nextIndex);
          return nextIndex;
        }),
      );
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  const cartClassName = useMemo(() => {
    const pulseClass = cartPulse ? 'animate-pulseGlow' : '';
    return `inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/80 px-3 py-1.5 text-sm font-semibold text-white shadow-neon ${pulseClass}`.trim();
  }, [cartPulse]);

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

  const checkoutUrl = useMemo(() => {
    if (cart.length === 0) {
      return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappFallbackMessage)}`;
    }

    return generateWhatsAppMessage(cart, cartTotal, customerDetails);
  }, [cart, cartTotal, customerDetails]);

  const updateCustomerDetail = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails((current) => ({ ...current, [field]: value }));
  };

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existingProduct = current.find((item) => item.id === product.id);

      if (existingProduct) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...current, { id: product.id, name: product.title, price: product.priceValue, quantity: 1 }];
    });

    setActivePulseId(product.id);
    setCartPulse(true);
    window.setTimeout(() => setActivePulseId((current) => (current === product.id ? null : current)), 680);
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

    if (product) {
      addToCart(product);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const openCart = () => {
    if (cartCount > 0) {
      setCartOpen(true);
    }
  };

  const onTrackScroll = (productIndex: number) => {
    const track = trackRefs.current[productIndex];

    if (!track || track.clientWidth === 0) {
      return;
    }

    const nextIndex = Math.round(track.scrollLeft / track.clientWidth);

    setActiveIndexes((current) =>
      current.map((value, index) => (index === productIndex ? nextIndex : value)),
    );
  };

  return (
    <LazyMotion features={domAnimation}>
      {splashVisible ? <SplashScreen /> : null}

      <main className="relative overflow-x-hidden pb-44 text-white">
        <header className="sticky top-3 z-40 mx-auto mt-3 flex w-[min(100%-1rem,76rem)] items-center justify-between rounded-full border border-white/10 bg-black/75 px-4 py-2 backdrop-blur-xl sm:px-5 glazed-panel">
          <div className="flex items-center gap-3">
            <div className="cubanito-mask h-9 w-9 rounded-full" aria-hidden="true" />
            <div>
              <p className="text-[0.55rem] uppercase tracking-[0.45em] text-white/45">Dark Sugar Neon</p>
              <p className="neon-text text-sm font-black uppercase tracking-[0.24em] text-white sm:text-base">DulcesCubanitos</p>
            </div>
          </div>

          <button
            type="button"
            onClick={openCart}
            disabled={cartCount === 0}
            aria-label="Abrir carrito"
            className={`${cartClassName} disabled:opacity-85`}
          >
            <span className="text-white/80">
              <BagIcon />
            </span>
            <span className="hidden text-[0.7rem] uppercase tracking-[0.28em] text-white/60 sm:inline">Reserva</span>
            <span className="cart-bubble min-w-7 rounded-full px-2 py-0.5 text-center text-xs font-black text-black">
              {cartCount}
            </span>
          </button>
        </header>

        <section className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <div className="hero-reveal mb-8 grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl glazed-panel">
              <p className="text-[0.65rem] uppercase tracking-[0.55em] text-neonCyan/75">Venta inmersiva</p>
              <h1 className="text-balance mt-4 max-w-4xl text-4xl font-black uppercase tracking-[0.18em] text-white sm:text-6xl">
                Glaseado oscuro, swipe directo y cierre instantaneo.
              </h1>
              <div className="neon-divider mt-6" />
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
                PWA premium enfocada en conversion movil: micro-carrito sticky, carruseles swipe-first, checkout inteligente y contacto inmediato por WhatsApp.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl glazed-panel">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.45em] text-neonPink/75">Optimizacion</p>
                  <p className="mt-2 text-sm text-white/72">Prioridad a la primera imagen, export estatico y superficies ligeras para mejorar LCP.</p>
                </div>
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.45em] text-neonCyan/75">Checkout</p>
                  <p className="mt-2 text-sm text-white/72">Cantidad, total, retiro, notas extra y mensaje estructurado listo para enviar.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {products.map((product, productIndex) => {
              const quantityInCart = cart.find((item) => item.id === product.id)?.quantity ?? 0;
              const activeIndex = activeIndexes[productIndex] ?? 0;
              const pulse = activePulseId === product.id;

              return (
                <article
                  key={product.id}
                  className="card-reveal rounded-[2rem] border border-[rgba(255,105,180,0.3)] bg-[rgba(255,255,255,0.03)] p-4 backdrop-blur-[10px] glazed-panel"
                  style={{ animationDelay: `${productIndex * 80}ms` }}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[0.62rem] uppercase tracking-[0.46em] text-white/50">{product.category}</p>
                      <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.16em] text-white sm:text-3xl">{product.title}</h2>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="text-xs uppercase tracking-[0.36em] text-white/35">{product.primaryPriceLabel}</p>
                      <p className="mt-1 text-[0.62rem] uppercase tracking-[0.28em] text-white/45">{product.secondaryPriceLabel}</p>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/85">
                    <StockBadge label={product.stockBadge} accent={product.accent} />
                    <div
                      ref={(node) => {
                        trackRefs.current[productIndex] = node;
                      }}
                      onScroll={() => onTrackScroll(productIndex)}
                      className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth"
                    >
                      {product.images.map((src, imageIndex) => (
                        <div key={`${product.id}-${imageIndex}`} className="relative h-[68vw] min-h-[20rem] w-full flex-none snap-center sm:h-[32rem]">
                          <Image
                            src={src}
                            alt={`${product.title} vista ${imageIndex + 1}`}
                            fill
                            priority={productIndex === 0 && imageIndex === 0}
                            sizes="(max-width: 768px) 100vw, 80vw"
                            className={`object-cover transition duration-500 ${heroLoaded || productIndex !== 0 ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => {
                              if (productIndex === 0 && imageIndex === 0) {
                                setHeroLoaded(true);
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/18 to-transparent" />
                        </div>
                      ))}
                    </div>

                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/55 px-3 py-2 backdrop-blur-md">
                      {product.images.map((_, bulletIndex) => (
                        <span
                          key={`${product.id}-bullet-${bulletIndex}`}
                          className={`h-1.5 rounded-full transition-all ${bulletIndex === activeIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/28'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div className="max-w-2xl">
                      <p className="text-balance text-sm leading-7 text-white/72 sm:text-base">{product.subtitle}</p>
                      <div className="neon-divider mt-4 max-w-[7rem]" />
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div>
                          <p className="text-xl font-semibold text-white">{product.primaryPriceLabel}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/45">{product.secondaryPriceLabel}</p>
                        </div>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.32em] text-white/45">
                          {quantityInCart > 0 ? `En carrito x${quantityInCart}` : 'Listo para sumar'}
                        </span>
                      </div>
                    </div>

                    <m.button
                      type="button"
                      aria-label={`Agregar ${product.title} al carrito`}
                      onClick={() => addToCart(product)}
                      whileTap={{ scale: 0.9 }}
                      animate={pulse ? { boxShadow: ['0 0 0 1px rgba(255,105,180,0.65)', '0 0 24px rgba(255,105,180,0.7)', '0 0 0 1px rgba(255,105,180,0.65)'] } : undefined}
                      transition={{ duration: 0.35 }}
                      className={`mt-1 inline-flex h-14 w-14 flex-none items-center justify-center rounded-full border text-3xl font-light leading-none ${
                        product.accent === 'pink'
                          ? 'border-neonPink/80 text-neonPink shadow-button'
                          : 'border-neonCyan/80 text-neonCyan shadow-[0_0_0_1px_rgba(0,255,255,0.6),0_0_18px_rgba(0,255,255,0.18)]'
                      }`}
                    >
                      +
                    </m.button>
                  </div>
                </article>
              );
            })}
          </div>

          <section className="mt-8 rounded-[2rem] border border-neonCyan/25 bg-white/[0.03] p-5 glazed-panel">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[0.65rem] uppercase tracking-[0.5em] text-neonCyan/75">{wholesaleOffer.title}</p>
                <h2 className="mt-3 text-2xl font-black uppercase tracking-[0.16em] text-white sm:text-3xl">{wholesaleOffer.detail}</h2>
                <p className="mt-3 text-sm leading-7 text-white/72 sm:text-base">{wholesaleOffer.subtitle}</p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/35 px-5 py-4 text-left lg:min-w-[18rem]">
                <p className="text-lg font-semibold text-white">{wholesaleOffer.priceLabel}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/45">{wholesaleOffer.units}</p>
              </div>
            </div>
          </section>
        </section>

        <AnimatePresence>
          {cartCount > 0 ? (
            <m.button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Abrir modal de reserva"
              initial={{ opacity: 0, y: 18, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 18, x: '-50%' }}
              className="fixed bottom-24 left-1/2 z-50 flex w-[min(calc(100%-1.5rem),34rem)] items-center gap-3 rounded-full border border-neonPink/80 bg-black/92 px-4 py-3 text-neonPink shadow-[0_0_0_1px_rgba(255,105,180,0.8),0_0_22px_rgba(255,105,180,0.38)] backdrop-blur-xl sm:bottom-6"
            >
              <span className="cart-bubble min-w-10 rounded-full px-3 py-1 text-center text-sm font-black text-black">{cartCount}</span>
              <span className="flex min-w-0 flex-1 flex-col text-left">
                <span className="truncate text-[0.62rem] uppercase tracking-[0.32em] text-white/58">Checkout inteligente</span>
                <span className="truncate text-sm font-black uppercase tracking-[0.12em] text-white">Confirmar reserva por WhatsApp</span>
              </span>
              <span className="text-right text-sm font-semibold text-white">{formatPrice(cartTotal)}</span>
            </m.button>
          ) : null}
        </AnimatePresence>

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
          className="float-orbit fixed bottom-5 right-4 z-50 flex h-16 w-16 items-center justify-center rounded-full border border-[#25D366]/70 bg-black/90 shadow-[0_0_0_1px_rgba(37,211,102,0.7),0_0_22px_rgba(37,211,102,0.32)] sm:right-6"
        >
          <WhatsAppIcon />
        </a>

        <button
          type="button"
          aria-label="Abrir CubanitoBot AI"
          onClick={() => setChatOpen(true)}
          className="float-orbit fixed bottom-5 left-4 z-50 flex h-16 w-16 items-center justify-center rounded-full border border-neonCyan/70 bg-black/90 shadow-[0_0_0_1px_rgba(0,255,255,0.7),0_0_20px_rgba(0,255,255,0.22)] sm:left-6"
          style={{ animationDelay: '0.35s' }}
        >
          <BotIcon />
        </button>

        <AnimatePresence>
          {chatOpen ? (
            <m.div
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/82 p-4 backdrop-blur-md sm:items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <m.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[rgba(7,7,7,0.98)] p-5 glazed-panel"
              >
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.45em] text-neonCyan/70">IA de contacto</p>
                    <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.18em] text-white">CubanitoBot AI</h2>
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
                        className={`rounded-[1.4rem] border px-4 py-4 text-left text-sm uppercase tracking-[0.15em] transition ${
                          active
                            ? 'border-neonPink/75 bg-neonPink/10 text-white shadow-button'
                            : 'border-white/10 bg-white/[0.03] text-white/75 hover:border-neonCyan/55 hover:bg-neonCyan/5 hover:text-white'
                        }`}
                      >
                        {faq.question}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-[1.6rem] border border-neonCyan/25 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.45em] text-neonPink/70">Respuesta instantanea</p>
                  <p className="mt-3 text-balance text-base leading-7 text-white/88">{activeFaq.answer}</p>
                </div>
              </m.div>
            </m.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {cartOpen ? (
            <m.div
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/82 p-4 backdrop-blur-md sm:items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <m.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-[rgba(7,7,7,0.98)] p-5 glazed-panel"
              >
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.45em] text-neonPink/70">Checkout neon</p>
                    <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.16em] text-white">Revisa tu reserva</h2>
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

                <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr,0.85fr]">
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-black uppercase tracking-[0.14em] text-white">{item.name}</p>
                            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/45">Subtotal {formatPrice(item.price * item.quantity)}</p>
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

                  <div className="rounded-[1.6rem] border border-neonCyan/20 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-neonCyan/70">Datos de retiro</p>

                    <div className="mt-4 grid gap-3">
                      <label className="grid gap-2 text-xs uppercase tracking-[0.24em] text-white/55">
                        Nombre
                        <input
                          aria-label="Nombre"
                          value={customerDetails.name}
                          onChange={(event) => updateCustomerDetail('name', event.target.value)}
                          placeholder="Tu nombre"
                          className="rounded-[1.15rem] border border-white/10 bg-black/40 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-neonPink/60"
                        />
                      </label>

                      <label className="grid gap-2 text-xs uppercase tracking-[0.24em] text-white/55">
                        Direccion o punto de retiro
                        <input
                          aria-label="Direccion o punto de retiro"
                          value={customerDetails.address}
                          onChange={(event) => updateCustomerDetail('address', event.target.value)}
                          placeholder="Barrio, punto de entrega o retiro"
                          className="rounded-[1.15rem] border border-white/10 bg-black/40 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-neonPink/60"
                        />
                      </label>

                      <label className="grid gap-2 text-xs uppercase tracking-[0.24em] text-white/55">
                        Fecha de retiro
                        <input
                          aria-label="Fecha de retiro"
                          value={customerDetails.pickupDate}
                          onChange={(event) => updateCustomerDetail('pickupDate', event.target.value)}
                          placeholder="Ej: Sabado 18:00"
                          className="rounded-[1.15rem] border border-white/10 bg-black/40 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-neonPink/60"
                        />
                      </label>

                      <label className="grid gap-2 text-xs uppercase tracking-[0.24em] text-white/55">
                        Notas extra
                        <textarea
                          aria-label="Notas extra"
                          value={customerDetails.notes}
                          onChange={(event) => updateCustomerDetail('notes', event.target.value)}
                          placeholder="Ej: sin azucar glass, para cumple, entrega urgente"
                          rows={4}
                          className="resize-none rounded-[1.15rem] border border-white/10 bg-black/40 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-neonPink/60"
                        />
                      </label>
                    </div>

                    <div className="mt-5 rounded-[1.3rem] border border-white/10 bg-black/30 p-4">
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
              </m.div>
            </m.div>
          ) : null}
        </AnimatePresence>
      </main>
    </LazyMotion>
  );
}
