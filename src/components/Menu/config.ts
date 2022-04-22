import { MenuEntry } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: t('Voting'),
    icon: 'GroupsIcon',
    href: '/voting',
  },
  {
    label: t('Community Farms'),
    icon: 'FarmIcon',
    href: '/communityFarms',
  },
  {
    label: t('Staking'),
    icon: 'PoolIcon',
    href: '/pools',
  },
  {
    label: t('Wrapper'),
    icon: 'HamburgerIcon',
    href: '/wrapper',
  },
  {
    label: 'Redeem',
    icon: 'TradeIcon',
    href: 'https://exchange.siriotoken.com/redeem',
  }
]

export default config
