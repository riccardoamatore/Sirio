import tokens from './tokens'
import { FarmConfig } from './types'

const communityFarms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'MDEX+PANCAKE BNB-BUSD-BNB-USDT',
    lpAddresses: {
      97: '0x96e66Ff2eB22c573238FE35C047EA360b2390095',
      56: '0x96e66Ff2eB22c573238FE35C047EA360b2390095',
    },
    token: tokens.cake,
    quoteToken: tokens.wbnb,
  }
]

export default communityFarms;
