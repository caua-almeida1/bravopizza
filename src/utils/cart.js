export const getCart = () => {
    return JSON.parse(localStorage.getItem("cart") || "[]");
};

export const updateCart = (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated")); // 🔥 segredo
};

export const addToCart = (item, qty = 1) => {
    const cart = getCart();

    const existing = cart.find(p => p.id === item.id && p.type === item.type);

    let updated;

    if (existing) {
        updated = cart.map(p =>
            p.id === item.id && p.type === item.type
                ? { ...p, quantity: p.quantity + qty }
                : p
        );
    } else {
        updated = [...cart, { ...item, quantity: qty }];
    }

    updateCart(updated);
    return updated;
};

export const increaseItem = (item) => {
    const cart = getCart();

    const updated = cart.map(p =>
        p.id === item.id && p.type === item.type
            ? { ...p, quantity: p.quantity + 1 }
            : p
    );

    updateCart(updated);
};

export const decreaseItem = (item) => {
    const cart = getCart();

    const updated = cart
        .map(p =>
            p.id === item.id && p.type === item.type
                ? { ...p, quantity: p.quantity - 1 }
                : p
        )
        .filter(p => p.quantity > 0);

    updateCart(updated);
};

export const removeItem = (item) => {
    const cart = getCart();

    const updated = cart.filter(
        p => !(p.id === item.id && p.type === item.type)
    );

    updateCart(updated);
};