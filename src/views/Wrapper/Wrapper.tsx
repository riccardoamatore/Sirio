import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import styled from 'styled-components'
import { Flex, Text, Button, Card, CardHeader, Modal, LinkExternal, CalculateIcon, IconButton, Input, Heading, CardBody } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import { ModalActions } from 'components/Modal'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, formatNumber } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
import { getInterestBreakdown } from 'utils/compoundApyHelpers'
import { simpleRpcProvider } from 'utils/providers'
import tokens from "config/constants/tokens"
import { useSirioWrapper, useERC20, useSirioMasterchef, useCake } from "../../hooks/useContract"





const AnnualRoiContainer = styled(Flex)`
  cursor: pointer;
`

const AnnualRoiDisplay = styled(Text)`
  width: 72px;
  max-width: 72px;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
`


const Wrapper = function () {
  const sirioWrapper = useSirioWrapper()
  const sirio = useCake()
  const wSirio = useERC20(tokens.wsir.address[56])
  const acc = useWeb3React()
  const [name, setName] = useState(" ");
  const [name2, setName2] = useState(" ");

  const wrap = async () => {
    const tx = await sirioWrapper.wrap((new BigNumber( "1000000000000000000" ).multipliedBy( parseFloat(name) )).toString())
    const receipt = tx.wait()
    if (receipt.code !== 4001)
      window.location.reload()

  }

  const unwrap = async () => {
    const tx = await sirioWrapper.unwrap((new BigNumber( "1000000000000000000" ).multipliedBy( parseFloat(name2) )).toString())
    const receipt = tx.wait()
    if (receipt.code !== 4001)
      window.location.reload()

  }

  const sirioApprove = async () => {
    const tx = await sirio.approve(sirioWrapper.address, "10000000000000000000000000000000000000000")
    const receipt = tx.wait()
    if (receipt.code !== 4001)
      window.location.reload()

  }

  const wSirioApprove = async () => {
    const tx = await wSirio.approve(sirioWrapper.address, "10000000000000000000000000000000000000000")
    const receipt = tx.wait()
    if (receipt.code !== 4001)
      window.location.reload()

  }



  const sirioBalance = async () => {
    const sBalance = await sirio.balanceOf(acc.account)
    if (localStorage.getItem("sirioBalance") !== sBalance)
      localStorage.setItem("sirioBalance", (parseFloat(sBalance) / 1000000000000000000).toString())
  }

  const sirioApproval = async () => {
    const sApp = await sirio.allowance(acc.account, sirioWrapper.address)
    if (localStorage.getItem("sirioApproval") !== sApp)
      localStorage.setItem("sirioApproval", (parseFloat(sApp) / 1000000000000000000).toString())
  }

  const wSirioBalance = async () => {
    const WsBalance = await wSirio.balanceOf(acc.account)
    if (localStorage.getItem("wSirioBalance") !== WsBalance)
      localStorage.setItem("wSirioBalance", (parseFloat(WsBalance) / 1000000000000000000).toString())
  }

  const wSirioApproval = async () => {
    const WsApp = await wSirio.allowance(acc.account, sirioWrapper.address)
    if (localStorage.getItem("wSirioApproval") !== WsApp)
      localStorage.setItem("wSirioApproval", (parseFloat(WsApp) / 1000000000000000000).toString())
  }



  const handleInput = event => {
    setName(event.target.value);
  };

  const handleInput2 = event => {
    setName2(event.target.value);
  };

  sirioBalance()
  wSirioBalance()
  wSirioApproval()
  sirioApproval()




  return (
    <>
      <PageHeader>

        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              Sirio Wrapping
            </Heading>
            <Heading scale="md" color="text">
              Prepare your Sirio to stake.
            </Heading>
          </Flex>

        </Flex>
      </PageHeader>

      <Page>
        <Container py="40px">
          <Card style={{marginBottom:"10px"}} >
            <CardHeader>
              Wrap your Sirio for staking
            </CardHeader>
            <CardBody>
              <Text>Sirio balance: {localStorage.getItem("sirioBalance")} Sir</Text>
              <Input onChange={handleInput} type="number" placeholder="0.0 SIR" style={{marginBottom:"10px"}} />
              {parseInt(localStorage.getItem("sirioApproval")) > 0 ?
                <Button onClick={wrap}>Wrap</Button> :
                <Button onClick={sirioApprove}>Approve</Button>
              }
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              Unwrap your Wrapped Sirio
            </CardHeader>
            <CardBody>
              <Text>Wrapped Sirio balance: {localStorage.getItem("wSirioBalance")} Sir</Text>
              <Input onChange={handleInput2} type="number" placeholder="0.0 WSIR" style={{marginBottom:"10px"}} />

              {parseInt(localStorage.getItem("wSirioApproval")) > 0 ?
                <Button onClick={unwrap}>Unwrap</Button> :
                <Button onClick={wSirioApprove}>Approve</Button>
              }
            </CardBody>
          </Card>
        </Container>



      </Page>
    </>
  )

}

export default Wrapper
