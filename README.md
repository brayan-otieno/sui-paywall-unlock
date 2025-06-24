<<<<<<< HEAD
# 🔓 Sui-paywall-unlock


## 📖 About The Project

**Sui-paywall-unlock** is a **permissionless unlock mechanism** for gated content or features on the **Sui blockchain** 🔗.
It enables developers to create **paywalled experiences** where access is granted based on **asset ownership**, **token payments**, or other **on-chain conditions** — without relying on centralized servers or services.

🎯 Ideal for **dApps**, **digital content**, and **access control**.

---

### 🛠️ Built With

This project is built with the following major frameworks and libraries:

* ⚛️ [React](https://reactjs.org/)
* ⚡ [Vite](https://vitejs.dev/)
* 🧠 [TypeScript](https://www.typescriptlang.org/)
* 🎨 [Tailwind CSS](https://tailwindcss.com/)
* 🧩 [Shadcn/UI](https://ui.shadcn.com/)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### ✅ Prerequisites

Make sure you have **Node.js** installed on your system.
📥 Download it from [nodejs.org](https://nodejs.org/)

This project also uses `bun` (as indicated by `bun.lockb`), but `npm` or `yarn` can also be used.

* 📦 npm

  ```sh
  npm install npm@latest -g
  ```
* 🍞 bun (optional)

  ```sh
  npm install -g bun
  ```

---

### 📦 Installation

1. 📂 Clone the repo:

   ```sh
   git clone <YOUR_REPOSITORY_URL>
   cd sui-paywall-unlock
   ```
2. 📥 Install dependencies:

   ```sh
   npm install
   ```

   Or using bun:

   ```sh
   bun install
   ```

---

## ⚙️ Available Scripts

In the project directory, you can run the following scripts:

### 🧪 `npm run dev` or `bun run dev`

Runs the app in development mode using Vite.
🌐 Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### 🏗️ `npm run build` or `bun run build`

Builds the app for production to the `dist` folder.
📦 Optimized for best performance.

### 🧱 `npm run build:dev` or `bun run build:dev`

Builds the app in **development mode** to the `dist` folder.

### 🧹 `npm run lint` or `bun run lint`

Runs ESLint to check for **code quality** and **style issues**.

### 👀 `npm run preview` or `bun run preview`

Serves the **production build locally** for final checks before deployment.

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! 🌍
Your help is **greatly appreciated** 💖

1. 🍴 Fork the project
2. 🌱 Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. ✅ Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔃 Open a Pull Request

⭐ Don’t forget to **star** the repo if you like it!

---

## 📄 License

Distributed under the **MIT License**.
See `LICENSE.txt` for more information.

---

## 📬 Contact

**Your Name** – [@your\_twitter](https://twitter.com/your_twitter) – [email@example.com](mailto:email@example.com)
🔗 Project Link: https://github.com/brayan-otieno/sui-paywall-unlock.git

---

=======
# 🔓 SUI Paywall Unlock

A **permissionless unlock mechanism** for gated content on the **SUI blockchain** with **Swypt payment integration**.

## 🚀 Features

- **Swypt Payment Integration** - Secure SUI payments
- **Real-time Access Control** - Instant content unlocking
- **Creator Dashboard** - Analytics and earnings tracking
- **MySQL Database** - Persistent data storage
- **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

### Frontend
- ⚛️ React 18 with TypeScript
- ⚡ Vite for development
- 🎨 Tailwind CSS + Shadcn/UI
- 🔗 React Router for navigation
- 📊 Recharts for analytics

### Backend
- 🟢 Node.js with Express
- 🗄️ MySQL database
- 🔐 JWT authentication
- 🎣 Webhook handling
- 🛡️ Security middleware

### Payment
- 💳 Swypt Checkout SDK
- 🔗 SUI blockchain integration
- 🎣 Real-time webhook processing

## 📦 Installation

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd sui-paywall-unlock
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Database Setup
```bash
# Start MySQL service
sudo systemctl start mysql  # Linux
brew services start mysql   # macOS

# Create database and tables
mysql -u root -p < database.sql

# Or use the setup script
cd server
npm run setup-db
```

### 4. Environment Configuration

**Frontend (.env):**
```bash
cp .env.example .env
# Edit .env with your settings
VITE_API_URL=http://localhost:3001/api
```

**Backend (server/.env):**
```bash
cd server
cp .env.example .env
# Edit server/.env with your settings
```

Required backend environment variables:
```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sui_paywall
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
SWYPT_API_KEY=your_swypt_api_key
SWYPT_WEBHOOK_SECRET=your_swypt_webhook_secret
```

### 5. Get Swypt API Keys

1. Visit [Swypt.io](https://swypt.io)
2. Create an account
3. Get your API keys from the dashboard
4. Add them to your `server/.env` file

## 🚀 Running the Application

### Development Mode
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:client  # Frontend only
npm run dev:server  # Backend only
```

### Production Mode
```bash
# Build frontend
npm run build

# Start backend
cd server
npm start
```

## 📊 Database Schema

The application uses the following main tables:

- **users** - User accounts and authentication
- **paywalls** - Content paywalls created by users
- **payments** - Payment transactions and status
- **paywall_views** - Analytics for paywall views

See `database.sql` for the complete schema.

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Paywalls
- `POST /api/paywalls` - Create paywall
- `GET /api/paywalls/my` - Get user's paywalls
- `GET /api/paywalls/:id` - Get single paywall
- `PUT /api/paywalls/:id` - Update paywall
- `DELETE /api/paywalls/:id` - Delete paywall

### Payments
- `POST /api/payments/create-session` - Create payment session
- `GET /api/payments/status/:id` - Get payment status
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/earnings` - Get creator earnings

### Webhooks
- `POST /api/webhooks/swypt` - Swypt payment webhooks

## 💳 Swypt Integration

The application integrates with Swypt for secure SUI payments:

1. **Payment Flow:**
   - User clicks "Pay" button
   - Backend creates payment session
   - Swypt SDK opens checkout
   - User completes payment
   - Webhook confirms payment
   - Content is unlocked

2. **Webhook Processing:**
   - Verifies webhook signature
   - Updates payment status
   - Grants content access
   - Sends notifications

## 🔐 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- SQL injection prevention
- Webhook signature verification

## 📱 Usage

### For Creators:
1. Register/login to dashboard
2. Create paywalls with content
3. Set prices in SUI
4. Share paywall links
5. Track earnings and analytics

### For Users:
1. Visit paywall link
2. Connect SUI wallet
3. Pay with Swypt
4. Access unlocked content

## 🧪 Testing

### Sample Data
The database includes sample users and paywalls for testing:

**Test Accounts:**
- Email: `creator@example.com`
- Email: `user@example.com`
- Password: `password123`

### Local Testing
1. Start the application
2. Visit `http://localhost:8080`
3. Login with test account
4. Create and test paywalls

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (VPS/Cloud)
```bash
# Install dependencies
npm install --production

# Set environment variables
export NODE_ENV=production

# Start with PM2
pm2 start server/index.js --name sui-paywall
```

### Database (Production)
- Use managed MySQL service
- Set up automated backups
- Configure SSL connections

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.

## 📞 Support

For issues and questions:
- Create GitHub issue
- Check documentation
- Contact support team

---

**Built with ❤️ for the SUI ecosystem**
>>>>>>> 139731a (Initial backend implementation and simple authentication)
