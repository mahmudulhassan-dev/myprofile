import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        ['link', 'image', 'video'], // clean
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'script',
    'link', 'image', 'video'
];

const RichTextEditor = ({ value, onChange, placeholder, height = '400px' }) => {
    return (
        <div className="rich-text-editor-wrapper" style={{ height: `calc(${height} + 42px)` }}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                style={{ height: height, background: 'white' }}
                className="rounded-lg overflow-hidden"
            />

            <style>{`
                .ql-toolbar.ql-snow {
                    border-top-left-radius: 0.75rem;
                    border-top-right-radius: 0.75rem;
                    border-color: #e2e8f0;
                    background: #f8fafc;
                }
                .ql-container.ql-snow {
                    border-bottom-left-radius: 0.75rem;
                    border-bottom-right-radius: 0.75rem;
                    border-color: #e2e8f0;
                    font-family: inherit;
                    font-size: 1rem;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
