# CAMPUS NAVIGATION SYSTEM
## College Software Engineering Microproject Report & Documentation

---

### 1. ABSTRACT
The **Campus Navigation System** is a responsive web application engineered to solve the common challenge of wayfinding in large collegiate institutions. Modern college campuses feature sprawling layouts comprising multiple multi-story academic blocks, departmental laboratories, libraries, administrative offices, sports complexes, and student residences. Visitors, freshers, and even senior students frequently struggle to locate specific buildings and identify the shortest walking route between destinations. 

This project implements an intelligent, graph-theoretic wayfinding web platform using **Next.js (React)**, **Tailwind CSS**, **MongoDB with Mongoose ODM**, **Leaflet.js + OpenStreetMap**, and **Dijkstra's Shortest Path Algorithm**. Campus locations are modeled as graph vertices with physical geographic coordinates, while walkable pathways and corridors are modeled as weighted, undirected graph edges where weights denote metric walking distances. The application features user role authentication (bcrypt + JWT), an interactive OpenStreetMap interface with custom categorized markers, real-time shortest-path calculation with turn-by-turn walking guidance, building directory search, and an administrative control panel for dynamic graph topology management.

---

### 2. INTRODUCTION
Colleges and universities are miniature cities. Spread over tens to hundreds of acres, institutional campuses house diverse functional units that must be accessed daily by thousands of students, faculty members, parents, external examiners, recruiters, and guests. Navigating these environments often relies on physical signboards that may be damaged, poorly positioned, or outdated following new construction.

Commercial mapping applications such as Google Maps primarily focus on vehicular roadways and frequently omit pedestrian-only corridors, internal campus sidewalks, inter-building pathways, and specific departmental floor information. Furthermore, commercial mapping APIs impose strict quotas, billing requirements, and proprietary key requirements.

The **Campus Navigation System** provides an autonomous, self-hosted, zero-cost, open-source solution specifically calibrated for collegiate environments. Built using standard web technologies and the venerable Dijkstra algorithm, it provides instantaneous routing, accurate distance computation, and estimated walking times on any desktop, tablet, or smartphone browser.

---

### 3. PROBLEM STATEMENT
Traditional campus navigation suffers from several distinct problems:
1. **Lack of Pedestrian Detail:** Commercial navigation platforms show external roads but fail to map internal campus footpaths, pedestrian walkways, and courtyard passages.
2. **Missing Facility Metadata:** Visitors do not merely need to find a building; they need to know the specific department, floor level, and administrative office inside it.
3. **Static Signage Inefficiency:** Physical signs cannot update dynamically when pathways are closed for maintenance or when departments relocate.
4. **Dependence on Paid APIs:** Many institutional software projects fail to sustain deployment due to recurring costs associated with commercial mapping API keys.

The objective of this microproject is to eliminate these pain points by building a dedicated, full-stack campus navigation system using open mapping tiles and graph search algorithms.

---

### 4. EXISTING SYSTEM vs. 5. PROPOSED SYSTEM

| Feature / Metric | Existing System (Traditional / Commercial) | Proposed System (CampusNav) |
| :--- | :--- | :--- |
| **Mapping Source** | Static printed maps / Google Maps | Leaflet + OpenStreetMap (100% Free & Open) |
| **Walkway Mapping** | Only major vehicular roads | Precise pedestrian walkways and corridors |
| **Algorithm** | Proprietary black-box cloud routing | Transparent, viva-verifiable Dijkstra's Algorithm |
| **Building Details** | Generic pin with limited metadata | Full metadata (Building, Floor, Department, Type) |
| **Administration** | Requires submitting map edits to third parties | Real-time Admin Dashboard for instant CRUD |
| **API Costs** | High / Requires Credit Card & Billing Setup | Zero API key requirement, zero operational cost |
| **Platform** | Native mobile app downloads required | Fully responsive Progressive Web App (Next.js) |

---

