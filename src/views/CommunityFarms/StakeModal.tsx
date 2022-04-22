import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Flex, Text, Button, Modal, LinkExternal, CalculateIcon, IconButton, Input } from '@pancakeswap/uikit'
import { ModalActions } from 'components/Modal'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, formatNumber } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
import { getInterestBreakdown } from 'utils/compoundApyHelpers'
import { useSirioDiversifier, useERC20, useSirioMasterchef } from "../../hooks/useContract"



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
  const sirioMasterchef = useSirioMasterchef()
  console.log(sirioMasterchef)
  const lpContract = useERC20(props[97])

  const acc = useWeb3React()

  const deposit = async () => {
    const lpBalance = await lpContract.balanceOf(acc.account)
    const tx = await sirioMasterchef.enterStaking(lpBalance)
    const receipt = tx.wait()
    if (receipt.code !== 4001)
      window.location.reload()
  }

  const approve = async () => {
    const tx = await lpContract.approve(sirioMasterchef.address, "1000000000000000000000000000000000000000000")
    const receipt = tx.wait()
    if (receipt.code !== 4001)
      window.location.reload()
  }

  const getLPbalance = async () => {
    const bal = await lpContract.balanceOf(acc.account)
    if (localStorage.getItem("LPBalance") !== bal)
      localStorage.setItem("LPBalance", (parseFloat(bal) / 1000000000000000000).toString())
  }

  const getLPapproval = async () => {
    const all = await lpContract.allowance(acc.account, sirioMasterchef.address)
    if (localStorage.getItem("LPallowance") !== all)
      localStorage.setItem("LPallowance", all)
  }


  getLPbalance()

  getLPapproval()

  return (

    <Modal title='Stake Community Farming tokens' onDismiss={onDismiss}>
      <Text>Sirio Community Farming Tokens: {localStorage.getItem("LPBalance")}</Text>
      {parseFloat(localStorage.getItem("LPallowance")) > 0 ?(
        parseFloat(localStorage.getItem("LPBalance"))>0 ?
          <Button onClick={deposit}>Stake All</Button>
          :
          <Button disabled>Stake All</Button>
        
      )      
      :
      <Button onClick={approve}>Approve First</Button>
        }

    </Modal>
  )
}

export default DepositModal
