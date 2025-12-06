import React from 'react';

const ProductEditor = ({ productId, onBack }) => {
    return (
        <div>
            <button onClick={onBack}>Back</button>
            <h2>Product Editor {productId ? `#${productId}` : 'New'} (Coming Soon)</h2>
        </div>
    );
};
export default ProductEditor;
