import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Flex, Text, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { PoolCategory } from 'config/constants/types'
import { Pool } from 'state/types'
import tokens from 'config/constants/tokens'
import { useERC20, useSirioMasterchef } from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ApprovalAction from './ApprovalAction'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'



const InlineText = styled(Text)`
  display: inline;
`

interface CardActionsProps {
  pool: Pool
  stakedBalance: BigNumber
}

const CardActions: React.FC<CardActionsProps> = ({ pool, stakedBalance }) => {
  const { sousId, stakingToken, earningToken, harvest, poolCategory, userData, earningTokenPrice } = pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const wSirio = useERC20(tokens.wsir.address[56])

  const sirioMasterchef = useSirioMasterchef()
  const { t } = useTranslation()

  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO

  const isStaked = stakedBalance.gt(0)
  const isLoading = !userData
  const acc = useActiveWeb3React()


  const wSirioApproval = async () => {
    const WsApp = await wSirio.allowance(acc.account, sirioMasterchef.address)

    if (localStorage.getItem("wSirioApproval") !== WsApp)
      localStorage.setItem("wSirioApproval", (parseFloat(WsApp) / 1000000000000000000).toString())

  }

  wSirioApproval()

  const wSirioBalance = async () => {
    const WsBal = await wSirio.balanceOf(acc.account)

    if (localStorage.getItem("wSirioBalance") !== WsBal)
      localStorage.setItem("wSirioBalance", (parseFloat(WsBal) / 1000000000000000000).toString())

  }

  wSirioBalance()

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        {harvest && (
          <>
            <Box display="inline">
              <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
                {`${earningToken.symbol} `}
              </InlineText>
              <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
                {t('Earned')}
              </InlineText>
            </Box>
            <HarvestActions
              earnings={earnings}
              earningToken={earningToken}
              sousId={sousId}
              earningTokenPrice={earningTokenPrice}
              isBnbPool={isBnbPool}
              isLoading={isLoading}
            />
          </>
        )}
        <Box display="inline">
          <InlineText color={isStaked ? 'secondary' : 'textSubtle'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? stakingToken.symbol : t('Stake')}{' '}
          </InlineText>
          <InlineText color={isStaked ? 'textSubtle' : 'secondary'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? t('Staked') : `${stakingToken.symbol}`}
          </InlineText>
        </Box>
        {!(parseInt(localStorage.getItem("wSirioApproval")) > 0) ? (
          <ApprovalAction pool={pool} isLoading={isLoading} />
        ) : (
          <StakeActions
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={new BigNumber(localStorage.getItem("wSirioBalance"))}
            stakedBalance={stakedBalance}
            isBnbPool={isBnbPool}
            isStaked={isStaked}
          />
        )}
      </Flex>
    </Flex>
  )
}

export default CardActions
