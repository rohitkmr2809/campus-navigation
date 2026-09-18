# Campus Navigation System 

**A Full-Stack College Software Engineering Microproject**  
*Built with Next.js (App Router), React, Tailwind CSS, MongoDB, Leaflet, OpenStreetMap, and Dijkstra's Shortest Path Algorithm.*

---

## 1. Project Overview & Description
The **Campus Navigation System** is a production-grade web application designed to help students, faculty members, parents, and campus visitors navigate a college campus efficiently. 

Large educational institutions often feature multi-acre campuses with dozens of academic blocks, departmental laboratories, libraries, administrative offices, sports complexes, hostels, and canteens. Finding the shortest walking route between buildings is often confusing, particularly for freshmen, external viva examiners, and guests.

This system provides:
- An interactive **Leaflet + OpenStreetMap** campus view (with zero paid Google Maps API dependencies).
- **Dijkstra's Shortest Path Algorithm** for finding the optimal walking path, exact distance in meters, and walking time.
- Categorized campus directory and live search.
- Role-based authentication (Student, Faculty, Visitor, Admin) with **bcrypt password hashing** and **JWT cookies**.
- Dedicated **Admin Control Center** to add, edit, and delete campus locations (graph nodes) and roads (graph edges).

---

## 2. Problem Statement
Commercial navigation tools like Google Maps are geared toward vehicular roads and frequently lack internal college footpaths, pedestrian-only courtyards, department floor details, and gate checkpoints. Moreover, commercial mapping APIs require paid subscriptions and credit cards, making them unsuitable for autonomous college software projects. 

This project solves this by formulating the college walkways into an undirected, weighted graph and solving for the optimal path using Dijkstra's algorithm over an open-source mapping stack.

---

## 3. Technology Stack

### Frontend:
- **Next.js 14 (App Router)** - React-based full-stack framework
- **React 18** - Component-based user interface
- **Tailwind CSS** - Modern, responsive styling
- **Leaflet & React-Leaflet** - Open-source interactive maps
- **Lucide React** - Clean iconography

### Backend:
- **Next.js Route Handlers** (`app/api/*`) - Serverless REST API endpoints
- **JSON Web Tokens (jsonwebtoken)** - Secure stateless authentication cookies
- **bcryptjs** - Salted password hashing

### Database:
- **MongoDB & Mongoose ODM** - Scalable document database modeling Users, Locations, and Roads
- **Dual-Mode Data Layer** - Automatically connects to MongoDB (Atlas or Local), with zero-config in-memory fallback for instant offline demonstrations.

### Graph Algorithm:
- **Dijkstra's Shortest Path Algorithm** (`lib/dijkstra.js`) - Solves single-source shortest path on weighted undirected graph $G = (V, E)$.

---

## 4. System Architecture

```
+-------------------------------------------------------------+
|                     Client Web Browser                      |
|       (Next.js React UI, Interactive Leaflet Canvas)        |
+-------------------------------------------------------------+
                              |
                         JSON REST API
                              |
+-------------------------------------------------------------+
|                  Next.js App Route Handlers                 |
|  - /api/auth/*        (Registration, Login, Me, Logout)     |
|  - /api/locations/*   (Public query & Admin CRUD)           |
|  - /api/roads/*       (Public query & Admin CRUD)           |
|  - /api/navigation/*  (Dijkstra Shortest Path Solver)       |
|  - /api/stats         (Campus Statistics Dashboard)         |
+-------------------------------------------------------------+
        |                                       |
        v                                       v
+------------------------+          +------------------------+
|   Dijkstra Engine      |          |  Authentication & JWT  |
|  (Adjacency List Graph)|          |  (bcrypt + Middleware) |
+------------------------+          +------------------------+
        |                                       |
        +-------------------+-------------------+
                            |
                            v
+-------------------------------------------------------------+
|                   MongoDB / MongoDB Atlas                   |
|               Collections: users, locations, roads          |
+-------------------------------------------------------------+
```

---

## 5. Dijkstra's Algorithm Explained (Viva Ready)

