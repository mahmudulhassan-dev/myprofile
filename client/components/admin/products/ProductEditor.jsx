import React, { useState, useEffect } from 'react';
import {
    Save, ArrowLeft, Layers, Image as ImageIcon, Box, Truck,
    DollarSign, Search, Settings, Tag as TagIcon, BarChart2
} from 'lucide-react';
import toast from 'react-hot-toast';

// Sub-components for tabs
const GeneralTab = ({ form, setForm }) => (
    <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Title</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Premium Cotton T-Shirt"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Description</label>
                    <textarea
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
                        placeholder="Detailed product description..."
                    />
                </div>
            </div>
            <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select
                        value={form.status}
                        onChange={e => setForm({ ...form, status: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="private">Private</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Type</label>
                    <select
                        value={form.type}
                        onChange={e => setForm({ ...form, type: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    >
                        <option value="simple">Simple Product</option>
                        <option value="variable">Variable Product</option>
                        <option value="digital">Digital Product</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
                    <textarea
                        value={form.short_description}
                        onChange={e => setForm({ ...form, short_description: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        placeholder="Brief summary..."
                    />
                </div>
            </div>
        </div>
    </div>
);

const PricingTab = ({ form, setForm }) => (
    <div className="space-y-6 max-w-2xl animate-fade-in">
        <div className="grid grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Regular Price</label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                    <input
                        type="number"
                        value={form.regular_price}
                        onChange={e => setForm({ ...form, regular_price: e.target.value })}
                        className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sale Price</label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                    <input
                        type="number"
                        value={form.sale_price}
                        onChange={e => setForm({ ...form, sale_price: e.target.value })}
                        className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cost Price (For Profit Calc)</label>
            <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                <input
                    type="number"
                    value={form.cost_price}
                    onChange={e => setForm({ ...form, cost_price: e.target.value })}
                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <p className="text-xs text-slate-400 mt-1">Customers will not see this.</p>
        </div>
    </div>
);

const InventoryTab = ({ form, setForm }) => (
    <div className="space-y-6 max-w-2xl animate-fade-in">
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">SKU (Stock Keeping Unit)</label>
            <input
                type="text"
                value={form.sku}
                onChange={e => setForm({ ...form, sku: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <div className="flex items-center gap-3">
            <input
                type="checkbox"
                id="manage_stock"
                checked={form.manage_stock}
                onChange={e => setForm({ ...form, manage_stock: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="manage_stock" className="text-sm font-medium text-slate-700">Track Stock Quantity</label>
        </div>
        {form.manage_stock && (
            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                    <input
                        type="number"
                        value={form.stock_quantity}
                        onChange={e => setForm({ ...form, stock_quantity: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Low Stock Threshold</label>
                    <input
                        type="number"
                        value={form.low_stock_threshold}
                        onChange={e => setForm({ ...form, low_stock_threshold: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        )}
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Stock Status</label>
            <select
                value={form.stock_status}
                onChange={e => setForm({ ...form, stock_status: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
            >
                <option value="instock">In Stock</option>
                <option value="outofstock">Out of Stock</option>
                <option value="onbackorder">On Backorder</option>
            </select>
        </div>
    </div>
);

const ShippingTab = ({ form, setForm }) => (
    <div className="space-y-6 max-w-2xl animate-fade-in">
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
            <input
                type="number"
                value={form.weight}
                onChange={e => setForm({ ...form, weight: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <div className="grid grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Length (cm)</label>
                <input
                    type="number"
                    value={form.length}
                    onChange={e => setForm({ ...form, length: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Width (cm)</label>
                <input
                    type="number"
                    value={form.width}
                    onChange={e => setForm({ ...form, width: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
                <input
                    type="number"
                    value={form.height}
                    onChange={e => setForm({ ...form, height: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                />
            </div>
        </div>
    </div>
);

const SEOTab = ({ form, setForm }) => (
    <div className="space-y-6 max-w-2xl animate-fade-in">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
            <p className="text-xs text-slate-500 uppercase font-bold mb-2">Search Preview</p>
            <h3 className="text-blue-600 text-xl font-medium hover:underline truncate cursor-pointer">{form.meta_title || form.title}</h3>
            <p className="text-green-700 text-sm mb-1">https://example.com/products/{form.slug}</p>
            <p className="text-slate-600 text-sm">{form.meta_desc || form.short_description}</p>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
            <input
                type="text"
                value={form.meta_title}
                onChange={e => setForm({ ...form, meta_title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={form.title}
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
            <textarea
                value={form.meta_desc}
                onChange={e => setForm({ ...form, meta_desc: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder={form.short_description}
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Focus Keyword</label>
            <input
                type="text"
                value={form.focus_keyword}
                onChange={e => setForm({ ...form, focus_keyword: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    </div>
);

const ProductEditor = ({ productId, onBack }) => {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(!!productId);
    const [saving, setSaving] = useState(false);

    // Initial State - Full Enterprise Schema
    const [form, setForm] = useState({
        title: '',
        slug: '',
        type: 'simple',
        status: 'draft',
        sku: '',
        short_description: '',
        description: '',
        regular_price: '',
        sale_price: '',
        cost_price: '',
        tax_status: 'taxable',
        manage_stock: false,
        stock_quantity: 0,
        stock_status: 'instock',
        low_stock_threshold: 2,
        weight: '',
        length: '',
        width: '',
        height: '',
        meta_title: '',
        meta_desc: '',
        focus_keyword: '',
        gallery: [],
        tags: []
    });

    useEffect(() => {
        if (productId) {
            fetchProduct(productId);
        }
    }, [productId]);

    const fetchProduct = async (id) => {
        try {
            const res = await fetch(`/api/admin/products/${id}`);
            const data = await res.json();
            setForm(data); // Auto-fill form
        } catch (error) {
            console.error(error);
            toast.error("Failed to load product");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const url = productId ? `/api/admin/products/${productId}` : '/api/admin/products';
            const method = productId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (!res.ok) throw new Error("Failed to save");

            toast.success("Product saved successfully!");
            if (!productId) onBack(); // Go back if new creation
        } catch (error) {
            console.error(error);
            toast.error("Error saving product");
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Layers },
        { id: 'pricing', label: 'Pricing', icon: DollarSign },
        { id: 'inventory', label: 'Inventory', icon: Box },
        { id: 'shipping', label: 'Shipping', icon: Truck },
        { id: 'seo', label: 'SEO', icon: Search },
        { id: 'media', label: 'Images', icon: ImageIcon },
    ];

    if (loading) return <div className="p-10 text-center">Loading product data...</div>;

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{productId ? 'Edit Product' : 'New Product'}</h2>
                        <p className="text-sm text-slate-500">{form.slug || 'untitled-product'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                        <Save size={18} /> {saving ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 bg-white border-r border-slate-200 p-4 space-y-1 overflow-y-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <tab.icon size={18} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        {activeTab === 'general' && <GeneralTab form={form} setForm={setForm} />}
                        {activeTab === 'pricing' && <PricingTab form={form} setForm={setForm} />}
                        {activeTab === 'inventory' && <InventoryTab form={form} setForm={setForm} />}
                        {activeTab === 'shipping' && <ShippingTab form={form} setForm={setForm} />}
                        {activeTab === 'seo' && <SEOTab form={form} setForm={setForm} />}
                        {activeTab === 'media' && (
                            <div className="text-center p-10 border-2 border-dashed border-slate-200 rounded-xl">
                                <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-slate-500">Media Manager coming soon (Integrated with File Manager)</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProductEditor;
