import logoHorizontal from '../../img/icon-horizontal.svg';

import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Icon } from '@iconify/react';
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/loader.json";

import bannerPromo1 from "../../img/banner-1.png"
import bannerPromo2 from "../../img/banner-2.png"
import bannerPromo3 from "../../img/banner-3.png"

import products from "../../data/products.json";
import combos from "../../data/combos.json";
import { getCart, updateCart } from "../../utils/cart";
import CartSidebar from "../../components/CartSidebar";
import Header from "../../components/Header"

function Home() {
    const [visibleCount, setVisibleCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [relatedItems, setRelatedItems] = useState([]);

    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(1);
    const [transitionEnabled, setTransitionEnabled] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [search, setSearch] = useState("");
    const searchRef = useRef(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const location = useLocation();
    const fromLogin = location.state?.fromLogin;
    const [loading, setLoading] = useState(!fromLogin);
    const handleSearch = () => {
        if (!search.trim()) return;

        navigate(`/search?q=${encodeURIComponent(search)}`);
    };

    useEffect(() => {
        if (location.state?.openCart) {
            setCartOpen(true);
        }
    }, [location.state]);

    const total = cart.reduce((acc, item) => {
        return acc + item.price * item.quantity;
    }, 0);

    const slides = [
        bannerPromo3,
        bannerPromo1,
        bannerPromo2
    ];

    const bannerRoutes = {
        0: "/item/p-1",
        1: "/item/p-1",
        2: "/item/c-2",
    };

    const extendedSlides = [
        slides[slides.length - 1],
        ...slides,
        slides[0],
    ];

    useEffect(() => {

        if (fromLogin) return;

        setLoading(true);
        setVisibleCount(0);

        const cards = allItems.slice(0, 12);

        cards.forEach((_, i) => {
            setTimeout(() => {
                setVisibleCount(prev => prev + 1);
            }, i * 90);
        });

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);

    }, [fromLogin]);

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 4000);

        return () => clearInterval(interval);
    }, [isAnimating]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (cartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [cartOpen]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    useEffect(() => {
        const sync = () => setCart(getCart());

        sync();

        window.addEventListener("cartUpdated", sync);

        return () => window.removeEventListener("cartUpdated", sync);
    }, []);

    const handleNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => prev + 1);
    };

    const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => prev - 1);
    };

    useEffect(() => {
        if (!transitionEnabled) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTransitionEnabled(true);
                });
            });
        }
    }, [transitionEnabled]);

    const goToSlide = (index) => {
        if (isAnimating) return;

        setIsAnimating(true);
        setCurrentIndex(index + 1);
    };

    const realIndex =
        currentIndex === 0
            ? slides.length - 1
            : currentIndex === slides.length + 1
                ? 0
                : currentIndex - 1;
    useEffect(() => {
        const handleTransitionEnd = () => {
            setIsAnimating(false);

            if (currentIndex === 0) {
                setTransitionEnabled(false);
                setCurrentIndex(slides.length);
            }

            if (currentIndex === slides.length + 1) {
                setTransitionEnabled(false);
                setCurrentIndex(1);
            }
        };

        const slider = document.querySelector(".ecom-banner__slider");

        if (!slider) return;

        slider.addEventListener("transitionend", handleTransitionEnd);

        return () => {
            slider.removeEventListener("transitionend", handleTransitionEnd);
        };
    }, [currentIndex, slides.length, loading]);

    const shuffleArray = (array) => {
        const shuffled = [...array];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    };

    const allItems = [
        ...products.map(p => ({ ...p, type: "p" })),
        ...combos.map(c => ({ ...c, type: "c" }))
    ];

    const filteredItems = useMemo(() => {
        if (!search) {
            return allItems
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);
        }

        return allItems
            .filter(item =>
                item.title.toLowerCase().includes(search.toLowerCase())
            )
            .slice(0, 3);
    }, [search]);

    const addToCart = (item) => {
        const current = getCart();

        const existing = current.find(p => p.id === item.id && p.type === item.type);

        let updated;

        if (existing) {
            updated = current.map(p =>
                p.id === item.id && p.type === item.type
                    ? { ...p, quantity: p.quantity + 1 }
                    : p
            );
        } else {
            updated = [...current, { ...item, quantity: 1 }];
        }

        updateCart(updated);
    };

    const animateToCart = (e, imageSrc) => {
        const img = document.createElement("img");
        img.src = imageSrc;

        const rect = e.target.closest(".ecom-product-card").getBoundingClientRect();
        const cartIcon = document.querySelector(".ecom-header__cart");

        const cartRect = cartIcon.getBoundingClientRect();

        img.style.position = "fixed";
        img.style.left = rect.left + "px";
        img.style.top = rect.top + "px";
        img.style.width = "80px";
        img.style.height = "80px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "10px";
        img.style.zIndex = 9999;
        img.style.transition = "all 0.8s cubic-bezier(.4,0,.2,1)";

        document.body.appendChild(img);

        requestAnimationFrame(() => {
            img.style.left = cartRect.left + "px";
            img.style.top = cartRect.top + "px";
            img.style.width = "20px";
            img.style.height = "20px";
            img.style.opacity = 0;
        });

        setTimeout(() => {
            img.remove();
        }, 800);
    };

    return (
        <>
            {loading && (
                <div className="ecom-login-loading">
                    <div className="ecom-login-loading__content">

                        <Lottie
                            animationData={loadingAnimation}
                            loop
                            style={{ width: 110, height: 110 }}
                        />

                        <span className="ecom-login-loading__text">
                            Carregando<span className="dots"></span>
                        </span>

                    </div>
                </div>
            )}

            <div className="ecom-app">

                <Header
                    search={search}
                    setSearch={setSearch}
                    onSearch={handleSearch}
                    cart={cart}
                    onCartClick={() => setCartOpen(true)}
                    searchRef={searchRef}
                    showSuggestions={showSuggestions}
                    filteredItems={filteredItems}
                    setShowSuggestions={setShowSuggestions}
                    onItemClick={(item) => {
                        navigate(`/item/${item.type}-${item.id}`);
                        setShowSuggestions(false);
                    }}
                />

                {/* ================= CATEGORIAS ================= */}

                <nav className="ecom-categories">
                    <div className="ecom-categories__container">

                        <div className="ecom-categories__scroll">
                            <button className="ecom-categories__item is-active">Tradicionais</button>
                            <button className="ecom-categories__item">Especiais</button>
                            <button className="ecom-categories__item">Gourmet</button>
                            <button className="ecom-categories__item">Premium</button>
                            <button className="ecom-categories__item">Vegetariana</button>
                            <button className="ecom-categories__item">Vegana</button>
                            <button className="ecom-categories__item">Sem Glúten</button>
                            <button className="ecom-categories__item">Sem Lactose</button>
                            <button className="ecom-categories__item">Apimentadas</button>
                            <button className="ecom-categories__item">Regionais</button>
                            <button className="ecom-categories__item">Internacionais</button>
                            <button className="ecom-categories__item">Doces</button>
                            <button className="ecom-categories__item">Brotinho</button>
                            <button className="ecom-categories__item">Grande</button>
                            <button className="ecom-categories__item">Família</button>
                            <button className="ecom-categories__item">Calzones</button>
                            <button className="ecom-categories__item">Massas</button>
                            <button className="ecom-categories__item">Entradas</button>
                            <button className="ecom-categories__item">Combos</button>
                            <button className="ecom-categories__item">Bebidas</button>
                            <button className="ecom-categories__item">Bordas Recheadas</button>

                        </div>
                    </div>
                </nav>

                {/* ================= BANNER ================= */}

                <section className="ecom-banner">
                    <div className="ecom-banner__container">

                        <div className="ecom-banner__wrapper">

                            <div
                                className="ecom-banner__slider"
                                style={{
                                    transform: `translateX(-${currentIndex * 100}%)`,
                                    transition: transitionEnabled ? "transform 0.6s ease" : "none"
                                }}
                            >
                                {extendedSlides.map((slide, index) => {
                                    let realSlideIndex = index - 1;

                                    if (realSlideIndex < 0) realSlideIndex = slides.length - 1;
                                    if (realSlideIndex >= slides.length) realSlideIndex = 0;

                                    return (
                                        <div
                                            className="ecom-banner__slide"
                                            key={index}
                                            onClick={() => navigate(bannerRoutes[realSlideIndex])}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <img src={slide} alt="Banner Promocional" />
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                className="ecom-banner__arrow ecom-banner__arrow--left"
                                onClick={handlePrev}
                            >
                                <Icon icon="mdi:chevron-left" />
                            </button>

                            <button
                                className="ecom-banner__arrow ecom-banner__arrow--right"
                                onClick={handleNext}
                            >
                                <Icon icon="mdi:chevron-right" />
                            </button>

                            <div className="ecom-banner__indicators">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`ecom-banner__indicator ${realIndex === index ? "is-active" : ""
                                            }`}
                                        onClick={() => goToSlide(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= MAIS VENDIDOS ================= */}

                <section className="ecom-products">
                    <div className="ecom-products__container">

                        <h2 className="ecom-products__title">
                            Mais Vendidos
                        </h2>

                        <div className="ecom-products__grid">
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className={`ecom-product-card ${index < visibleCount ? "is-visible" : ""
                                        }`}
                                    onClick={() => navigate(`/item/p-${product.id}`)}
                                >

                                    <div className="ecom-product-card__image">
                                        <img src={product.image} alt={product.title} />
                                    </div>

                                    <div className="ecom-product-card__content">
                                        <h3 className="ecom-product-card__title">
                                            {product.title}
                                        </h3>

                                        <p className="ecom-product-card__description">
                                            {product.description}
                                        </p>

                                        <div className="ecom-product-card__footer">
                                            <span className="ecom-product-card__price">
                                                R$ {product.price.toFixed(2)}
                                            </span>

                                            <button
                                                className="ecom-product-card__cart"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart({ ...product, type: "p" });
                                                    animateToCart(e, product.image);
                                                }}
                                            >
                                                Adicionar
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </section>

                {/* ================= COMBOS ================= */}

                <section className="ecom-products">
                    <div className="ecom-products__container">

                        <h2 className="ecom-products__title">
                            Combos Especiais
                        </h2>

                        <div className="ecom-products__grid">
                            {combos.map((combo, index) => (
                                <div
                                    key={combo.id}
                                    className={`ecom-product-card ${index < visibleCount ? "is-visible" : ""
                                        }`}
                                    onClick={() => navigate(`/item/c-${combo.id}`)}
                                >

                                    <div className="ecom-product-card__image">
                                        <img src={combo.image} alt={combo.title} />
                                    </div>

                                    <div className="ecom-product-card__content">
                                        <h3 className="ecom-product-card__title">
                                            {combo.title}
                                        </h3>

                                        <p className="ecom-product-card__description">
                                            {combo.description}
                                        </p>

                                        <div className="ecom-product-card__footer">
                                            <span className="ecom-product-card__price">
                                                R$ {combo.price.toFixed(2)}
                                            </span>

                                            <button
                                                className="ecom-product-card__cart"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart({ ...combo, type: "c" });
                                                    animateToCart(e, combo.image);
                                                }}
                                            >
                                                Adicionar
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </section>
                <CartSidebar
                    isOpen={cartOpen}
                    onClose={() => setCartOpen(false)}
                />
            </div>
        </>
    );
}

export default Home;