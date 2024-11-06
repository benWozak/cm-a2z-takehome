import { setupNavigation } from './navigation.ts'
import { setupTimeDisplay } from './time.ts'

const navElement = document.querySelector<HTMLUListElement>('nav ul')
if (navElement) {
  setupNavigation(navElement)
}

const clockElement = document.querySelector<HTMLElement>('.clock')
if (clockElement) {
  setupTimeDisplay(clockElement)
}