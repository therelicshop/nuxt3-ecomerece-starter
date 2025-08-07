# 🚀 Multi-Platform Inventory Management SaaS

A comprehensive **multi-tenant inventory management platform** with advanced e-commerce integrations and cryptocurrency payment processing.

## ✨ Features

### 🔌 **Multi-Platform Integration**
- **eBay OAuth 2.0** - Production-ready integration with user credentials
- **WooCommerce API** - Complete REST API integration with key management
- **Shopware Integration** - Access token-based API connection
- **Real-time Sync** - Automatic inventory synchronization across platforms

### 📦 **Advanced Inventory Management**
- **Product Catalog** - Complete CRUD with barcode support, images, categories
- **Stock Tracking** - Real-time alerts, reorder points, multi-level warnings
- **Supplier Management** - Comprehensive vendor database with performance metrics
- **Order Tracking** - Multi-platform order management and fulfillment

### 💰 **Cryptocurrency Payments (NOWpayments)**
- **Multi-Currency Support** - BTC, ETH, LTC, XRP, USDT (TRC20/ERC20), SOL, TRX, TON
- **QR Code Generation** - Instant payment addresses with QR codes
- **Real-time Status** - Webhook-based payment confirmation
- **Blockchain Explorer** - Direct links to transaction verification

### 🔐 **Multi-Tenant Architecture**
- **JWT Authentication** - Secure user authentication and session management
- **Data Isolation** - Complete separation of user data and permissions
- **Role-based Access** - Configurable user permissions and access levels
- **MongoDB Database** - Scalable document-based data storage with Prisma ORM

### 📊 **Analytics & Reporting**
- **Sales Analytics** - Revenue tracking by platform and time period
- **Performance Metrics** - Top products, conversion rates, profit margins
- **Payment Analytics** - Breakdown by payment methods including crypto
- **Stock Reports** - Low stock alerts, reorder recommendations

### 🎨 **Modern UI/UX**
- **Nuxt.js Framework** - Server-side rendering and optimal performance
- **Shadcn-Vue Components** - Beautiful, accessible UI components
- **Tailwind CSS** - Responsive design with mobile-first approach
- **Real-time Updates** - Live notifications and status updates

## 🏗️ **Tech Stack**

### **Frontend**
- **Nuxt.js 3** - Vue.js framework with SSR/SSG
- **Vue.js 3** - Progressive JavaScript framework
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn-Vue** - Re-usable components built on Radix Vue
- **VueUse** - Essential Vue.js composition utilities

### **Backend**
- **Nuxt Server API** - Full-stack TypeScript API
- **Prisma ORM** - Type-safe database access and migrations
- **MongoDB** - Document-based NoSQL database
- **JWT Authentication** - Secure token-based authentication
- **bcryptjs** - Password hashing and security

### **Integrations**
- **eBay API** - OAuth 2.0 integration for inventory sync
- **WooCommerce REST API** - WordPress e-commerce integration
- **Shopware API** - German e-commerce platform integration
- **NOWpayments API** - Cryptocurrency payment processing
- **Cloudinary** - Image upload and optimization (optional)

### **Deployment**
- **Vercel** - Serverless deployment platform
- **MongoDB Atlas** - Cloud database hosting
- **Environment Variables** - Secure configuration management

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- MongoDB database (local or Atlas)
- NOWpayments API account (for crypto payments)
- eBay Developer account (for eBay integration)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inventory-management-saas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

4. **Configure Environment Variables**
   ```env
   # Database
   DATABASE_URL="mongodb://localhost:27017/inventory-saas"
   
   # Authentication
   JWT_SECRET="your-super-secret-jwt-key"
   
   # eBay Integration
   EBAY_CLIENT_ID="your-ebay-client-id"
   EBAY_CLIENT_SECRET="your-ebay-client-secret"
   EBAY_DEV_ID="your-ebay-dev-id"
   EBAY_RUNAME="your-ebay-runame"
   
   # NOWpayments
   NOWPAYMENTS_API_KEY="your-nowpayments-api-key"
   NOWPAYMENTS_IPN_SECRET="your-nowpayments-ipn-secret"
   ```

5. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Access Application**
   - Open http://localhost:3000
   - Register a new account or use demo credentials

## 📋 **API Documentation**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user details

