export const similarity = (a, b) => {
    a = a.toLowerCase();
    b = b.toLowerCase();

    if (a.includes(b)) return 1;

    let matches = 0;

    for (let char of b) {
        if (a.includes(char)) matches++;
    }

    return matches / b.length;
};

export const searchItems = (items, query) => {
    if (!query) return items;

    return items
        .map(item => ({
            ...item,
            score: similarity(item.title, query)
        }))
        .filter(item => item.score > 0.3)
        .sort((a, b) => b.score - a.score);
};