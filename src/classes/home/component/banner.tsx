import * as React from 'react'
import Carousel from '../component/carousel'
import { autoplay } from '../../../utils/config'
import { findBanner } from '../../../http/home'
import { getHashUrl } from '../../../utils/http'
import * as instance from '../../../utils/instance'

interface IBannerDataSource {
  id: string,
  src: string
}

interface IBannerState {
  dataSource: Array<IBannerDataSource>
}

class Banner extends React.Component<{}, IBannerState> {
  constructor(props: object) {
    super(props)
    this.state = {
      dataSource: []
    }
  }


  componentDidMount() {
    findBanner({
      pageSize: 6,
    }, (err, data) => {
      if (!err && data && data.length > 3) {
        const s = data.map(e => ({
          id: e.id,
          src: getHashUrl(e.cover),
        }))
        this.configDs(s)
      }
    })
  }
  
  configDs(ds: Array<IBannerDataSource>) {
    this.setState({
      dataSource: ds,
    }, () => {
      Carousel.init({
        container: "#banner",
        datas: ds,
        autoplaySpeed: autoplay,
        autoplay: true,
        clickHandler: (id: string) => {
          instance.getValueByKey('history').push(`/p/${id}`)
        }
      })
    })
  }

  render() {
    const { dataSource } = this.state
    if (!dataSource.length) {
      return null
    }
    return (
      <div id="banner" />
    )
  }
}

export default Banner
