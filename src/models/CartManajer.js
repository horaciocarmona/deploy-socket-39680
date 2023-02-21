import { promises as fs}  from 'fs'
//declaro el array de objetos carritos vacio
let carritos=[];
// declaro clase CartManager 
// la clave unica id
export class CartManager {
//    constructor(id,products)
    constructor(path)
    {
      this.path=path
    } 
    
    static incrementId(){
        if (this.idIncrement){
            this.idIncrement++
        } else{
            this.idIncrement=1
        }
        return this.idIncrement
    }


    async addCart(){
        //leo archivo
        let resultado = await fs.readFile(this.path,'utf-8')
        let carritos= JSON.parse(resultado)
        let carrito = {"id":CartManager.incrementId(),"products":[]} 
        carritos.push(carrito)
        // grabo en Archivo
        await fs.writeFile(this.path,JSON.stringify(carritos))
        return "carrito creado"
    }

    
    async getCartProductsById(idCart){
        //leo archivo
        let resultado = await fs.readFile(this.path,'utf-8')
        let cartCons= JSON.parse(resultado).find(cart =>cart.id===idCart)
        if (cartCons){
            return cartCons.products
        } else {
            return false
        }

    }

    async addProductToCart(idCart,idProduct){
        //leo archivo
        let resultado = await fs.readFile(this.path,'utf-8')
        let carritos= JSON.parse(resultado)
        let cartCons= JSON.parse(resultado).find(cart =>cart.id===idCart)
        if (cartCons){

            const getProductsFromCart=(id)=>{return cartCons.products.find(ord =>ord.id===id)};                                                                  
            const isProductInCart= (id) =>{ return id !== undefined ? getProductsFromCart(id):undefined};
            if (isProductInCart(idProduct)){

                cartCons.products.map((producto,i) => (producto.id===idProduct ? producto.quantity+=1 : undefined ));  
            } else {
                let product={"id":idProduct,"quantity":1}
                cartCons.products.push(product);  
                console.log("agrego producto a carrito")
            }
            carritos.map((carrito,i) => (carrito.id===idCart ? carrito.products=cartCons.products : undefined ));  
            console.log(JSON.stringify(carritos))

            // grabo en Archivo
            await fs.writeFile(this.path,JSON.stringify(carritos))
            return JSON.stringify(carritos)
        } else {
            return `carrito con id ${idCart} no encontrado`
        }    
    }

}

