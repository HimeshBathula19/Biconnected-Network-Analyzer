from typing import Dict, List, Optional

from algorithms.dfs import run_dfs
from algorithms.articulation import find_articulation_points
from algorithms.biconnected import find_biconnected_components
from algorithms.components import find_connected_components


def analyze_network(
    adjacency: Dict[str, List[str]],
    start: Optional[str] = None,
) -> dict:
    """
    Run the complete network analysis.

    Algorithms:
    - DFS
    - Articulation Points
    - Biconnected Components
    - Connected Components
    """

    # -------------------------
    # DFS
    # -------------------------

    dfs_result = run_dfs(
        adjacency,
        start,
    )

    # -------------------------
    # ARTICULATION POINTS
    # -------------------------

    articulation_points = find_articulation_points(
        adjacency
    )

    # -------------------------
    # BICONNECTED COMPONENTS
    # -------------------------

    biconnected_components = find_biconnected_components(
        adjacency
    )

    # -------------------------
    # CONNECTED COMPONENTS
    # -------------------------

    connected_components = find_connected_components(
        adjacency
    )

    # -------------------------
    # BASIC GRAPH STATISTICS
    # -------------------------

    node_count = len(adjacency)

    edge_count = sum(
        len(neighbors)
        for neighbors in adjacency.values()
    ) // 2

    # -------------------------
    # NETWORK STATUS
    # -------------------------

    if len(connected_components) == 0:
        network_status = "empty"

    elif len(connected_components) > 1:
        network_status = "disconnected"

    elif len(articulation_points) > 0:
        network_status = "critical"

    else:
        network_status = "connected"

    # -------------------------
    # FINAL RESULT
    # -------------------------

    return {
        "statistics": {
            "nodes": node_count,
            "edges": edge_count,
            "connected_regions": len(
                connected_components
            ),
            "articulation_points": len(
                articulation_points
            ),
            "biconnected_components": len(
                biconnected_components
            ),
        },

        "network_status": network_status,

        "dfs": {
            "order": dfs_result.order,
            "discovery": dfs_result.discovery,
            "low": dfs_result.low,
            "parent": dfs_result.parent,
            "steps": dfs_result.steps,
        },

        "articulation_points": articulation_points,

        "biconnected_components": [
            [
                {
                    "source": edge[0],
                    "target": edge[1],
                }
                for edge in component
            ]
            for component in biconnected_components
        ],

        "connected_components": connected_components,
    }