const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");

dotenv.config();
const app = express();
const port = process.env.PORT;
const uri = process.env.MONGO_URI;

// const JWKS = createRemoteJWKSet(new URL(process.env.CLIENT_URL + "/api/auth/jwks"));

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const verifyToken = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];
  if(!token){
    return res.status(401).json({message: "Unauthorized"})
  }
  try {
    const JWKS = createRemoteJWKSet(new URL(process.env.CLIENT_URL + "/api/auth/jwks"));
    const { payload } = await jwtVerify(token, JWKS);
    req.user = payload
    console.log(req.user);
    next();
  } catch (error) {
    console.error("Token validation failed:", error);
    return res.status(401).json({message: "Unauthorized"})
  }
  
};

async function run() {
  try {
    await client.connect();

    const db = client.db("mentora");
    const courseCollection = db.collection("courses");

    app.get("/courses", async (req, res) => {
      const result = await courseCollection.find().toArray();
      res.send(result);
    });
    app.get("/featured", async (req, res) => {
      const result = await courseCollection.find().limit(4).toArray();
      res.send(result);
    });

    app.get("/courses/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const result = await courseCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
