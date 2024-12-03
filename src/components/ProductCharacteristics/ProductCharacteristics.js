import React from 'react';
import { useLanguage } from 'context/language-provider'
import './ProductCharacteristics.css'

const ProductCharacteristics = ({ data }) => {
    const { currentLanguage } = useLanguage()
    if (!data || !data.characteristics || !currentLanguage) {
        return <p>No data or language specified.</p>;
    }

    const renderCharacteristics = () => {
        return data.characteristics.map((itemGroup, index) => {
            const languageItem = itemGroup.find(item => item.language === currentLanguage);
            return (
                <li key={index} className="characteristics-list-item">
                    {languageItem ? languageItem.value : 'Translation not available'}
                </li>
            );
        });
    };

    return (
        <ul className="characteristics-list">
            {renderCharacteristics()}
        </ul>
    );
};

export default ProductCharacteristics;