export const HandleRenderCarts = async (req, res) => {
  res.render('cart/table', { title: 'Carts' })
}

export const HandleRenderCartDetail = async (req, res) => {
  res.render('cart/detail', { title: 'Cart' })
}
