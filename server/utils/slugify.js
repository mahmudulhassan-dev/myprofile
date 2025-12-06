
const slugify = (text, options = {}) => {
    if (!text) return '';
    let str = text.toString();
    if (options.lower) str = str.toLowerCase();

    // Remove accents
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Basic slugify logic
    const replacement = options.replacement || '-';

    if (options.strict) {
        // Strict: remove special chars
        str = str.replace(/[^a-zA-Z0-9 ]/g, '');
    }

    // Replace spaces with replacement
    str = str.trim().replace(/\s+/g, replacement);

    return str;
};
export default slugify;
