// examples/list.js
import { client, connect, close } from "./redis-client.js";

/**
 * Redis LIST Examples (fixed method names for redis@4)
 */

async function listPushAndRange() {
  console.log("\n-- LPUSH / RPUSH / LRANGE --");

  await client.del("tasks"); // clear previous

  // Use camelCase method names
  await client.lPush("tasks", "task1");      // ["task1"]
  await client.lPush("tasks", "task0");      // ["task0","task1"]
  await client.rPush("tasks", "task2");      // ["task0","task1","task2"]

  const all = await client.lRange("tasks", 0, -1);
  console.log("tasks =", all);
}

async function popsAndLen() {
  console.log("\n-- LPOP / RPOP / LLEN --");

  await client.del("jobs");
  await client.rPush("jobs", "job1", "job2", "job3");

  // correct camelCase methods
  const left = await client.lPop("jobs");   // job1
  const right = await client.rPop("jobs");  // job3
  const length = await client.lLen("jobs"); // 1

  console.log("lPop =", left);
  console.log("rPop =", right);
  console.log("remaining length =", length);

  await client.del("jobs");
}

async function lremAndIndex() {
  console.log("\n-- LREM & LINDEX --");

  await client.del("queue");
  await client.rPush("queue", "a", "b", "a", "c", "a");

  // remove first 2 occurrences of "a"
  const removed = await client.lRem("queue", 2, "a");
  const after = await client.lRange("queue", 0, -1);

  console.log("removed number =", removed);
  console.log("after =", after);

  // LINDEX (get element by index)
  await client.del("queue");
  await client.rPush("queue", "x", "y", "z");
  const at1 = await client.lIndex("queue", 1); // "y"
  console.log("element at index 1 =", at1);

  await client.del("queue");
}


// Try to pop the first item from the list.
// If the list already has items, BLPOP returns immediately.
// If the list is empty, Redis waits for the number of seconds specified (timeout).
// If a new item is pushed into the list during this waiting period, BLPOP returns it instantly.
// If nothing arrives within the timeout, BLPOP gives up and returns null.

async function blockingPopDemo() {
  console.log("\n-- BLPOP demo (2s timeout) --");

  await client.del("bq"); // ensure empty

  console.log("Waiting for an item (up to 2 seconds)...");
  // Note: client.blPop returns an array [key, element] or null on timeout
  const res = await client.blPop("bq", 2);

  console.log("blPop result =", res); // null if timeout
}

async function runAll() {
  try {
    await connect();

    await listPushAndRange();
    await popsAndLen();
    await lremAndIndex();
    await blockingPopDemo();

    console.log("\n All LIST examples completed.");
  } catch (err) {
    console.error("LIST ERROR:", err);
  } finally {
    await close();
  }
}

runAll();

export {
  listPushAndRange,
  popsAndLen,
  lremAndIndex,
  blockingPopDemo,
};