### **Inventory Management**
- `GET /api/inventory/products` - List products with filtering
- `POST /api/inventory/products` - Create new product
- `PUT /api/inventory/products/[id]` - Update product
- `DELETE /api/inventory/products/[id]` - Delete product
- `GET /api/inventory/suppliers` - List suppliers
- `GET /api/inventory/orders` - List orders
- `GET /api/inventory/alerts` - List alerts and notifications
- `GET /api/inventory/analytics` - Get analytics data

### **Platform Integration**
- `GET /api/auth/ebay/connect` - Initiate eBay OAuth
- `GET /api/auth/ebay/callback` - Handle eBay OAuth callback
- `POST /api/integrations/sync` - Sync inventory across platforms
- `GET /api/integrations/status` - Get integration status
- `POST /api/integrations/disconnect` - Disconnect platform

### **Crypto Payments**
- `GET /api/payments/crypto/currencies` - List supported cryptocurrencies
- `POST /api/payments/crypto/create` - Create crypto payment
- `GET /api/payments/crypto/status/[id]` - Get payment status
- `POST /api/payments/crypto/webhook` - NOWpayments webhook handler

## 🔧 **Configuration**

### **eBay Integration Setup**
1. Create eBay Developer account
2. Generate production API credentials
3. Configure OAuth redirect URLs
4. Set up webhook endpoints

### **NOWpayments Setup**  
1. Create NOWpayments account
2. Generate API key and IPN secret
3. Configure webhook URL: `https://your-domain.com/api/payments/crypto/webhook`
4. Test with sandbox before production

### **Database Schema**
The application uses a comprehensive Prisma schema with:
- **Users** - Multi-tenant user management
- **Products** - Inventory items with platform sync
- **Suppliers** - Vendor management
- **Orders** - Multi-platform order tracking
- **Integrations** - Platform connection management
- **CryptoPayments** - Cryptocurrency transaction tracking
- **Alerts** - System notifications and warnings

## 🚀 **Deployment to Vercel**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Import project from GitHub
   - Configure environment variables
   - Deploy automatically

3. **Environment Variables**
   - Copy all `.env` variables to Vercel dashboard
   - Update URLs for production environment
   - Configure domain and SSL

4. **Database Setup**
   - Use MongoDB Atlas for production
   - Run Prisma migrations: `npx prisma db push`
   - Verify connections and test endpoints

## 🔒 **Security Features**

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Data Isolation** - Multi-tenant architecture
- **API Key Management** - Encrypted credential storage
- **Webhook Verification** - HMAC signature validation
- **Environment Variables** - Secure configuration
- **HTTPS Enforcement** - SSL/TLS encryption

## 📈 **Performance Optimizations**

- **Server-Side Rendering** - Nuxt.js SSR/SSG
- **Database Indexing** - Optimized MongoDB queries
- **Image Optimization** - Cloudinary integration
- **Caching Strategy** - API response caching
- **Code Splitting** - Dynamic imports and lazy loading
- **Edge Functions** - Vercel edge computing

## 🧪 **Testing**

```bash
# Run unit tests
npm run test

# Run integration tests  
npm run test:integration

# Run end-to-end tests
npm run test:e2e

# Check API endpoints
curl http://localhost:3000/api/inventory/products
```

## 📞 **Support**

- **Documentation** - Comprehensive API docs
- **Issues** - GitHub issue tracker
- **Community** - Discord/Slack support
- **Professional** - Enterprise support available

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎯 **Key Features Summary**

✅ **Multi-Platform E-commerce Integration** (eBay, WooCommerce, Shopware)  
✅ **Advanced Inventory Management** (Products, Stock, Suppliers, Orders)  
✅ **Cryptocurrency Payments** (9+ supported currencies via NOWpayments)  
✅ **Multi-Tenant SaaS Architecture** (JWT auth, data isolation)  
✅ **Real-time Analytics** (Sales, payments, stock alerts)  
✅ **Modern UI/UX** (Nuxt.js, Vue 3, Tailwind CSS)  
✅ **Production Ready** (Vercel deployment, MongoDB, security)  
✅ **Comprehensive API** (REST endpoints, webhook support)  

**Perfect for e-commerce businesses managing inventory across multiple platforms with modern cryptocurrency payment acceptance!**