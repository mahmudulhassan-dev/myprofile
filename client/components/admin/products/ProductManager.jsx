import React, { useState } from 'react';
import { Package, List, Plus, Tag, Settings, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Sub Components (Placeholders for now)
import ProductList from './ProductList';
import ProductEditor from './ProductEditor';
import AttributeManager from './AttributeManager';
import ProductDashboard from './ProductDashboard';

const ProductManager = () => {
    const [view, setView] = useState('list'); // list, editor, attributes, dashboard
    const [editingId, setEditingId] = useState(null);

    const handleEdit = (id) => {
        setEditingId(id);
        setView('editor');
    };

    const handleCreate = () => {
        setEditingId(null);
        setView('editor');
    };

    const handleBack = () => {
        setView('list');
        setEditingId(null);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[calc(100vh-8rem)] flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setView('dashboard')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${view === 'dashboard' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        <BarChart2 size={16} /> Overview
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${view === 'list' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        <List size={16} /> All Products
                    </button>
                    <button
                        onClick={() => setView('attributes')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${view === 'attributes' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        <Tag size={16} /> Attributes
                    </button>
                </div>

                {view === 'list' && (
                    <button
                        onClick={handleCreate}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition shadow-lg shadow-blue-600/20"
                    >
                        <Plus size={16} /> Add Product
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        {view === 'dashboard' && <ProductDashboard />}
                        {view === 'list' && <ProductList onEdit={handleEdit} />}
                        {view === 'editor' && <ProductEditor productId={editingId} onBack={handleBack} />}
                        {view === 'attributes' && <AttributeManager />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProductManager;
