const axios = require('axios')


const getProducts = async () => {
  const result = await axios.get('https://fakestoreapi.com/products')
    .catch((err) => { return err.response })
  return result.data
}


const productDetail = async (id) => {
  const result = await axios.get(`https://fakestoreapi.com/products/${id}`)
    .catch((err) => { return err.response })
  return result.data
}

const productHandler = async (type, payload) => {
  if (type == "PRODUCT")
    return await getProducts()
  else if (type == "PRODUCT_DETAIL")
    return await productDetail(payload.id)
}

module.exports = productHandler
