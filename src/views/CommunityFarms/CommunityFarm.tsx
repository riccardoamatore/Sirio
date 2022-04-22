import { useWeb3React } from "@web3-react/core"
import { HelpIcon, Button, Input, useModal, Heading, Card, CardHeader, CardBody, Text, Table, Flex, CardFooter, useTooltip } from "@pancakeswap/uikit"
import { ChainId } from "@pancakeswap/sdk"
import BigNumber from "bignumber.js"
import Container from 'components/Layout/Container'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import DesktopImage from "../Voting/components/DesktopImage"
import { useSirioDiversifier, useCake, useSirioMasterchef, useERC20 } from "../../hooks/useContract"
import DepositModal from "./DepositModal"
import StakeModal from "./StakeModal"
import UnstakeModal from "./UnstakeModal"
import WithdrawModal from "./WithdrawModal"

import Hero from './components/Hero'


const Chrome = styled.div`
  flex: none;
`

const Content = styled.div`
  flex: 1;
  height: 100%;
`
const ReferenceElement = styled.div`
  display: inline-block;
`


const CommunityFarm = (par) => {

    const { t } = useTranslation()
    const { targetRef, tooltip, tooltipVisible } = useTooltip(
        t('You are not farming yet, you have to stake the deposit through the stake button!'),
        { placement: 'top-end', tooltipOffset: [20, 10] },
    )

    const { pid, lpAddresses, lpSymbol } = par.par
    const sirioDiversifier = useSirioDiversifier()
    const sirio = useCake()
    const account = useWeb3React()
    const sirioMasterchef = useSirioMasterchef()
    const wbnb = useERC20("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
    const stakedCommunityToken = useERC20("0x96e66Ff2eB22c573238FE35C047EA360b2390095")
    const mdexToken = useERC20("0x09CB618bf5eF305FadfD2C8fc0C26EeCf8c6D5fd")
    const usdtToken = useERC20("0x55d398326f99059ff775485246999027b3197955")
    const sirioInAYear = 5256000000

    const getSirioPrice = async () => {
        const wbnbReserve = await wbnb.balanceOf("0x59d87c6b33a076647b10027b76dc08c45f9c8ef0")
        const sirioReserve = await sirio.balanceOf("0x59d87c6b33a076647b10027b76dc08c45f9c8ef0")
        const sirioPrice = wbnbReserve / sirioReserve
        const stakedReserve = await stakedCommunityToken.balanceOf(sirioMasterchef.address)
        const stakedReserveWbnb = await wbnb.balanceOf("0x09CB618bf5eF305FadfD2C8fc0C26EeCf8c6D5fd")
        const stakedReserveUsdt = await usdtToken.balanceOf("0x09CB618bf5eF305FadfD2C8fc0C26EeCf8c6D5fd")
        const stakedReserveTotalSupply = await mdexToken.totalSupply()
        const stakedReservePrice = (((parseFloat(stakedReserveWbnb) * 2) / stakedReserveTotalSupply) * 2)
        const stakedReservePriceUsd = (((parseFloat(stakedReserveUsdt) * 2) / stakedReserveTotalSupply) * 2)
        localStorage.setItem("stakedReservePrice", stakedReservePrice.toString())
        localStorage.setItem("stakedReservePriceUsd", stakedReservePriceUsd.toString())
        const poolLiquidityBnb = stakedReserve / 1000000000000000000 * stakedReservePrice
        const apr = sirioInAYear * sirioPrice / poolLiquidityBnb * 100
        if (localStorage.getItem("apr") !== apr.toFixed(0).toString())
            localStorage.setItem("apr", apr.toFixed(0).toString())
    }

    getSirioPrice()

    const [onPresentDeposit] = useModal(
        <DepositModal />
    )

    const [onPresentStake] = useModal(
        <StakeModal props={lpAddresses} />
    )

    const [onPresentUnstake] = useModal(
        <UnstakeModal />
    )

    const [onPresentWithdraw] = useModal(
        <WithdrawModal props={lpAddresses} />
    )

    const acc = useWeb3React()
    const lpContract = useERC20(lpAddresses[97])

    const getLPapproval = async () => {
        const all = await lpContract.allowance(acc.account, sirioMasterchef.address)
        if (localStorage.getItem("LPallowance") !== all)
            localStorage.setItem("LPallowance", all)
    }

    getLPapproval()
    const deposit = async () => {
        const lpBalance = await lpContract.balanceOf(acc.account)
        localStorage.setItem("lpBalance", lpBalance._hex)
    }
    deposit();

    const getLPstaked = async () => {
        const all = await sirioMasterchef.userInfo(0, acc.account)
        if (localStorage.getItem("LPstaked") !== all)
            localStorage.setItem("LPstaked", (parseFloat(all[0]) / 1000000000000000000).toString())
    }

    getLPstaked()

    const harvest = async () => {
        const tx = await sirioMasterchef.enterStaking(0)
        const receipt = tx.wait()
        if (receipt.code !== 4001)
            window.location.reload()
    }

    const handleSirioApprove = async () => {
        const tx = await sirio.approve(sirioDiversifier.address, "10000000000000000000000000000000000000000000000000000")
        const receipt = tx.wait()
        if (receipt.code !== 4001)
            window.location.reload()
    }

    const handleWithrawApprove = async () => {
        const tx = await stakedCommunityToken.approve(sirioDiversifier.address, "10000000000000000000000000000000000000000000000000000")
        const receipt = tx.wait()
        if (receipt.code !== 4001)
            window.location.reload()
    }

    const getApproval = async () => {
        const approval = await sirio.allowance(account.account, sirioDiversifier.address)
        if (localStorage.getItem("approval") !== approval)
            localStorage.setItem("approval", approval)
    }

    getApproval()

    const getApprovalWithdraw = async () => {
        const approval = await stakedCommunityToken.allowance(account.account, sirioDiversifier.address)
        if (localStorage.getItem("approvalWit") !== approval)
            localStorage.setItem("approvalWit", approval)
    }

    getApprovalWithdraw()

    const getSirioFarmed = async () => {
        const farmed = await sirioMasterchef.pendingSirio(pid, account.account)
        if (localStorage.getItem("farmedSirio") !== farmed)
            localStorage.setItem("farmedSirio", farmed)
    }

    getSirioFarmed()
    const getLPbalance = async () => {
        const bal = await lpContract.balanceOf(acc.account)
        if (localStorage.getItem("LPBalance") !== bal)
            localStorage.setItem("LPBalance", (parseFloat(bal) / 1000000000000000000).toString())
    }

    getLPbalance()
    const depositValue = async () => {
        const a = parseFloat(localStorage.getItem("LPstaked"))
        const b = parseFloat(localStorage.getItem("stakedReservePriceUsd"))
        const c = parseFloat(localStorage.getItem("LPBalance"))
        if (localStorage.getItem("stakedValue") !== (a * b).toString())
            localStorage.setItem("stakedValue", (a * b).toString())
        if (localStorage.getItem("depositValue") !== (b * c).toString())
            localStorage.setItem("depositValue", (b * c).toString())
    }
    depositValue();
    return (
        <Flex flexDirection="column" minHeight="100vh">
            <Chrome>
                <Hero />
            </Chrome>
            <Content>
                <Container py="1vh">
                    <Flex>
                        <DesktopImage src="../images/CommunityFarms/mdex.png" width={100} height={100} style={{ marginLeft: '1vh', marginRight: '1vh', marginBottom: '1vh' }} />
                        <Text style={{ marginLeft: '1vh' }}>{lpSymbol}</Text>
                        <DesktopImage src="../images/CommunityFarms/pancakeswap.png" width={100} height={100} style={{ marginLeft: '1vh', marginRight: '1vh', marginBottom: '1vh' }} />
                    </Flex>
                   
                    <Text>
                        <Card>
                            <CardHeader style={{ textAlign: 'center', fontSize: '4vh' }}>
                                <b style={{ fontSize: '4vh' }}>APR</b>
                            </CardHeader>
                            <CardBody>
                                <Heading style={{ textAlign: 'center', color: 'green', fontSize: '4vh' }}>
                                    {localStorage.getItem("apr")} %
                                </Heading>
                            </CardBody>
                        </Card>
                    </Text>
                    <Text py="2vh">
                         {((parseFloat(localStorage.getItem("farmedSirio")) / 1000000000000000000 > 0) || (parseFloat(localStorage.getItem("LPBalance")) > 0)) ?
                            <Card>
                                <CardHeader style={{ textAlign: 'center' }}>
                                    <b style={{ fontSize: '4vh' }}>Sir Earned</b>
                                </CardHeader>
                                <CardBody>
                                    <Heading style={{ textAlign: 'center', color: 'green', fontSize: '4vh' }}>{parseFloat(localStorage.getItem("farmedSirio")) / 1000000000000000000}</Heading>
                                    <Flex alignItems="center" justifyContent="space-between">
                                        <Button onClick={onPresentStake}>Stake</Button>
                                        {parseFloat(localStorage.getItem("farmedSirio")) > 0 ?
                                            <Flex alignItems="center" justifyContent="space-between">
                                                <Button onClick={harvest}>Harvest</Button>

                                            </Flex>
                                            :
                                            <Flex alignItems="center" justifyContent="space-between">
                                                <Button disabled onClick={harvest}>Harvest</Button>
                                            </Flex>
                                        }
                                        <Button onClick={onPresentUnstake}>Unstake</Button>
                                    </Flex>
                                </CardBody>
                                <CardFooter>
                                    Staked value: <b style={{ textAlign: 'center', color: 'white' }}>{parseFloat(localStorage.getItem("stakedValue")).toFixed(2)} $</b>
                                </CardFooter>
                            </Card>

                            :
                            <Card>
                                <CardHeader style={{ textAlign: 'center' }}>
                                    <b style={{ fontSize: '4vh' }}>Stake your community farming token</b>
                                </CardHeader>
                                <CardBody>
                                    <Heading style={{ textAlign: 'center', color: 'green', fontSize: '4vh' }}>{parseFloat(localStorage.getItem("farmedSirio")) / 1000000000000000000}</Heading>
                                    <Flex alignItems="center" justifyContent="space-between">
                                        <Button disabled>Stake</Button>
                                        {parseFloat(localStorage.getItem("farmedSirio")) > 0 ?
                                            <Flex alignItems="center" justifyContent="space-between">
                                                <Button onClick={harvest}>Harvest</Button>
                                            </Flex>
                                            :
                                            <Flex alignItems="center" justifyContent="space-between">
                                                <Button disabled onClick={harvest}>Harvest</Button>
                                            </Flex>
                                        }
                                        {parseFloat(localStorage.getItem("LPstaked")) > 0 ?
                                            <Button onClick={onPresentUnstake}>Unstake</Button>
                                            :
                                            <Button disabled>Unstake</Button>
                                        }
                                    </Flex>
                                </CardBody>
                                <CardFooter>
                                    {parseFloat(localStorage.getItem("LPstaked")) > 0 ?
                                        <Container>Staked value: <b style={{ textAlign: 'center', color: 'white' }}>{parseFloat(localStorage.getItem("stakedValue")).toFixed(2)} $</b></Container>
                                        :
                                        <Container>Staked value: 0 $</Container>
                                    }
                                </CardFooter>
                            </Card>

                        }
                    </Text>
                    <Text>

                        <Container py="2vh">
                            <Heading as="h2" scale="xl" mb="1vh">
                                Deposit & Withdraw
                            </Heading>
                        </Container>
                        <Card>
                            <CardBody>
                                {parseInt(localStorage.getItem("approval")) === 0 ?
                                    <Button onClick={handleSirioApprove} style={{ marginLeft: '1vh' }}>Approve Deposit First</Button>
                                    :
                                    <Text>
                                        <DepositModal />
                                        {parseInt(localStorage.getItem("approvalWit")) === 0 ?
                                            <Button onClick={handleWithrawApprove} style={{ marginLeft: '1vh' }}>Approve Withdraw First</Button>
                                            : (
                                                <div>
                                                    <Flex alignItems="center" justifyContent="space-between">
                                                        <Container>Deposit value: <b style={{ textAlign: 'center', color: 'white' }}>{parseFloat(localStorage.getItem("depositValue")).toFixed(2)} $ </b>
                                                            <ReferenceElement ref={targetRef}>
                                                                <HelpIcon color="textSubtle" />
                                                            </ReferenceElement>
                                                            {tooltipVisible && tooltip}
                                                        </Container>
                                                    </Flex>
                                                    <Flex alignItems="center" justifyContent="space-between">
                                                        <WithdrawModal props={lpAddresses} />
                                                    </Flex>
                                                </div>
                                            )
                                        }
                                    </Text>
                                }
                            </CardBody>

                            <CardFooter>
                                {parseInt(localStorage.getItem("approval")) === 0 ?
                                    <Text> </Text>
                                    : (
                                        <Text>-Deposit and Stake 1M Sirio, 50% BNB, 25% BUSD, 25% USDT (1% deposit fee)</Text>
                                    )
                                }
                                {parseInt(localStorage.getItem("approvalWit")) === 0 ?
                                    <Text> </Text>
                                    :
                                    <Text>-Withdraw 1M Sirio, 50% BNB, 25% BUSD, 25% USDT (1% withdraw fee)</Text>
                                }
                            </CardFooter>
                        </Card>
                    </Text>
                </Container>
            </Content>
        </Flex >
    )

}

export default CommunityFarm;