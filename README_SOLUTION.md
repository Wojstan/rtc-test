# 🏃‍♂️ Getting Started

You can run this project in two ways:

---

## ⚙️ Option 1: Using Docker

1. **Build the container:**

   ```bash
   docker compose build
   ```

2. **Start the app:**

   ```bash
   docker compose up
   ```

---

## 💻 Option 2: Run Locally with Node.js

1. **Install dependencies:**

   ```bash
   npm install
   ```

   or (recommended):

   ```bash
   pnpm install
   ```

2. **Build the project:**

   ```bash
   npm run build
   ```

3. **Start the app:**

   ```bash
   npm run start
   ```

---

## 🧪 Running Tests

```bash
npm run test
```

---

## 🧹 Lint & Fix

```bash
npm run lint:fix
```

## 📡 API

The API will be accessible on port 3005

- **GET `/client/state`**
  Returns the current internal simulation state.
