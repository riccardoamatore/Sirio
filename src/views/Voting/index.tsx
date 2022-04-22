import React from 'react'
import { Button, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'
import Delegate1 from './components/Delegate1'
import Proposals from './components/Proposals/Proposals'
import Hero from './components/Hero'
import Footer from './components/Footer'



const Chrome = styled.div`
  flex: none;
`

const Content = styled.div`
  flex: 1;
  height: 100%;
`


const Voting = () => {
  return (
    <Flex flexDirection="column" minHeight="calc(100vh - 64px)">
    <Chrome>
      <Hero />
    </Chrome>
    <Content>
      <Delegate1 />
      <Proposals />
    </Content>
  </Flex>
  )
}

export default Voting
