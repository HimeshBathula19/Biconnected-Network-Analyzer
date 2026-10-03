import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  type NodeProps,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Database,
  GitBranch,
  Globe,
  Network,
  Play,
  Plus,
  RotateCcw,
  Server,
  ShieldCheck,
  Trash2,
  Wifi,
  XCircle,
  Zap,
} from "lucide-react";

import "./index.css";


/* =========================================================
   TYPES
========================================================= */

type DeviceType =
  | "router"
  | "server"
  | "switch"
  | "gateway"
  | "database";

type DeviceStatus =
  | "Online"
  | "Warning"
  | "Offline";

type DeviceData = {
  label: string;
  deviceType: DeviceType;
  ip: string;
  status: DeviceStatus;
  failed?: boolean;
};

type Bridge = {
  source: string;
  target: string;
};

type AnalysisResult = {
  statistics: {
    nodes: number;
    edges: number;
    connected_regions: number;
    articulation_points: number;
    biconnected_components: number;
  };

  network_status: string;

  dfs: {
    order: string[];
    discovery: Record<string, number>;
    low: Record<string, number>;
    parent: Record<string, string | null>;

    steps: Array<{
      type?: string;
      node?: string;
      parent?: string | null;
      discovery?: number;
      low?: number;
    }>;
  };

  articulation_points: string[];

  biconnected_components: Array<
    Array<{
      source: string;
      target: string;
    }>
  >;

  connected_components: string[][];

  bridges?: Bridge[];
};


/* =========================================================
   ICONS
========================================================= */

const typeIcons: Record<DeviceType, any> = {
  router: Network,
  server: Server,
  switch: Wifi,
  gateway: Globe,
  database: Database,
};


/* =========================================================
   DEVICE NODE
========================================================= */

function DeviceNode({
  data,
  selected,
}: NodeProps<Node<DeviceData>>) {

  const Icon = typeIcons[data.deviceType];

  return (
    <div
      className={[
        "device-node",
        data.status.toLowerCase(),
        data.failed ? "failed" : "",
        selected ? "selected" : "",
      ].join(" ")}
    >

      <Handle
        type="target"
        position={Position.Top}
        className="flow-handle"
      />

      <div className="device-icon">
        <Icon size={18} />
      </div>

      <div className="device-content">

        <div className="device-name">
          {data.label}
        </div>

        <div className="device-type">
          {data.deviceType}
        </div>

        <div className="device-ip">
          {data.ip || "No IP assigned"}
        </div>

      </div>

      <div className="device-status">

        <span className="status-dot" />

        {data.failed
          ? "Failed"
          : data.status}

      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="flow-handle"
      />

    </div>
  );
}


const nodeTypes = {
  device: DeviceNode,
};


/* =========================================================
   METRIC
========================================================= */

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
}) {

  return (
    <div className="metric-card">

      <div className="metric-icon">
        {icon}
      </div>

      <div>

        <div className="metric-value">
          {value}
        </div>

        <div className="metric-label">
          {label}
        </div>

      </div>

    </div>
  );
}


/* =========================================================
   APP
========================================================= */

