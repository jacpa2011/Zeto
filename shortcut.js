function formatupto2euro(location) {
    if (location.lte(1000)) {
    return `\u20ac${parseFloat(format(location)).toFixed(2)}`
    } else {
        return `\u20ac${format(location)}`
    }
}