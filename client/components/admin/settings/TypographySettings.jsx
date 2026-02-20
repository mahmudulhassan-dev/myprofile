import React from 'react';
import { Type, Upload, Bold, AlignLeft, Space, Minus } from 'lucide-react';

const TypographySettings = ({ settings, handleChange, handleFileUpload }) => {

    const googleFonts = [
        { value: 'Inter', label: 'Inter', category: 'Sans-serif' },
        { value: 'Roboto', label: 'Roboto', category: 'Sans-serif' },
        { value: 'Poppins', label: 'Poppins', category: 'Sans-serif' },
        { value: 'Open Sans', label: 'Open Sans', category: 'Sans-serif' },
        { value: 'Lato', label: 'Lato', category: 'Sans-serif' },
        { value: 'Montserrat', label: 'Montserrat', category: 'Sans-serif' },
        { value: 'Nunito', label: 'Nunito', category: 'Sans-serif' },
        { value: 'Raleway', label: 'Raleway', category: 'Sans-serif' },
        { value: 'Outfit', label: 'Outfit', category: 'Sans-serif' },
        { value: 'Work Sans', label: 'Work Sans', category: 'Sans-serif' },
        { value: 'Playfair Display', label: 'Playfair Display', category: 'Serif' },
        { value: 'Merriweather', label: 'Merriweather', category: 'Serif' },
        { value: 'Lora', label: 'Lora', category: 'Serif' },
        { value: 'Source Serif Pro', label: 'Source Serif Pro', category: 'Serif' },
        { value: 'Fira Code', label: 'Fira Code', category: 'Monospace' },
        { value: 'JetBrains Mono', label: 'JetBrains Mono', category: 'Monospace' },
    ];

    const fontWeights = [
        { value: '300', label: 'Light' },
        { value: '400', label: 'Regular' },
        { value: '500', label: 'Medium' },
        { value: '600', label: 'Semi-Bold' },
        { value: '700', label: 'Bold' },
        { value: '800', label: 'Extra-Bold' },
    ];

    const fontSizes = [
        { value: '14', label: '14px - Small' },
        { value: '15', label: '15px - Compact' },
        { value: '16', label: '16px - Default' },
        { value: '17', label: '17px - Comfortable' },
        { value: '18', label: '18px - Large' },
    ];

    const lineHeights = [
        { value: '1.4', label: '1.4 - Tight' },
        { value: '1.5', label: '1.5 - Compact' },
        { value: '1.6', label: '1.6 - Default' },
        { value: '1.75', label: '1.75 - Relaxed' },
        { value: '2', label: '2.0 - Loose' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Font Family Selection */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Type className="text-blue-500" size={20} /> Font Families
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Body Font (Google Fonts)</label>
                        <select
                            value={settings.font_body || 'Inter'}
                            onChange={(e) => handleChange('font_body', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            <optgroup label="Sans-serif">
                                {googleFonts.filter(f => f.category === 'Sans-serif').map(font => (
                                    <option key={font.value} value={font.value}>{font.label}</option>
                                ))}
                            </optgroup>
                            <optgroup label="Serif">
                                {googleFonts.filter(f => f.category === 'Serif').map(font => (
                                    <option key={font.value} value={font.value}>{font.label}</option>
                                ))}
                            </optgroup>
                            <optgroup label="Monospace">
                                {googleFonts.filter(f => f.category === 'Monospace').map(font => (
                                    <option key={font.value} value={font.value}>{font.label}</option>
                                ))}
                            </optgroup>
                        </select>
                        <p
                            className="mt-3 p-4 bg-slate-50 rounded-lg text-lg border border-slate-200"
                            style={{ fontFamily: settings.font_body || 'Inter' }}
                        >
                            The quick brown fox jumps over the lazy dog.
                        </p>
                    </div>

                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Heading Font (Google Fonts)</label>
                        <select
                            value={settings.font_heading || 'Inter'}
                            onChange={(e) => handleChange('font_heading', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            <optgroup label="Sans-serif">
                                {googleFonts.filter(f => f.category === 'Sans-serif').map(font => (
                                    <option key={font.value} value={font.value}>{font.label}</option>
                                ))}
                            </optgroup>
                            <optgroup label="Serif">
                                {googleFonts.filter(f => f.category === 'Serif').map(font => (
                                    <option key={font.value} value={font.value}>{font.label}</option>
                                ))}
                            </optgroup>
                        </select>
                        <p
                            className="mt-3 p-4 bg-slate-50 rounded-lg text-2xl font-bold border border-slate-200"
                            style={{ fontFamily: settings.font_heading || 'Inter' }}
                        >
                            Heading Preview
                        </p>
                    </div>
                </div>

                {/* Custom Font Upload */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Upload size={16} /> Custom Font Upload
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">Upload TTF/OTF/WOFF2 files for a custom font.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-500 mb-1 block">Custom Font File</label>
                            <input
                                type="file"
                                accept=".ttf,.otf,.woff,.woff2"
                                onChange={(e) => handleFileUpload(e, 'custom_font_file')}
                                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 mb-1 block">Custom Font Name</label>
                            <input
                                type="text"
                                value={settings.custom_font_name || ''}
                                onChange={(e) => handleChange('custom_font_name', e.target.value)}
                                placeholder="e.g. MyCustomFont"
                                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Font Sizes */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <AlignLeft className="text-purple-500" size={20} /> Font Sizes
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Base Font Size (Body Text)</label>
                        <select
                            value={settings.font_size_base || '16'}
                            onChange={(e) => handleChange('font_size_base', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {fontSizes.map(size => (
                                <option key={size.value} value={size.value}>{size.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Heading Scale Ratio</label>
                        <select
                            value={settings.heading_scale || '1.25'}
                            onChange={(e) => handleChange('heading_scale', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            <option value="1.125">Minor Second (1.125)</option>
                            <option value="1.2">Minor Third (1.2)</option>
                            <option value="1.25">Major Third (1.25) - Default</option>
                            <option value="1.333">Perfect Fourth (1.333)</option>
                            <option value="1.5">Perfect Fifth (1.5)</option>
                        </select>
                    </div>
                </div>

                {/* Heading Sizes Preview */}
                <div className="p-4 bg-slate-900 text-white rounded-xl">
                    <p className="text-xs text-slate-400 mb-4 uppercase font-bold">Heading Size Preview</p>
                    <div className="space-y-2" style={{ fontFamily: settings.font_heading || 'Inter' }}>
                        <p style={{ fontSize: `${(settings.font_size_base || 16) * Math.pow(settings.heading_scale || 1.25, 5)}px` }} className="font-bold">H1 Heading</p>
                        <p style={{ fontSize: `${(settings.font_size_base || 16) * Math.pow(settings.heading_scale || 1.25, 4)}px` }} className="font-bold">H2 Heading</p>
                        <p style={{ fontSize: `${(settings.font_size_base || 16) * Math.pow(settings.heading_scale || 1.25, 3)}px` }} className="font-bold">H3 Heading</p>
                        <p style={{ fontSize: `${(settings.font_size_base || 16) * Math.pow(settings.heading_scale || 1.25, 2)}px` }} className="font-bold">H4 Heading</p>
                    </div>
                </div>
            </section>

            {/* Font Weight & Spacing */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Bold className="text-green-500" size={20} /> Weight & Spacing
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Body Font Weight</label>
                        <select
                            value={settings.font_weight_body || '400'}
                            onChange={(e) => handleChange('font_weight_body', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {fontWeights.map(w => (
                                <option key={w.value} value={w.value}>{w.label} ({w.value})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Heading Font Weight</label>
                        <select
                            value={settings.font_weight_heading || '700'}
                            onChange={(e) => handleChange('font_weight_heading', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {fontWeights.map(w => (
                                <option key={w.value} value={w.value}>{w.label} ({w.value})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Line Height</label>
                        <select
                            value={settings.line_height || '1.6'}
                            onChange={(e) => handleChange('line_height', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 outline-none text-sm"
                        >
                            {lineHeights.map(lh => (
                                <option key={lh.value} value={lh.value}>{lh.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Letter Spacing (px)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="-1"
                                max="3"
                                step="0.25"
                                value={settings.letter_spacing || 0}
                                onChange={(e) => handleChange('letter_spacing', e.target.value)}
                                className="flex-1 accent-blue-600"
                            />
                            <span className="text-sm font-mono text-slate-600 w-16 text-right">{settings.letter_spacing || 0}px</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-xs font-bold uppercase mb-2">Paragraph Spacing</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="0"
                                max="32"
                                step="4"
                                value={settings.paragraph_spacing || 16}
                                onChange={(e) => handleChange('paragraph_spacing', e.target.value)}
                                className="flex-1 accent-blue-600"
                            />
                            <span className="text-sm font-mono text-slate-600 w-16 text-right">{settings.paragraph_spacing || 16}px</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TypographySettings;
