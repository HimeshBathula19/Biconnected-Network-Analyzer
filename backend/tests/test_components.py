from algorithms.components import find_connected_components


def test_single_component():

    graph = {
        "A": ["B"],
        "B": ["A", "C"],
        "C": ["B"],
    }

    result = find_connected_components(graph)

    assert result == [
        ["A", "B", "C"]
    ]


def test_two_components():

    graph = {
        "A": ["B"],
        "B": ["A"],
        "C": ["D"],
        "D": ["C"],
    }

    result = find_connected_components(graph)

    assert result == [
        ["A", "B"],
        ["C", "D"],
    ]


def test_three_components():

    graph = {
        "A": ["B"],
        "B": ["A"],
        "C": [],
        "D": ["E"],
        "E": ["D"],
    }

    result = find_connected_components(graph)

    assert result == [
        ["A", "B"],
        ["C"],
        ["D", "E"],
    ]


def test_empty_graph():

    graph = {}

    result = find_connected_components(graph)

    assert result == []


def test_single_node():

    graph = {
        "A": []
    }

    result = find_connected_components(graph)

    assert result == [
        ["A"]
    ]