### 6. OBJECTIVES
1. Develop an interactive web-based map visualizing all major college campus locations.
2. Formulate campus pathways as a weighted graph and implement Dijkstra's algorithm to calculate the optimal path between any two locations.
3. Provide total distance in meters and walking time estimation in minutes.
4. Implement a comprehensive search and filter interface to locate facilities by name or category.
5. Provide secure role-based access control (Student, Faculty, Visitor, Administrator).
6. Enable administrators to dynamically add, modify, or delete campus locations and road connections.

---

### 7. SCOPE
- **Target Audience:** College students, teaching/non-teaching faculty, administrative staff, guests, prospective students, and visitors.
- **Geographic Scope:** The physical boundary of the college campus, including academic blocks, sports fields, hostels, gates, and cafeterias.
- **Device Support:** Accessible on any modern web browser (Chrome, Firefox, Safari, Edge) across mobile devices, tablets, and desktop computers.

---

### 8. FUNCTIONAL REQUIREMENTS
1. **User Authentication Module:**
   - Registration with name, email, password, and campus role.
   - Secure login with bcrypt password comparison.
   - Stateless JWT tokens stored in HTTP-only cookies.
   - Logout functionality clearing session cookies.
2. **Campus Map Module:**
   - Interactive pan, zoom, and touch controls via Leaflet.js.
   - OpenStreetMap base tile rendering without API keys.
   - Categorized location pins with distinct visual indicators.
   - Information popups on marker click with quick "Set Start" and "Set Destination" triggers.
3. **Route Planning Module:**
   - Dropdown selection of origin and destination nodes.
   - Origin/destination swap utility.
   - Route calculation invoking Dijkstra's algorithm.
   - Dynamic polyline rendering showing the shortest route on the map.
   - Summary statistics: Total meters and estimated walking duration.
   - Node-by-node turn-by-turn walking directions.
4. **Campus Directory & Search Module:**
   - Live text search querying location names, buildings, and descriptions.
   - Filter chips by category (Department, Library, Canteen, Hostel, Gate, etc.).
5. **Admin Management Module:**
   - Protected `/admin` dashboard with campus metrics (users, nodes, edges, network length).
   - Location CRUD: Add, update, delete campus nodes.
   - Road CRUD: Connect two locations with distance, update distance, delete edge.
   - User Directory: View registered users and roles.

---

### 9. NON-FUNCTIONAL REQUIREMENTS
- **Performance:** Pathfinding calculation completes in under 20 milliseconds on a campus graph with dozens of nodes.
- **Security:** Passwords salted and hashed with bcrypt (10 rounds); routes protected with role authorization.
- **Usability:** Clean college-style aesthetic built with Tailwind CSS; intuitive iconography from Lucide React.
- **Reliability & Availability:** Dual-mode data service operates seamlessly with MongoDB Atlas or in-memory fallback for offline vivas.
- **Extensibility:** Modularity ensures additional nodes and 3D floor plans can be incorporated without refactoring core logic.

---

### 10. MODULE DESCRIPTION
1. **Authentication Engine (`lib/auth.js`, `app/api/auth/*`):** Handles credential verification, token generation, cookie lifecycle, and role gating.
2. **Graph Navigation Engine (`lib/dijkstra.js`, `app/api/navigation/*`):** Constructs adjacency lists and executes Dijkstra's greedy search.
3. **Data Layer (`lib/mongodb.js`, `lib/data-service.js`, `models/*`):** Mongoose schemas for User, Location, and Road.
4. **Mapping Interface (`components/CampusMap.js`, `app/map/*`):** SSR-safe Leaflet container rendering OpenStreetMap tiles and polylines.
5. **Directory & Search (`app/locations/*`):** Real-time text filtering and categorical sorting of facilities.
6. **Admin Control Center (`app/admin/*`):** Full administrative portal for graph maintenance.

---

### 11. SYSTEM ARCHITECTURE

