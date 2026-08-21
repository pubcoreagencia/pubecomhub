import { CatalogSourceAdapter, RawProduct } from "./types";
import { ShopeeAdapter } from "./adapters/ShopeeAdapter";
import { MockAdapter } from "./adapters/MockAdapter";

export class SourceResolver {
  private adapters: CatalogSourceAdapter[] = [
    new ShopeeAdapter(),
    new MockAdapter()
  ];

  resolve(url: string): CatalogSourceAdapter | null {
    // Se for URL de teste, forçamos o MockAdapter
    if (url.includes('example.com') || url.includes('test') || !url.startsWith('http')) {
      return this.adapters.find(a => a instanceof MockAdapter) || null;
    }

    return this.adapters.find(adapter => adapter.canHandle(url)) || null;
  }
}
