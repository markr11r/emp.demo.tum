import React, { useState, createContext, useContext } from 'react'
import About from './About'
import Service from './Service'
import Category from './Category'
import Product from './Product'
import Subscribe from './Subscribe'
import Layout from '../Layout'
import Content from '../../components/Content/Content'
import { useSites } from 'context/sites-provider'

const Home = () => {
  const { currentSite } = useSites()
  return (
    <Layout title={'home'}>
      <Content site={currentSite} />
      <Category />
      <Subscribe />
    </Layout>
  )
}

export default Home
