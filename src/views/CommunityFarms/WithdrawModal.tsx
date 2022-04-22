import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import styled from 'styled-components'
import { Flex, Text, Button, Box, Modal, LinkExternal, CalculateIcon, IconButton, Input } from '@pancakeswap/uikit'
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
  onDismiss?: () => void,
  props: any
}

const DepositModal: React.FC<DepositModalProps> = ({ onDismiss, props }) => {
  const sirioDiversifier = useSirioDiversifier()
  const sirioMasterchef = useSirioMasterchef()
  const sirio = useCake()
  const acc = useWeb3React()
  const lpContract = useERC20(props[97])

  const withdraw = async () => {
    const tx = await sirioDiversifier.unstake()
    const receipt = tx.wait()
    if (receipt.code !== 4001)
      window.location.reload()

  }

  const sirioBalance = async () => {
    const sBalance = await sirio.balanceOf(acc.account)
    if (localStorage.getItem("sirioBalance") !== sBalance)
      localStorage.setItem("sirioBalance", (parseFloat(sBalance) / 1000000000000000000).toString())
  }


  sirioBalance()

  const bnbBalance = async () => {
    const bBalance = await simpleRpcProvider.getBalance(acc.account)
    if (localStorage.getItem("bBalance") !== bBalance.toString())
      localStorage.setItem("bBalance", (parseFloat(bBalance.toString()) / 1000000000000000000).toString())
  }

  bnbBalance()

  const getLPapproval = async () => {
    const all = await lpContract.allowance(acc.account, sirioMasterchef.address)
    if (localStorage.getItem("LPallowance") !== all)
      localStorage.setItem("LPallowance", all)
  }

  getLPapproval()

  const approve = async () => {
    const tx = await lpContract.approve(sirioDiversifier.address, "1000000000000000000000000000000000000000000000000")
    const receipt = tx.wait()
    if (receipt.code !== 4001)
      window.location.reload()

  }
  const getLPbalance = async () => {
    const bal = await lpContract.balanceOf(acc.account)
    if (localStorage.getItem("LPBalance") !== bal)
      localStorage.setItem("LPBalance", (parseFloat(bal) / 1000000000000000000).toString())
  }

  getLPbalance()

  return (
    <Box mt="24px" ml="44%">
      {parseFloat(localStorage.getItem("LPBalance")) > 0 ?
        <Flex alignItems="center" mb="8px" style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'space-between',
          height: 36,
          marginTop: 20,
          borderRadius: 2
        }}>
          <Button onClick={withdraw}>Withdraw</Button>
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
          <Button disabled>Withdraw</Button>
        </Flex>

      }

    </Box>
  )


}

export default DepositModal
