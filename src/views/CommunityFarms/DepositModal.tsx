import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import styled from 'styled-components'
import { Flex, Text, Box, Button, Modal, LinkExternal, CalculateIcon, IconButton, Input } from '@pancakeswap/uikit'
import { ModalActions } from 'components/Modal'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, formatNumber } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
import { getInterestBreakdown } from 'utils/compoundApyHelpers'
import { simpleRpcProvider } from 'utils/providers'
import { useSirioDiversifier, useERC20, useSirioMasterchef, useCake } from "../../hooks/useContract"




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

interface DepositModalProps {
  onDismiss?: () => void
}

const DepositModal: React.FC<DepositModalProps> = ({ onDismiss }) => {
  const sirioDiversifier = useSirioDiversifier()
  const sirio = useCake()
  const acc = useWeb3React()
  const [name, setName] = useState(" ");
  localStorage.setItem("amount", name);

  const deposit = async () => {
    const tx = await sirioDiversifier.diversify({ value: (new BigNumber(name).multipliedBy(new BigNumber(1000000000000000000))).toString() })
    const receipt = tx.wait()
    if (receipt.code !== 4001)
      window.location.reload()

  }



  const sirioBalance = async () => {
    const sBalance = await sirio.balanceOf(acc.account)
    if (localStorage.getItem("sirioBalance") !== sBalance)
      localStorage.setItem("sirioBalance", (parseFloat(sBalance) / 1000000000000000000).toString())
  }

  const handleInput = event => {
    setName(event.target.value);
  };

  sirioBalance()

  const bnbBalance = async () => {
    const bBalance = await simpleRpcProvider.getBalance(acc.account)
    if (localStorage.getItem("bBalance") !== bBalance.toString())
      localStorage.setItem("bBalance", (parseFloat(bBalance.toString()) / 1000000000000000000).toString())
  }

  bnbBalance()


  return (
    <Box mt="24px">
      <Flex alignItems="center" mb="8px">
        <Text>Deposit First (1% deposit fee) and Farm Sirio!</Text>
      </Flex>
      <Flex alignItems="center" mb="8px">
        <Text>Sirio balance: <b style={{textAlign:'center',color:'white'}}>{localStorage.getItem("sirioBalance")} Sir</b></Text>
      </Flex>
      <Flex alignItems="center" mb="8px">
        <Text>BNB balance: <b style={{textAlign:'center',color:'white'}}>{localStorage.getItem("bBalance")} BnB</b></Text>
      </Flex>
      <Box mb="4px">
        <Input onChange={handleInput}  style={{textAlign:'center',color:'green'}} type="number" placeholder="0.0 BNB" />
      </Box>
      {parseFloat(localStorage.getItem("amount")) > 0 ?
        <Flex alignItems="center" mb="8px" style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'space-between',
          height: 36,
          marginTop: 20,
          borderRadius: 2
        }}>
          <Button onClick={deposit}>Deposit</Button>
        </Flex>
        :
        <Flex alignItems="center" mb="8px" style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'space-between',
          height: 36,
          marginTop: 20,
          borderRadius: 2
        }}>
          <Button disabled>Deposit</Button>
        </Flex>      
      }

    </Box>
  )
}

export default DepositModal
