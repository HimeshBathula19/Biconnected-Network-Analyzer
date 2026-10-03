from typing import Dict, List


def find_connected_components(
    adjacency: Dict[str, List[str]]
) -> List[List[str]]:
    """
    Find all connected components in an undirected graph.

    Time Complexity:
        O(V + E)

    Space Complexity:
        O(V)
    """

    visited = set()
    components = []

    def dfs(node: str, component: List[str]) -> None:
        visited.add(node)
        component.append(node)

        for neighbor in adjacency.get(node, []):
            if neighbor not in visited:
                dfs(neighbor, component)

    for node in sorted(adjacency):

        if node not in visited:

            component = []

            dfs(node, component)

            components.append(sorted(component))

    return components