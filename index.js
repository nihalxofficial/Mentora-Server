const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const dotenv = require("dotenv")
const cors = require("cors")

dotenv.config()
const app = express()
const port = process.env.PORT
const uri = process.env.MONGO_URI

app.use(cors())
app.use(express.json())

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

    const db = client.db("mentora");
    const courseCollection = db.collection("courses")

    app.get("/courses", async(req, res)=>{
      const result = await courseCollection.find().toArray();
      res.send(result);
    })

    app.get("/courses/:id", async(req, res)=>{
      const {id} = req.params
      const result = await courseCollection.findOne({_id: new ObjectId(id)});
      res.send(result);
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
