import React, { useEffect, useState } from 'react'
import {useGovernor} from 'hooks/useContract'
import { Box, Breadcrumbs, Card, Flex, Heading, Text,Button, useModal} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import { useAppDispatch } from 'state'
import { fetchProposals } from 'state/voting'
import { useGetProposalLoadingStatus, useGetProposals } from 'state/voting/hooks'
import { ProposalState, ProposalType, VotingStateLoadingStatus , SirioProposal } from 'state/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useProposalStatus from 'hooks/useProposalStatus'
import { filterProposalsByState, filterProposalsByType } from '../../helpers'
import BreadcrumbLink from '../BreadcrumbLink'
import ProposalsLoading from './ProposalsLoading'
import TabMenu from './TabMenu'
import ProposalRow from './ProposalRow'
import Filters from './Filters'
import prop from '../../../../config/constants/proposals.json'



const Proposals = () => {
 



  return (
    <Container py="40px">
        <Heading as="h2" scale="xl" mb="32px">
        Proposals
        </Heading>
      <div>
      {prop.map((proposal) => (
        
       <ProposalRow proposal={proposal}/>
       
      ))}
      
    </div>
    </Container>
  )
}

export default Proposals