```
+-------------------------------------------------------------+
|                     Client Web Browser                      |
| (Next.js React Pages: /, /map, /navigate, /locations, /admin)|
+-------------------------------------------------------------+
                              |
                     HTTPS / JSON REST API
                              |
+-------------------------------------------------------------+
|                  Next.js App Route Handlers                 |
|  - /api/auth/*        (Register, Login, Me, Logout)         |
|  - /api/locations/*   (GET, POST, PUT, DELETE)              |
|  - /api/roads/*       (GET, POST, PUT, DELETE)              |
|  - /api/navigation/*  (Dijkstra Shortest Path Solver)       |
|  - /api/stats         (Campus Network Metrics)              |
+-------------------------------------------------------------+
        |                                       |
        v                                       v
+------------------------+          +------------------------+
|   Dijkstra Algorithm   |          |  Authentication Layer  |
|     Priority Queue     |          |  (JWT + bcryptjs)      |
| Adjacency List Builder |          +------------------------+
+------------------------+                      |
        |                                       |
        +-------------------+-------------------+
                            |
                            v
+-------------------------------------------------------------+
|                Data Service & Mongoose ODM                  |
|                 (Cached Connection Pooling)                 |
+-------------------------------------------------------------+
                            |
                            v
+-------------------------------------------------------------+
|                   MongoDB / MongoDB Atlas                   |
|               Collections: users, locations, roads          |
+-------------------------------------------------------------+
```

---

### 12. USE CASE DESCRIPTIONS

#### Use Case 1: Student / Visitor Finding a Shortest Route
- **Actor:** Student, Faculty, or Visitor.
- **Preconditions:** Website is loaded.
- **Main Flow:**
  1. User navigates to `/navigate`.
  2. User selects "Main Gate" as start location.
  3. User selects "Computer Science Block" as destination.
  4. User clicks "Find Shortest Route".
  5. System executes Dijkstra's algorithm.
  6. Optimal path, walking distance (e.g., 370m), walking time (~5 min), and map polyline are displayed.
- **Postconditions:** User is guided from origin to destination.

#### Use Case 2: Administrator Adding a New Campus Road
- **Actor:** Administrator.
- **Preconditions:** User is logged in with `admin` role.
- **Main Flow:**
  1. Admin opens `/admin/roads`.
  2. Admin clicks "Add Road".
  3. Admin selects Source node and Destination node from dropdowns.
  4. Admin inputs distance in meters (e.g., 120m).
  5. Admin submits form.
  6. System creates road edge in MongoDB.
  7. Graph topology updates instantly for all subsequent navigation queries.

---

### 13. DATABASE DESIGN & ER MODEL
The database utilizes MongoDB with three principal Mongoose schemas:

1. **User Schema (`users`):**
   - `_id`: ObjectId (Primary Key)
   - `name`: String (Required)
   - `email`: String (Required, Unique, Lowercase)
   - `password`: String (Bcrypt hashed)
   - `role`: String (Enum: `['student', 'faculty', 'visitor', 'admin']`)
   - `createdAt`: Date

2. **Location Schema (`locations`):**
   - `_id`: ObjectId (Primary Key)
   - `name`: String (Required, Unique)
   - `type`: String (Enum: `['Building', 'Department', 'Classroom', 'Laboratory', 'Library', 'Canteen', 'Hostel', 'Parking', 'Office', 'Sports', 'Gate', 'Other']`)
   - `description`: String
   - `building`: String
   - `floor`: String
   - `latitude`: Number (Decimal degrees)
   - `longitude`: Number (Decimal degrees)
   - `createdAt`: Date

3. **Road Schema (`roads`):**
   - `_id`: ObjectId (Primary Key)
   - `source`: ObjectId (Ref: `Location`)
   - `destination`: ObjectId (Ref: `Location`)
   - `distance`: Number (Positive integer in meters)
   - `createdAt`: Date

---

### 14. ALGORITHM: DIJKSTRA'S SHORTEST PATH

#### Theory:
Dijkstra's Algorithm (published by Edsger W. Dijkstra in 1959) solves the single-source shortest path problem for a graph with non-negative edge weights. Because metric walking distances cannot be negative, Dijkstra is mathematically optimal and guaranteed to discover the minimum distance route.

