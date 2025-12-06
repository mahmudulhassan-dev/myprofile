# Product Management System Implementation Plan

## Goal
Build a professional-grade, full-featured Products Management System including inventory, variations, SEO, analytics, and shipping/tax logic.

## 1. Database Schema Expansion
We need to upgrade the existing `Product` model and add several related models.

### Models to Update/Create:
- **Product** (Core):
    - Fields: `title`, `slug`, `type` (simple/variable/digital/service), `status`, `short_description`, `description` (long), `featured_image`, `gallery`, `video_url`.
    - Pricing: `regular_price`, `sale_price`, `sale_start`, `sale_end`, `tax_class_id`.
    - Inventory: `sku`, `stock_quantity`, `low_stock_threshold`, `stock_status`, `manage_stock` (bool), `sold_individually` (bool).
    - Shipping: `weight`, `dimensions` (length, width, height), `shipping_class_id`.
    - Organization: `category_id`, `tags` (m:n).
    - SEO: `meta_title`, `meta_desc`, `focus_keyword`.
    - Analytics: `view_count`, `sales_count`.
- **ProductVariation**:
    - For Variable Products.
    - Fields: `product_id`, `attributes` (JSON: {size: 'M', color: 'Red'}), `sku`, `price`, `sale_price`, `stock_quantity`, `weight`, `image`.
- **Attribute**:
    - Defines global attributes (e.g., Color, Size).
    - Fields: `name`, `slug`, `type` (text, color, button), `values` (JSON).
- **ProductReview**:
    - Fields: `product_id`, `user_id`, `guest_name`, `rating`, `comment`, `status` (approved/pending).
- **TaxClass** & **ShippingClass**:
    - Basic models for logic separation.

## 2. Backend Implementation (Node/Express/Sequelize)
- **Controllers**:
    - `ProductController`: CRUD, Filters, Sorting, Bulk Actions.
    - `VariationController`: Manage variants.
    - `AttributeController`: Manage global attributes.
    - `ReviewController`: Moderation.
- **Services**:
    - `ProductService`: Handle complex SEO generation, SKU duplication checks.
- **API Routes**:
    - `/api/admin/products`
    - `/api/admin/products/variations`
    - `/api/admin/attributes`
    - `/api/admin/reviews`

## 3. Frontend Modules (React + Tailwind)
Located in `src/components/admin/products/`.

### Components:
- **ProductDashboard**: Stats (Total, Out of Stock, Best Sellers).
- **ProductList**: Advanced DataTable (Filter by Category, Price, Status; Sort; Bulk Edit).
- **ProductEditor**: Multi-tab form:
    - **General**: Title, Description, Type.
    - **Data**: Price, Inventory, SKU, Tax.
    - **Attributes & Variations**: The complex engine for generating variants.
    - **Shipping**: Weight, Dimensions.
    - **SEO**: Meta tags, Preview.
    - **Media**: Gallery, Video.
- **AttributeManager**: UI to define global attributes.
- **ReviewManager**: Moderation table.

## 4. Execution Strategy
1.  **Database & Backend Core**: Implement extended Models and Migration logic in `server/models/index.js`.
2.  **Basic API**: Create Controllers for basic CRUD.
3.  **Frontend List & Dashboard**: Build the view layer.
4.  **Frontend Editor (Simple)**: Build editor for Simple Products.
5.  **Advanced Features**: Implement Variations, Attributes, and SEO.
6.  **Polishing**: Analytics, Reviews, and final UI checks.

## 5. User Review Required
- Breaking change to `Product` model (will wipe existing simple product data if not careful).
- Confirmation on "Digital Product" file handling (using local upload or needing external bucket?). **Assumption: Local `uploads/` folder for now.**
