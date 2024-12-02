import React, { useEffect, useState } from "react";
import { addTenantToUrl, homeUrl } from '../../services/service.config'
import { Link } from 'react-router-dom'
import { useSites } from 'context/sites-provider'
import { useLanguage } from 'context/language-provider'
import { current } from "@reduxjs/toolkit";

const TopNavigation = ({ locale = 'en' }) => {
    const [navigationItems, setNavigationItems] = useState([]);
    const { currentSite } = useSites()
    

    useEffect(() => {
        // Replace with your Contentful API credentials and fetch logic
        const fetchNavigation = async () => {
            const spaceId = process.env.REACT_APP_CONTENTFUL_SPACE;
            const accessToken = process.env.REACT_APP_CONTENTFUL_TOKEN;
            const environment = process.env.REACT_APP_CONTENTFUL_ENVIRONMENT;

            const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries?content_type=navigation&locale=` + locale;

            try {
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch navigation data.");
                }

                const data = await response.json();

                // Map the Contentful data to navigation items
                const items = data.items.map((item) => ({
                    name: item.fields.name,
                    slug: item.fields.slug,
                    sites: item.fields.sites,
                }));

                setNavigationItems(items);
            } catch (error) {
                console.error("Error fetching navigation data:", error);
            }
        };

        fetchNavigation();
    }, [locale]);

    return (
        <>
        {
                navigationItems.map((item, index) => (
                    !item.sites || item.sites?.includes(currentSite)  ? (
                <button
                    key={index}
                    className="mega_menu_dropbtn"
                >
                    <Link to={!item?.items?.length ? addTenantToUrl(item.slug) : homeUrl}>
                        <div className="text-demoGrayDarkest tracking-tight text-sm mt-[3px] uppercase">
                            {item.name}
                        </div>
                    </Link>
                </button>
                ): (<></>)
            ))
        
        }
        </>
    );
};

export default TopNavigation;