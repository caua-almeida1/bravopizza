import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/loader.json";

import products from "../../data/products.json";
import combos from "../../data/combos.json";
import { searchItems } from "../../utils/search";
import Header from "../../components/Header";
import { addToCart } from "../../utils/cart";
import { getCart } from "../../utils/cart";
import CartSidebar from "../../components/CartSidebar";

function Search() {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);
    const [visibleCount, setVisibleCount] = useState(0);

    const query = new URLSearchParams(location.search).get("q") || "";

    const allItems = [
        ...products.map(p => ({ ...p, type: "p" })),
        ...combos.map(c => ({ ...c, type: "c" }))
    ];

    const { strongResults, suggestions } = useMemo(() => {
        const searched = searchItems(allItems, query);

        return {
            strongResults: searched.filter(item => item.score >= 0.6),
            suggestions: searched.filter(item => item.score < 0.6)
        };
    }, [query]);

    useEffect(() => {
        setLoading(true);
        setVisibleCount(0);

        const items = [...strongResults, ...suggestions];

        items.forEach((_, i) => {
            setTimeout(() => {
                setVisibleCount(prev => prev + 1);
            }, i * 220);
        });

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);

    }, [query, strongResults, suggestions]);

    const [search, setSearch] = useState(query);
    const [showItems, setShowItems] = useState(false);


    const handleSearch = () => {
        if (!search.trim()) return;

        navigate(`/search?q=${encodeURIComponent(search)}`);
    };



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    const animateToCart = (e, imageSrc) => {
        const img = document.createElement("img");
        img.src = imageSrc;

        const rect = e.target.closest(".ecom-product-card").getBoundingClientRect();
        const cartIcon = document.querySelector(".cart-icon");
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

    useEffect(() => {
        const sync = () => setCart(getCart());

        sync();
        window.addEventListener("cartUpdated", sync);

        return () => window.removeEventListener("cartUpdated", sync);
    }, []);

    const handleItemClick = (item) => {
        navigate(`/item/${item.type}-${item.id}`);
        setShowSuggestions(false);
    };

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

    return (
        <div className="ecom-search-page">
            {loading && (
                <div className="ecom-search-loading">
                    <div className="ecom-search-loading__content">
                        <Lottie
                            animationData={loadingAnimation}
                            loop
                            style={{ width: 110, height: 110 }}
                        />

                        <span className="ecom-search-loading__text">
                            Carregando<span className="dots"></span>
                        </span>
                    </div>
                </div>
            )}
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
                onItemClick={handleItemClick}
            />

            <>
                {strongResults.length > 0 && (
                    <section className="ecom-products">
                        <div className="ecom-products__container">

                            <h2 className="ecom-products__title">
                                Resultados para "{query}"
                            </h2>

                            <div className="ecom-products__grid">
                                {strongResults.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`ecom-product-card ${index < visibleCount ? "is-visible" : ""}`}
                                        onClick={() => navigate(`/item/${item.type}-${item.id}`)}
                                    >

                                        <div className="ecom-product-card__image">
                                            <img src={item.image} alt={item.title} />
                                        </div>

                                        <div className="ecom-product-card__content">
                                            <h3 className="ecom-product-card__title">
                                                {item.title}
                                            </h3>

                                            <p className="ecom-product-card__description">
                                                {item.description}
                                            </p>

                                            <div className="ecom-product-card__footer">
                                                <span className="ecom-product-card__price">
                                                    R$ {item.price.toFixed(2)}
                                                </span>

                                                <button
                                                    className="ecom-product-card__cart"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addToCart(item);
                                                        animateToCart(e, item.image);
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
                )}

                {suggestions.length > 0 && (
                    <section className="ecom-products">
                        <div className="ecom-products__container">

                            <h2 className="ecom-products__title">
                                Talvez você goste
                            </h2>

                            <div className="ecom-products__grid">
                                {suggestions.map((item, index) => {
                                    const globalIndex = strongResults.length + index;

                                    return (
                                        <div
                                            key={item.id}
                                            className={`ecom-product-card ${globalIndex < visibleCount ? "is-visible" : ""}`}
                                            style={{ transitionDelay: `${index * 80}ms` }}
                                            onClick={() => navigate(`/item/${item.type}-${item.id}`)}
                                        >

                                            <div className="ecom-product-card__image">
                                                <img src={item.image} alt={item.title} />
                                            </div>

                                            <div className="ecom-product-card__content">
                                                <h3 className="ecom-product-card__title">
                                                    {item.title}
                                                </h3>

                                                <p className="ecom-product-card__description">
                                                    {item.description}
                                                </p>

                                                <div className="ecom-product-card__footer">
                                                    <span className="ecom-product-card__price">
                                                        R$ {item.price.toFixed(2)}
                                                    </span>

                                                    <button
                                                        className="ecom-product-card__cart"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            addToCart(item);
                                                            animateToCart(e, item.image);
                                                        }}
                                                    >
                                                        Adicionar
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </section>
                )}

                {strongResults.length === 0 && (
                    <p className="ecom-search-empty">
                        Nenhum resultado encontrado para "{query}"
                    </p>
                )}

            </>
            <CartSidebar
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
            />
        </div>
    );
}

export default Search;