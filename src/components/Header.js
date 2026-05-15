import logoHorizontal from '../img/icon-horizontal.svg';
import { Icon } from '@iconify/react';
import { useNavigate } from "react-router-dom";

function Header({
    search = "",
    setSearch = () => { },
    onSearch = () => { },
    cart = [],
    onCartClick = () => { },
    searchRef = null,
    showSuggestions = false,
    filteredItems = [],
    onItemClick = () => { },
    setShowSuggestions = () => { }
}) {
    const navigate = useNavigate();

    return (
        <header className="ecom-header">
            <div className="ecom-header__container">

                <div
                    className="ecom-header__logo"
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                >
                    <img src={logoHorizontal} />
                </div>

                <div className="ecom-header__search" ref={searchRef}>

                    <div className="ecom-header__search-wrapper">

                        <input
                            type="text"
                            value={search}
                            onFocus={() => setShowSuggestions(true)}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") onSearch();
                            }}
                            placeholder="Buscar produtos..."
                            className="ecom-header__input"
                        />

                        <button
                            className="ecom-header__search-button"
                            onClick={onSearch}
                        >
                            <Icon icon="iconamoon:search" />
                        </button>

                        <div className={`ecom-search-suggestions ${showSuggestions && filteredItems.length ? "is-visible" : ""}`}>
                            {filteredItems.map(item => (
                                <div
                                    key={item.id}
                                    className="ecom-search-item"
                                    onClick={() => onItemClick(item)}
                                >
                                    <div className="ecom-search-left">
                                        <img src={item.image} />
                                        <span>{item.title}</span>
                                    </div>

                                    <strong>R$ {item.price.toFixed(2)}</strong>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                <div
                    className="ecom-header__account"
                    onClick={() => navigate("/login")}
                >
                    <Icon icon="mdi:account-outline" className='ecom-header__icon' />
                    <span>Entrar</span>
                </div>

                <div
                    className="ecom-header__cart"
                    onClick={onCartClick}
                >
                    <div className="cart-icon">
                        <Icon icon="boxicons:cart" />

                        {cart.length > 0 && (
                            <span className="cart-badge">
                                {cart.reduce((acc, i) => acc + i.quantity, 0)}
                            </span>
                        )}
                    </div>

                    <span>Carrinho</span>
                </div>

            </div>
        </header>
    );
}

export default Header;