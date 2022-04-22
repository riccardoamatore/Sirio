import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardHeader, ArrowForwardIcon, Box, IconButton, Flex, Text, Button, Progress } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { SirioProposal } from 'state/types'
import { useGovernor } from 'hooks/useContract'
import { ClosedTag, CommunityTag, CoreTag, SoonTag, VoteNowTag } from 'components/Tags'



interface ProposalRowProps {
  proposal: SirioProposal
}

const StyledProposalRow = styled(Link)`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  display: flex;
  padding: 16px 24px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.dropdown};
  }
`



const ProposalRow: React.FC<ProposalRowProps> = ({ proposal }) => {
  const governorContract = useGovernor()


  const getProposalStatus = async () => {
    const result = await governorContract.state(proposal.id)
    if (localStorage.getItem(proposal.id) !== result.toString()) {
      localStorage.setItem(proposal.id, result.toString())
      window.location.reload()
    }
  }

  getProposalStatus()

  const getForVotes = async () => {
    const result = await governorContract.getForVotes(proposal.id)
    if (localStorage.getItem(`${proposal.id}for`) !== result.toString()) {
      localStorage.setItem(`${proposal.id}for`, result.toString())
      window.location.reload()
    }
  }

  getForVotes()

  const getAgainstVotes = async () => {
    const result = await governorContract.getAgainstVotes(proposal.id)
    if (localStorage.getItem(`${proposal.id}against`) !== result.toString()) {
      localStorage.setItem(`${proposal.id}against`, result.toString())
      window.location.reload()
    }
  }

  getAgainstVotes()
  
  
  const handleFor = async (proposalId) => {
    const tx = await governorContract.castVote(proposalId, 1);
    const receipt = await tx.wait()
    if (receipt.code !== 4001)
      alert("Thank you for your vote!")
  }

  const handleAgainst = async (proposalId) => {
    const tx = await governorContract.castVote(proposalId, 0);
    const receipt = await tx.wait()
    if (receipt.code !== 4001)
      alert("Thank you for your vote!")
  }
  /*  <Flex alignItems="center" mb="8px">
            <TimeFrame startDate={proposal.start} endDate={proposal.end} proposalState={proposal.state} />
          </Flex> */
  return (

    <div  style={{marginTop:40}}>
      
      {localStorage.getItem(proposal.id) === "1" ?
        <Card>
          <CardHeader>
            <Flex alignItems="center" justifyContent="space-between">
              <Text color="sirioWhite">{proposal.description}</Text>
              <VoteNowTag />
            </Flex>
          </CardHeader>
          <CardBody>
            <p>Operations: {proposal.operations}</p>
            {proposal.id === "96458435314086978198572800983476621502463654488477134528485941059116652356740" ?
              <Text color="green">Expires on 20/09/2021 at 19UTC</Text>
              :
              <Text color="green">.</Text>
              }
            <Flex alignItems="center" mb="8px" style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'space-between',
              height: 36,
              marginTop: 20,
              borderRadius: 2
            }}>
              <Button onClick={() => handleFor(proposal.id.toString())} variant="success">For</Button>

              <Button onClick={() => handleAgainst(proposal.id.toString())} variant="danger">Against</Button>
            </Flex>
            <Box mt="24px">
              <Flex alignItems="center" mb="8px">
                For
              </Flex>
              <Box mb="4px">
                <Progress primaryStep={(parseInt(localStorage.getItem(`${proposal.id}for`)) / (parseInt(localStorage.getItem(`${proposal.id}for`))+parseInt(localStorage.getItem(`${proposal.id}against`)))*100)} scale="sm" />
              </Box>
              <Flex alignItems="center" justifyContent="space-between">
                <Text color="textSubtle">{localStorage.getItem(`${proposal.id}for`)} Votes</Text>
                <Text>
                {(parseInt(localStorage.getItem(`${proposal.id}for`)) / (parseInt(localStorage.getItem(`${proposal.id}for`))+parseInt(localStorage.getItem(`${proposal.id}against`)))*100)}%
                </Text>
              </Flex>
            </Box>
            <Box mt="24px">
              <Flex alignItems="center" mb="8px">
                Against
              </Flex>
              <Box mb="4px">
                <Progress primaryStep={(parseInt(localStorage.getItem(`${proposal.id}against`)) / (parseInt(localStorage.getItem(`${proposal.id}for`))+parseInt(localStorage.getItem(`${proposal.id}against`)))*100)} scale="sm" />
              </Box>
              <Flex alignItems="center" justifyContent="space-between">
                <Text color="textSubtle">{localStorage.getItem(`${proposal.id}against`)} Votes</Text>
                <Text>
                {(parseInt(localStorage.getItem(`${proposal.id}against`)) / (parseInt(localStorage.getItem(`${proposal.id}for`))+parseInt(localStorage.getItem(`${proposal.id}against`)))*100)}%
                </Text>

              </Flex>
            </Box>
          </CardBody>
        </Card>
        :

        <Card>
          <CardHeader>
            <Flex alignItems="center" justifyContent="space-between">
              {proposal.description}<ClosedTag />
            </Flex>
          </CardHeader>
          <CardBody>
            <p>Operations: {proposal.operations}</p>
            <Text color="red">Expired</Text>
            <Flex alignItems="center" mb="8px" style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'space-between',
              height: 36,
              marginTop: 20,
              borderRadius: 2
            }}>
              <Button  variant="success" disabled onClick={() => handleFor(proposal.id.toString())}>For</Button>

              <Button variant="danger" disabled onClick={() => handleAgainst(proposal.id.toString())}>Against</Button>
            </Flex>
            <Box mt="24px">
              <Flex alignItems="center" mb="8px">
                For
              </Flex>
              <Box mb="4px">
                <Progress primaryStep={(Math.floor(parseInt(localStorage.getItem(`${proposal.id}for`)) / parseInt(localStorage.getItem(`${proposal.id}for`)) + parseInt(localStorage.getItem(`${proposal.id}against`))) * 100)} scale="sm" />
              </Box>
              <Flex alignItems="center" justifyContent="space-between">
                <Text color="textSubtle">{localStorage.getItem(`${proposal.id}for`)} Votes</Text>
                <Text>
                {(parseInt(localStorage.getItem(`${proposal.id}for`)) / (parseInt(localStorage.getItem(`${proposal.id}for`))+parseInt(localStorage.getItem(`${proposal.id}against`)))*100)}%
                </Text>
              </Flex>
            </Box>
            <Box mt="24px">
              <Flex alignItems="center" mb="8px">
                Against
              </Flex>
              <Box mb="4px">
                <Progress primaryStep={(Math.floor(parseInt(localStorage.getItem(`${proposal.id}against`)) / parseInt(localStorage.getItem(`${proposal.id}for`)) + parseInt(localStorage.getItem(`${proposal.id}against`))) * 100)} scale="sm" />
              </Box>
              <Flex alignItems="center" justifyContent="space-between">
                <Text color="textSubtle">{localStorage.getItem(`${proposal.id}against`)} Votes</Text>
                <Text>
                {(parseInt(localStorage.getItem(`${proposal.id}against`)) / (parseInt(localStorage.getItem(`${proposal.id}for`))+parseInt(localStorage.getItem(`${proposal.id}against`)))*100)}%
                </Text>
              </Flex>
            </Box>
          </CardBody>
        </Card>
      }


    </div>
  )
}

export default ProposalRow
