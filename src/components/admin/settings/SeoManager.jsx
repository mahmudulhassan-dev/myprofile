import React, { useState } from 'react';
import {
    Globe, Search, Settings, FileText, Share2, Code, Database,
    RefreshCw, CheckCircle, AlertTriangle, Layout
} from 'lucide-react';

const SeoManager = () => {
    const [activeTab, setActiveTab] = useState('general');

    // SEO Mock Data
    const [meta, setMeta] = useState({
        title: 'M. Hassan | Full Stack Developer',
        desc: 'Professional Portfolio of M. Hassan...',
        keywords: 'Web Developer, React, Node.js',
        author: 'M. Hassan',
        ogImage: 'https://example.com/og.jpg',
        twitterCard: 'summary_large_image'
    });

    const [robots, setRobots] = useState(`User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml`);
    const [schema, setSchema] = useState(`{\n  "@context": "https://schema.org",\n  "@type": "Person",\n  "name": "M. Hassan"\n}`);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 animate-fade-in font-sans">
            <div className="border-b border-slate-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Search className="text-blue-600" /> SEO Command Center
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Manage Search Engine Visibility, Schemas, and Social Appearance (30+ Features)</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-100 flex items-center gap-2"><RefreshCw size={14} /> Scan Site</button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 shadow-lg shadow-green-500/30">Save Changes</button>
                </div>
            </div>

            <div className="flex border-b border-slate-100 overflow-x-auto">
                {[
                    { id: 'general', label: 'Global Meta', icon: Globe },
                    { id: 'social', label: 'Social & OG', icon: Share2 },
                    { id: 'schema', label: 'Schema / JSON-LD', icon: Code },
                    { id: 'sitemap', label: 'Sitemap & Robots', icon: Database },
                    { id: 'audit', label: 'SEO Audit', icon: CheckCircle },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-4 flex items-center gap-2 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            <div className="p-6">
                {activeTab === 'general' && (
                    <div className="space-y-6 max-w-3xl">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3 text-sm text-slate-700">
                            <Layout className="text-blue-500 shrink-0" />
                            <div>
                                <strong>Search Preview:</strong>
                                <div className="mt-2 bg-white p-3 rounded shadow-sm border border-slate-200 max-w-md">
                                    <div className="text-xs text-slate-500 mb-0.5">example.com › portfolio</div>
                                    <div className="text-lg text-blue-800 hover:underline cursor-pointer font-medium truncate">{meta.title}</div>
                                    <div className="text-sm text-slate-600 line-clamp-2">{meta.desc}</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Global Meta Title (3.1)</label>
                                <input value={meta.title} onChange={e => setMeta({ ...meta, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" />
                                <div className="flex justify-between mt-1 text-xs text-slate-400"><span>Recommended: 60 chars</span><span>{meta.title.length} chars</span></div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Global Meta Description (3.2)</label>
                                <textarea rows={3} value={meta.desc} onChange={e => setMeta({ ...meta, desc: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" />
                                <div className="flex justify-between mt-1 text-xs text-slate-400"><span>Recommended: 160 chars</span><span>{meta.desc.length} chars</span></div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Global Keywords (3.3)</label>
                                <input value={meta.keywords} onChange={e => setMeta({ ...meta, keywords: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none" placeholder="Comma separated..." />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sitemap' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">Robots.txt Editor (3.9)</h3>
                            <textarea value={robots} onChange={e => setRobots(e.target.value)} className="w-full h-48 font-mono text-sm bg-slate-900 text-green-400 p-4 rounded-xl outline-none border border-slate-700" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">Sitemap Status (3.8)</h3>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                                <Database size={48} className="mx-auto text-blue-500 mb-4" />
                                <p className="font-bold text-slate-700">sitemap.xml</p>
                                <p className="text-sm text-slate-500 mb-4">Last Generated: 2 hours ago</p>
                                <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-50">View Sitemap</button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 ml-2">Regenerate</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'schema' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">Structured Data (JSON-LD) Generator (3.18)</h3>
                            <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm p-2 outline-none">
                                <option>Person Schema</option>
                                <option>Organization Schema</option>
                                <option>Website Schema</option>
                            </select>
                        </div>
                        <textarea value={schema} onChange={e => setSchema(e.target.value)} className="w-full h-80 font-mono text-sm bg-slate-50 p-4 rounded-xl outline-none border border-slate-200 focus:border-blue-500 text-slate-700" />
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-start gap-3">
                            <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-bold text-green-800">SSL Certificate Valid</h4>
                                <p className="text-sm text-green-700">HTTPS is enforced for all traffic.</p>
                            </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-3">
                            <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-bold text-yellow-800">2 Pages Missing Meta Description</h4>
                                <p className="text-sm text-yellow-700">About Page, Contact Page. <a href="#" className="underline">Fix now</a></p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeoManager;
