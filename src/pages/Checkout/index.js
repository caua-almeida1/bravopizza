import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Icon } from "@iconify/react";
import { getCart } from "../../utils/cart";

import logoHorizontal from '../../img/icon-horizontal.svg';
import logoCheckout from '../../img/checkout/logoCheckout.svg';
import masterCardLogo from '../../img/checkout/mastercardWide.png';
import cardChip from '../../img/checkout/card/cardChip.svg';

function Checkout() {
    const [timeLeft, setTimeLeft] = useState(300);
    const [cardNumber, setCardNumber] = useState("");
    const [isEditingCard, setIsEditingCard] = useState(false);
    const [cvv, setCvv] = useState("");
    const [isCvvModalOpen, setIsCvvModalOpen] = useState(false);
    const [isClosingCvvModal, setIsClosingCvvModal] = useState(false);
    const [expiryMonth, setExpiryMonth] = useState("");
    const [expiryYear, setExpiryYear] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isClosingPasswordModal, setIsClosingPasswordModal] = useState(false);

    const formatCardNumber = (value) => {
        return value
            .replace(/\D/g, "")
            .slice(0, 16);
    };

    const groupedNumbers = (cardNumber + "0000000000000000")
        .slice(0, 16)
        .match(/.{1,4}/g);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    clearInterval(interval);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");

    const navigate = useNavigate();
    const cart = getCart();

    const subtotal = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const closeCvvModal = () => {
        setIsClosingCvvModal(true);

        setTimeout(() => {
            setIsCvvModalOpen(false);
            setIsClosingCvvModal(false);
        }, 250);
    };

    return (
        <div className="ecom-checkout">

            <div className="ecom-checkout-header">

                <img
                    src={logoHorizontal}
                    className="ecom-checkout-header__logo"
                    onClick={() => navigate("/")}
                />

            </div>

            <div className="ecom-checkout__content">

                <div className="ecom-checkout__info">

                    <div className="ecom-checkout__info-header">

                        <img
                            src={logoCheckout}
                            className="ecom-checkout__platform-logo"
                        />

                        <div className="ecom-checkout__timer">

                            <div className="ecom-checkout__timer-group">
                                <div className="ecom-checkout__timer-digit">
                                    {minutes[0]}
                                </div>

                                <div className="ecom-checkout__timer-digit">
                                    {minutes[1]}
                                </div>
                            </div>

                            <span className="ecom-checkout__timer-separator">:</span>

                            <div className="ecom-checkout__timer-group">
                                <div className="ecom-checkout__timer-digit">
                                    {seconds[0]}
                                </div>

                                <div className="ecom-checkout__timer-digit">
                                    {seconds[1]}
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="ecom-checkout__section">

                        <div className="ecom-checkout__section-top">

                            <h2>Número do Cartão</h2>
                            <button
                                className="ecom-checkout__edit"
                                onClick={() => setIsEditingCard(prev => !prev)}
                            >

                                <Icon
                                    icon={
                                        isEditingCard
                                            ? "material-symbols:save"
                                            : "material-symbols:edit"
                                    }
                                    className="icon"
                                />

                                {isEditingCard ? "Salvar" : "Editar"}

                            </button>

                        </div>

                        <p className="ecom-checkout__description">
                            Para adicionar os 16 dígitos do cartão, informe os dados abaixo.
                        </p>

                        <div
                            className={`
                                ecom-checkout__card-input
                                ${isEditingCard ? "editing" : "locked"}
                            `}
                        >

                            <div className="ecom-checkout__card-left">

                                <div className="ecom-checkout__mastercard">
                                    <img src={masterCardLogo} />
                                </div>

                                <div className="ecom-checkout__card-display">

                                    <input
                                        type="text"
                                        value={cardNumber}
                                        disabled={!isEditingCard}
                                        onChange={(e) =>
                                            setCardNumber(formatCardNumber(e.target.value))
                                        }
                                        className="ecom-checkout__real-input"
                                        inputMode="numeric"
                                    />

                                    {groupedNumbers.map((group, index) => (
                                        <div
                                            key={index}
                                            className="ecom-checkout__card-group"
                                        >
                                            {group}

                                            {index < 3 && (
                                                <span className="ecom-checkout__dash">
                                                    -
                                                </span>
                                            )}
                                        </div>
                                    ))}

                                </div>

                            </div>

                            <div className="ecom-checkout__card-check">

                                {!isEditingCard && (
                                    <span className="ecom-checkout__seal-splash"></span>
                                )}

                                <Icon
                                    icon="ph:seal-check-fill"
                                    className={`
                                    ecom-checkout__seal
                                    ${!isEditingCard ? "active" : ""}
                                `}
                                />

                            </div>

                        </div>

                        <div className="ecom-checkout__cvv-row">

                            <div className="ecom-checkout__cvv-content">

                                <h2>Número CVV</h2>

                                <p className="ecom-checkout__description">
                                    Digite o código de segurança do cartão.
                                </p>

                            </div>

                            <button
                                className="ecom-checkout__cvv-input"
                                onClick={() => setIsCvvModalOpen(true)}
                            >

                                <span>
                                    {cvv || "•••"}
                                </span>

                                <Icon
                                    icon="eva:keypad-fill"
                                    className="icon"
                                />

                            </button>

                        </div>

                        <div className="ecom-checkout__cvv-row">

                            <div className="ecom-checkout__cvv-content">

                                <h2>Data de validade</h2>

                                <p className="ecom-checkout__description">
                                    Informe o mês e ano de validade.
                                </p>

                            </div>

                            <div className="ecom-checkout__expiry-inputs">

                                <input
                                    type="text"
                                    placeholder="MM"
                                    maxLength={2}
                                    value={expiryMonth}
                                    onChange={(e) => {
                                        let value = e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 2);

                                        if (value.length === 2) {
                                            const month = parseInt(value, 10);

                                            if (month < 1) {
                                                value = "01";
                                            } else if (month > 12) {
                                                value = "12";
                                            } else {
                                                value = String(month).padStart(2, "0");
                                            }
                                        }

                                        setExpiryMonth(value);
                                    }}
                                    className="ecom-checkout__expiry-input"
                                />

                                <span className="ecom-checkout__expiry-separator">/</span>

                                <input
                                    type="text"
                                    placeholder="AA"
                                    maxLength={2}
                                    value={expiryYear}
                                    onChange={(e) => {
                                        let value = e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 2);

                                        if (value.length === 2) {
                                            const year = parseInt(value, 10);

                                            if (year < 26) {
                                                value = "26";
                                            } else if (year > 99) {
                                                value = "99";
                                            }
                                        }

                                        setExpiryYear(value);
                                    }}
                                    className="ecom-checkout__expiry-input"
                                />

                            </div>

                        </div>

                        <div className="ecom-checkout__cvv-row">

                            <div className="ecom-checkout__cvv-content">

                                <h2>Senha do cartão</h2>

                                <p className="ecom-checkout__description">
                                    Digite a senha de 4 dígitos do cartão.
                                </p>

                            </div>

                            <button
                                className="ecom-checkout__cvv-input"
                                onClick={() => setIsPasswordModalOpen(true)}
                            >

                                <span>
                                    {password
                                        ? "•".repeat(password.length)
                                        : "••••"
                                    }
                                </span>

                                <Icon
                                    icon="solar:lock-password-bold"
                                    className="icon"
                                />

                            </button>

                        </div>

                        <button className="ecom-checkout__confirm-button">
                            Confirmar pedido
                        </button>

                    </div>

                </div>

                <div className="ecom-checkout__summary">
                    <div className="ecom-checkout__floating-card-circle" />

                    <div className="ecom-checkout__floating-card">

                        <svg
                            className="ecom-checkout__floating-card-noise"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 700 700"
                            preserveAspectRatio="none"
                        >
                            <defs>
                                <filter
                                    id="nnnoise-filter"
                                    x="-20%"
                                    y="-20%"
                                    width="140%"
                                    height="140%"
                                    filterUnits="objectBoundingBox"
                                    primitiveUnits="userSpaceOnUse"
                                    colorInterpolationFilters="linearRGB"
                                >
                                    <feTurbulence
                                        type="fractalNoise"
                                        baseFrequency="0.104"
                                        numOctaves="4"
                                        seed="15"
                                        stitchTiles="stitch"
                                        result="turbulence"
                                    />

                                    <feSpecularLighting
                                        surfaceScale="15"
                                        specularConstant="0.6"
                                        specularExponent="20"
                                        lightingColor="#a6a6a6"
                                        in="turbulence"
                                        result="specularLighting"
                                    >
                                        <feDistantLight
                                            azimuth="3"
                                            elevation="125"
                                        />
                                    </feSpecularLighting>
                                </filter>
                            </defs>

                            <rect
                                width="700"
                                height="700"
                                fill="transparent"
                            />

                            <rect
                                width="700"
                                height="700"
                                fill="#a6a6a6"
                                filter="url(#nnnoise-filter)"
                            />
                        </svg>
                        <div className="ecom-checkout__floating-card-top">
                            <img
                                src={cardChip}
                                className="ecom-checkout__floating-card-chip"
                            />

                            <Icon
                                icon="mdi:contactless-payment"
                                className="ecom-checkout__floating-card-contactless"
                            />

                        </div>

                        <div className="ecom-checkout__floating-card-bottom">

                            <span className="ecom-checkout__floating-card-name">
                                Caua G Almeida
                            </span>

                            <span className="ecom-checkout__floating-card-number">

                                <span className="ecom-checkout__floating-card-dots">
                                    ••••
                                </span>

                                {groupedNumbers?.[3] || "0000"}

                            </span>

                            <div className="ecom-checkout__floating-card-footer">

                                <div className="ecom-checkout__floating-card-expiry">

                                    <span className="value">

                                        {expiryMonth
                                            ? expiryMonth.padStart(2, "0")
                                            : "00"}
                                        /
                                        {expiryYear || "00"}

                                    </span>

                                </div>

                                <Icon
                                    icon="logos:mastercard"
                                    className="ecom-checkout__floating-card-mastercard"
                                />

                            </div>

                        </div>

                    </div>
                    <div className="ecom-checkout__summary-content">

                        {cart.map(item => (
                            <div
                                key={item.id}
                                className="ecom-checkout__item"
                            >

                                <div className="ecom-checkout__item-left">

                                    <span className="ecom-checkout__item-title">
                                        {item.title}
                                    </span>

                                    <span className="ecom-checkout__item-quantity">
                                        x{item.quantity}
                                    </span>

                                </div>

                                <strong>
                                    R${(item.price * item.quantity).toFixed(2)}
                                </strong>

                            </div>
                        ))}

                    </div>

                    <div className="ecom-checkout__summary-bottom">

                        <span className="ecom-checkout__summary-label">
                            Você tem que pagar
                        </span>

                        <div className="ecom-checkout__summary-price-row">

                            <strong className="ecom-checkout__summary-price">

                                {subtotal.toFixed(2).split(".")[0]}

                                <span className="ecom-checkout__summary-cents">
                                    .{subtotal.toFixed(2).split(".")[1]}
                                </span>

                            </strong>

                            <span className="ecom-checkout__summary-currency">
                                BRL
                            </span>

                            <Icon
                                icon="basil:invoice-outline"
                                className="ecom-checkout__summary-icon"
                            />

                        </div>

                    </div>

                </div>

            </div>
            {isCvvModalOpen && (

                <div
                    className={`
                        ecom-checkout__cvv-modal-overlay
                        ${isClosingCvvModal ? "closing" : ""}
                    `}
                    onClick={closeCvvModal}
                >
                    <div
                        className={`
                            ecom-checkout__cvv-modal
                            ${isClosingCvvModal ? "closing" : ""}
                        `}
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="ecom-checkout__cvv-modal-top">

                            <h3>Digite o CVV</h3>

                            <button
                                onClick={() => closeCvvModal()}
                            >
                                <Icon icon="material-symbols:close-rounded" />
                            </button>

                        </div>

                        <div className="ecom-checkout__cvv-display">
                            {cvv.padEnd(3, "•")}
                        </div>

                        <div className="ecom-checkout__keypad">

                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                                <button
                                    key={number}
                                    onClick={() => {
                                        if (cvv.length < 3) {
                                            setCvv(prev => prev + number);
                                        }
                                    }}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() => setCvv("")}
                            >
                                C
                            </button>

                            <button
                                onClick={() => {
                                    if (cvv.length < 3) {
                                        setCvv(prev => prev + "0");
                                    }
                                }}
                            >
                                0
                            </button>

                            <button
                                onClick={() =>
                                    setCvv(prev => prev.slice(0, -1))
                                }
                            >
                                <Icon icon="solar:backspace-bold" />
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {isPasswordModalOpen && (

                <div
                    className={`
            ecom-checkout__cvv-modal-overlay
            ${isClosingPasswordModal ? "closing" : ""}
        `}
                    onClick={() => {
                        setIsClosingPasswordModal(true);

                        setTimeout(() => {
                            setIsPasswordModalOpen(false);
                            setIsClosingPasswordModal(false);
                        }, 250);
                    }}
                >

                    <div
                        className={`
                ecom-checkout__cvv-modal
                ${isClosingPasswordModal ? "closing" : ""}
            `}
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="ecom-checkout__cvv-modal-top">

                            <h3>Digite a senha</h3>

                            <button
                                onClick={() => {
                                    setIsClosingPasswordModal(true);

                                    setTimeout(() => {
                                        setIsPasswordModalOpen(false);
                                        setIsClosingPasswordModal(false);
                                    }, 250);
                                }}
                            >
                                <Icon icon="material-symbols:close-rounded" />
                            </button>

                        </div>

                        <div className="ecom-checkout__cvv-display">
                            {"•".repeat(password.length).padEnd(4, "•")}
                        </div>

                        <div className="ecom-checkout__keypad">

                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                                <button
                                    key={number}
                                    onClick={() => {
                                        if (password.length < 4) {
                                            setPassword(prev => prev + number);
                                        }
                                    }}
                                >
                                    {number}
                                </button>
                            ))}

                            <button onClick={() => setPassword("")}>
                                C
                            </button>

                            <button
                                onClick={() => {
                                    if (password.length < 4) {
                                        setPassword(prev => prev + "0");
                                    }
                                }}
                            >
                                0
                            </button>

                            <button
                                onClick={() =>
                                    setPassword(prev => prev.slice(0, -1))
                                }
                            >
                                <Icon icon="solar:backspace-bold" />
                            </button>

                        </div>

                    </div>

                </div>

            )}
        </div>

    );
}

export default Checkout;