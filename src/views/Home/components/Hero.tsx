import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Flex, Heading, Link, Button, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useCake, useERC20, useSirioMasterchef } from 'hooks/useContract'
import { WBNB, USDT } from 'config/constants/tokens'
import useTheme from 'hooks/useTheme'
import MdexDashboard from 'views/Voting/communityDashboard/mdexDashboard'
import { SlideSvgDark, SlideSvgLight } from './SlideSvg'
import CompositeImage, { getSrcSet, CompositeImageProps } from './CompositeImage'



const flyingAnim = () => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-5px, -5px);
  }
  to {
    transform: translate(0, 0px);
  }  
`

const fading = () => keyframes`
  from {
    opacity: 0.9;
  }
  50% {
    opacity: 0.1;
  }
  to {
    opacity: 0.9;
  }  
`

const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0px;
  left: 0px;
`

const InnerWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: -3px;
`

const BunnyWrapper = styled.div`
  width: 100%;
  animation: ${flyingAnim} 3.5s ease-in-out infinite;
`

const StarsWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  & :nth-child(2) {
    animation: ${fading} 2s ease-in-out infinite;
    animation-delay: 1s;
  }

  & :nth-child(3) {
    animation: ${fading} 5s ease-in-out infinite;
    animation-delay: 0.66s;
  }

  & :nth-child(4) {
    animation: ${fading} 2.5s ease-in-out infinite;
    animation-delay: 0.33s;
  }
`

const imagePath = '/images/home/lunar-bunny/'
const imageSrc = 'bunny'



const starsImage: CompositeImageProps = {
  path: '/images/home/lunar-bunny/',
  attributes: [
    { src: 'star-l', alt: '3D Star' },
    { src: 'star-r', alt: '3D Star' },
    { src: 'star-top-r', alt: '3D Star' },
  ],
}

const Hero = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()

  const wbnb = useERC20("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
  const sirio = useCake()
  const wsirio = useERC20("0x6f5b2D5b578b88322dE6E9238676C83E8b284506")
  const usdt = useERC20("0x55d398326f99059ff775485246999027b3197955")
  const scf = useERC20("0x96e66ff2eb22c573238fe35c047ea360b2390095")
  const lp = useERC20("0x09CB618bf5eF305FadfD2C8fc0C26EeCf8c6D5fd")
  const sirioMasterchef = useSirioMasterchef()

  const getTVL = async () => {

    const wbnbReserve = await wbnb.balanceOf("0x09CB618bf5eF305FadfD2C8fc0C26EeCf8c6D5fd")
    const usdtReserve = await usdt.balanceOf("0x09CB618bf5eF305FadfD2C8fc0C26EeCf8c6D5fd")
    const wbnbReserveSir = await wbnb.balanceOf("0x59d87c6b33a076647b10027b76dc08c45f9c8ef0")
    const sirioReserve = await sirio.balanceOf("0x59d87c6b33a076647b10027b76dc08c45f9c8ef0")
    const wbnbPrice = await parseFloat(usdtReserve) / parseFloat(wbnbReserve)
    const sirioPrice = parseFloat(wbnbReserveSir) / parseFloat(sirioReserve) * wbnbPrice
    const wsirioStaked = await wsirio.balanceOf(sirioMasterchef.address)
    const sirioStaked = await sirio.balanceOf("0x317F0797cbBbef257Cd0C425b02ae00FA17f9a99")
    const lpTotalSupply = await lp.totalSupply()

    const scfPrice = (parseFloat(wbnbReserve) * wbnbPrice + parseFloat(usdtReserve)) / parseFloat(lpTotalSupply) * 2
    const scfMCBalance = await scf.balanceOf(sirioMasterchef.address)
    const sirioTVL = (wsirioStaked * sirioPrice/ 1000000000000000000) + (sirioStaked * sirioPrice / 1000000000000000000) + (scfPrice * parseFloat(scfMCBalance) / 1000000000000000000)
    if (localStorage.getItem("tvl") !== sirioTVL.toFixed(0).toString())
      localStorage.setItem("tvl", sirioTVL.toFixed(0).toString())

  }

  getTVL()

  return (
    <>
      <BgWrapper>
        <InnerWrapper>{theme.isDark ? <SlideSvgDark width="100%" /> : <SlideSvgLight width="100%" />}</InnerWrapper>
      </BgWrapper>
      <Flex
        position="relative"
        flexDirection={['column-reverse', null, null, 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="center"
      >
        <Flex flex="1" flexDirection="column" zIndex={9999}>
          <Heading scale="xxl" color="sirioWhite" mb="24px">
            {t('Sirio Token')}
          </Heading>
          <Heading scale="md" mb="24px">
            {t('The Community Driven Token.')}
          </Heading>

          <Heading scale="xxl" color="secondary" mb="24px">
            {t('')}
          </Heading>
          <MdexDashboard />
          <Heading scale="xl" color="sirioWhite" mb="24px" marginTop='10px'>
            {t('Total Value Locked')}
          </Heading>
          <Heading scale="xxl" color="sirioWhite" mb="24px" marginTop='10px'>
            {localStorage.getItem("tvl")} $
          </Heading>
        </Flex>
        <Flex
          height={['192px', null, null, '100%']}
          width={['192px', null, null, '100%']}
          flex={[null, null, null, '1']}
          mb={['24px', null, null, '0']}
          position="relative"

        >
          <BunnyWrapper>
            <img src={`${imagePath}${imageSrc}.png`} srcSet={getSrcSet(imagePath, imageSrc)} alt={t('Lunar bunny')} />
          </BunnyWrapper>
        </Flex>
      </Flex>
    </>
  )
}

export default Hero
