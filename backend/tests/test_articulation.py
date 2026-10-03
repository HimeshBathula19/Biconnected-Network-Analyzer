from algorithms.articulation import find_articulation_points


def test_chain():

    adjacency = {
        "A": ["B"],
        "B": ["A", "C"],
        "C": ["B"],
    }

    result = find_articulation_points(adjacency)

    assert result == ["B"]


def test_triangle_has_no_articulation_point():

    adjacency = {
        "A": ["B", "C"],
        "B": ["A", "C"],
        "C": ["A", "B"],
    }

    result = find_articulation_points(adjacency)

    assert result == []


def test_star_graph():

    adjacency = {
        "A": ["B", "C", "D"],
        "B": ["A"],
        "C": ["A"],
        "D": ["A"],
    }

    result = find_articulation_points(adjacency)

    assert result == ["A"]


def test_disconnected_graph():

    adjacency = {
        "A": ["B"],
        "B": ["A"],
        "C": ["D"],
        "D": ["C"],
    }

    result = find_articulation_points(adjacency)

    assert result == []


def test_complex_graph():

    adjacency = {
        "A": ["B", "C"],
        "B": ["A", "C", "D"],
        "C": ["A", "B"],
        "D": ["B", "E"],
        "E": ["D"],
    }

    result = find_articulation_points(adjacency)

    assert result == ["B", "D"]