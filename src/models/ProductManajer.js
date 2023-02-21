import { promises as fs}  from 'fs'
//declaro el array de objetos productos vacio
let products=[];
// declaro clase ProducManager 
// la clave unica id
export class ProductManager {
//    constructor(path,title,price,stock,thumpbnail,code,description)
    constructor(path)
    {
        this.path=path
        // this.id=ProductManager.incrementId();
        // this.title=title;
        // this.description=description;
        // this.price=price;
        // this.thumpbnail=thumpbnail;
        // this.code=code;
        // this.stock=stock;
        // this.path=ProductManager.pathName();
    } 
    
    static incrementId(){
        if (this.idIncrement){
            this.idIncrement++
        } else{
            this.idIncrement=1
        }
        return this.idIncrement
    }

    async addProduct(producto){
        //leo archivo
        let resultado = await fs.readFile(this.path,'utf-8')
        let products= JSON.parse(resultado)
        producto.id=ProductManager.incrementId()
        products.push(producto)
        // grabo en Archivo
        await fs.writeFile(this.path,JSON.stringify(products))
        return "Producto creado"
    }

    async getProducts(){   
        //leo archivo
        let resultado = await fs.readFile(this.path,'utf-8')
        products= JSON.parse(resultado)
        return products
    }
    
    async getProductById(idProd){
        //leo archivo
        let resultado = await fs.readFile(this.path,'utf-8')
        let prodCons= JSON.parse(resultado).find(prod =>prod.id===idProd)
        return prodCons
    }
    async getProductByCode(codeProd){
        //leo archivo
        let resultado = await fs.readFile(this.path,'utf-8')
        let prodCons= JSON.parse(resultado)
        if (prodCons){
            return ( await prodCons.find(prod =>prod.code===codeProd)) 
        } else {
            return `producto de codigo ${codeProd} no encontrado`
        }    
    }                                                                  

    async updateProduct(idProd,{...productRest}){
        //leo archivo
        try  {
            let resultado = await fs.readFile(this.path,'utf-8')
            let products= JSON.parse(resultado)
            let productoElegido= products.find(prod =>prod.id===idProd)
            if (productoElegido) {
                console.log("producto a modificar",productoElegido)
                products.forEach(element => {
                    if (element.id==idProd){
                          element.description=productRest.description
                          element.title=productRest.title;
                          element.price=productRest.price;
                          element.thumpbnail=productRest.thumpbnail;
                          element.code=productRest.code;
                          element.stock=productRest.stock;
                          console.log("cambio a ",element)
                    }
                });
            //      grabar archivo
                await fs.writeFile(this.path,JSON.stringify(products))
                return productoElegido
            } else {
                return "Producto no encontrado"
            }
        }     
        catch (err) {
            return "producto no encontrado"
        }   
    }
    
    async deleteProduct(idProd){
        //leo archivo
        try  {
            let resultado = await fs.readFile(this.path,'utf-8')
            products= JSON.parse(resultado)
            let productoElegido=products.find(prod =>prod.id===idProd)
            if (productoElegido) {
                console.log("listado",products)
                console.log("producto a eliminar",productoElegido)
                const resto=products.filter(prod=>prod.id !== idProd)
                console.log("resto",resto)
                //grabar archivo
                await fs.writeFile(this.path,JSON.stringify(resto))
                return "Producto eliminado" 
            } else {
                return "Producto no encontrado"
            }   
        } catch(err){
            return err
        }
    }
}
// defino funcion que crea la instancia y utiliza los metodos de clase , agrego productos a la lista vacia
// agrego a la lista un code nuevo, busco el code y si no esta lo doy de alta con id nuevo

