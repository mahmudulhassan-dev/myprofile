import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Product = sequelize.define('Product', {
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    type: { type: DataTypes.ENUM('simple', 'variable', 'digital', 'downloadable', 'subscription', 'grouped'), defaultValue: 'simple' },
    status: { type: DataTypes.ENUM('draft', 'published', 'scheduled', 'private', 'archived'), defaultValue: 'draft' },
    sku: { type: DataTypes.STRING, unique: true },
    short_description: DataTypes.TEXT,
    description: DataTypes.TEXT('long'),
    featured_image: DataTypes.STRING,
    gallery: { type: DataTypes.JSON, defaultValue: [] },
    video_url: DataTypes.STRING,
    three_sixty_view_images: { type: DataTypes.JSON, defaultValue: [] },
    regular_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    sale_price: { type: DataTypes.DECIMAL(10, 2) },
    sale_start_date: DataTypes.DATE,
    sale_end_date: DataTypes.DATE,
    cost_price: { type: DataTypes.DECIMAL(10, 2) },
    tax_status: { type: DataTypes.ENUM('taxable', 'shipping', 'none'), defaultValue: 'taxable' },
    tax_class: { type: DataTypes.STRING, defaultValue: 'standard' },
    manage_stock: { type: DataTypes.BOOLEAN, defaultValue: false },
    stock_quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    stock_status: { type: DataTypes.ENUM('instock', 'outofstock', 'onbackorder'), defaultValue: 'instock' },
    low_stock_threshold: { type: DataTypes.INTEGER, defaultValue: 2 },
    sold_individually: { type: DataTypes.BOOLEAN, defaultValue: false },
    backorders_allowed: { type: DataTypes.ENUM('no', 'notify', 'yes'), defaultValue: 'no' },
    warehouse_location: DataTypes.STRING,
    barcode: DataTypes.STRING,
    weight: DataTypes.DECIMAL(10, 3),
    length: DataTypes.DECIMAL(10, 2),
    width: DataTypes.DECIMAL(10, 2),
    height: DataTypes.DECIMAL(10, 2),
    shipping_class: DataTypes.STRING,
    is_virtual: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_downloadable: { type: DataTypes.BOOLEAN, defaultValue: false },
    download_limit: { type: DataTypes.INTEGER, defaultValue: -1 },
    download_expiry: { type: DataTypes.INTEGER, defaultValue: -1 },
    file_urls: { type: DataTypes.JSON, defaultValue: [] },
    category_id: DataTypes.INTEGER,
    tags: { type: DataTypes.JSON, defaultValue: [] },
    upsell_ids: { type: DataTypes.JSON, defaultValue: [] },
    cross_sell_ids: { type: DataTypes.JSON, defaultValue: [] },
    related_ids: { type: DataTypes.JSON, defaultValue: [] },
    meta_title: DataTypes.STRING,
    meta_desc: DataTypes.TEXT,
    focus_keyword: DataTypes.STRING,
    og_image: DataTypes.STRING,
    view_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    sales_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    average_rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    review_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    menu_order: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    published_at: DataTypes.DATE
});

const ProductVariation = sequelize.define('ProductVariation', {
    sku: { type: DataTypes.STRING },
    regular_price: { type: DataTypes.DECIMAL(10, 2) },
    sale_price: { type: DataTypes.DECIMAL(10, 2) },
    stock_quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    stock_status: { type: DataTypes.ENUM('instock', 'outofstock', 'onbackorder'), defaultValue: 'instock' },
    manage_stock: { type: DataTypes.BOOLEAN, defaultValue: false },
    weight: DataTypes.DECIMAL(10, 3),
    length: DataTypes.DECIMAL(10, 2),
    width: DataTypes.DECIMAL(10, 2),
    height: DataTypes.DECIMAL(10, 2),
    attributes: { type: DataTypes.JSON, allowNull: false },
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true }
});

const Attribute = sequelize.define('Attribute', {
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    type: { type: DataTypes.ENUM('select', 'color', 'image', 'button'), defaultValue: 'select' },
    values: { type: DataTypes.JSON, defaultValue: [] },
    is_global: { type: DataTypes.BOOLEAN, defaultValue: true }
});

const ProductReview = sequelize.define('ProductReview', {
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: DataTypes.TEXT,
    status: { type: DataTypes.ENUM('pending', 'approved', 'spam'), defaultValue: 'pending' },
    guest_name: DataTypes.STRING,
    guest_email: DataTypes.STRING
});

const ProductMeta = sequelize.define('ProductMeta', {
    productId: { type: DataTypes.INTEGER, allowNull: false },
    key: { type: DataTypes.STRING, allowNull: false },
    value: DataTypes.TEXT('long')
});

export { Product, ProductVariation, Attribute, ProductReview, ProductMeta };
