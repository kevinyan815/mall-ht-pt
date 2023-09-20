import axios from '../utils/axios'

export function addCart(params) {
  return axios.post('/shop-cart', params)
}

export function getCart(params) {
  return axios.get('/shop-cart', { params })
}

export function deleteCartItem(id) {
  return axios.delete(`/shop-cart/${id}`)
}

export function modifyCart(params) {
  return axios.put('/shop-cart', params)
}

// 根据购物车id获取购物车列表接口
export function getByCartItemIds(params) {
    return axios.get('/shop-cart/settle', { params })
}