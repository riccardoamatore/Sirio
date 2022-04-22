import React from 'react'
import styled from 'styled-components'
import { Flex, TooltipText, IconButton, useModal, CalculateIcon, Skeleton, useTooltip, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { Pool } from 'state/types'
import { getAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { useERC20, useCake, useSirioMasterchef } from 'hooks/useContract'

interface AprRowProps {
  pool: Pool
  stakedBalance: BigNumber
  performanceFee?: number
}

const AprRow: React.FC<AprRowProps> = ({ pool, stakedBalance, performanceFee = 0 }) => {
  const { t } = useTranslation()
  const { stakingToken, earningToken, isFinished, apr, earningTokenPrice, stakingTokenPrice, userData, isAutoVault } =
    pool

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const tooltipContent = isAutoVault
    ? t('APY includes compounding, APR doesn’t. This pool’s CAKE is compounded automatically, so we show APY.')
    : t('This pool’s rewards aren’t compounded automatically, so we show APR')

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })

  const wsirio = useERC20("0x6f5b2D5b578b88322dE6E9238676C83E8b284506")
  const sirioInAYear = 5256000000
  const sirioMasterchef = useSirioMasterchef()


  const getSirioPrice = async () => {
    
    const wsirioReserve = await wsirio.balanceOf(sirioMasterchef.address)

    const apr1 = sirioInAYear / (wsirioReserve / 1000000000000000000) * 100

    if (localStorage.getItem("aprp") !== apr1.toFixed(0).toString())
      localStorage.setItem("aprp", apr1.toFixed(0).toString())

  }

  getSirioPrice()

  const apyModalLink = stakingToken.address ? `/swap?outputCurrency=${getAddress(stakingToken.address)}` : '/swap'



  return (
    <Flex alignItems="center" justifyContent="space-between">
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef}>{isAutoVault ? `${t('APY')}:` : `${t('APR')}:`}</TooltipText>
      {isFinished || !localStorage.getItem("aprp") ? (
        <Skeleton width="82px" height="32px" />
      ) : (
        <Text>{parseFloat(localStorage.getItem("aprp")).toString()} %</Text>
      )}
    </Flex>
  )
}

export default AprRow
