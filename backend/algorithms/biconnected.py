from typing import Dict, List, Tuple


def find_biconnected_components(
    adjacency: Dict[str, List[str]]
) -> List[List[Tuple[str, str]]]:
    """
    Find biconnected components of an undirected graph.

    Uses:
        DFS
        Discovery time
        Low-link values
        Edge stack

    Time Complexity:
        O(V + E)

    Returns:
        A list of components.
        Each component contains graph edges as (u, v).
    """

    visited = set()

    discovery: Dict[str, int] = {}
    low: Dict[str, int] = {}
    parent: Dict[str, str | None] = {}

    edge_stack: List[Tuple[str, str]] = []

    components: List[List[Tuple[str, str]]] = []

    time = 0

    def dfs(node: str) -> None:
        nonlocal time

        visited.add(node)

        time += 1

        discovery[node] = time
        low[node] = time

        children = 0

        for neighbor in adjacency.get(node, []):

            # Ignore the edge back to the DFS parent.
            if neighbor == parent[node]:
                continue

            # Tree edge.
            if neighbor not in visited:

                parent[neighbor] = node
                children += 1

                edge_stack.append((node, neighbor))

                dfs(neighbor)

                low[node] = min(
                    low[node],
                    low[neighbor],
                )

                # A component is complete here.
                if low[neighbor] >= discovery[node]:

                    component = []

                    while edge_stack:

                        edge = edge_stack.pop()
                        component.append(edge)

                        if edge == (node, neighbor):
                            break

                    if component:
                        components.append(component)

            # Back edge.
            elif discovery[neighbor] < discovery[node]:

                edge_stack.append((node, neighbor))

                low[node] = min(
                    low[node],
                    discovery[neighbor],
                )

    # Handle disconnected graphs.
    for node in sorted(adjacency):

        if node not in visited:

            parent[node] = None
            dfs(node)

            # Safety cleanup for remaining edges.
            if edge_stack:

                component = []

                while edge_stack:
                    component.append(edge_stack.pop())

                if component:
                    components.append(component)

    return components