# UnHackable

A secure cryptographic key pair generation and recovery application for Solana blockchain.

https://github.com/user-attachments/assets/bfacf288-e6eb-4a2b-88aa-d0c2263203e4

## Features

- 🔐 **Generate Key Pairs** - Create secure public-private key pairs for Solana wallets
- 🔑 **Recover Private Keys** - Restore keys from seed phrases with custom derivation paths
- 💾 **Save Hints** - Securely store encrypted hints for registered users
- 👛 **Wallet Management** - Dashboard for managing multiple wallet configurations

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 15 |
| Language | TypeScript |
| Styling | TailwindCSS, shadcn/ui |
| Auth | NextAuth.js |
| Database | MongoDB + Prisma |
| Container | Docker |
| CI/CD | GitHub Actions |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/shubhiscoding/UnHackable.git
   cd UnHackable
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env`:
   ```bash
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   NEXTAUTH_URL=http://localhost:3000
   AUTH_SECRET=your-secret-key
   DATABASE_URI=mongodb://...
   NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
   ```

3. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

### Running Tests

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
```

### Docker Build

```bash
# Build image
docker build -t unhackable .

# Run container
docker run -p 3000:3000 unhackable
```

---

## 🔧 CI/CD Pipeline

This project uses GitHub Actions for automated CI/CD.

### CI Pipeline (`.github/workflows/ci.yml`)

Triggered on: Push/PR to `main` branch

| Stage | Purpose |
|-------|---------|
| 🔍 Lint & Type Check | ESLint + TypeScript validation |
| 🧪 Unit Tests | Jest test execution |
| 🔐 SAST (CodeQL) | Static security analysis |
| 📦 SCA | Dependency vulnerability scan |
| 🏗️ Build | Next.js production build |
| 🐳 Docker Build & Scan | Container build + Trivy scan |
| 📤 Push to DockerHub | Publish verified image |

### CD Pipeline (`.github/workflows/cd.yml`)

Triggered: After successful CI

| Stage | Purpose |
|-------|---------|
| 🚀 Deploy to Staging | Kubernetes deployment validation |
| 🔐 DAST | OWASP ZAP security scan |
| 🚀 Deploy to Production | Production release (manual approval) |

### Configure GitHub Secrets

Go to **Repository Settings → Secrets and variables → Actions** and add:

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token ([create here](https://hub.docker.com/settings/security)) |

### Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CI PIPELINE                             │
├─────────────────────────────────────────────────────────────┤
│  Push → Lint → Tests → SAST → SCA → Build → Docker → Push   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      CD PIPELINE                             │
├─────────────────────────────────────────────────────────────┤
│  Deploy Staging → DAST Scan → [Approval] → Deploy Prod      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
UnHackable/
├── .github/workflows/     # CI/CD pipelines
│   ├── ci.yml
│   └── cd.yml
├── k8s/                   # Kubernetes manifests
│   ├── deployment.yaml
│   └── service.yaml
├── src/
│   ├── app/               # Next.js app router
│   ├── components/        # React components
│   └── lib/               # Utilities
├── __tests__/             # Jest tests
├── dockerfile             # Multi-stage Docker build
└── .zap/                  # OWASP ZAP config
```

---

## 🔒 Security

- **SAST**: CodeQL scans for OWASP Top 10 vulnerabilities
- **SCA**: npm audit for dependency vulnerabilities  
- **Container Scanning**: Trivy for image vulnerabilities
- **DAST**: OWASP ZAP for runtime security testing

---

## 📜 License

MIT

---

<!-- GitAds-Verify: DT98EHXVE6E5DCZH6VAECCPN2BGFALLK -->
## GitAds Sponsored
[![Sponsored by GitAds](https://gitads.dev/v1/ad-serve?source=shubhiscoding/unhackable@github)](https://gitads.dev/v1/ad-track?source=shubhiscoding/unhackable@github)


