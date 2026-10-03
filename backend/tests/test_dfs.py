from algorithms.dfs import run_dfs


def test_dfs_chain():
    adjacency = {
        "A": ["B"],
        "B": ["A", "C"],
        "C": ["B"],
    }

    result = run_dfs(adjacency, "A")

    assert result.order == ["A", "B", "C"]

    assert result.discovery["A"] == 1
    assert result.discovery["B"] == 2
    assert result.discovery["C"] == 3

    assert result.parent["A"] is None
    assert result.parent["B"] == "A"
    assert result.parent["C"] == "B"


def test_dfs_triangle():
    adjacency = {
        "A": ["B", "C"],
        "B": ["A", "C"],
        "C": ["A", "B"],
    }

    result = run_dfs(adjacency, "A")

    assert result.order == ["A", "B", "C"]

    # Because of the cycle, low values should
    # eventually reach the first discovered node.
    assert result.low["B"] == 1
    assert result.low["C"] == 1


def test_dfs_disconnected_graph():
    adjacency = {
        "A": ["B"],
        "B": ["A"],
        "C": ["D"],
        "D": ["C"],
    }

    result = run_dfs(adjacency, "A")

    assert set(result.order) == {"A", "B", "C", "D"}

    assert result.parent["A"] is None
    assert result.parent["C"] is None


def test_dfs_single_node():
    adjacency = {
        "A": []
    }

    result = run_dfs(adjacency, "A")

    assert result.order == ["A"]
    assert result.discovery["A"] == 1
    assert result.low["A"] == 1
    assert result.parent["A"] is None


def test_dfs_records_steps():
    adjacency = {
        "A": ["B"],
        "B": ["A"],
    }

    result = run_dfs(adjacency, "A")

    assert len(result.steps) > 0
    assert result.steps[0]["type"] == "visit"
    assert result.steps[0]["node"] == "A"