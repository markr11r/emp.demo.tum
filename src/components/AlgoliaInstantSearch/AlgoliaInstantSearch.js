import './AlgoliaInstantSearch.css';
import { extractProductIDfromObjectID } from '../../helpers/algolia'
import React, { useState, createContext, useContext } from 'react'
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import {
    InstantSearch,
    SearchBox,
    Hits,
    Pagination,
    Highlight,
} from 'react-instantsearch';
import {
    APPLICATION_ID,
    INDEX_NAME,
    SEARCH_KEY,
    TENANT,
} from '../../constants/localstorage'
import { useLanguage } from '../../context/language-provider'
import { useCurrency } from '../../context/currency-context'

const Hit = ({ hit }) => {
    
    const tenant = localStorage.getItem(TENANT)
    const pdpUrl = '/' + tenant + '/product/details/' + extractProductIDfromObjectID(hit.objectID)
    const { currentLanguage } = useLanguage()
    const { activeCurrency } = useCurrency()

    return (
        <div className="ais-Hits-item">
            {/* Product Image */}
            <img
                src={hit.image}
                alt={hit.name}
                className="hit-image"
            />
            {/* Title with Link */}
            <div>
                <h3 className="hit-title">
                    <a href={pdpUrl} rel="noopener noreferrer">
                        {hit.localizedName[currentLanguage] ? hit.localizedName[currentLanguage] : hit.name}
                    </a>
                </h3>
            </div>
        </div>
    )
};

const AlgoliaInstantSearch = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const client = algoliasearch(
        localStorage.getItem(APPLICATION_ID),
        localStorage.getItem(SEARCH_KEY)
    )
    const index = localStorage.getItem(INDEX_NAME)

    return (
        <div className="search-container instant-search">
            <InstantSearch
                indexName={index}
                searchClient={client}
            >
                {/* Custom SearchBox with Focus/Blur Handlers */}
                <div
                    className="ais-SearchBox"
                    onFocus={() => setDropdownVisible(true)}
                    onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
                >
                    <SearchBox />
                </div>

                {/* Hits Dropdown */}
                <div className={`hits-dropdown ${dropdownVisible ? '' : 'hidden'}`}>
                    <Hits hitComponent={Hit} />
                </div>
            </InstantSearch>
        </div>
    );
};

export default AlgoliaInstantSearch;