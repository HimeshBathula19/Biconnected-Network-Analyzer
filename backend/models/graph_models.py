from pydantic import BaseModel, Field
from typing import Literal


DeviceType = Literal[
    "router",
    "server",
    "switch",
    "computer",
    "gateway",
    "database",
]


class Node(BaseModel):
    id: str
    name: str
    type: DeviceType = "router"


class Edge(BaseModel):
    id: str
    source: str
    target: str


class GraphData(BaseModel):
    nodes: list[Node] = Field(default_factory=list)
    edges: list[Edge] = Field(default_factory=list)