const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uqgpfrz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB
async function run() {
  try {
    await client.connect();

    const locationCollection = client.db("locationDB").collection("location");
    const countriesCollection = client.db("countryDB").collection("countries");
    const bdCollection = client.db("bdDB").collection("bd");

    // Routes
      // Add location
      app.post("/location", async (req, res) => {
        const AddformData = req.body;
        console.log(AddformData);
        const result = await locationCollection.insertOne(AddformData);
        res.send(result);
      });

    // Get all locations
    app.get("/location", async (req, res) => {
      const cursor = locationCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });


    // Get locations by email
    app.get("/location/:email", async (req, res) => {
      try {
        const email = req.params.email;
        console.log("Fetching locations for email:", email);
        const locations = await locationCollection.find({ email }).toArray();
        console.log("Fetched locations:", locations);
        res.json(locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // app.get("/location/:email/", async (req, res) => {
    //   const { email } = req.params;
    //   const result = await locationCollection.findOne({ email: email});
    //   res.send(result);
    // });

    
    // Get location by email and _id
    // app.get("/location/:email/:id", async (req, res) => {
    //   const  id  = req.params.id;
    //   const result = await locationCollection.findOne({ _id: new ObjectId(id) });
    //   res.send(result);
    // }); 

    // app.put('/location/:email/:id',async(req,res)=>{
    //   const id = req.params.id;
    //   const email= req.params.email;
    //   const filter = {_id: new ObjectId(id),email: email}
    //   const options = {upsert:true}
    //   const updatedItem = req.body;
    //   const location = {
    //     $set:{
           
    //         image:updatedItem.image,
    //         tourists_spot_name:updatedItem.tourists_spot_name,
    //         country_name:updatedItem.country_name,
    //         location:updatedItem.location,
    //         short_description:updatedItem.short_description,
    //         average_cost:updatedItem.average_cost,
    //         seasonality:updatedItem.seasonality,
    //         travel_time:updatedItem.travel_time,
    //         total_visitors_per_year:updatedItem.total_visitors_per_year
        
    //   }
    // }
    // const result = await locationCollection.updateOne(filter,location,options);
    // res.send(result)
    // })
    

  
    // Get all countries
    app.get("/countries", async (req, res) => {
      const cursor = countriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get all details by _id
    app.get("/details/:_id", async (req, res) => {
      console.log(req.params._id);
      const result = await locationCollection.findOne({
        _id: new ObjectId(req.params._id),
      });
      console.log(result);
      res.send(result);
    });

  
    // Delete location by _id
    app.delete("/location/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await locationCollection.deleteOne(query);
      res.send(result);
    });

    
    // Update location by _id
//  app.put("/location/email/:id", async (req, res) => {
//   try {
//     const email= req.params.email;
//     const id = req.params.id;
//     const updatedLocation = req.body;
//     const result = await locationCollection.updateOne(
//       { _id: ObjectId(id) },
//       { $set: updatedLocation }
//     );
//     if (result.modifiedCount === 1) {
//       res.status(200).json({ message: "Location updated successfully" });
//     } else {
//       res.status(404).json({ error: "Location not found" });
//     }
//   } catch (error) {
//     console.error("Error updating location:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// app.put('/location/:email/:id',async(req,res)=>{
//   const id = req.params.id;
//   const email= req.params.email;
//   const filter = {_id: new ObjectId(id),email: email}
//   const options = {upsert:true}
//   const updatedItem = req.body;
//   const location = {
//     $set:{
       
//         image:updatedItem.image,
//         tourists_spot_name:updatedItem.tourists_spot_name,
//         country_name:updatedItem.country_name,
//         location:updatedItem.location,
//         short_description:updatedItem.short_description,
//         average_cost:updatedItem.average_cost,
//         seasonality:updatedItem.seasonality,
//         travel_time:updatedItem.travel_time,
//         total_visitors_per_year:updatedItem.total_visitors_per_year
    
//   }
// }
// const result = await locationCollection.updateOne(filter,location,options);
// res.send(result)
// })


    // Get country details by name
    app.get("/countries/:country_name", async (req, res) => {
      const countryName = req.params.country_name;
      try {
        const countryDetails = await countriesCollection.findOne({ country_name: countryName });
        if (!countryDetails) {
          return res.status(404).json({ error: "Country not found" });
        }
        res.json(countryDetails);
      } catch (error) {
        console.error("Error fetching country details:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/location/country/:country_name", async (req, res) => {
      console.log(req.params.country_name);
      const countryName = req.params.country_name;
      const result = await locationCollection.find({
        country_name: countryName
      }).toArray();
      console.log(result);
      res.send(result);
    });


    // Ping MongoDB deployment
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Close client connection
    // await client.close();
  }
}

run().catch(console.dir);

// Default route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port :${port}`);
});
