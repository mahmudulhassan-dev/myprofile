import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search, Filter, Plus, MoreVertical, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductList = ({ onEdit }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/products?search=${search}&status=${statusFilter}`);
            const data = await res.json();
            if (res.ok) {
                setProducts(data.products || []);
            } else {
                toast.error(data.error || 'Failed to fetch products');
            }
        } catch (error) {
            console.error(error);
            toast.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timeout);
    }, [search, statusFilter]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Product deleted');
                fetchProducts();
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            toast.error('Error deleting product');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'draft': return 'bg-slate-100 text-slate-700';
            case 'archived': return 'bg-orange-100 text-orange-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-48 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Product</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Category</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Price</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Stock</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-10 text-slate-500">Loading products...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10 text-slate-500">No products found. Add your first product!</td></tr>
                            ) : (
                                products.map(product => (
                                    <tr key={product.id} className="hover:bg-slate-50/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                                    {product.featured_image ? (
                                                        <img src={product.featured_image} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <PackageIcon /> // Placeholder
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">{product.title}</p>
                                                    <p className="text-xs text-slate-400">SKU: {product.sku || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {product.Category?.name || 'Uncategorized'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                            ৳{product.sale_price || product.regular_price}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock_quantity > 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.manage_stock ? `${product.stock_quantity} in stock` : product.stock_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => onEdit(product.id)} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 transition shadow-sm">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-500 hover:text-red-600 transition shadow-sm">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const PackageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22v-10" /></svg>
);

export default ProductList;
