from algorithms.analyzer import analyze_network


def test_analyze_chain():

    graph = {
        "A": ["B"],
        "B": ["A", "C"],
        "C": ["B"],
    }

    result = analyze_network(graph, "A")

    assert result["statistics"]["nodes"] == 3
    assert result["statistics"]["edges"] == 2

    assert result["statistics"]["connected_regions"] == 1

    assert result["statistics"]["articulation_points"] == 1

    assert result["network_status"] == "critical"

    assert result["articulation_points"] == ["B"]


def test_analyze_triangle():

    graph = {
        "A": ["B", "C"],
        "B": ["A", "C"],
        "C": ["A", "B"],
    }

    result = analyze_network(graph, "A")

    assert result["statistics"]["nodes"] == 3
    assert result["statistics"]["edges"] == 3

    assert result["statistics"]["connected_regions"] == 1

    assert result["statistics"]["articulation_points"] == 0

    assert result["network_status"] == "connected"


def test_analyze_disconnected_network():

    graph = {
        "A": ["B"],
        "B": ["A"],
        "C": ["D"],
        "D": ["C"],
    }

    result = analyze_network(graph)

    assert result["statistics"]["nodes"] == 4
    assert result["statistics"]["edges"] == 2

    assert result["statistics"]["connected_regions"] == 2

    assert result["network_status"] == "disconnected"


def test_analyze_empty_network():

    graph = {}

    result = analyze_network(graph)

    assert result["statistics"]["nodes"] == 0
    assert result["statistics"]["edges"] == 0

    assert result["statistics"]["connected_regions"] == 0

    assert result["network_status"] == "empty"


def test_analyzer_contains_dfs_information():

    graph = {
        "A": ["B"],
        "B": ["A"],
    }

    result = analyze_network(graph, "A")

    assert "order" in result["dfs"]
    assert "discovery" in result["dfs"]
    assert "low" in result["dfs"]
    assert "parent" in result["dfs"]
    assert "steps" in result["dfs"]

    assert result["dfs"]["order"] == ["A", "B"]