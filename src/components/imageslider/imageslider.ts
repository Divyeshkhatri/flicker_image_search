import { Component, Vue } from 'vue-property-decorator'
import axios, { AxiosResponse } from 'axios'
import bContainer from 'bootstrap-vue/es/components/layout/container'
import bCol from 'bootstrap-vue/es/components/layout/col'
import bRow from 'bootstrap-vue/es/components/layout/row'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

import './imageslider.scss'

interface ApiResponse {

  link: string,
  media: {
    m: string
  }

}

@Component({
  template: require('./imageslider.html'),
  components: {
    'b-container': bContainer,
    'b-col': bCol,
    'b-row': bRow,
    'swiper': swiper,
    'swiperSlide': swiperSlide
  }
})
export class ImageSliderComponent extends Vue {

  items: ApiResponse[] = []
  protected axios
  protected swiperOptionTop
  protected swiperOptionThumbs
  protected searchText
  protected error
  private url = 'https://api.flickr.com/services/feeds/photos_public.gne?tags=kitten&format=json&nojsoncallback=true'

  constructor() {
    super()
    this.axios = axios
    this.searchText = ''
    this.error = ''
    this.swiperOptionTop = {
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    }
    this.swiperOptionThumbs = {
      spaceBetween: 10,
      centeredSlides: true,
      slidesPerView: 'auto',
      touchRatio: 0.2,
      slideToClickedSlide: true
    }
  }

  onSearchClick(): void {

    if (this.searchText && this.searchText.trim().length > 0) {
      this.error = ''
      this.url = 'https://api.flickr.com/services/feeds/photos_public.gne?tags=' + this.searchText + '&format=json&nojsoncallback=true'
      this.loadItems()
    } else {
      this.error = 'Please enter text to search.'
    }
  }

  mounted() {
    this.$nextTick(() => {
      const swiperTop = this.$refs.swiperTop['swiper']
      const swiperThumbs = this.$refs.swiperThumbs['swiper']
      swiperTop.controller.control = swiperThumbs
      swiperThumbs.controller.control = swiperTop
    })
  }

  private loadItems() {
    this.axios.get(this.url).then((response: AxiosResponse) => {
      this.items = response.data.items
      if (this.items.length <= 0) {
        this.error = 'No Results Found!'
      } else {
        this.items = this.items.filter(function (item, index) {
          return index < 10
        })
        this.error = ''
      }
    }, (error) => {
      console.error(error)
    })
  }
}
