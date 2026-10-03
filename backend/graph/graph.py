from typing import Dict, List, Set, Tuple

from models.graph_models import Edge, Node


class Graph:
    """
    Undirected graph representation for the
    Biconnected Network Analyzer.

    The graph stores:
    - devices as nodes
    - communication links as undirected edges
    - adjacency list for graph algorithms
    """

    def __init__(self):
        self.nodes: Dict[str, Node] = {}
        self.edges: Dict[str, Edge] = {}
        self.adjacency: Dict[str, Set[str]] = {}

    # -------------------------
    # NODE OPERATIONS
    # -------------------------

    def add_node(self, node: Node) -> None:
        if node.id in self.nodes:
            raise ValueError(f"Node '{node.id}' already exists.")

        self.nodes[node.id] = node
        self.adjacency[node.id] = set()

    def remove_node(self, node_id: str) -> None:
        if node_id not in self.nodes:
            raise ValueError(f"Node '{node_id}' does not exist.")

        # Remove all connections involving this node.
        edge_ids_to_remove = [
            edge_id
            for edge_id, edge in self.edges.items()
            if edge.source == node_id or edge.target == node_id
        ]

        for edge_id in edge_ids_to_remove:
            self.remove_edge(edge_id)

        del self.nodes[node_id]
        del self.adjacency[node_id]

    # -------------------------
    # EDGE OPERATIONS
    # -------------------------

    def add_edge(self, edge: Edge) -> None:
        if edge.id in self.edges:
            raise ValueError(f"Edge '{edge.id}' already exists.")

        if edge.source not in self.nodes:
            raise ValueError(
                f"Source node '{edge.source}' does not exist."
            )

        if edge.target not in self.nodes:
            raise ValueError(
                f"Target node '{edge.target}' does not exist."
            )

        if edge.source == edge.target:
            raise ValueError("A node cannot connect to itself.")

        if self.has_edge(edge.source, edge.target):
            raise ValueError(
                f"Connection between '{edge.source}' "
                f"and '{edge.target}' already exists."
            )

        self.edges[edge.id] = edge

        # Undirected graph:
        self.adjacency[edge.source].add(edge.target)
        self.adjacency[edge.target].add(edge.source)

    def remove_edge(self, edge_id: str) -> None:
        if edge_id not in self.edges:
            raise ValueError(f"Edge '{edge_id}' does not exist.")

        edge = self.edges[edge_id]

        self.adjacency[edge.source].discard(edge.target)
        self.adjacency[edge.target].discard(edge.source)

        del self.edges[edge_id]

    # -------------------------
    # GRAPH QUERIES
    # -------------------------

    def has_edge(self, source: str, target: str) -> bool:
        if source not in self.adjacency:
            return False

        return target in self.adjacency[source]

    def get_neighbors(self, node_id: str) -> List[str]:
        if node_id not in self.nodes:
            raise ValueError(f"Node '{node_id}' does not exist.")

        return sorted(self.adjacency[node_id])

    def get_node(self, node_id: str) -> Node:
        if node_id not in self.nodes:
            raise ValueError(f"Node '{node_id}' does not exist.")

        return self.nodes[node_id]

    def get_nodes(self) -> List[Node]:
        return list(self.nodes.values())

    def get_edges(self) -> List[Edge]:
        return list(self.edges.values())

    # -------------------------
    # ALGORITHM INPUT
    # -------------------------

    def to_adjacency_list(self) -> Dict[str, List[str]]:
        """
        Return a clean adjacency-list representation
        suitable for DFS and other graph algorithms.
        """

        return {
            node_id: sorted(neighbors)
            for node_id, neighbors in self.adjacency.items()
        }

    # -------------------------
    # STATISTICS
    # -------------------------

    def node_count(self) -> int:
        return len(self.nodes)

    def edge_count(self) -> int:
        return len(self.edges)

    def clear(self) -> None:
        self.nodes.clear()
        self.edges.clear()
        self.adjacency.clear()