The algorithmic core of this project resides in [`lib/dijkstra.js`](file:///./lib/dijkstra.js).

### Concept:
1. **Vertices ($V$):** Campus locations (e.g., Main Gate, Admin Block, CSE Block, Library).
2. **Edges ($E$):** Walkable pathways connecting pairs of locations.
3. **Weights ($w$):** Measured pedestrian distance in meters. Because walking distances are non-negative ($w \ge 0$), Dijkstra's greedy algorithm is mathematically guaranteed to find the absolute shortest path.

### Execution Steps:
1. **Adjacency List Construction:** The system loads all locations and roads to construct a bidirectional adjacency list `graph.get(u) = [{ nodeId: v, distance: weight }]`.
2. **Initialization:** Distance to the start node is set to `0`. Distances to all other nodes are initialized to `Infinity`. An `unvisited` set contains all vertices.
3. **Greedy Traversal:**
   - Select the unvisited vertex $u$ with the minimum tentative distance.
   - For every neighbor $v$ of $u$, calculate tentative distance:
     $$\text{newDist} = \text{dist}[u] + \text{weight}(u, v)$$
   - If $\text{newDist} < \text{dist}[v]$, update $\text{dist}[v] = \text{newDist}$ and record predecessor $\text{previous}[v] = u$.
   - Mark $u$ as visited.
4. **Target Termination:** Once the destination vertex is selected, the shortest path is finalized.
5. **Backtracking:** Reconstruct the path by traversing backwards from destination to source using `previous` pointers.
6. **Walking Time Calculation:**
   $$\text{Walking Time (minutes)} = \left\lceil \frac{\text{Distance in Meters}}{80\text{ m/min}} \right\rceil$$
   *(Based on standard human campus walking speed of 4.8 km/h).*

---

## 6. Sample Login Credentials

For demonstration and testing during college presentation/viva:

| Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@campus.edu` | `Admin@123` | Full access: Add/Edit/Delete locations & roads, view users |
| **Student** | `student@campus.edu` | `Student@123` | Campus map, shortest route calculation, directory search |
| **Faculty** | `faculty@campus.edu` | `Student@123` | Standard campus exploration and navigation |
| **Visitor** | `visitor@campus.edu` | `Student@123` | Guest navigation access |

> [!NOTE]  
> The login page at `/login` also features **one-click autofill buttons** for rapid viva testing.

---

## 7. Installation & Setup Instructions

### Prerequisites:
- **Node.js**: v18 or higher (tested on Node v20/v22/v24)
- **npm** or **yarn**
- **Git**

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/campus-navigation.git
cd campus-navigation
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a file named `.env.local` in the project root:
```env
# MongoDB Connection String (Atlas or Local)
MONGODB_URI=mongodb://127.0.0.1:27017/campus_navigation

# JWT Secret Key
JWT_SECRET=super_secret_jwt_key_campus_navigation_2026_dev_key

# Environment
NODE_ENV=development
```

### Step 4: Seed the Database
Run the seed script to populate 15 realistic campus locations, 22 roads, and sample users:
```bash
npm run seed
```

### Step 5: Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 8. API Documentation

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT cookie |
| `POST` | `/api/auth/logout` | Public | Invalidate auth cookie |
| `GET` | `/api/auth/me` | Public | Return current session profile |
| `GET` | `/api/locations` | Public | Get all campus locations (supports `?search=` & `?type=`) |
| `POST` | `/api/locations` | Admin | Create a new campus location |
| `GET` | `/api/locations/:id` | Public | Get single location details |
| `PUT` | `/api/locations/:id` | Admin | Update location details |
| `DELETE`| `/api/locations/:id` | Admin | Delete location and cascade-delete connected roads |
| `GET` | `/api/roads` | Public | Get all connected campus roads |
| `POST` | `/api/roads` | Admin | Connect two locations with walking distance |
| `PUT` | `/api/roads/:id` | Admin | Update road distance |
| `DELETE`| `/api/roads/:id` | Admin | Delete road edge |
| `POST` | `/api/navigation/shortest-path` | Public | Execute Dijkstra algorithm between two node IDs |
| `GET` | `/api/users` | Admin | View registered users list |
| `GET` | `/api/stats` | Admin | View campus topology metrics & stats |

---

## 9. Production Deployment Guide (Vercel + MongoDB Atlas)

### 1. MongoDB Atlas Setup (Free Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Create a free **M0 Sandbox** cluster.
3. Under **Database Access**, create a database user (e.g. `campus_admin`) and generate a password.
4. Under **Network Access**, click **Add IP Address** and choose **Allow Access from Anywhere** (`0.0.0.0/0`) so Vercel serverless functions can connect.
5. Click **Connect** > **Drivers** > copy the connection URI:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/campus_navigation?retryWrites=true&w=majority
   ```

### 2. Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Campus Navigation System"
git branch -M main
git remote add origin https://github.com/<your-username>/campus-navigation.git
git push -u origin main
```

### 3. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com) and click **"Add New..." > "Project"**.
2. Select your `campus-navigation` repository.
3. In **Environment Variables**, add:
   - `MONGODB_URI` = *(your MongoDB Atlas connection string)*
   - `JWT_SECRET` = *(a random 32-character secret)*
   - `NODE_ENV` = `production`
4. Click **Deploy**. Vercel will build and deploy the Next.js application.

---

## 10. Verification & Testing Checklist
- [x] Dijkstra Algorithm Unit Tests (`npm run test:dijkstra`)
- [x] User Registration & bcrypt password hashing
- [x] Role-Based Access Control (Admin route gating)
- [x] Leaflet OpenStreetMap rendering without Google Maps API keys
- [x] Live Shortest Path route polyline display
- [x] Dynamic Location CRUD in Admin Panel
- [x] Dynamic Road Network CRUD in Admin Panel
- [x] Clean Next.js Production Build (`npm run build`)
