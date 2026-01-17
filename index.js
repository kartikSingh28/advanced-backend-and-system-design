import dotenv from "dotenv";
dotenv.config();
import {createClient} from "redis";

const client=createClient({
    url:process.env.REDIS_URL
});

client.on("error",(err)=>console.log("Reddis error",err));

async function start(){
    await client.connect();
    console.log("redis Connected!");

    await client.set("name", "kartik");
  const value = await client.get("name");

  console.log("Value from Redis:", value);

}
start();