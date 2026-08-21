
import { runShopeeWorker } from "./src/lib/ingestion/workers/ShopeeWorker.server";

async function test() {
  const url = "https://shopee.com.br/shop/286044738";
  console.log("--- STARTING REAL TEST ---");
  console.log("URL:", url);
  
  try {
    const result = await runShopeeWorker({
      url,
      limit: 10,
      pageSize: 30
    });
    
    console.log("--- RESULTS ---");
    console.log("ShopID detected:", result.shopId);
    console.log("Products found:", result.items.length);
    console.log("Execution time:", result.executionTime, "ms");
    console.log("Errors:", result.errors);
    
    if (result.items.length > 0) {
      console.log("First item sample:", {
        name: result.items[0].name,
        price: result.items[0].price,
        itemid: result.items[0].itemid
      });
    }
  } catch (e) {
    console.error("Test failed:", e);
  }
}

test();
