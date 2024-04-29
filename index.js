const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



// middleware
app.use(cors());
app.use(express.json());
// bbbbb


// user:artCreft
// pass:lANZqc6NQRd56H7Z

// console.log(process.env.BD_USER)

const uri = "mongodb://localhost:27017";

// const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.ckoz8fu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const productCollection = client.db("artCraft").collection("artCraftProducts");
  
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    app.delete('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.deleteOne(query);
      res.send(result);
  })
   
    app.get('/allProduct', async (req, res) => {
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.put('/product/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedProduct = req.body;

      const product = {
          $set: {
              itemName: updatedProduct.itemName,
              subcategory_Name: updatedProduct.subcategory_Name,
              short_description: updatedProduct.short_description,
              price: updatedProduct.price,
              rating: updatedProduct.rating,
              customization: updatedProduct.customization,
              processing_time: updatedProduct.processing_time,
              stockStatus: updatedProduct.stockStatus,
              email: updatedProduct.email,
              image: updatedProduct.image,
              
           
          }
      }

      const result = await productCollection.updateOne(filter, product, options);
      res.send(result);
  })


    app.post("/addProduct", async (req, res) => {
      console.log(req.body);
      const result = await productCollection.insertOne(req.body);
      console.log(result);
       res.send(result)
    })




    app.get("/myProduct/:email", async (req, res) => {
      // console.log(req.params.email);
      const result = await productCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })

    app.get("/singleProduct/:id", async (req, res) => {
      console.log(req.params.id);
      // const query = { _id: new ObjectId(id) }
      // const result = await productCollection.findOne(query);
      // res.send(result);

      const result = await productCollection.findOne({
         _id: new ObjectId(req.params.id) });
      res.send(result)
    })
    

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);













app.get('/', (req, res) => {
  res.send('art & creaft making server is running')
})

app.listen(port, () => {
  console.log(`art & creaft Server is running on port: ${port}`)
})