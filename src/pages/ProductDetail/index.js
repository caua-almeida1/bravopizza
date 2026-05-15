import logoHorizontal from '../../img/icon-horizontal.svg';

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Icon } from '@iconify/react';

import products from "../../data/products.json";
import combos from "../../data/combos.json";
import { getCart, addToCart } from "../../utils/cart";
import CartSidebar from "../../components/CartSidebar";

function ProductDetail() {
    const [cart, setCart] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [animateIn, setAnimateIn] = useState(false);

    const [relatedItems, setRelatedItems] = useState([]);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const t = setTimeout(() => setAnimateIn(true), 50);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const sync = () => setCart(getCart());

        sync();

        window.addEventListener("cartUpdated", sync);

        return () => window.removeEventListener("cartUpdated", sync);
    }, []);

    useEffect(() => {
        setCart(getCart());
    }, []);

    const animateToCart = (e, imageSrc) => {
        const img = document.createElement("img");
        img.src = imageSrc;

        const origin =
            e.target.closest(".ecom-product-card") ||
            e.target.closest(".ecom-related-card") ||
            e.target.closest(".ecom-detail__actions");

        const rect = origin.getBoundingClientRect();
        const cartIcon = document.querySelector(".cart-icon");

        const cartRect = cartIcon.getBoundingClientRect();

        img.style.position = "fixed";
        img.style.left = rect.left + "px";
        img.style.top = rect.top + "px";
        img.style.width = "80px";
        img.style.height = "80px";
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

        setTimeout(() => img.remove(), 800);
    };

    const allItems = [
        ...products.map(item => ({ ...item, _type: "product", _uid: `p-${item.id}` })),
        ...combos.map(item => ({ ...item, _type: "combo", _uid: `c-${item.id}` }))
    ];

    const selectedItem = allItems.find(
        item => item._uid === id
    );

    useEffect(() => {
        if (!selectedItem) return;

        // remove o item atual
        const filtered = allItems.filter(
            item => item._uid !== selectedItem._uid
        );

        // embaralha (Fisher-Yates)
        const shuffled = [...filtered];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const limited = shuffled.slice(0, 6);

        setRelatedItems(limited);

    }, [id]);

    useEffect(() => {
        setQuantity(1);
    }, [id]);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const getServeIcon = () => {
        if (!selectedItem?.serves) return null;

        if (selectedItem.serves === 1) {
            return <Icon icon="garden:user-solo-fill-12" />;
        }

        if (selectedItem.serves === 2) {
            return <Icon icon="bi:people-fill" />;
        }

        return <Icon icon="mingcute:group-3-fill" />;
    };

    if (!selectedItem) return <div>Produto não encontrado</div>;

    const handleOpenCart = () => {
        setCartOpen(true);
    };
    return (
        <div className="ecom-detail is-active">

            {/* HEADER */}
            <div className="ecom-detail__header">
                <button
                    className="ecom-detail__back"
                    onClick={() => navigate("/")}
                >
                    <Icon icon="mdi:arrow-left" />
                </button>

                <img onClick={() => navigate("/")} src={logoHorizontal} className="ecom-detail__logo" />

                <div className="ecom-detail__header-actions">

                    <Icon className='icon' icon="mi:user" onClick={() => navigate("/login")}
                    />

                    <div className="cart-icon" onClick={handleOpenCart}>
                        <Icon icon="boxicons:cart" />

                        {cart.length > 0 && (
                            <span className="cart-badge">
                                {cart.reduce((acc, i) => acc + i.quantity, 0)}
                            </span>
                        )}
                    </div>

                </div>
            </div>

            {/* BODY */}
            <div className="ecom-detail__container">

                {/* LEFT */}
                <div className={`ecom-detail__left ${animateIn ? "is-visible" : ""}`}>

                    <div className="ecom-detail__topbar">
                        <div className="ecom-detail__serve">
                            {getServeIcon()}

                            <div className="ecom-detail__tooltip">
                                Serve {selectedItem.serves} pessoa{selectedItem.serves > 1 ? "s" : ""}
                            </div>
                        </div>
                    </div>

                    <div className="ecom-detail__content">
                        <div className="ecom-detail__center">

                            <div className="ecom-detail__top">
                                <img
                                    src={selectedItem.image}
                                    className="ecom-detail__image"
                                />
                            </div>

                            <div className="ecom-detail__info">
                                <h2>{selectedItem.title}</h2>

                                <div className="ecom-detail__nutrition">
                                    <span>Gordura - <strong>{selectedItem.nutrition.fat}g</strong></span>
                                    <span>Carboidratos - <strong>{selectedItem.nutrition.carbs}g</strong></span>
                                    <span>Açúcar - <strong>{selectedItem.nutrition.sugar}g</strong></span>
                                    <span>Sal - <strong>{selectedItem.nutrition.salt}g</strong></span>
                                </div>

                                <p className="ecom-detail__desc">
                                    {selectedItem.description}
                                </p>
                            </div>

                            <div className="ecom-detail__actions">

                                <div className="ecom-actions__left">
                                    <div className="ecom-qty">
                                        <button
                                            className={quantity === 1 ? "ecom-qty-btn-minus disabled" : "ecom-qty-btn-minus"}
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        >
                                            -
                                        </button>

                                        <span>{quantity}</span>

                                        <button onClick={() => setQuantity(q => q + 1)}>
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="ecom-actions__right">
                                    <div className="ecom-detail__price">
                                        R$ {(selectedItem.price * quantity).toFixed(2)}
                                    </div>

                                    <button
                                        className="ecom-detail__btn"
                                        onClick={(e) => {
                                            addToCart({
                                                ...selectedItem,
                                                type: selectedItem._type === "product" ? "p" : "c"
                                            }, quantity);

                                            animateToCart(e, selectedItem.image);
                                        }}
                                    >
                                        <span className="ecom-detail__cart-icon">
                                            <Icon icon="bi:cart2" />
                                        </span>
                                        <span className="ecom-detail__btn-text">
                                            Adicionar ao carrinho
                                        </span>
                                    </button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="ecom-detail__right">

                    {relatedItems.map((item, index) => (
                        <div
                            key={item._uid}
                            className={`ecom-related-card ${animateIn ? "is-visible" : ""}`}
                            style={{ transitionDelay: `${index * 0.08}s` }}
                            onClick={() => navigate(`/item/${item._uid}`)}
                        >

                            {item.serves && (
                                <div className="ecom-related__serve">
                                    {item.serves === 1 && <Icon icon="garden:user-solo-fill-12" />}
                                    {item.serves === 2 && <Icon icon="bi:people-fill" />}
                                    {item.serves > 2 && <Icon icon="mingcute:group-3-fill" />}

                                    <div className="ecom-related__tooltip">
                                        Serve {item.serves} pessoa{item.serves > 1 ? "s" : ""}
                                    </div>
                                </div>
                            )}

                            <div className="ecom-related__content">
                                <img src={item.image} />
                                <h4>{item.title}</h4>

                                <p className="ecom-related__desc">
                                    {item.description.length > 90
                                        ? item.description.slice(0, 90) + "..."
                                        : item.description}
                                </p>
                            </div>

                            <div className="ecom-related__actions">
                                <div className="ecom-qty">
                                    <button>-</button>
                                    <span>1</span>
                                    <button>+</button>
                                </div>

                                <div className="ecom-related__right">
                                    <span className="ecom-related__price">
                                        R$ {item.price.toFixed(2)}
                                    </span>
                                    <button
                                        className="ecom-related__btn"
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            addToCart({
                                                ...item,
                                                type: item._type === "product" ? "p" : "c"
                                            }, 1);

                                            animateToCart(e, item.image);
                                        }}
                                    >
                                        <Icon icon="bi:cart2" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}

                </div>

            </div>
            <CartSidebar
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
            />
        </div>
    );
}

export default ProductDetail;