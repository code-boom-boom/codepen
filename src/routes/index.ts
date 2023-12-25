import LionPage from '../pages/lion'
import CuteBirdPage from '../pages/cute-bird'

const routes = [
  {
    path: 'lion',
    pageComponent: LionPage,
    label: 'Chilling Lion'
  },
  {
    path: 'cute-bird',
    pageComponent: CuteBirdPage,
    label: 'Cute Bird'
  }
]

export default routes
