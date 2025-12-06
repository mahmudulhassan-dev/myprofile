import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/db')
            .then(res => res.json())
            .then(data => {
                if (data.products) setProducts(data.products);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <section id="products" className="py-24 relative bg-aurora-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-primary-purple font-bold tracking-widest text-xs uppercase bg-purple-100 px-3 py-1 rounded-full">Store</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-6 mb-6">Premium Products</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        High-quality digital assets and services to accelerate your growth.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center"><div className="w-10 h-10 border-4 border-primary-purple border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-lg shadow-purple-900/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col"
                            >
                                <div className="h-64 bg-slate-100 relative overflow-hidden">
                                    <img
                                        src={product.image || `https://placehold.co/600x400/f1f5f9/cbd5e1?text=${product.name}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-slate-900 font-bold shadow-sm">
                                        {product.price}
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{product.name}</h3>
                                    <p className="text-slate-500 leading-relaxed mb-6 text-sm flex-1">
                                        {product.description}
                                    </p>

                                    <a
                                        href={product.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-primary-purple transition-colors"
                                    >
                                        <ShoppingBag size={18} /> Buy Now
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Products;
