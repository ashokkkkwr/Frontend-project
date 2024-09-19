const express = require("express");
const axios = require("axios");
const cors = require("cors");
const Redis = require("redis");
//Creates a Redis client to communicate with the Redis server.
const redisClient = Redis.createClient();
const DEFAULT_EXPIRATION = 3600;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connects the Redis client to the Redis server.
redisClient.connect().catch(console.error);

app.get("/photos", async (req, res) => {
  const albumId = req.query.albumId;
  try {
    const photos = await redisClient.get("photos")
    if (photos != null) {
      console.log("from redius")
      return res.json(JSON.parse(photos));
    } else {
      console.log("from endPoint")
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos",
        { params: { albumId } }
      )
      await redisClient.setEx(
        "photos",
        DEFAULT_EXPIRATION,
        JSON.stringify(data)
      );
      return res.json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
