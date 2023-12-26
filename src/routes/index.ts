import LionPage from '../pages/lion'
import CuteBirdPage from '../pages/cute-bird'
import WolfAndRabbitPage from '../pages/wolf-and-rabbit'

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
  },
  {
    path: 'wolf-and-rabbit',
    pageComponent: WolfAndRabbitPage,
    label: 'Wolf and Rabbit'
  }
]

export default routes
