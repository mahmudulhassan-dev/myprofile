import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search, Filter, Plus, MoreVertical, Eye, ChevronLeft, ChevronRight, CheckSquare, Square } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductList = ({ onEdit }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        type: 'all',
        stock_status: 'all',
        category: 'all'
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1
    });
    const [selected, setSelected] = useState([]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                search,
                status: filters.status,
                type: filters.type,
                stock_status: filters.stock_status,
                category: filters.category
            });
            const res = await fetch(`/api/admin/products?${query.toString()}`);
            const data = await res.json();
            if (res.ok) {
                setProducts(data.products || []);
                setPagination(prev => ({
                    ...prev,
                    total: data.total,
                    pages: data.pages,
                    page: data.currentPage
                }));
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
    }, [search, filters, pagination.page]);

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

    const handleSelectAll = () => {
        if (selected.length === products.length) setSelected([]);
        else setSelected(products.map(p => p.id));
    };

    const handleSelect = (id) => {
        if (selected.includes(id)) setSelected(selected.filter(s => s !== id));
        else setSelected([...selected, id]);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-700';
            case 'draft': return 'bg-slate-100 text-slate-700';
            case 'archived': return 'bg-orange-100 text-orange-700';
            case 'sys_notification': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, SKU..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                        <select
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                        >
                            <option value="all">All Types</option>
                            <option value="simple">Simple</option>
                            <option value="variable">Variable</option>
                            <option value="digital">Digital</option>
                        </select>
                        <select
                            value={filters.stock_status}
                            onChange={(e) => setFilters({ ...filters, stock_status: e.target.value })}
                            className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                        >
                            <option value="all">All Stock</option>
                            <option value="instock">In Stock</option>
                            <option value="outofstock">Out of Stock</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <button onClick={handleSelectAll} className="text-slate-400 hover:text-slate-600">
                                        {selected.length === products.length && products.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                                    </button>
                                </th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Product</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Type</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Price</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Stock</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-10 text-slate-500">Loading products...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-10 text-slate-500">No products found.</td></tr>
                            ) : (
                                products.map(product => (
                                    <tr key={product.id} className="hover:bg-slate-50/50 transition">
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleSelect(product.id)} className={`text-slate-400 hover:text-slate-600 ${selected.includes(product.id) ? 'text-blue-600' : ''}`}>
                                                {selected.includes(product.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                                    {product.featured_image ? (
                                                        <img src={product.featured_image} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <PackageIcon />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">{product.title}</p>
                                                    <p className="text-xs text-slate-400">SKU: {product.sku || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                                            {product.type}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                            ৳{product.sale_price || product.regular_price}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock_quantity > 0 || product.stock_status === 'instock' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.manage_stock ? `${product.stock_quantity} in stock` : product.stock_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
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
                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            disabled={pagination.page >= pagination.pages}
                            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PackageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22v-10" /></svg>
);

export default ProductList;
