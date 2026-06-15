# Deployment Strategy

## 1. Infrastructure Providers
- **Frontend Hosting**: Firebase Hosting (Using the experimental Next.js Web Frameworks integration) or Vercel (Alternative).
- **Backend & Database**: Firebase (Authentication, Firestore, Cloud Functions, Cloud Messaging).

## 2. Environments
- **Local Development**: Using Firebase Local Emulator Suite (Auth, Firestore, Functions) and `next dev`.
- **Preview/Staging**: Automatically deployed on every PR using GitHub Actions. Connects to a dedicated `remindsync-staging` Firebase project.
- **Production**: Deployed when changes are merged to the `main` branch. Connects to `remindsync-prod`.

## 3. CI/CD Workflow (GitHub Actions)

### Continuous Integration (On Pull Request)
1. `npm ci` (Install dependencies)
2. `npm run lint` (ESLint & Prettier)
3. `npm run test` (Unit and Integration tests against Emulators)
4. Build Next.js app to catch compilation errors.

### Continuous Deployment (On Merge to Main)
1. Run CI steps.
2. `npm run build` (Production optimized build).
3. `firebase deploy --only functions,firestore:rules,firestore:indexes`
4. `firebase deploy --only hosting`

## 4. Environment Variables Management
- `.env.local`: Used for local development (contains emulator ports, local API keys).
- **GitHub Secrets**: Store production and staging environment variables (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`).
- **Google Cloud Secret Manager**: Used for sensitive backend secrets (e.g., third-party API keys) accessed directly by Cloud Functions.

## 5. Production Checklist
- [ ] Firestore Security Rules fully tested and deployed.
- [ ] Firebase App Check enforced with App Attest/reCAPTCHA.
- [ ] Firestore indexes created for all complex queries.
- [ ] Custom domain connected to Firebase Hosting and SSL provisioned.
- [ ] Google Analytics / Crashlytics configured for monitoring.
