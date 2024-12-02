import Layout from '../Layout'
import React from 'react';
import {
    APPLICATION_ID,
    INDEX_NAME,
    SEARCH_KEY,
    TENANT,
} from '../../constants/localstorage'
import {
    InstantSearch,
    SearchBox,
    RefinementList,
    Hits,
    SortBy,
} from 'react-instantsearch';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import './search.css'; // Import the CSS file
import { extractProductIDfromObjectID } from '../../helpers/algolia'
import { useLanguage } from '../../context/language-provider'
import { useCurrency } from '../../context/currency-context'
import rating, { RatingMenu } from './rating'

// "Did You Mean?" Component
const DidYouMean = ({ searchResults, refine }) => {

    if (
      searchResults &&
      searchResults.query &&
      searchResults.correctedQuery &&
      searchResults.query !== searchResults.correctedQuery
    ) {
      return (
        <div className="did-you-mean">
          Did you mean{' '}
          <strong
            onClick={() => refine(searchResults.correctedQuery)}
            style={{ cursor: 'pointer', color: '#5a67d8', textDecoration: 'underline' }}
          >
            {searchResults.correctedQuery}
          </strong>
          ?
        </div>
      );
    }
    return null;
  };


const Hit = ({ hit }) => {
    const { currentLanguage } = useLanguage()
    const { activeCurrency } = useCurrency()
    const tenant = localStorage.getItem(TENANT)
    console.log(activeCurrency)

    const priceEntry = hit.prices.find((entry) => entry.currency === "EUR");
    const price = priceEntry?.tierValues?.[0]?.priceValue || "Price not available";
    const currency = activeCurrency?.symbol || "Currency not available";
    const pdpUrl = '/' + tenant + '/product/details/' + extractProductIDfromObjectID(hit.objectID)
    return (
        <div className="ais-Hits-item">
            <img src={hit.image} alt={hit.title} className="hit-image" />
            <div>
                <h3 className="hit-title">
                    <a href={pdpUrl} rel="noopener noreferrer">
                        {hit.localizedName[currentLanguage] ? hit.localizedName[currentLanguage] : hit.name}
                    </a>
                </h3>
                <p>{currency} {price}</p>
            </div>
        </div>
    )
};

const FullPageSearch = () => {
    const client = algoliasearch(
        localStorage.getItem(APPLICATION_ID),
        localStorage.getItem(SEARCH_KEY)
    )
    const index = localStorage.getItem(INDEX_NAME)
    const [searchState, setSearchState] = React.useState({});
    return (
        <div className="full-page-search">
            <InstantSearch
                indexName={index}
                searchClient={client}
                searchState={searchState}
                onSearchStateChange={(newState) => setSearchState(newState)}
            >
                {/* Search Bar */}
                <div className="search-bar">
                    <SearchBox />
                </div>

                {/* "Did You Mean?" */}
                <DidYouMean searchResults={searchState?.results} refine={(query) => setSearchState({ ...searchState, query })} />

                {/* Sorting Dropdown */}
                <div className="sort-bar">
                    <SortBy
                        items={[
                            { value: 'prod_bbraun', label: 'Default' },
                            { value: 'prod_bbraun_name_asc', label: 'Name (A-Z)' },
                            { value: 'prod_bbraun_name_desc', label: 'Name (Z-A)' },
                            { value: 'prod_bbraun_popularity_asc', label: 'Popularity (High to Low)' },
                            { value: 'prod_bbraun_mixins.AdditionalInformation.originalProductPrice_asc', label: 'Price (Low to High)' },
                        ]}
                    />
                </div>

                {/* Layout */}
                <div className="search-layout">
                    {/* Facets */}
                    <div className="facets">
                        <h4>Categories</h4>
                        <RefinementList attribute="categories" />

                        <h4>Ratings</h4>
                        <div class="ratings ais-RefinementList">
                            <RatingMenu attribute="mixins.reviews.score" refine="true" />
                        </div>
                        
                        <h4>Sales Promotions</h4>
                        <RefinementList attribute="mixins.Characteristics.promotions" />

                        <h4>Campaigns</h4>
                        <RefinementList attribute="mixins.Characteristics.campaigns" />

                        <h4>Brand</h4>
                        <RefinementList attribute="brand" />
                    </div>

                    {/* Results */}
                    <div className="results">
                        <Hits hitComponent={Hit} />
                    </div>
                </div>
            </InstantSearch>
        </div>
    );
};

const Search = () => {
    if (localStorage.getItem(APPLICATION_ID).empty) {
        return (
            <Layout title={'Search'}>
            </Layout>
        )
    }
    return (
        <Layout title={''}>
            <FullPageSearch />
        </Layout>
    )
}

export default Search