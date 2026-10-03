import pytest

from graph.graph import Graph
from models.graph_models import Edge, Node


def create_test_graph():
    graph = Graph()

    graph.add_node(
        Node(id="A", name="Router A", type="router")
    )

    graph.add_node(
        Node(id="B", name="Router B", type="router")
    )

    graph.add_node(
        Node(id="C", name="Server C", type="server")
    )

    return graph


def test_add_nodes():
    graph = create_test_graph()

    assert graph.node_count() == 3
    assert graph.get_node("A").name == "Router A"


def test_add_edge():
    graph = create_test_graph()

    graph.add_edge(
        Edge(
            id="edge-1",
            source="A",
            target="B",
        )
    )

    assert graph.edge_count() == 1
    assert graph.has_edge("A", "B")
    assert graph.has_edge("B", "A")


def test_adjacency_list():
    graph = create_test_graph()

    graph.add_edge(
        Edge(
            id="edge-1",
            source="A",
            target="B",
        )
    )

    graph.add_edge(
        Edge(
            id="edge-2",
            source="B",
            target="C",
        )
    )

    adjacency = graph.to_adjacency_list()

    assert adjacency["A"] == ["B"]
    assert adjacency["B"] == ["A", "C"]
    assert adjacency["C"] == ["B"]


def test_cannot_create_self_connection():
    graph = create_test_graph()

    with pytest.raises(ValueError):
        graph.add_edge(
            Edge(
                id="edge-1",
                source="A",
                target="A",
            )
        )


def test_cannot_create_duplicate_connection():
    graph = create_test_graph()

    graph.add_edge(
        Edge(
            id="edge-1",
            source="A",
            target="B",
        )
    )

    with pytest.raises(ValueError):
        graph.add_edge(
            Edge(
                id="edge-2",
                source="B",
                target="A",
            )
        )


def test_remove_edge():
    graph = create_test_graph()

    graph.add_edge(
        Edge(
            id="edge-1",
            source="A",
            target="B",
        )
    )

    graph.remove_edge("edge-1")

    assert graph.edge_count() == 0
    assert not graph.has_edge("A", "B")


def test_remove_node_removes_connections():
    graph = create_test_graph()

    graph.add_edge(
        Edge(
            id="edge-1",
            source="A",
            target="B",
        )
    )

    graph.add_edge(
        Edge(
            id="edge-2",
            source="B",
            target="C",
        )
    )

    graph.remove_node("B")

    assert graph.node_count() == 2
    assert graph.edge_count() == 0
    assert "B" not in graph.to_adjacency_list()