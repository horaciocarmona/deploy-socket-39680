import {Router} from "express"
import {CartManager} from '../models/CartManajer.js'
import {ProductManager} from '../models/ProductManajer.js'
const cartManager = new CartManager('src/models/carritos.txt')
const productManager = new ProductManager('src/models/productos.txt')
const routerCart=Router()


//EndPoint crea carrito con products vacio ruta\api\carts
routerCart.post('/',async (req,res)=>{
    let mensaje= await cartManager.addCart()
    console.log(mensaje)
    res.send(mensaje)
})

//EndPoint Traer todos los producto por id de carrito ruta\api\carts
routerCart.get('/:cid',async (req,res)=>{
    let CartProducts= await cartManager.getCartProductsById(parseInt(req.params.cid))
    if (CartProducts) {
        console.log(CartProducts)
        res.send(CartProducts)
    } else {
        console.log(`no existe el carrito con id: ${req.params.cid} en archivo de productos.txt`)
        res.send(`no existe el carrito con id: ${req.params.cid} en archivo de productos.txt`)
    }
})

//EndPoint carga productos al carrito ruta\api\carts
routerCart.post('/:cid/product/:pid',async (req,res)=>{
    //Persiste producto en productos.txt
    let Product= await productManager.getProductById(parseInt(req.params.pid))
    if (Product) {
        let CartProducts= await cartManager.addProductToCart(parseInt(req.params.cid),parseInt(req.params.pid))
        console.log(CartProducts)
        res.send(CartProducts)
    } else {
        console.log(`no existe el producto con id: ${req.params.pid} en archivo de productos.txt`)
        res.send(`no existe el producto con id: ${req.params.pid} en archivo de productos.txt`)
    }
}
)


export default routerCart
