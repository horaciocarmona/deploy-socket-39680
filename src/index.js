import express from "express"
import routerProd from '../src/routes/products.router.js'
import routerCart from '../src/routes/carts.router.js'
import routerSocket from '../src/routes/socket.router.js'

import { __dirname } from './path.js'

import multer from 'multer'
//import {create} from 'express-handlebars' server complejo
import {engine} from 'express-handlebars' //server simple
import * as path from 'path'
import {Server} from 'socket.io'
import { info } from "console"
import {ProductManager} from './models/ProductManajer.js'
const productManager = new ProductManager('./models/productos.txt')
//let mensajeAltaProductoPorServidor="mensaje del servidor"
//const upload=multer({dest:'src/public/img'})
// Imagenes con formato
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{cb(null,'src/public/img')},
    filename:(req,file,cb)=>{cb(null,`${Date.now()}${file.originalname}`)}
})
const upload=multer({storage:storage})
 
const app=express()

const PORT=8080

const server = app.listen(PORT,()=>{
    console.log(`server on port ${PORT}`)
})
let listProducts=[]

const io=new Server(server)


//Midlewares
app.use(express.json()) //mi app entiende json
app.use(express.urlencoded({extended:true})) //mi app usa url largas
app.engine("handlebars",engine()) //configuracion de hbs
app.set("view engine","handlebars")
app.set("views",path.resolve(__dirname,'./views'))
console.log(__dirname)

//Routers
app.use('/',express.static(__dirname+'/public'))
app.use('/api/products',routerProd)
app.use('/api/carts',routerCart)
app.use('/',routerSocket)

app.get('/',(req,res)=>{
    
    res.render('home',{
        tituloAlta:"Alta de Producto",
        tituloEliminacion:"Eliminar Producto",
        mensaje:"mundo"

    })
    
})

 app.get('/realTimeProducts',(req,res)=>{
     res.render('realTimeProducts',{
         listProducts
     })
 })
const mensajes=[]
io.on('connection',(socket)=>{
    console.log('cliente conectado')
    
    socket.on('mensaje',info=>{
        mensajes.push(info)    
        console.log(info)//captura info del cliente
        io.emit('messagesLogs',mensajes)
    })
    
    socket.on('creacion',info=>{
//        console.log(info)//captura info del cliente
//        app.post('/api/products',info)
        info.id=ProductManager.incrementId()
        listProducts.push(info)    
        socket.emit('evento-general',"se dio de Alta por servidor ") // lo pudo ejecutar en todos los socketes
    })

    socket.on('eliminacion',info=>{
        console.log(info)//captura info del cliente
         let productoElegido=listProducts.find(prod =>prod.id===info)
         if (productoElegido) {
              listProducts=listProducts.filter(prod=>prod.id !== info)
              console.log(listProducts)  
              socket.emit('evento-general',"se dio de Baja por servidor: "+info) // lo pudo ejecutar en todos los socketes
         } else {
            socket.emit('evento-general',"No se encontro el producto "+info) // lo pudo ejecutar en todos los socketes
         }   
    })

    socket.broadcast.emit('evento-admin',"hola desde server sos el admin") // se va a escuchar en mi app menos en mi socket actual
    socket.emit('evento-general',"hola a todos los usuarios soy el server") // lo pudo ejecutar en todos los socketes
})


app.post('/upload',upload.single('product'),(req,res)=>{
    console.log(req.file)
    res.send("Imagen cargada")
})

