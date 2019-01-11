import Vue from 'vue'
import VueRouter, { Location, Route, RouteConfig } from 'vue-router'
import { makeHot, reload } from './util/hot-reload'

const homeComponent = () => import('./components/home').then(({ HomeComponent }) => HomeComponent)
const imageSliderComponent = () => import('./components/imageslider').then(({ ImageSliderComponent }) => ImageSliderComponent)

if (process.env.ENV === 'development' && module.hot) {
  const homeModuleId = './components/home'
  const imageSliderId = './components/imageslider'

  // first arguments for `module.hot.accept` and `require` methods have to be static strings
  // see https://github.com/webpack/webpack/issues/5668
  makeHot(homeModuleId, homeComponent,
    module.hot.accept('./components/home', () => reload(homeModuleId, (require('./components/home') as any).HomeComponent)))

  makeHot(imageSliderId, imageSliderComponent,
    module.hot.accept('./components/imageslider', () => reload(imageSliderId, (require('./components/imageslider') as any).ImageSliderComponent)))
}

Vue.use(VueRouter)

export const createRoutes: () => RouteConfig[] = () => [
  {
    path: '/',
    component: homeComponent
  },
  {
    path: '/images',
    component : imageSliderComponent
  }
]

export const createRouter = () => new VueRouter({ mode: 'history', routes: createRoutes() })
