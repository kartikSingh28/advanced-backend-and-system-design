// examples/string.js
import { client, connect, close } from "./redis-client.js"; 
// <-- IF your client file is named "red-client.js" instead, change this to:
// import { client, connect, close } from "./red-client.js";

async function setAndGet() {
  console.log("\n-- SET & GET --");
  // fix: use SET to create the key
  await client.set("greet", "hello kartik");
  const k = await client.get("greet");
  console.log("greet =", k);
}

async function setWithExpiry() {
  console.log("\n-- SET with expiry 10s --");
  await client.set("otp:1234", "9999", { EX: 10 });
  const otp = await client.get("otp:1234");
  console.log("otp:1234 =", otp);

  const ttl = await client.ttl("otp:1234");
  console.log("TTL (seconds) =", ttl);
}

async function incrDecr() {
  console.log("\n-- INCR / DECR --");
  await client.set("visits", "0");
  await client.incr("visits");
  await client.incr("visits");
  await client.decr("visits");
  const visits = await client.get("visits");
  console.log("visits =", visits);
}

async function appendAndGetrange() {
  console.log("\n-- APPEND, STRLEN, GETRANGE --");
  await client.set("msg", "hello ");
  await client.append("msg", "annie");
  const full = await client.get("msg");
  const len = await client.strLen("msg");
  const part = await client.getRange("msg", 0, 4); // first 5 chars
  console.log("msg =", full);
  console.log("strlen =", len);
  console.log("first5 =", part);
}

async function conditionalSetAndDelete() {
  console.log("\n-- SETNX (set if not exists) & DEL --");
  await client.del("unique:token");

  const setnx1 = await client.setNX("unique:token", "abc");
  const setnx2 = await client.setNX("unique:token", "def");
  const val = await client.get("unique:token");
  console.log("first SETNX success?", setnx1); // true
  console.log("second SETNX success?", setnx2); // false
  console.log("value =", val); // abc

  await client.del("unique:token");
  const afterDel = await client.get("unique:token");
  console.log("after DEL =", afterDel); // null
}

async function msetMget() {
  console.log("\n-- MSET & MGET --");
  await client.mSet({ name: "Kartik", role: "student" });
  const [name, role] = await client.mGet(["name", "role"]);
  console.log("name =", name);
  console.log("role =", role);
  await client.del("name", "role");
}

async function demoJSONAsString() {
  console.log("\n-- Storing JSON as STRING --");
  const user = { id: 1, name: "Kartik", age: 20 };
  await client.set("user:1", JSON.stringify(user));
  const raw = await client.get("user:1");
  const parsed = JSON.parse(raw);
  console.log("raw string:", raw);
  console.log("parsed object:", parsed);
  await client.del("user:1");
}

async function showTTLandPersist() {
  console.log("\n-- TTL & PERSIST --");
  await client.set("temp", "will-expire", { EX: 5 });
  console.log("TTL before persist:", await client.ttl("temp"));
  await client.persist("temp");
  console.log("TTL after persist (should be -1):", await client.ttl("temp"));
  await client.del("temp");
}

async function runAll() {
  try {
    await connect(); // connects if not open
    await setAndGet();
    await setWithExpiry();
    await incrDecr();
    await appendAndGetrange();
    await conditionalSetAndDelete();
    await msetMget();
    await demoJSONAsString();
    await showTTLandPersist();
    console.log("\n✅ All string examples completed.");
  } catch (err) {
    console.error("Example error:", err);
  } finally {
    await close();
  }
}

// Run immediately when executed directly
runAll();

// also export functions if you want to import them elsewhere
export {
  setAndGet,
  setWithExpiry,
  incrDecr,
  appendAndGetrange,
  conditionalSetAndDelete,
  msetMget,
  demoJSONAsString,
  showTTLandPersist,
};
