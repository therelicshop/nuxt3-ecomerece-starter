// Integration utility functions and types

export interface PlatformProduct {
  id: string
  platform: 'ebay' | 'woocommerce' | 'shopware'
  title: string
  sku: string
  price: number
  quantity: number
  status: string
  category: string
  lastSync: string
  [key: string]: any // Additional platform-specific fields
}

export interface IntegrationStatus {
  connected: boolean
  lastSync: string | null
  status: 'active' | 'disconnected' | 'error'
  productsCount: number
  apiCallsToday: number
  apiLimit: number | 'unlimited'
}

export interface SyncResult {
  platform: string
  success: boolean
  productsProcessed: number
  duration: number
  lastSync: string
}

// eBay API utilities
export class EbayAPI {
  private accessToken: string
  private environment: 'sandbox' | 'production'

  constructor(accessToken: string, environment: 'sandbox' | 'production' = 'production') {
    this.accessToken = accessToken
    this.environment = environment
  }

  private getApiUrl(): string {
    return this.environment === 'sandbox' 
      ? 'https://api.sandbox.ebay.com'
      : 'https://api.ebay.com'
  }

  async getInventoryItems(): Promise<any> {
    const response = await fetch(`${this.getApiUrl()}/sell/inventory/v1/inventory_item`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`eBay API error: ${response.statusText}`)
    }
    
    return await response.json()
  }
}

// WooCommerce API utilities
export class WooCommerceAPI {
  private apiUrl: string
  private consumerKey: string
  private consumerSecret: string

  constructor(storeUrl: string, consumerKey: string, consumerSecret: string) {
    this.apiUrl = `${storeUrl}/wp-json/wc/v3`
    this.consumerKey = consumerKey
    this.consumerSecret = consumerSecret
  }

  private getAuth(): string {
    return Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64')
  }

  async getProducts(): Promise<any> {
    const response = await fetch(`${this.apiUrl}/products`, {
      headers: {
        'Authorization': `Basic ${this.getAuth()}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.statusText}`)
    }
    
    return await response.json()
  }
}

// Shopware API utilities
export class ShopwareAPI {
  private apiUrl: string
  private accessToken: string

  constructor(storeUrl: string, accessToken: string) {
    this.apiUrl = `${storeUrl}/api`
    this.accessToken = accessToken
  }

  async getProducts(): Promise<any> {
    const response = await fetch(`${this.apiUrl}/product`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Shopware API error: ${response.statusText}`)
    }
    
    return await response.json()
  }
}

// Product synchronization utilities
export function normalizeProduct(product: any, platform: string): PlatformProduct {
  switch (platform) {
    case 'ebay':
      return {
        id: product.sku || product.inventoryItemGroupKey,
        platform: 'ebay',
        title: product.product?.title || 'Untitled',
        sku: product.sku,
        price: product.offers?.[0]?.price?.value || 0,
        quantity: product.offers?.[0]?.availableQuantity || 0,
        status: product.offers?.[0]?.listingStatus || 'unknown',
        category: product.product?.aspects?.Brand?.[0] || 'Uncategorized',
        lastSync: new Date().toISOString()
      }

    case 'woocommerce':
      return {
        id: product.id.toString(),
        platform: 'woocommerce',
        title: product.name,
        sku: product.sku || '',
        price: parseFloat(product.price) || 0,
        quantity: product.stock_quantity || 0,
        status: product.status,
        category: product.categories?.[0]?.name || 'Uncategorized',
        lastSync: new Date().toISOString()
      }

    case 'shopware':
      return {
        id: product.id,
        platform: 'shopware',
        title: product.translated?.name || product.name,
        sku: product.productNumber,
        price: product.price?.[0]?.gross || 0,
        quantity: product.availableStock || 0,
        status: product.active ? 'active' : 'inactive',
        category: product.categories?.[0]?.translated?.name || 'Uncategorized',
        lastSync: new Date().toISOString()
      }

    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}