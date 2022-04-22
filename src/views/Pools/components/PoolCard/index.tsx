import BigNumber from 'bignumber.js'
import React from 'react'
import { CardBody, Flex, Text, CardRibbon } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { Pool } from 'state/types'
import { useSirioMasterchef, useSirioWrapper } from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import AprRow from './AprRow'
import { StyledCard } from './StyledCard'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'


const PoolCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const { sousId, stakingToken, earningToken, isFinished, userData } = pool
  const { t } = useTranslation()
  const sirioMasterchef = useSirioMasterchef()
  const acc = useActiveWeb3React()

  const wSirioBalance = async () => {
    const staked = await sirioMasterchef.userInfo(sousId + 1, acc.account).catch((err) => { console.log(err) })
    if (staked) {
      if (localStorage.getItem("staked") !== staked[0])
        localStorage.setItem("staked", (parseFloat(staked[0]) / 1000000000000000000).toString())
    }
  }

  wSirioBalance()

  const stakedBalance = new BigNumber(localStorage.getItem("staked"))
  const accountHasStakedBalance = stakedBalance.gt(0)

  return (
    <StyledCard
      isFinished={isFinished && sousId !== 0}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <StyledCardHeader
        isStaking={accountHasStakedBalance}
        earningToken={earningToken}
        stakingToken={stakingToken}
        isFinished={isFinished && sousId !== 0}
      />
      <CardBody>
        <AprRow pool={pool} stakedBalance={stakedBalance} />
        <Flex mt="24px" flexDirection="column">
          {account ? (
            <CardActions pool={pool} stakedBalance={stakedBalance} />
          ) : (
            <>
              <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                {t('Start earning')}
              </Text>
              <ConnectWalletButton />
            </>
          )}
        </Flex>
      </CardBody>
    </StyledCard>
  )
}

export default PoolCard
