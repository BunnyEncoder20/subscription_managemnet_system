# subscription_management_system

## Studying

### Backend Architectures

#### 1. Monolithic architecture
- All components of your app are combined into a single unified codebase
- Hence the backend handles everything from user management to business logic and database interactions.
- Pros:
    - simple to develop and deploy
    - Easier to debug since everything is in one place
- Cons:
    - can get messy as the app grows
    - scaling specific parts of the app can be tricky
- it has been the go-to  architecture for several years, and is also used in this project

#### 2. Microservices architecture
- The entire app is broken down into smaller independent services,
- Each services handle a specific business function (eg: auth, payments, notifications), all separated
- They communicate via
- Ideal for very larges scale systems and enterprise systems where there is demand for scalaibility and flexibility

#### 3. Serverless architecture
- it lets you write your application code without worrying about the underlying infrastructure.
- services like AWS, Vercel now handle provisioning, scaling, and server management for you
- have used a lot of this for my Next.js projects (all deployed to vercel)
- their ideal for startups, rapid prototyping and spiky traffic (cause of the several architecture, the load of the server can bear can be increased easily)


## Project Plan:
1. Setting up a  monolithic backend
2. Using Node.js and Express.js
3. Connecting to MongoDB database
4. Securing API with Arcjet
5. Automating Subscription tracking with Upstash Workflows

## Important Commands
- To generate a express project (for only backend)
```bash
npx express-generator --no-view --git ./
```
- To start upstash serverless workflow (for local dev)
```bash
npx @upstash/qstash-cli dev
```
