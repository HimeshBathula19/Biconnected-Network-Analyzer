from algorithms.biconnected import find_biconnected_components


def normalize_component(component):
    return {
        frozenset(edge)
        for edge in component
    }


def normalize_components(components):
    return [
        normalize_component(component)
        for component in components
    ]


def test_triangle_is_one_biconnected_component():

    graph = {
        "A": ["B", "C"],
        "B": ["A", "C"],
        "C": ["A", "B"],
    }

    result = find_biconnected_components(graph)

    assert len(result) == 1

    assert normalize_component(result[0]) == {
        frozenset(("A", "B")),
        frozenset(("A", "C")),
        frozenset(("B", "C")),
    }


def test_chain_has_two_components():

    graph = {
        "A": ["B"],
        "B": ["A", "C"],
        "C": ["B"],
    }

    result = find_biconnected_components(graph)

    assert len(result) == 2


def test_single_edge():

    graph = {
        "A": ["B"],
        "B": ["A"],
    }

    result = find_biconnected_components(graph)

    assert len(result) == 1

    assert normalize_component(result[0]) == {
        frozenset(("A", "B"))
    }


def test_disconnected_graph():

    graph = {
        "A": ["B"],
        "B": ["A"],
        "C": ["D"],
        "D": ["C"],
    }

    result = find_biconnected_components(graph)

    assert len(result) == 2


def test_cycle_with_tail():

    graph = {
        "A": ["B", "C"],
        "B": ["A", "C"],
        "C": ["A", "B", "D"],
        "D": ["C"],
    }

    result = find_biconnected_components(graph)

    assert len(result) == 2