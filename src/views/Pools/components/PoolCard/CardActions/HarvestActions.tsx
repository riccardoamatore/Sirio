import React from 'react'
import { Flex, Text, Button, Heading, useModal, Skeleton } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { Token } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { useCake, useERC20, useSirioMasterchef} from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import CollectModal from '../Modals/CollectModal'



interface HarvestActionsProps {
  earnings: BigNumber
  earningToken: Token
  sousId: number
  earningTokenPrice: number
  isBnbPool: boolean
  isLoading?: boolean
}

const HarvestActions: React.FC<HarvestActionsProps> = ({
  earnings,
  earningToken,
  sousId,
  isBnbPool,
  earningTokenPrice,
  isLoading = false,
}) => {
  const { t } = useTranslation()

  const sirioMasterchef=useSirioMasterchef()
  const acc=useActiveWeb3React()

  const wbnb=useERC20("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
  const usdtToken = useERC20("0x55d398326f99059ff775485246999027b3197955")
  const sirio=useCake();


  const wSirioBalance= async()=>{
    const ear=await sirioMasterchef.pendingSirio(sousId+1,acc.account).catch((err)=>{console.log(err)})
    if(localStorage.getItem("earnings")!==ear)
        localStorage.setItem("earnings",(parseFloat(ear)/1000000000000000000).toString())
  }

  wSirioBalance()

  const getPrice= async()=>{
    const wbnbReserve = await wbnb.balanceOf("0x59d87c6b33a076647b10027b76dc08c45f9c8ef0")
    const sirioReserve = await sirio.balanceOf("0x59d87c6b33a076647b10027b76dc08c45f9c8ef0")
    const stakedReserveWbnb = await wbnb.balanceOf("0x09CB618bf5eF305FadfD2C8fc0C26EeCf8c6D5fd")
    const stakedReserveUsdt = await usdtToken.balanceOf("0x09CB618bf5eF305FadfD2C8fc0C26EeCf8c6D5fd")
    const wbnbPrice = stakedReserveUsdt/stakedReserveWbnb

    const sirioPrice = wbnbReserve / sirioReserve * wbnbPrice
    const earningsPrice = parseFloat(localStorage.getItem("earnings"))*sirioPrice
    
    
    if(localStorage.getItem("earningsPrice")!==earningsPrice.toString())
        localStorage.setItem("earningsPrice",earningsPrice.toString())
  }
  getPrice()
  const earnings1=new BigNumber(localStorage.getItem("earnings"))
  
  const earningTokenBalance = getBalanceNumber(earnings1, earningToken.decimals)
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3)

  const earningTokenDollarBalance = getBalanceNumber(earnings1.multipliedBy(earningTokenPrice), earningToken.decimals)

  const fullBalance = getFullDisplayBalance(earnings1, earningToken.decimals)

  const hasEarnings = earnings1.toNumber() > 0
  const isCompoundPool = sousId === 0

  const onPresentCollect = async()=>{
    const tx=await sirioMasterchef.deposit(sousId+1,"0")
    const receipt=tx.wait()
    if(receipt.code!==4001)
        window.location.reload()
  
  }
  return (
    <Flex justifyContent="space-between" alignItems="center" mb="16px">
      <Flex flexDirection="column">
        {isLoading ? (
          <Skeleton width="80px" height="48px" />
        ) : (
          <>
            {hasEarnings ? (
              <>
                <Balance bold fontSize="20px" decimals={5} value={parseFloat(localStorage.getItem("earnings"))} />
                {earningTokenPrice > 0 && (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    prefix="~"
                    value={parseFloat(localStorage.getItem("earningsPrice"))}
                    unit=" USD"
                  />
                )}
              </>
            ) : (
              <>
                <Heading color="textDisabled">0</Heading>
                <Text fontSize="12px" color="textDisabled">
                  0 USD
                </Text>
              </>
            )}
          </>
        )}
      </Flex>
      <Button disabled={!hasEarnings} onClick={onPresentCollect}>
        {isCompoundPool ? t('Collect') : t('Harvest')}
      </Button>
    </Flex>
  )
}

export default HarvestActions
