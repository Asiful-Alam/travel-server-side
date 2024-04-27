const express = require('express');
const cors = require('cors');
require('dotenv').config();

const {MongoClient , ServerApiVersion} = require('mongodb');
const app =express();
const port =process.env.PORT || 5000;

// middleware
// username:   asif
// pass:   G5lPF00y3iNkDm8Q
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

app.use(cors());
app.use(express.json());





// const uri = "mongodb+srv://asif:G5lPF00y3iNkDm8Q@cluster0.uqgpfrz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uqgpfrz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
   
    await client.connect();

    const locationCollection = client.db('locationDB').collection('location')

    app.get('/location',async(req,res)=>{
        const cursor = locationCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })


    app.post('/location',async(req,res)=>{
        const AddformData =req.body;
        console.log(AddformData);
        const result=await locationCollection.insertOne(AddformData);
        res.send(result);
    })



    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("my server is runningg vai eta server side!");
})

app.listen (port,()=>{
    console.log(`travel server is running on port :${port}`)
})