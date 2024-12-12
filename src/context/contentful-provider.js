import React, { createContext, useContext, useEffect, useState } from 'react'
import { useContentfulApi } from '../hooks/useContentfulApi'
import { useLanguage } from './language-provider'

const ContentfulContext = createContext({ fields: {} })

export const useContentful = () => useContext(ContentfulContext)

export const ContentfulProvider = ({ children }) => {
  const [fields, setFields] = useState({})
  const { getEntry, getEntries } = useContentfulApi()
  const { currentLanguage } = useLanguage()
  useEffect(() => {
    ;(async () => {
      const { fields } = await getEntry('3u4iua1uGUweEsBHLJaU6I')
      setFields(fields)
    })()
  }, [currentLanguage])

  return (
    <ContentfulContext.Provider value={{ fields }}>
      {children}
    </ContentfulContext.Provider>
  )
}

export const GetLogo = ({ children }, tenant, site) => {
  const [fields, setFields] = useState({})
  const { getEntries } = useContentfulApi()
  const { currentLanguage } = useLanguage()

  useEffect(() => {
    ;(async () => {
    
      const entries = await getEntries({
        content_type: "logos",
        "fields.tenant": tenant,
        "fields.sites[match]": site,
    });

    if (entries.items.length > 0) {
      const entry = entries.items[0];
      const { fields } = entry
      setFields(fields)
    }
      
    })()
  }, [currentLanguage])

  return (
    <ContentfulContext.Provider value={{ fields }}>
      {children}
    </ContentfulContext.Provider>
  )
}