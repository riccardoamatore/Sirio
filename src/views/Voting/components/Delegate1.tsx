import React from 'react'
import { Button, Box, Breadcrumbs, Card, Flex, Heading, Text, CardHeader, CardBody,ModalBody,
  ModalContainer,
  ModalHeader,
  ModalTitle,ButtonMenu,
  ButtonMenuItem,
  CloseIcon,
  IconButton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import styled from 'styled-components'
import {useCake} from '../../../hooks/useContract'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import BreadcrumbLink from './BreadcrumbLink'
import ProposalsLoading from './Proposals/ProposalsLoading'
import TabMenu from './Proposals/TabMenu'
import ProposalRow from './Proposals/ProposalRow'
import Filters from './Proposals/Filters'




const Delegate1 = () => {
  const cake=useCake();
  const { account } = useActiveWeb3React()
  const handleDelegation= async() =>{
    const tx=await cake.delegate(account)
    const receipt = await tx.wait()
    if(receipt.code!==4001)
      alert("Ok. You are ready to vote!")
  }

  return (
    <Container py="40px">
      <Heading as="h2" scale="xl" mb="32px">
        Delegate
      </Heading>
      <Card>
        <CardHeader>
          The first time you vote you have to Delegate your Sirio to your address
        </CardHeader>
        <CardBody>
          <Button onClick={handleDelegation}>Delegate to yourself</Button>
        </CardBody>
      </Card>
    </Container>
    
  )
}

export default Delegate1