import React, { useEffect, useState } from "react";
import { createClient } from "contentful";
import { homeUrl } from '../../services/service.config'
import { useSites } from 'context/sites-provider'
import { TENANT } from '../../constants/localstorage'

const Logo = () => {
    const [logoUrl, setLogoUrl] = useState(null);
    const [error, setError] = useState(null);
    const { currentSite } = useSites()
    const tenant = localStorage.getItem(TENANT)

    const client = createClient({
        space: process.env.REACT_APP_CONTENTFUL_SPACE,
        accessToken: process.env.REACT_APP_CONTENTFUL_TOKEN,
    });

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const entries = await client.getEntries({
                    content_type: "logos",
                    "fields.tenant": tenant,
                    "fields.sites[match]": currentSite,
                });

                if (entries.items.length > 0) {
                    const logoEntry = entries.items[0];
                    const logoImageId = logoEntry.fields.image?.sys.id;

                    if (logoImageId) {
                        const asset = await client.getAsset(logoImageId);
                        setLogoUrl(asset.fields.file.url);
                    } else {
                        setError("Logo image not found.");
                    }
                } else {
                    setError("No logo entry matches the provided criteria.");
                }
            } catch (err) {
                setError("Error fetching logo data.");
                console.error(err);
            }
        };

        fetchLogo();
    });

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!logoUrl) {
        return <p>Loading...</p>;
    }

    return (
        <a href={homeUrl()} className="flex">
            <img src={`https:${logoUrl}`} alt={`${tenant} logo`} />
        </a>)
};

export default Logo;