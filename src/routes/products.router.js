import {Router} from "express"
import {ProductManager} from '../models/ProductManajer.js'
const productManager = new ProductManager('src/models/productos.txt')
const routerProd=Router()

//EndPoint todos los productos ruta\product ad product
routerProd.get('/',async (req,res)=>{
    let {limit}=req.query
    let ListProducts= await productManager.getProducts()
    if (limit) {
       console.log(ListProducts.slice(0,parseInt(limit)))
       res.send(ListProducts.slice(0,parseInt(limit)))
    } else {
        console.log(ListProducts)
        res.send(ListProducts)
    }
})


//EndPoint Traer un producto por id ruta\product
routerProd.get('/:pid',async (req,res)=>{
    let Product= await productManager.getProductById(parseInt(req.params.pid))
    if (Product) {
        console.log(Product) 
        res.send(Product)
    } else {
        console.log( `producto con id ${req.params.pid} no encontrado`)
        res.send(`producto con id ${req.params.pid} no encontrado`)

    }
})

//EndPoint borra producto por id ruta\product
routerProd.delete('/:pid',async (req,res)=>{
    let Product=await productManager.deleteProduct(parseInt(req.params.pid))
    console.log(JSON.stringify(Product))
    res.send(JSON.stringify(Product))
})

//EndPoint Dar de alta un producto ruta\product por id
routerProd.post('/',async (req,res)=>{
    let mensaje= await productManager.addProduct(req.body)
    console.log(mensaje)
    res.send(mensaje)
})
    
//EndPoint Modificar un producto ruta\product por id
routerProd.put('/:pid',async (req,res)=>{
    let mensaje= await productManager.updateProduct(parseInt(req.params.pid),req.body)
    console.log(mensaje)
    res.send(mensaje)
})


export default routerProd
