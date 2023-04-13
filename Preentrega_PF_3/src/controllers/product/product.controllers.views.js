export const HandleRenderProducts = async (req, res) => {
  res.render('product/table', { title: 'Products' })
}

export const HandleRenderProductDetail = async (req, res) => {
  res.render('product/detail', { title: 'Product Detail' })
}

export const HandleRenderCreateProduct = async (req, res) => {
  res.render('product/create', { title: 'Nuevo producto' })
}

export const HandleRenderUpdateProduct = async (req, res) => {
  res.render('product/update', { title: 'Actualizar producto' })
}
