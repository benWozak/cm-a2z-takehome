import './styles/index.scss'
import { setupNavigation } from './navigation.ts'

const navElement = document.querySelector<HTMLUListElement>('nav ul')
if (navElement) {
  setupNavigation(navElement)
}
