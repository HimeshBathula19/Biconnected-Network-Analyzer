from typing import Dict, List, Optional


class DFSResult:
    def __init__(self):
        self.order: List[str] = []
        self.discovery: Dict[str, int] = {}
        self.low: Dict[str, int] = {}
        self.parent: Dict[str, Optional[str]] = {}
        self.steps: List[dict] = []


def run_dfs(adjacency: Dict[str, List[str]], start: Optional[str] = None) -> DFSResult:
    """
    Run DFS on an undirected graph.

    Tracks:
    - traversal order
    - discovery time
    - low-link value
    - parent
    - algorithm steps for visualization
    """

    result = DFSResult()

    time = 0
    visited = set()

    def dfs(node: str, parent: Optional[str]) -> None:
        nonlocal time

        time += 1

        visited.add(node)
        result.order.append(node)

        result.discovery[node] = time
        result.low[node] = time
        result.parent[node] = parent

        result.steps.append({
            "type": "visit",
            "node": node,
            "discovery": time,
            "low": time,
            "parent": parent,
        })

        for neighbor in adjacency.get(node, []):

            # Ignore the edge back to our parent.
            if neighbor == parent:
                continue

            # Tree edge
            if neighbor not in visited:

                result.steps.append({
                    "type": "explore",
                    "from": node,
                    "to": neighbor,
                })

                dfs(neighbor, node)

                # Update low-link value after returning
                # from the child.
                result.low[node] = min(
                    result.low[node],
                    result.low[neighbor],
                )

                result.steps.append({
                    "type": "low_update",
                    "node": node,
                    "low": result.low[node],
                    "child": neighbor,
                })

            # Back edge
            else:
                result.low[node] = min(
                    result.low[node],
                    result.discovery[neighbor],
                )

                result.steps.append({
                    "type": "back_edge",
                    "from": node,
                    "to": neighbor,
                    "low": result.low[node],
                })

    # If a starting node is provided, start there first.
    if start is not None and start in adjacency:
        dfs(start, None)

    # Continue DFS for disconnected regions.
    for node in sorted(adjacency):
        if node not in visited:
            dfs(node, None)

    return result