import React, { useState, useEffect, useRef } from 'react';
import {
    Folder, Image, File, FolderPlus, Upload, Trash2,
    ChevronRight, RefreshCw, Home, Download, Star, Search,
    Grid, List, MoreVertical, X, Check, ArrowLeft, Clock,
    Move, Copy, Info, Tag
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- Sub-Components ---

const FileIcon = ({ type, name }) => {
    if (type === 'folder') return <Folder size={48} className="text-yellow-400 fill-yellow-400" />;
    const ext = name.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <Image size={48} className="text-purple-500" />;
    if (['pdf'].includes(ext)) return <File size={48} className="text-red-500" />;
    if (['zip', 'rar'].includes(ext)) return <File size={48} className="text-orange-500" />;
    return <File size={48} className="text-slate-400" />;
};

const ContextMenu = ({ x, y, options, onClose }) => (
    <>
        <div className="fixed inset-0 z-40" onClick={onClose} />
        <div className="fixed z-50 bg-white shadow-xl rounded-lg border border-slate-100 py-2 w-48 animate-fade-in" style={{ top: y, left: x }}>
            {options.map((opt, i) => (
                <button
                    key={i}
                    onClick={() => { opt.action(); onClose(); }}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-sm ${opt.danger ? 'text-red-600' : 'text-slate-700'}`}
                >
                    {opt.icon && <opt.icon size={14} />}
                    {opt.label}
                </button>
            ))}
        </div>
    </>
);

const FileManager = () => {
    // State
    const [path, setPath] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [selected, setSelected] = useState([]); // Multi-select
    const [sidebarMode, setSidebarMode] = useState('folders'); // folders | trash | favorites
    const [searchQuery, setSearchQuery] = useState('');
    const [contextMenu, setContextMenu] = useState(null); // {x, y, item}
    const [stats, setStats] = useState({ used: 0, filesCount: 0 });

    useEffect(() => { loadFiles(); fetchStats(); }, [path, sidebarMode]);

    const loadFiles = async () => {
        setLoading(true);
        try {
            if (sidebarMode === 'trash') {
                const res = await fetch('/api/fm/trash');
                const data = await res.json();
                setFiles(data);
            } else {
                const res = await fetch('/api/fm/list', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path,
                        query: { starred: sidebarMode === 'favorites' }
                    })
                });
                const data = await res.json();
                setFiles(data);
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const fetchStats = async () => {
        const res = await fetch('/api/fm/stats');
        setStats(await res.json());
    };

    // --- Actions ---

    const handleUpload = async (e) => {
        const fileList = e.target.files;
        if (!fileList.length) return;
        const toastId = toast.loading(`Uploading ${fileList.length} files...`);

        // Serial upload
        for (let i = 0; i < fileList.length; i++) {
            const formData = new FormData();
            formData.append('image', fileList[i]);
            formData.append('folder', path || '');
            await fetch('/api/fm/upload', { method: 'POST', body: formData });
        }
        toast.success('Upload complete', { id: toastId });
        loadFiles();
        fetchStats();
    };

    const handleCreateFolder = async () => {
        const name = prompt('Folder Name:');
        if (!name) return;
        await fetch('/api/fm/folder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, currentPath: path })
        });
        loadFiles();
    };

    const handleOperate = async (action, items = selected) => {
        if (!items.length) return toast.error('No items selected');
        if (action === 'delete' && !window.confirm(`Permanently delete ${items.length} items?`)) return;

        let destination = '';
        if (action === 'move' || action === 'copy') {
            destination = prompt('Destination Folder Path (relative to root):', path);
            if (destination === null) return;
        }

        const toastId = toast.loading('Processing...');
        const res = await fetch('/api/fm/operate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, items, destination })
        });
        const result = await res.json();

        toast.success('Done', { id: toastId });
        setSelected([]);
        loadFiles();
        fetchStats();
    };

    const handleStar = async (itemPath, isStarred) => {
        await fetch('/api/fm/meta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: itemPath, updates: { starred: !isStarred } })
        });
        loadFiles(); // Refresh UI to show star
    };

    // --- Events ---

    const selectItem = (itemPath, multi) => {
        if (multi) {
            setSelected(prev => prev.includes(itemPath) ? prev.filter(p => p !== itemPath) : [...prev, itemPath]);
        } else {
            setSelected([itemPath]);
        }
    };

    const onRightClick = (e, item) => {
        e.preventDefault();
        selectItem(item.path, false);
        setContextMenu({ x: e.clientX, y: e.clientY, item });
    };

    // --- Renderers ---

    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="h-[calc(100vh-100px)] flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-sm animate-fade-in font-sans">

            {/* Sidebar (Left) */}
            <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col hidden md:flex">
                <div className="p-4">
                    <button onClick={handleUpload} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 relative overflow-hidden">
                        <Upload size={16} /> Upload Files
                        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} />
                    </button>
                    <button onClick={handleCreateFolder} className="w-full mt-2 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg font-bold hover:bg-slate-100 flex items-center justify-center gap-2">
                        <FolderPlus size={16} /> New Folder
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Storage</p>
                    <button onClick={() => { setSidebarMode('folders'); setPath(''); }} className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center gap-3 ${sidebarMode === 'folders' && !path ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-200'}`}>
                        <Home size={18} /> My Files
                    </button>
                    <button onClick={() => setSidebarMode('favorites')} className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center gap-3 ${sidebarMode === 'favorites' ? 'bg-yellow-100 text-yellow-700 font-bold' : 'text-slate-600 hover:bg-slate-200'}`}>
                        <Star size={18} /> Favorites
                    </button>
                    <button onClick={() => setSidebarMode('trash')} className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center gap-3 ${sidebarMode === 'trash' ? 'bg-red-100 text-red-700 font-bold' : 'text-slate-600 hover:bg-slate-200'}`}>
                        <Trash2 size={18} /> Recycle Bin
                    </button>

                    <div className="pt-4 px-3">
                        <div className="bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full" style={{ width: '40%' }}></div> {/* Mock progress */}
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-bold">
                            <span>{(stats.used / 1024 / 1024).toFixed(1)} MB Used</span>
                            <span>{stats.filesCount} Files</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col bg-white">

                {/* Header / Toolbar */}
                <div className="h-16 border-b border-slate-100 flex items-center justify-between px-4 bg-white/80 backdrop-blur sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        {path && (
                            <button onClick={() => setPath(path.split('/').slice(0, -1).join('/'))} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <div className="text-lg font-bold text-slate-700 flex items-center gap-2">
                            {sidebarMode === 'trash' ? 'Recycle Bin' : (path ? path.split('/').pop() : 'My Files')}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                        <Search size={16} className="text-slate-400 ml-2" />
                        <input
                            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search files..."
                            className="bg-transparent border-none outline-none text-sm w-48 text-slate-700"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {selected.length > 0 && (
                            <div className="flex bg-slate-800 text-white rounded-lg p-1 px-3 items-center gap-3 mr-4">
                                <span className="text-xs font-bold">{selected.length} selected</span>
                                {sidebarMode === 'trash' ? (
                                    <button onClick={() => handleOperate('delete')} className="hover:text-red-300"><Trash2 size={16} /></button>
                                ) : (
                                    <>
                                        <button onClick={() => handleOperate('trash')} className="hover:text-red-300"><Trash2 size={16} /></button>
                                        <button onClick={() => handleOperate('move')} className="hover:text-blue-300"><Move size={16} /></button>
                                    </>
                                )}
                            </div>
                        )}
                        <button onClick={() => loadFiles()} className="p-2 text-slate-400 hover:text-blue-600"><RefreshCw size={18} /></button>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}><Grid size={16} /></button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}><List size={16} /></button>
                        </div>
                    </div>
                </div>

                {/* File Grid/List */}
                <div
                    className="flex-1 overflow-y-auto p-4 bg-slate-50/50"
                    onClick={() => { setSelected([]); setContextMenu(null); }}
                >
                    {loading ? (
                        <div className="flex h-full items-center justify-center text-slate-400 gap-2"><RefreshCw className="animate-spin" /> Loading...</div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="flex flex-col h-full items-center justify-center text-slate-400 gap-2 opacity-50">
                            <Folder size={64} className="text-slate-200" />
                            <p>Empty Folder</p>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" : "space-y-1"}>
                            {filteredFiles.map(file => (
                                <div
                                    key={file.path}
                                    onClick={(e) => { e.stopPropagation(); selectItem(file.path, e.ctrlKey); }}
                                    onDoubleClick={() => file.type === 'folder' ? setPath(file.path) : window.open(file.url, '_blank')}
                                    onContextMenu={(e) => onRightClick(e, file)}
                                    className={`
                                        group relative rounded-xl transition cursor-pointer border
                                        ${selected.includes(file.path) ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'bg-white border-slate-200 hover:shadow-md'}
                                        ${viewMode === 'grid' ? 'p-3 flex flex-col items-center text-center aspect-[4/5]' : 'p-3 flex items-center gap-4'}
                                    `}
                                >
                                    <div className={viewMode === 'grid' ? 'w-full flex-1 flex items-center justify-center overflow-hidden mb-2 relative' : ''}>
                                        {file.type !== 'folder' && viewMode === 'grid' ? (
                                            <img src={file.url} className="object-cover w-full h-full rounded" />
                                        ) : (
                                            <FileIcon type={file.type} name={file.name} />
                                        )}
                                        {/* Star Badge */}
                                        {file.starred && <Star size={12} className="absolute top-0 right-0 text-yellow-500 fill-yellow-500" />}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-slate-700 truncate w-full" title={file.name}>{file.name}</p>
                                        <p className="text-[10px] text-slate-400">
                                            {(file.size / 1024).toFixed(0)} KB • {new Date(file.modified).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Quick Actions (Hover) */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition z-10 flex gap-1">
                                        <button onClick={(e) => { e.stopPropagation(); handleStar(file.path, file.starred); }} className="p-1 bg-white rounded shadow hover:text-yellow-500">
                                            <Star size={12} className={file.starred ? 'fill-yellow-500 text-yellow-500' : 'text-slate-400'} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY, item: file }); }} className="p-1 bg-white rounded shadow hover:text-blue-500">
                                            <MoreVertical size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)}
                    options={[
                        { label: 'Open', icon: Info, action: () => contextMenu.item.type === 'folder' ? setPath(contextMenu.item.path) : window.open(contextMenu.item.url) },
                        { label: contextMenu.item.starred ? 'Unstar' : 'Add to Favorites', icon: Star, action: () => handleStar(contextMenu.item.path, contextMenu.item.starred) },
                        { label: 'Download', icon: Download, action: () => window.open(contextMenu.item.url) },
                        { label: 'Move to...', icon: Move, action: () => handleOperate('move', [contextMenu.item.path]) },
                        { label: 'Copy to...', icon: Copy, action: () => handleOperate('copy', [contextMenu.item.path]) },
                        { label: 'Delete', icon: Trash2, action: () => handleOperate('trash', [contextMenu.item.path]), danger: true },
                    ]}
                />
            )}
        </div>
    );
};

export default FileManager;
