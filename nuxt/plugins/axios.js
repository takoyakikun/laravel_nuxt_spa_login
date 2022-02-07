import axios from 'axios'

export default function({ $axios }) {
  $axios.onRequest(config => {
    // headerの設定
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

    return config
  })
}
