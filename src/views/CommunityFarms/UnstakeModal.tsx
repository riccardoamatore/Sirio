import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Flex, Text, Button, Modal, LinkExternal, CalculateIcon, IconButton } from '@pancakeswap/uikit'
import { ModalActions } from 'components/Modal'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, formatNumber } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
import { getInterestBreakdown } from 'utils/compoundApyHelpers'
import { useSirioDiversifier, useCake, useSirioMasterchef } from "../../hooks/useContract"

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

const UnstakeModal: React.FC<DepositModalProps> = ({ onDismiss }) => {
  const sirioDiversifier = useSirioDiversifier()
  const sirioMasterchef = useSirioMasterchef()
  const acc = useWeb3React()

  const unstake = async () => {
    const info = await sirioMasterchef.userInfo(0, acc.account)
    const tx = await sirioMasterchef.leaveStaking(info[0])
    const receipt = tx.wait()
    if (receipt.code !== 4001)
      window.location.reload()

  }

  const getLPstaked = async () => {
    const all = await sirioMasterchef.userInfo(0, acc.account)
    if (localStorage.getItem("LPstaked") !== all)
      localStorage.setItem("LPstaked", (parseFloat(all[0]) / 1000000000000000000).toString())
  }

  getLPstaked()


  return (
    <Modal title='Unstake Community Farming token' onDismiss={onDismiss}>
      <Text>Community Farming Token staked: {localStorage.getItem("LPstaked")}</Text>
      {parseFloat(localStorage.getItem("LPstaked")) === 0 ?
        <Button disabled>Unstake</Button>
        :
        <Button onClick={unstake}>Unstake</Button>
      }
    </Modal>
  )
}

export default UnstakeModal
