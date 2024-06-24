import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './styles/custom.css'

import AsideSponsors from './components/AsideSponsors.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'aside-ads-before': () => h(AsideSponsors),
    })
  }
}

