from typing import Dict, List


def find_articulation_points(
    adjacency: Dict[str, List[str]]
) -> List[str]:
    """
    Find articulation points in an undirected graph
    using DFS and low-link values.

    Time Complexity:
        O(V + E)

    Space Complexity:
        O(V)
    """

    visited = set()

    discovery: Dict[str, int] = {}
    low: Dict[str, int] = {}
    parent: Dict[str, str | None] = {}

    articulation_points = set()

    time = 0

    def dfs(node: str) -> None:
        nonlocal time

        visited.add(node)

        time += 1
        discovery[node] = time
        low[node] = time

        children = 0

        for neighbor in adjacency.get(node, []):

            # Ignore the edge leading back to parent.
            if neighbor == parent[node]:
                continue

            # Tree edge
            if neighbor not in visited:

                parent[neighbor] = node
                children += 1

                dfs(neighbor)

                # Update low-link value.
                low[node] = min(
                    low[node],
                    low[neighbor],
                )

                # Non-root articulation condition.
                if (
                    parent[node] is not None
                    and low[neighbor] >= discovery[node]
                ):
                    articulation_points.add(node)

            # Back edge
            else:

                low[node] = min(
                    low[node],
                    discovery[neighbor],
                )

        # Root articulation condition.
        if (
            parent[node] is None
            and children > 1
        ):
            articulation_points.add(node)

    # Handle disconnected graphs.
    for node in sorted(adjacency):

        if node not in visited:

            parent[node] = None
            dfs(node)

    return sorted(articulation_points)