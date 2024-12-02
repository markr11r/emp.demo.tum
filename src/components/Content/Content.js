import { useAuth } from 'context/auth-provider'
import { useLanguage } from 'context/language-provider'
import { useContentfulApi } from 'hooks/useContentfulApi'
import React, { useEffect, useState, useRef } from 'react'
import { createClient } from "contentful";
import './Content.css'
import { useSites } from 'context/sites-provider'
import { TENANT } from '../../constants/localstorage'

const Content = ({ site }) => {

    const [images, setImages] = useState([]);
    const [imageWidth, setImageWidth] = useState(0);
    const [error, setError] = useState(null);
    const currentSite = site
    const tenant = localStorage.getItem(TENANT)

    const client = createClient({
        space: process.env.REACT_APP_CONTENTFUL_SPACE,
        accessToken: process.env.REACT_APP_CONTENTFUL_TOKEN,
    });

    function SetImgWidthFromScreenWidth() {
        //if (window.innerWidth < imageWidth) { setImageWidth(window.innerWidth); }
        //else if (contentName.includes('Banner')) { setImageWidth(window.innerWidth); }
        { setImageWidth(window.innerWidth); }
    }

    // Update width on window resize
    useEffect(() => {
        window.addEventListener('resize', SetImgWidthFromScreenWidth);
        return () => window.removeEventListener('resize', SetImgWidthFromScreenWidth);
    });


    useEffect(() => {
        SetImgWidthFromScreenWidth()
        const fetchContentItems = async () => {
          try {
            const entries = await client.getEntries({
              content_type: "items",
              "fields.tenant": tenant,
              "fields.sites[match]": currentSite,
              order: "fields.name",
            });
    
            const uniqueImageUrls = new Set();
            for (const entry of entries.items) {
              const itemImageId = entry.fields.image?.sys.id;
              if (itemImageId) {
                const asset = await client.getAsset(itemImageId);
                uniqueImageUrls.add(asset.fields.file.url);
              }
            }
    
            setImages(Array.from(uniqueImageUrls)); // Convert Set back to array
          } catch (err) {
            setError("Error fetching image data.");
            console.error(err);
          }
        };
    
        if (tenant && currentSite) {
          fetchContentItems();
        }
      }, [tenant, currentSite]); // Remove client from dependencies
    
      if (error) {
        return <p>Error: {error}</p>;
      }

    return (
        <div className="home_content">
            <div className="home_content_block">
                {images?.map((url, index) => (
                    <div
                        style={{
                            width: `${imageWidth}px`,
                        }}
                    >
                        <img
                            key={index}
                            src={`https:${url}`}
                            alt={`Image ${index + 1}`}
                            style={{ width: `${imageWidth}px` }}
                        />
                    </div>
                ))}
            </div>
        </div >

    )
}

export default Content