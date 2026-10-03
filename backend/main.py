from typing import List, Optional, Dict, Tuple, Set

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from algorithms.analyzer import analyze_network


app = FastAPI(
    title="Biconnected Network Analyzer",
    description="DAA-based communication network resilience analyzer",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Edge(BaseModel):
    source: str
    target: str


class AnalyzeRequest(BaseModel):
    nodes: List[str] = Field(default_factory=list)
    edges: List[Edge] = Field(default_factory=list)
    start_node: Optional[str] = None


def build_adjacency(
    nodes: List[str],
    edges: List[Edge],
) -> Dict[str, List[str]]:

    adjacency = {node: [] for node in nodes}

    for edge in edges:

        source = edge.source
        target = edge.target

        if source not in adjacency:
            raise ValueError(f"Unknown source node: {source}")

        if target not in adjacency:
            raise ValueError(f"Unknown target node: {target}")

        if source == target:
            raise ValueError("Self-connections are not allowed.")

        if target not in adjacency[source]:
            adjacency[source].append(target)

        if source not in adjacency[target]:
            adjacency[target].append(source)

    return adjacency


def find_bridges(
    adjacency: Dict[str, List[str]]
) -> List[Dict[str, str]]:

    discovery: Dict[str, int] = {}
    low: Dict[str, int] = {}
    parent: Dict[str, Optional[str]] = {}

    bridges: List[Dict[str, str]] = []

    time = 0

    def dfs(node: str):

        nonlocal time

        time += 1

        discovery[node] = time
        low[node] = time

        for neighbor in adjacency.get(node, []):

            if neighbor == parent.get(node):
                continue

            if neighbor not in discovery:

                parent[neighbor] = node

                dfs(neighbor)

                low[node] = min(
                    low[node],
                    low[neighbor],
                )

                if low[neighbor] > discovery[node]:

                    bridges.append(
                        {
                            "source": node,
                            "target": neighbor,
                        }
                    )

            else:

                low[node] = min(
                    low[node],
                    discovery[neighbor],
                )

    for node in sorted(adjacency):

        if node not in discovery:

            parent[node] = None
            dfs(node)

    return bridges


@app.get("/")
def root():

    return {
        "status": "ok",
        "message": "Biconnected Network Analyzer API is running",
        "version": "2.0.0",
    }


@app.get("/api/health")
def health():

    return {
        "status": "healthy",
        "service": "biconnected-network-analyzer",
    }


@app.post("/api/analyze")
def analyze(request: AnalyzeRequest):

    try:

        if not request.nodes:

            raise ValueError(
                "At least one device is required."
            )

        adjacency = build_adjacency(
            request.nodes,
            request.edges,
        )

        if (
            request.start_node
            and request.start_node not in adjacency
        ):

            raise ValueError(
                f"Start node '{request.start_node}' does not exist."
            )

        result = analyze_network(
            adjacency,
            request.start_node,
        )

        bridges = find_bridges(adjacency)

        result["bridges"] = bridges

        result["algorithm_summary"] = {
            "traversal": "Depth-First Search",
            "complexity": "O(V + E)",
            "graph_representation": "Adjacency List",
            "analysis": [
                "DFS traversal",
                "Discovery values",
                "Low-link values",
                "Articulation points",
                "Connected components",
                "Biconnected components",
                "Bridge detection",
            ],
        }

        return {
            "success": True,
            "result": result,
        }

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(error)}",
        )