#### Pseudo-Code:
```text
function DIJKSTRA(Graph, sourceNode, targetNode):
    create vertex set Q
    for each vertex v in Graph:
        dist[v] ← INFINITY
        prev[v] ← UNDEFINED
        add v to Q
    dist[sourceNode] ← 0

    while Q is not empty:
        u ← vertex in Q with min dist[u]
        if u == targetNode:
            break
        remove u from Q
        
        for each neighbor v of u:
            alt ← dist[u] + weight(u, v)
            if alt < dist[v]:
                dist[v] ← alt
                prev[v] ← u

    path ← empty list
    curr ← targetNode
    while curr is defined:
        prepend curr to path
        curr ← prev[curr]
    return path, dist[targetNode]
```

#### Time and Space Complexity:
- **Time Complexity:** $O((V + E) \log V)$ with a priority queue min-heap, or $O(V^2)$ with an array scan. For campus graphs with $V \approx 50$ and $E \approx 100$, execution time is sub-millisecond ($< 1\text{ ms}$).
- **Space Complexity:** $O(V + E)$ to maintain adjacency list representation and distance arrays.

---

### 15. TESTING & TEST CASES

| Test ID | Test Scenario | Input Data | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Dijkstra Shortest Route | Start: Main Gate, Dest: CSE Block | 370m route via Admin & Library | **PASSED** |
| **TC-02** | Same Start & Destination | Start: Admin Block, Dest: Admin Block | Distance 0m, immediate arrival message | **PASSED** |
| **TC-03** | Disconnected Node Detection | Start: Main Gate, Dest: Isolated Tower | Handled gracefully with descriptive error | **PASSED** |
| **TC-04** | User Registration | Email: new@campus.edu, Pass: valid123 | User created, password hashed with bcrypt | **PASSED** |
| **TC-05** | Duplicate Email Rejection | Existing user email | HTTP 409 Conflict, helpful error message | **PASSED** |
| **TC-06** | Invalid Password Login | Correct email, wrong password | HTTP 401 Unauthorized | **PASSED** |
| **TC-07** | Admin Route Authorization | Student role accessing `/admin` | Denied access with warning banner | **PASSED** |
| **TC-08** | Admin Road Addition | Connect Admin to Sports (180m) | Road inserted, Dijkstra graph reflects edge | **PASSED** |
| **TC-09** | Cascade Delete on Location | Delete "Hostel A" | Location removed & connected roads deleted | **PASSED** |
| **TC-10** | Leaflet Polyline Rendering | Calculated Dijkstra coordinates | Polyline draws on OpenStreetMap canvas | **PASSED** |

---

### 16. ADVANTAGES
1. **Zero Cost:** Uses Leaflet and OpenStreetMap; no Google Cloud billing or API key restrictions.
2. **Speed & Efficiency:** In-memory graph search provides near-instantaneous route calculations.
3. **Accuracy:** Precise pedestrian paths mapped down to meter-level fidelity.
4. **Maintainability:** Clean Next.js modular architecture with standalone route handlers.
5. **Demonstration Resilience:** Dual-mode architecture runs with MongoDB Atlas or in-memory fallback for reliable college vivas.

---

### 17. LIMITATIONS & 18. FUTURE ENHANCEMENTS
- **Current Limitations:**
  - Campus must be mapped and road distances inputted by campus administrator.
  - Multi-floor indoor vertical navigation (elevators/staircases) is represented textually rather than in 3D.
- **Future Enhancements:**
  - GPS Geolocation ("Locate Me" button to pinpoint the user's real-time campus coordinates).
  - AR (Augmented Reality) camera overlay showing arrow directions in the phone camera view.
  - Wheelchair-accessible route toggle prioritizing ramps and elevators over stairs.
  - Integration with campus bus/shuttle live GPS tracking.

---

### 19. CONCLUSION
The **Campus Navigation System** successfully satisfies all criteria established for a comprehensive Software Engineering Microproject. By combining foundational computer science theory (Dijkstra's graph algorithm) with modern full-stack web engineering (Next.js App Router, React, Tailwind CSS, Leaflet, and MongoDB), the application delivers a real-world, production-ready solution that simplifies collegiate navigation for students, faculty, and visitors alike.
