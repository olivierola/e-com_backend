function formatCurrency(value) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(value);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
}

function formatPercentage(value) {
    return `${value.toFixed(2)}%`;
}

export { formatCurrency, formatDate, formatPercentage };