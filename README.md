# Biconnected Network Analyzer

A graph-based communication network resilience analyzer built using Data Structures and Algorithms (DAA).

The system models a communication network as an undirected graph and applies DFS, articulation point detection, connected components, and biconnected component analysis to identify structurally critical devices and understand network connectivity.

---

## Problem Statement

Communication networks may contain devices whose failure can disconnect important parts of the network.

This project analyzes a network topology and identifies:

- Critical devices (articulation points)
- Connected regions of the network
- Biconnected components
- DFS traversal information
- Discovery and low-link values
- Overall network connectivity status

The goal is to demonstrate how graph algorithms can be applied to analyze communication-network structure and identify potential single points of failure.

---

## Key Features

- Interactive network topology builder
- Add routers, switches, servers, gateways, and databases
- Configure device names, types, IP addresses, and status
- Create connections between devices
- Interactive graph visualization
- DFS-based network analysis
- Articulation point detection
- Biconnected component detection
- Connected component detection
- Discovery and low-link values
- Critical-device identification
- Network statistics dashboard
- FastAPI backend
- Automated algorithm tests

---

## DAA Algorithms

### 1. Depth-First Search

DFS traverses the network graph and records:

- Discovery time
- Low-link value
- Parent relationship
- Traversal order

**Time Complexity:** `O(V + E)
Technology Stack
Frontend
React
TypeScript
Vite
React Flow
Lucide React
Framer Motion
CSS
Backend
Python
FastAPI
Pydantic
Uvicorn
Testing
Pytest
## Project Structure

Biconnected-Network-Analyzer/
│
├── backend/
│   ├── algorithms/       # Core DAA implementations
│   ├── tests/            # Algorithm test suite
│   ├── graph/            # Graph representation
│   ├── models/           # Data models
│   ├── main.py           # FastAPI entry point
│   └── requirements.txt
│
├── frontend/
│   ├── src/              # React application
│   └── package.json
│
├── Final Presentation.pptx
├── Final Report.docx
└── README.md
Running the Project
Backend
Open a terminal and navigate to the backend:
cd backend
Create a virtual environment:
python -m venv venv
Activate it on Windows:
venv\Scripts\activate
Install dependencies:
pip install -r requirements.txt
Start the FastAPI server:
uvicorn main:app --reload
Backend:
http://127.0.0.1:8000
API documentation:
http://127.0.0.1:8000/docs
Frontend
Open another terminal:
cd frontend
Install dependencies:
npm install
Start the development server:
npm run dev
Open the URL displayed by Vite, typically:
http://localhost:5173
Testing
From the backend directory:
pytest
The test suite covers:
Graph representation
DFS
Articulation points
Biconnected components
Connected components
Complete network analysis
How It Works
Add devices to the network.
Configure device information.
Connect devices to form the topology.
Run the network analysis.
The backend converts the topology into an adjacency-list graph.
DFS traverses the graph.
Discovery and low-link values are calculated.
Articulation points are identified.
Connected components are calculated.
Biconnected components are identified.
Results are returned through the API.
The frontend visualizes the analysis.
Example Network Model
A communication network can be represented as:
Router A ───── Switch B ───── Server C
                  │
                  │
              Database D
Each device represents a vertex and each network connection represents an edge.
The resulting topology is analyzed as an undirected graph.
Academic Relevance
This project demonstrates practical applications of fundamental Data Structures and Algorithms concepts:
Graph representation
Depth-First Search
Discovery times
Low-link values
Articulation points
Connected components
Biconnected components
Graph traversal
Time and space complexity analysis
It connects theoretical DAA concepts with a practical communication-network resilience use case.
Important Note
This prototype analyzes a network topology provided by the user.
It does not automatically discover physical or cloud infrastructure. Real-world live network discovery would require integration with network-management systems, cloud APIs, SNMP, monitoring agents, or other infrastructure connectors.
Project Deliverables
This repository contains:
Working implementation
Interactive frontend
FastAPI backend
DAA algorithm implementations
Automated tests
Project presentation
Project report
Documentation
Author
Himesh Bathula
B.Tech – Computer Science & Engineering (AI & ML)
Academic Project
Developed as a Data Structures and Algorithms project demonstrating the application of graph algorithms to communication-network analysis and resilience.

Then on GitHub:

**Commit message:**

```text
docs: add project README