export default function App() {

  const [nodes, setNodes, onNodesChange] =
    useNodesState<Node<DeviceData>>([]);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState<Edge>([]);

  const [mode, setMode] =
    useState<"select" | "connect">("select");


  /* FORM */

  const [deviceName, setDeviceName] =
    useState("");

  const [deviceType, setDeviceType] =
    useState<DeviceType>("router");

  const [deviceIp, setDeviceIp] =
    useState("");

  const [deviceStatus, setDeviceStatus] =
    useState<DeviceStatus>("Online");


  /* ANALYSIS */

  const [analysis, setAnalysis] =
    useState<AnalysisResult | null>(null);

  const [failureAnalysis, setFailureAnalysis] =
    useState<AnalysisResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  /* FAILURE */

  const [selectedCriticalDevice, setSelectedCriticalDevice] =
    useState("");

  const [selectedInsight, setSelectedInsight] =
    useState("");

  const [failedDevice, setFailedDevice] =
    useState<string | null>(null);

  const [beforeRegions, setBeforeRegions] =
    useState<number | null>(null);

  const [afterRegions, setAfterRegions] =
    useState<number | null>(null);

  const [originalNodes, setOriginalNodes] =
    useState<Node<DeviceData>[]>([]);

  const [originalEdges, setOriginalEdges] =
    useState<Edge[]>([]);


  /* =======================================================
     DEMO NETWORK
  ======================================================= */

  const loadDemoNetwork = () => {

    const demoNodes: Node<DeviceData>[] = [

      {
        id: "gateway",
        type: "device",
        position: {
          x: 450,
          y: 30,
        },
        data: {
          label: "Internet Gateway",
          deviceType: "gateway",
          ip: "192.168.1.1",
          status: "Online",
        },
      },

      {
        id: "router",
        type: "device",
        position: {
          x: 450,
          y: 190,
        },
        data: {
          label: "Core Router",
          deviceType: "router",
          ip: "192.168.1.2",
          status: "Online",
        },
      },

      {
        id: "switch",
        type: "device",
        position: {
          x: 450,
          y: 350,
        },
        data: {
          label: "Core Switch",
          deviceType: "switch",
          ip: "192.168.1.3",
          status: "Online",
        },
      },

      {
        id: "web",
        type: "device",
        position: {
          x: 100,
          y: 550,
        },
        data: {
          label: "Web Server",
          deviceType: "server",
          ip: "192.168.1.10",
          status: "Online",
        },
      },

      {
        id: "database",
        type: "device",
        position: {
          x: 450,
          y: 550,
        },
        data: {
          label: "Database",
          deviceType: "database",
          ip: "192.168.1.20",
          status: "Online",
        },
      },

      {
        id: "backup",
        type: "device",
        position: {
          x: 800,
          y: 550,
        },
        data: {
          label: "Backup Server",
          deviceType: "server",
          ip: "192.168.1.21",
          status: "Online",
        },
      },
    ];


    const demoEdges: Edge[] = [

      {
        id: "gateway-router",
        source: "gateway",
        target: "router",
        type: "smoothstep",
      },

      {
        id: "router-switch",
        source: "router",
        target: "switch",
        type: "smoothstep",
      },

      {
        id: "switch-web",
        source: "switch",
        target: "web",
        type: "smoothstep",
      },

      {
        id: "switch-database",
        source: "switch",
        target: "database",
        type: "smoothstep",
      },

      {
        id: "switch-backup",
        source: "switch",
        target: "backup",
        type: "smoothstep",
      },

      {
        id: "web-database",
        source: "web",
        target: "database",
        type: "smoothstep",
      },

      {
        id: "database-backup",
        source: "database",
        target: "backup",
        type: "smoothstep",
      },
    ];


    setNodes(demoNodes);
    setEdges(demoEdges);

    setAnalysis(null);
    setFailureAnalysis(null);

    setFailedDevice(null);

    setBeforeRegions(null);
    setAfterRegions(null);

    setSelectedCriticalDevice("");
    setSelectedInsight("");

    setOriginalNodes([]);
    setOriginalEdges([]);

    setError("");
  };


  /* Automatically load demo */

  useEffect(() => {
    loadDemoNetwork();
  }, []);


  /* =======================================================
     ADD DEVICE
  ======================================================= */

  const addDevice = () => {

    const name =
      deviceName.trim();

    if (!name) {

      setError(
        "Enter a device name."
      );

      return;
    }


    const duplicate =
      nodes.some(
        (node) =>
          node.data.label.toLowerCase() ===
          name.toLowerCase()
      );


    if (duplicate) {

      setError(
        "A device with this name already exists."
      );

      return;
    }


    const id =
      `device-${Date.now()}`;


    const newNode: Node<DeviceData> = {

      id,

      type: "device",

      position: {
        x:
          100 +
          (nodes.length % 3) * 280,

        y:
          100 +
          Math.floor(nodes.length / 3) * 180,
      },

      data: {
        label: name,
        deviceType,
        ip: deviceIp,
        status: deviceStatus,
      },
    };


    setNodes((current) => [
      ...current,
      newNode,
    ]);


    setDeviceName("");
    setDeviceIp("");

    setAnalysis(null);
    setFailureAnalysis(null);

    setError("");
  };


  /* =======================================================
     CONNECT
  ======================================================= */

  const onConnect = (
    connection: Connection
  ) => {

    if (
      !connection.source ||
      !connection.target
    ) {
      return;
    }


    if (
      connection.source ===
      connection.target
    ) {
      return;
    }


    setEdges((current) => {

      const alreadyExists =
        current.some(
          (edge) =>
            (
              edge.source ===
                connection.source &&
              edge.target ===
                connection.target
            ) ||
            (
              edge.source ===
                connection.target &&
              edge.target ===
                connection.source
            )
        );


      if (alreadyExists) {
        return current;
      }


      return addEdge(
        {
          ...connection,
          type: "smoothstep",
        },
        current
      );
    });


    setAnalysis(null);
  };


  /* =======================================================
     API ANALYSIS
  ======================================================= */

  const analyzeGraph = async (
    inputNodes: Node<DeviceData>[] = nodes,
    inputEdges: Edge[] = edges,
  ): Promise<AnalysisResult | null> => {

    if (!inputNodes.length) {

      setError(
        "Add at least one device."
      );

      return null;
    }


    setLoading(true);
    setError("");


    try {

      const idToName:
        Record<string, string> = {};


      inputNodes.forEach(
        (node) => {

          idToName[node.id] =
            node.data.label;
        }
      );


      const response =
        await fetch(
          "http://127.0.0.1:8000/api/analyze",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              nodes:
                inputNodes.map(
                  (node) =>
                    node.id
                ),

              edges:
                inputEdges.map(
                  (edge) => ({
                    source: edge.source,
                    target: edge.target,
                  })
                ),

              start_node:
                inputNodes[0]?.id,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Analysis failed."
        );
      }


      const raw =
        data.result as AnalysisResult;


      /*
       * Convert backend IDs into
       * human-readable device names.
       */

      const converted: AnalysisResult = {

        ...raw,


        articulation_points:
          raw.articulation_points.map(
            (id) =>
              idToName[id] ?? id
          ),


        bridges:
          (raw.bridges ?? []).map(
            (bridge) => ({
              source:
                idToName[
                  bridge.source
                ] ??
                bridge.source,

              target:
                idToName[
                  bridge.target
                ] ??
                bridge.target,
            })
          ),


        connected_components:
          raw.connected_components.map(
            (component) =>
              component.map(
                (id) =>
                  idToName[id] ?? id
              )
          ),


        dfs: {

          ...raw.dfs,


          order:
            raw.dfs.order.map(
              (id) =>
                idToName[id] ?? id
            ),


          discovery:
            Object.fromEntries(
              Object.entries(
                raw.dfs.discovery
              ).map(
                ([id, value]) => [
                  idToName[id] ?? id,
                  value,
                ]
              )
            ),


          low:
            Object.fromEntries(
              Object.entries(
                raw.dfs.low
              ).map(
                ([id, value]) => [
                  idToName[id] ?? id,
                  value,
                ]
              )
            ),


          parent:
            Object.fromEntries(
              Object.entries(
                raw.dfs.parent
              ).map(
                ([id, value]) => [
                  idToName[id] ?? id,
                  value
                    ? idToName[value] ??
                      value
                    : null,
                ]
              )
            ),


          steps:
            raw.dfs.steps.map(
              (step) => ({
                ...step,

                node:
                  step.node
                    ? idToName[
                        step.node
                      ] ??
                      step.node
                    : step.node,

                parent:
                  step.parent
                    ? idToName[
                        step.parent
                      ] ??
                      step.parent
                    : step.parent,
              })
            ),
        },


        biconnected_components:
          raw.biconnected_components.map(
            (component) =>
              component.map(
                (edge) => ({
                  source:
                    idToName[
                      edge.source
                    ] ??
                    edge.source,

                  target:
                    idToName[
                      edge.target
                    ] ??
                    edge.target,
                })
              )
          ),
      };


      return converted;

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Backend connection failed."
      );

      return null;

    } finally {

      setLoading(false);
    }
  };


  /* =======================================================
     ANALYZE BUTTON
  ======================================================= */

  const handleAnalyze = async () => {

    const result =
      await analyzeGraph();


    if (!result) {
      return;
    }


    setAnalysis(result);
    setFailureAnalysis(null);

    setFailedDevice(null);


    if (
      result.articulation_points.length
    ) {

      setSelectedCriticalDevice(
        result.articulation_points[0]
      );
    }


    setSelectedInsight("");
  };


  /* =======================================================
     FAILURE SIMULATION
  ======================================================= */

  const simulateFailure = async () => {

    if (!analysis) {

      setError(
        "Analyze the network first."
      );

      return;
    }


    const target =
      selectedCriticalDevice ||
      analysis.articulation_points[0];


    if (!target) {

      setError(
        "No critical device selected."
      );

      return;
    }


    const targetNode =
      nodes.find(
        (node) =>
          node.data.label ===
          target
      );


    if (!targetNode) {

      setError(
        "Could not locate the selected device."
      );

      return;
    }


    /*
     * Save original topology.
     */

    setOriginalNodes(
      JSON.parse(
        JSON.stringify(nodes)
      )
    );


    setOriginalEdges(
      JSON.parse(
        JSON.stringify(edges)
      )
    );


    /*
     * Remove failed device.
     */

    const remainingNodes =
      nodes.filter(
        (node) =>
          node.id !==
          targetNode.id
      );


    const remainingEdges =
      edges.filter(
        (edge) =>
          edge.source !==
            targetNode.id &&
          edge.target !==
            targetNode.id
      );


    /*
     * Re-analyze network
     * after failure.
     */

    const result =
      await analyzeGraph(
        remainingNodes,
        remainingEdges
      );


    if (!result) {
      return;
    }


    setBeforeRegions(
      analysis.statistics
        .connected_regions
    );


    setAfterRegions(
      result.statistics
        .connected_regions
    );


    setFailedDevice(target);

    setFailureAnalysis(result);


    /*
     * Show failed node
     * as offline.
     */

    setNodes(
      nodes.map(
        (node) =>
          node.id ===
          targetNode.id
            ? {
                ...node,

                data: {
                  ...node.data,
                  failed: true,
                  status: "Offline",
                },
              }
            : node
      )
    );


    /*
     * Remove its connections.
     */

    setEdges(remainingEdges);

    setError("");
  };


  /* =======================================================
     RESTORE
  ======================================================= */

  const restoreNetwork = () => {

    if (!originalNodes.length) {
      return;
    }


    setNodes(
      JSON.parse(
        JSON.stringify(
          originalNodes
        )
      )
    );


    setEdges(
      JSON.parse(
        JSON.stringify(
          originalEdges
        )
      )
    );


    setFailedDevice(null);

    setFailureAnalysis(null);

    setBeforeRegions(null);
    setAfterRegions(null);

    setError("");
  };


  /* =======================================================
     DELETE DEVICE
  ======================================================= */

  const deleteSelectedDevice = () => {

    const selected =
      nodes.find(
        (node) =>
          node.selected
      );


    if (!selected) {

      setError(
        "Select a device first."
      );

      return;
    }


    setNodes(
      (current) =>
        current.filter(
          (node) =>
            node.id !==
            selected.id
        )
    );


    setEdges(
      (current) =>
        current.filter(
          (edge) =>
            edge.source !==
              selected.id &&
            edge.target !==
              selected.id
        )
    );


    setAnalysis(null);
    setFailureAnalysis(null);
  };


  /* =======================================================
     CLEAR
  ======================================================= */

  const clearNetwork = () => {

    setNodes([]);
    setEdges([]);

    setAnalysis(null);
    setFailureAnalysis(null);

    setFailedDevice(null);

    setBeforeRegions(null);
    setAfterRegions(null);

    setSelectedCriticalDevice("");
    setSelectedInsight("");

    setError("");
  };


  /* =======================================================
     DERIVED DATA
  ======================================================= */

  const visibleAnalysis =
    failureAnalysis ||
    analysis;


  const criticalNodes =
    useMemo(
      () =>
        new Set(
          analysis?.articulation_points ??
          []
        ),
      [analysis]
    );


  const bridgeSet =
    useMemo(() => {

      const result =
        new Set<string>();


      (
        analysis?.bridges ??
        []
      ).forEach(
        (bridge) => {

          result.add(
            `${bridge.source}|${bridge.target}`
          );

          result.add(
            `${bridge.target}|${bridge.source}`
          );
        }
      );


      return result;

    }, [analysis]);


  /*
   * Highlight bridges.
   */

  const styledEdges =
    edges.map(
      (edge) => {

        const source =
          nodes.find(
            (node) =>
              node.id ===
              edge.source
          )?.data.label;


        const target =
          nodes.find(
            (node) =>
              node.id ===
              edge.target
          )?.data.label;


        const isBridge =
          !!source &&
          !!target &&
          (
            bridgeSet.has(
              `${source}|${target}`
            ) ||
            bridgeSet.has(
              `${target}|${source}`
            )
          );


        return {

          ...edge,

          animated:
            isBridge,

          style:
            isBridge
              ? {
                  stroke:
                    "#e05252",

                  strokeWidth: 3,
                }
              : {
                  stroke:
                    "#9aa3b2",

                  strokeWidth: 1.5,
                },
        };
      }
    );


  /*
   * Highlight articulation nodes.
   */

  const styledNodes =
    nodes.map(
      (node) => {

        const critical =
          criticalNodes.has(
            node.data.label
          );


        return {

          ...node,

          className:
            critical
              ? "critical-device-node"
              : "",
        };
      }
    );


  /* =======================================================
     UI
  ======================================================= */

  return (

    <div className="app-shell">


      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-mark">
            <ShieldCheck size={19} />
          </div>

          <div>

            <div className="brand-title">
              Network Analyzer
            </div>

            <div className="brand-subtitle">
              Biconnected Network Resilience
            </div>

          </div>

        </div>


        <div className="header-right">

          <div className="backend-pill">

            <span />

            Backend connected

          </div>


          <button
            className="demo-button"
            onClick={
              loadDemoNetwork
            }
          >

            <Zap size={15} />

            Demo Network

          </button>


          <button
            className="analyze-button"
            onClick={
              handleAnalyze
            }
            disabled={loading}
          >

            <Play size={15} />

            {loading
              ? "Analyzing..."
              : "Analyze Network"}

          </button>

        </div>

      </header>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="main-layout">


        {/* =================================================
            LEFT SIDEBAR
        ================================================= */}

        <aside className="sidebar">

          <div className="sidebar-title">

            <div className="eyebrow">
              NETWORK BUILDER
            </div>

            <h2>
              Infrastructure
            </h2>

            <p>
              Add the devices that make
              up your network topology.
            </p>

          </div>


          <div className="builder-form">


            <label>
              Device name
            </label>

            <input
              value={deviceName}
              onChange={
                (event) =>
                  setDeviceName(
                    event.target.value
                  )
              }
              placeholder="e.g. Production Server 01"
            />


            <label>
              Device type
            </label>

            <select
              value={deviceType}
              onChange={
                (event) =>
                  setDeviceType(
                    event.target.value as DeviceType
                  )
              }
            >

              <option value="router">
                Router
              </option>

              <option value="switch">
                Switch
              </option>

              <option value="server">
                Server
              </option>

              <option value="gateway">
                Gateway
              </option>

              <option value="database">
                Database
              </option>

            </select>


            <label>
              IP address
            </label>

            <input
              value={deviceIp}
              onChange={
                (event) =>
                  setDeviceIp(
                    event.target.value
                  )
              }
              placeholder="10.0.0.10"
            />


            <label>
              Status
            </label>

            <select
              value={deviceStatus}
              onChange={
                (event) =>
                  setDeviceStatus(
                    event.target.value as DeviceStatus
                  )
              }
            >

              <option value="Online">
                Online
              </option>

              <option value="Warning">
                Warning
              </option>

              <option value="Offline">
                Offline
              </option>

            </select>


            <button
              className="add-device-button"
              onClick={
                addDevice
              }
            >

              <Plus size={16} />

              Add Device

            </button>

          </div>


          <div className="builder-divider" />


          <div className="mode-title">
            Canvas mode
          </div>


          <div className="mode-switch">

            <button
              className={
                mode === "select"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setMode(
                  "select"
                )
              }
            >
              Select
            </button>


            <button
              className={
                mode === "connect"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setMode(
                  "connect"
                )
              }
            >
              Connect
            </button>

          </div>


          <p className="mode-hint">

            {mode === "select"
              ? "Drag devices to arrange your topology."
              : "Drag from one device handle to another."}

          </p>


          <div className="quick-actions">

            <button
              onClick={
                deleteSelectedDevice
              }
            >

              <Trash2 size={14} />

              Delete device

            </button>


            <button
              onClick={
                clearNetwork
              }
            >

              <RotateCcw size={14} />

              Clear topology

            </button>

          </div>


          <div className="sidebar-bottom">

            <div>

              <span>
                Devices
              </span>

              <strong>
                {nodes.length}
              </strong>

            </div>


            <div>

              <span>
                Links
              </span>

              <strong>
                {edges.length}
              </strong>

            </div>

          </div>


          {error && (

            <div className="error-box">

              <CircleAlert size={15} />

              {error}

            </div>

          )}

        </aside>


        {/* =================================================
            NETWORK CANVAS
        ================================================= */}

        <section className="canvas-area">


          <div className="canvas-header">

            <div>

              <div className="canvas-title">
                Live Network Topology
              </div>

              <div className="canvas-description">
                Graph representation of your infrastructure
              </div>

            </div>


            <div className="legend">

              <span>
                <i className="green-dot" />
                Online
              </span>

              <span>
                <i className="red-dot" />
                Critical
              </span>

              <span>
                <i className="bridge-dot" />
                Bridge
              </span>

            </div>

          </div>


          <div className="flow-wrapper">


            {nodes.length === 0 ? (

              <div className="canvas-empty">

                <div className="canvas-empty-icon">
                  <Network size={27} />
                </div>

                <h2>
                  Build a network
                </h2>

                <p>
                  Add devices or load the
                  prepared demonstration topology.
                </p>


                <button
                  className="load-demo-button"
                  onClick={
                    loadDemoNetwork
                  }
                >

                  <Zap size={15} />

                  Load Demo Network

                </button>

              </div>

            ) : (

              <ReactFlow

                nodes={styledNodes}

                edges={styledEdges}

                onNodesChange={
                  onNodesChange
                }

                onEdgesChange={
                  onEdgesChange
                }

                onConnect={
                  onConnect
                }

                nodeTypes={
                  nodeTypes
                }

                nodesDraggable={
                  mode === "select"
                }

                nodesConnectable={
                  mode === "connect"
                }

                fitView

                fitViewOptions={{
                  padding: 0.2,
                }}

                proOptions={{
                  hideAttribution:
                    true,
                }}
              >

                <Background
                  gap={20}
                  size={1}
                  color="#dfe3e9"
                />

                <Controls />

                <MiniMap
                  nodeColor="#aab2c0"
                  maskColor="rgba(245,246,248,0.72)"
                />

              </ReactFlow>

            )}

          </div>

        </section>


        {/* =================================================
            ANALYSIS PANEL
        ================================================= */}

        <aside className="analysis-panel">


          {!visibleAnalysis ? (

            <div className="analysis-empty">

              <div className="analysis-icon">
                <Activity size={21} />
              </div>


              <h2>
                Network Analysis
              </h2>


              <p>
                Run the analysis to inspect
                graph structure, critical
                devices and network resilience.
              </p>


              <div className="analysis-preview">

                <div>
                  <CheckCircle2 size={14} />
                  DFS traversal
                </div>

                <div>
                  <CheckCircle2 size={14} />
                  Articulation points
                </div>

                <div>
                  <CheckCircle2 size={14} />
                  Connected components
                </div>

                <div>
                  <CheckCircle2 size={14} />
                  Biconnected components
                </div>

                <div>
                  <CheckCircle2 size={14} />
                  Bridge detection
                </div>

              </div>

            </div>

          ) : (

            <div className="analysis-content">


              {/* ANALYSIS STATUS */}

              <div className="analysis-status">

                <div className="status-check">
                  <CheckCircle2 size={18} />
                </div>

                <div>

                  <strong>
                    Analysis complete
                  </strong>

                  <span>
                    DFS-based graph analysis
                  </span>

                </div>

              </div>


              {/* METRICS */}

              <div className="metrics-grid">

                <Metric
                  label="Devices"
                  value={
                    visibleAnalysis.statistics.nodes
                  }
                  icon={
                    <Network size={15} />
                  }
                />


                <Metric
                  label="Links"
                  value={
                    visibleAnalysis.statistics.edges
                  }
                  icon={
                    <GitBranch size={15} />
                  }
                />


                <Metric
                  label="Regions"
                  value={
                    visibleAnalysis.statistics
                      .connected_regions
                  }
                  icon={
                    <Globe size={15} />
                  }
                />


                <Metric
                  label="Critical"
                  value={
                    analysis?.statistics
                      .articulation_points ??
                    0
                  }
                  icon={
                    <AlertTriangle size={15} />
                  }
                />

              </div>


              {/* FAILURE RESULT */}

              {failedDevice && (

                <section className="failure-card">

                  <div className="failure-card-title">

                    <div>

                      <span>
                        FAILURE SIMULATION
                      </span>

                      <strong>
                        {failedDevice}
                      </strong>

                    </div>

                    <XCircle size={19} />

                  </div>


                  <div className="failure-compare">

                    <div>

                      <span>
                        Before
                      </span>

                      <strong>
                        {beforeRegions}
                      </strong>

                      <small>
                        regions
                      </small>

                    </div>


                    <ArrowRight
                      size={17}
                    />


                    <div>

                      <span>
                        After
                      </span>

                      <strong className="after-number">
                        {afterRegions}
                      </strong>

                      <small>
                        regions
                      </small>

                    </div>

                  </div>


                  <p>

                    {afterRegions !== null &&
                    beforeRegions !== null &&
                    afterRegions >
                      beforeRegions

                      ? "The failed device caused network fragmentation."

                      : "The failure did not increase network fragmentation."}

                  </p>


                  <button
                    onClick={
                      restoreNetwork
                    }
                  >

                    <RotateCcw size={14} />

                    Restore Network

                  </button>

                </section>

              )}


              {/* CRITICAL DEVICES */}

              <section className="analysis-section">

                <div className="section-title">

                  <div>

                    <h3>
                      Critical Devices
                    </h3>

                    <p>
                      Articulation points
                    </p>

                  </div>

                  <AlertTriangle
                    size={16}
                  />

                </div>


                {analysis &&
                analysis.articulation_points
                  .length > 0 ? (

                  <div className="critical-list">

                    {analysis.articulation_points.map(
                      (device) => (

                        <button
                          key={device}
                          className={
                            selectedCriticalDevice ===
                            device
                              ? "critical-item selected"
                              : "critical-item"
                          }
                          onClick={() => {

                            setSelectedCriticalDevice(
                              device
                            );

                            setSelectedInsight(
                              device
                            );

                          }}
                        >

                          <span className="critical-dot" />

                          <strong>
                            {device}
                          </strong>

                          <ArrowRight
                            size={13}
                          />

                        </button>

                      )
                    )}

                  </div>

                ) : (

                  <div className="safe-box">

                    <CheckCircle2
                      size={15}
                    />

                    No articulation points
                    detected.

                  </div>

                )}

              </section>


              {/* WHY CRITICAL */}

              {selectedInsight &&
              analysis && (

                <section className="insight-card">

                  <div className="insight-title">

                    <Activity
                      size={15}
                    />

                    Why is it critical?

                  </div>


                  <strong>
                    {selectedInsight}
                  </strong>


                  <p>
                    This device is an
                    articulation point.
                    Removing it can increase
                    the number of connected
                    regions.
                  </p>


                  <div className="insight-values">

                    <div>

                      <span>
                        Discovery
                      </span>

                      <strong>
                        {
                          analysis.dfs
                            .discovery[
                              selectedInsight
                            ]
                        }
                      </strong>

                    </div>


                    <div>

                      <span>
                        Low-link
                      </span>

                      <strong>
                        {
                          analysis.dfs
                            .low[
                              selectedInsight
                            ]
                        }
                      </strong>

                    </div>

                  </div>

                </section>

              )}


              {/* FAILURE SIMULATION */}

              {analysis &&
              analysis.articulation_points
                .length > 0 &&
              !failedDevice && (

                <section className="simulation-card">

                  <div className="section-title">

                    <div>

                      <h3>
                        Failure Simulation
                      </h3>

                      <p>
                        Test network resilience
                      </p>

                    </div>

                    <Zap size={16} />

                  </div>


                  <select
                    value={
                      selectedCriticalDevice ||
                      analysis
                        .articulation_points[0]
                    }
                    onChange={
                      (event) =>
                        setSelectedCriticalDevice(
                          event.target.value
                        )
                    }
                  >

                    {analysis
                      .articulation_points
                      .map(
                        (device) => (

                          <option
                            key={device}
                            value={device}
                          >
                            {device}
                          </option>

                        )
                      )}

                  </select>


                  <button
                    className="simulate-button"
                    onClick={
                      simulateFailure
                    }
                  >

                    <XCircle
                      size={15}
                    />

                    Simulate Failure

                  </button>

                </section>

              )}


              {/* BRIDGES */}

              <section className="analysis-section">

                <div className="section-title">

                  <div>

                    <h3>
                      Critical Connections
                    </h3>

                    <p>
                      Bridges detected by DFS
                    </p>

                  </div>

                  <GitBranch
                    size={16}
                  />

                </div>


                {analysis?.bridges &&
                analysis.bridges.length > 0 ? (

                  <div className="bridge-list">

                    {analysis.bridges.map(
                      (bridge, index) => (

                        <div
                          className="bridge-item"
                          key={index}
                        >

                          <span>
                            {bridge.source}
                          </span>

                          <ArrowRight
                            size={12}
                          />

                          <span>
                            {bridge.target}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <div className="safe-box">

                    <CheckCircle2
                      size={15}
                    />

                    No bridges detected.

                  </div>

                )}

              </section>


              {/* DFS */}

              <section className="analysis-section">

                <div className="section-title">

                  <div>

                    <h3>
                      DFS Traversal
                    </h3>

                    <p>
                      Exploration order
                    </p>

                  </div>

                  <GitBranch
                    size={16}
                  />

                </div>


                <div className="dfs-list">

                  {visibleAnalysis.dfs.order.map(
                    (node, index) => (

                      <div
                        className="dfs-item"
                        key={
                          `${node}-${index}`
                        }
                      >

                        <span>
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <strong>
                          {node}
                        </strong>

                      </div>

                    )
                  )}

                </div>

              </section>


              {/* DISCOVERY + LOW */}

              <section className="analysis-section">

                <div className="section-title">

                  <div>

                    <h3>
                      Discovery & Low
                    </h3>

                    <p>
                      DFS structural values
                    </p>

                  </div>

                </div>


                <div className="values-table">

                  <div className="values-head">

                    <span>
                      Device
                    </span>

                    <span>
                      Disc.
                    </span>

                    <span>
                      Low
                    </span>

                  </div>


                  {visibleAnalysis.dfs.order.map(
                    (node) => (

                      <div
                        className="values-row"
                        key={node}
                      >

                        <span>
                          {node}
                        </span>

                        <span>
                          {
                            visibleAnalysis
                              .dfs
                              .discovery[
                                node
                              ]
                          }
                        </span>

                        <span>
                          {
                            visibleAnalysis
                              .dfs
                              .low[
                                node
                              ]
                          }
                        </span>

                      </div>

                    )
                  )}

                </div>

              </section>


              {/* CONNECTED COMPONENTS */}

              <section className="analysis-section">

                <div className="section-title">

                  <div>

                    <h3>
                      Connected Regions
                    </h3>

                    <p>
                      Reachability groups
                    </p>

                  </div>

                  <Globe
                    size={16}
                  />

                </div>


                <div className="component-list">

                  {visibleAnalysis
                    .connected_components
                    .map(
                      (component, index) => (

                        <div
                          className="component-item"
                          key={index}
                        >

                          <div className="component-number">
                            {index + 1}
                          </div>

                          <div>

                            <strong>
                              Region {index + 1}
                            </strong>

                            <span>
                              {
                                component.join(
                                  " · "
                                )
                              }
                            </span>

                          </div>

                        </div>

                      )
                    )}

                </div>

              </section>


              {/* BICONNECTED */}

              <section className="biconnected-card">

                <ShieldCheck
                  size={17}
                />

                <div>

                  <strong>
                    {
                      visibleAnalysis
                        .statistics
                        .biconnected_components
                    }
                  </strong>

                  <span>
                    biconnected components
                  </span>

                </div>

              </section>


              {/* COMPLEXITY */}

              <div className="complexity-bar">

                <span>
                  Algorithm
                </span>

                <strong>
                  DFS · O(V + E)
                </strong>

              </div>


            </div>

          )}

        </aside>

      </main>

    </div>
  );
}