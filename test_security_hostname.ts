import { runShopeeWorker } from "./src/lib/ingestion/workers/ShopeeWorker.server";

async function testSecurity() {
  const targets = [
    "http://127.0.0.1",
    "http://localhost",
    "http://169.254.169.254",
    "https://evil-shopee.com.br",
    "https://legit.shopee.com.br.evil.com"
  ];

  for (const url of targets) {
    try {
      console.log(`Testing: ${url}`);
      const result = await runShopeeWorker({ url, limit: 1, pageSize: 1 });
      console.log(`Result for ${url}: `, result.errors);
    } catch (e: any) {
      console.log(`Caught error for ${url}: ${e.message}`);
    }
  }
}

testSecurity();
