import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Exchange | Sirio Token',
  description:
    'Exchange Sirio Token',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('Sirio Token')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('Sirio Token')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('Sirio Token')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('Sirio Token')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('Sirio Token')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('Sirio Token')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('Sirio Token')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('Sirio Token')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('Sirio Token')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('Sirio Token')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('Sirio Token')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('Sirio Token')}`,
      }
    default:
      return null
  }
}
