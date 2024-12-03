import React from 'react';
import { useLanguage } from 'context/language-provider'
import './ProductCharacteristics.css'

const ProductBasicCharacteristics = ({ caption, value }) => {

    return (
        <ul className="characteristics-list">
            <li key="0" className="characteristics-list-item">
            {caption}: {value + ' '}
            </li>
        </ul>
    );
};

export default ProductBasicCharacteristics;