import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { getCart, increaseItem, decreaseItem, removeItem } from "../utils/cart";

function CartSidebar({ isOpen, onClose }) {
    const [cart, setCart] = useState([]);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const sync = () => setCart(getCart());

        sync();
        window.addEventListener("cartUpdated", sync);

        return () => window.removeEventListener("cartUpdated", sync);
    }, []);

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const closeModal = () => {
        setIsClosing(true);
        setIsVisible(false);

        setTimeout(() => {
            setItemToRemove(null);
            setIsClosing(false);
        }, 250);
    };


    return (
        <>
            <div
                className={`ecom-cart-overlay ${isOpen ? "is-visible" : ""}`}
                onClick={onClose}
            />

            <div className={`ecom-cart ${isOpen ? "is-open" : ""}`}>

                <div className="ecom-cart__header">
                    <h3>Seu Carrinho</h3>
                    <button onClick={onClose}>✕</button>
                </div>

                <div className="ecom-cart__content">
                    {cart.length === 0 ? (
                        <p>Seu carrinho está vazio</p>
                    ) : (
                        cart.map(item => (
                            <div key={`${item.type}-${item.id}`} className="ecom-cart-item">
                                <img src={item.image} />

                                <div className="ecom-cart-item__info">

                                    {/* TOP */}
                                    <div className="ecom-cart-top">
                                        <h4>{item.title}</h4>

                                        <button
                                            className="delete"
                                            onClick={() => {
                                                setItemToRemove(item);
                                                setTimeout(() => setIsVisible(true), 10);
                                            }}                                        >
                                            <Icon icon="mdi:trash-can-outline" />
                                        </button>
                                    </div>

                                    {/* BOTTOM */}
                                    <div className="ecom-cart-bottom">
                                        <span className="price">
                                            R$ {item.price.toFixed(2)}
                                        </span>

                                        <div className="ecom-cart-actions">

                                            <button
                                                disabled={item.quantity === 1}
                                                className={item.quantity === 1 ? "disabled" : ""}
                                                onClick={() => decreaseItem(item)}
                                            >
                                                <Icon icon="mdi:minus" />
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button onClick={() => increaseItem(item)}>
                                                <Icon icon="mdi:plus" />
                                            </button>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="ecom-cart__footer">
                    <div className="ecom-cart-summary">
                        <span>{cart.length} itens</span>
                        <strong>R$ {total.toFixed(2)}</strong>
                    </div>

                    <button
                        className="ecom-cart__checkout"
                        onClick={() => {
                            onClose();
                            navigate("/checkout");
                        }}
                    >
                        Finalizar pedido
                    </button>
                </div>

                {itemToRemove && (
                    <>
                        <div className={`confirmation-delete-cart-overlay ${isVisible && !isClosing ? "is-visible" : ""}`}
                            onClick={() => {
                                closeModal();
                            }}
                        />

                        <div className={`confirmation-delete-cart ${isVisible && !isClosing ? "is-visible" : ""}`}>                            <h4>Remover item?</h4>
                            <p>Deseja remover "{itemToRemove.title}" do carrinho?</p>

                            <div className="confirmation-delete-cart__actions">
                                <button
                                    className="cancel"
                                    onClick={closeModal}
                                >
                                    Cancelar
                                </button>

                                <button
                                    className="confirm"
                                    onClick={() => {
                                        removeItem(itemToRemove);
                                        closeModal();
                                    }}
                                >
                                    Remover
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default CartSidebar;