import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getBep20Contract, getCakeContract , getGovernorContract} from 'utils/contractHelpers'
import { useGovernor} from 'hooks/useContract'
import { BIG_ZERO } from 'utils/bigNumber'
import { simpleRpcProvider } from 'utils/providers'
import useRefresh from './useRefresh'
import useLastUpdated from './useLastUpdated'

type UseStatusState = {
  status: string
  fetchStatus: FetchStatus
}

export enum FetchStatus {
  NOT_FETCHED = 'not-fetched',
  SUCCESS = 'success',
  FAILED = 'failed',
}

const useProposalStatus = (proposalId: string) => {
  const { NOT_FETCHED, SUCCESS, FAILED } = FetchStatus
  const [state, setState] = useState<UseStatusState>({
    status: "0",
    fetchStatus: NOT_FETCHED,
  })
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    const fetchStatus = async () => {
      const contract = getGovernorContract()
      try {
        console.log(contract)
        const res = await contract.state(proposalId)
        setState({ status: res.toString(), fetchStatus: SUCCESS })
      } catch (e) {
        console.error(e)
        setState((prev) => ({
          ...prev,
          fetchStatus: FAILED,
        }))
      }
    }

    if (account) {
      fetchStatus()
    }
  }, [account, proposalId ,fastRefresh, SUCCESS, FAILED])

  return state
}

export default useProposalStatus
