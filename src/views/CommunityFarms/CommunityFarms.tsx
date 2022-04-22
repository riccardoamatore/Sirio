import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import communityFarms from '../../config/constants/communityFarms'
import CommunityFarm from './CommunityFarm'

const CommunityFarms : React.FC = () => {

    const renderContent = (): JSX.Element => {
        return(
            <div>{communityFarms.map((farm) => (
                <CommunityFarm par={farm} />
            ))}</div>
        )
    }
    return(
        renderContent()
    )

}

export default CommunityFarms
