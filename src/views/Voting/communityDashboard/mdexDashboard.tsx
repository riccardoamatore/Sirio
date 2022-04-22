import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Card, CardBody, CardHeader, CardProps, Heading, Radio, Text, useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useMdexMasterchef } from '../../../hooks/useContract'
import DesktopImage from '../components/DesktopImage'

const InnerWrapper = styled.div`
  width: 40vh;
`

const MdexDashboard = ()=>{
    const mdexMasterchefContract= useMdexMasterchef()
    const getMdex = async () => {
        const result = await mdexMasterchefContract.pending(31,"0xafCC197769C822AD52661075432817cDA7E9956E")
        if (localStorage.getItem(`mdex`) !== result[0].toString()) {
            
          localStorage.setItem(`mdex`, result[0].toString())
          window.location.reload()
        }
      }

      getMdex()

    return(
        <InnerWrapper>
<Card>
            <CardHeader style={{  textAlign: 'center' } }>
            MDex community farming
            </CardHeader>
            <CardBody style={{  textAlign: 'center' } }>
                <DesktopImage src="https://assets.coingecko.com/coins/images/13775/small/mdex.png?1611739676" width={70} height={70}  style={{ marginLeft: '14vh' , marginRight: '35vh', marginBottom: '5vh'  }} />
                <Text style={{marginBottom: '5vh' }}>Deposited 4.5 BNB</Text>
                <Text style={{marginBottom: '5vh', fontSize:30}}>{(parseInt(localStorage.getItem('mdex'))/1000000000000000000).toFixed(2)} MDex farmed</Text>
            </CardBody>
      </Card>
        </InnerWrapper>
        

 
    )
}

export default MdexDashboard;