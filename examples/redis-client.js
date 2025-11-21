import dotenv from "dotenv";
dotenv.config();

import {createClient} from "redis";

export const client=createClient({url:process.env.REDIS_URL});

client.on("error",(err)=>console.error("Redis error",err));

export async function connect() {
    if(!client.isOpen) await client.connect();
}

export async function close(){
    if(client.isOpen) await client.quit();
}