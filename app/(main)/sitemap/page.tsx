"use client";

import React, { useEffect, useState } from "react";
import ReactFlow, { Controls, Panel, Node, Edge } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import "reactflow/dist/style.css";
import { convertSitemapToFlow } from "./_helper/sitemap.helper";
import { sitemap } from "./_helper/data/sitemap.data";
import CustomNode from "./_components/custom_node";
import { sidePanel } from "./_helper/data/sidePanel";
import { Plus, Repeat2, Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  addFieldToNode,
  closeSidePanel,
  selectCurrentNodeId,
  selectIsSidePanelOpen,
  setNodes,
  checkReplaceNode,
  sidePanelWithEditButton,
  setNodesToStack,
} from "@/redux/Nodes/nodeSlice";
import Icon from "./assets/Icon";
import Edit from "./assets/Edit";
import Circle from "./assets/Circle";

interface NodeData {
  name: string;
  description: string;
  fields: { name: string; description: string }[];
}

interface CustomNode extends Node<NodeData> {
  type: "textUpdater";
}

const nodeTypes = { textUpdater: CustomNode };

interface ComponentSection {
  name: string;
}

const SiteMap: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const getCursorType = useSelector(
    (state: RootState) => state.nodes.cursorPointer
  );

  const nodes = useSelector((state: RootState) => state.nodes.nodes);
  const edges = useSelector((state: RootState) => state.nodes.edges);
  const [sidePanelData, setSidePanelData] = React.useState(sidePanel);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] =
    useState<ComponentSection[]>(sidePanelData);
  const [randomComponents, setRandomComponents] = useState<ComponentSection[]>(
    []
  );

  useEffect(() => {
    if (searchTerm.length >= 3) {
      const filtered = sidePanelData.filter((section) =>
        section.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(sidePanelData);
    }
  }, [searchTerm, sidePanelData]);

  useEffect(() => {
    if (filteredData.length === 0) {
      const randomData = sidePanelData
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      setRandomComponents(randomData);
    } else {
      setRandomComponents([]);
    }
  }, [filteredData, sidePanelData]);
  const currentNodeId = useSelector(selectCurrentNodeId);
  const replaceNode = useSelector(checkReplaceNode);
  const selectedIndex = useSelector(
    (state: RootState) => state.nodes.fieldIndex
  );
  const isSidePanelOpen = useSelector(selectIsSidePanelOpen);

  useEffect(() => {
    const { nodes: initialNodes, edges: initialEdges } =
      convertSitemapToFlow(sitemap);
    dispatch(setNodes({ nodes: initialNodes, edges: initialEdges }));
  }, [dispatch]);

  /**
   * Adjusts the positions of nodes based on the specified direction.
   * If the direction is "left", nodes to the left of the selected node will be shifted left.
   * If the direction is "right", nodes to the right of the selected node will be shifted right.
   * @param {number} selectedNodeIndex - The index of the selected node in the nodes array.
   * @param {any[]} updatedNodes - The array of nodes including the new node.
   * @param {any} selectedNode - The currently selected node.
   * @param {"left" | "right"} direction - The direction to adjust the positions ("left" or "right").
   * @returns {any[]} - The array of nodes with adjusted positions.
   */
  const adjustPositionOfNodes = (
    selectedNodeIndex: number,
    updatedNodes: any[],
    selectedNode: any,
    direction: "left" | "right"
  ) => {
    // Create a copy of the updated nodes array to avoid mutating the original array
    const copyUpdatedNodes = updatedNodes.map((node) => ({ ...node }));
    // Create a copy of the edges array to avoid mutating the original array
    const allEdges = edges.slice().map((edge: any) => ({ ...edge }));

    if (direction === "left") {
      // Iterate through the copied nodes array to adjust positions of nodes to the left
      copyUpdatedNodes.forEach((node, index) => {
        if (
          index !== selectedNodeIndex &&
          node.position.y === selectedNode.position.y &&
          node.position.x < selectedNode.position.x
        ) {
          // Adjust positions of target nodes connected by edges
          allEdges.forEach((edge: any) => {
            if (edge.source === node.id) {
              const targetNode = copyUpdatedNodes.find(
                (n) => n.id === edge.target
              );
              if (targetNode) {
                const updatedPosition = {
                  ...targetNode.position,
                  x: targetNode.position.x - 300,
                };
                targetNode.position = updatedPosition;
              }
            }
          });

          // Shift the node to the left
          node.position = {
            ...node.position,
            x: node.position.x - 300,
          };
        }
      });
    } else if (direction === "right") {
      // Iterate through the copied nodes array to adjust positions of nodes to the right
      copyUpdatedNodes.forEach((node, index) => {
        if (
          index !== selectedNodeIndex &&
          node.position.y === selectedNode.position.y &&
          node.position.x > selectedNode.position.x
        ) {
          // Adjust positions of target nodes connected by edges
          allEdges.forEach((edge: any) => {
            if (edge.source === node.id) {
              const targetNode = copyUpdatedNodes.find(
                (n) => n.id === edge.target
              );
              if (targetNode) {
                const updatedPosition = {
                  ...targetNode.position,
                  x: targetNode.position.x + 300,
                };
                targetNode.position = updatedPosition;
              }
            }
          });

          // Shift the node to the right
          node.position = {
            ...node.position,
            x: node.position.x + 300,
          };
        }
      });
    }

    // Return the array of nodes with adjusted positions
    return copyUpdatedNodes;
  };

  const handleAddNode = (
    nodeId: string,
    position: { x: number; y: number }
  ) => {
    const selectedNodeIndex = nodes.findIndex(
      (node: any) => node.id === nodeId
    );
    if (selectedNodeIndex === -1) return;

    if (selectedNodeIndex === 0 && nodes.length === 1) {
      const newNodeId = `node-${nodes.length + 1}`;
      const newNode: CustomNode = {
        id: newNodeId,
        type: "textUpdater",
        position: {
          x: nodes[selectedNodeIndex].position.x - nodes.length * 300 - 100,
          y: nodes[selectedNodeIndex].position.y + nodes.length * 300 + 100,
        },
        data: {
          name: "New Node",
          description: "New Description",
          fields: [{ name: "Name", description: "Description" }],
        },
      };
      const updatedNodes = [...nodes, newNode];
      // setNodes(updatedNodes);
      const newEdge: Edge = {
        id: `edge-${nodeId}-${newNodeId}`,
        source: nodeId,
        target: newNodeId,
        type: "smoothstep",
      };
      const updatedEdges = [...edges, newEdge];
      // setEdges(updatedEdges);
      return;
    }

    const parentNode = edges.find(
      (edge: any) => edge.target === nodeId
    )?.source;
    if (!parentNode) return;

    const newNodeId = `node-${nodes.length + 1}`;
    const newNode: Node = {
      id: newNodeId,
      type: "textUpdater",
      position: {
        x: nodes[selectedNodeIndex].position.x + 50,
        y: nodes[selectedNodeIndex].position.y,
      },
      data: {
        name: "New Node",
        description: "New Description",
        fields: [{ name: "Name", description: "Description" }],
      },
    };

    const updatedNodes = [...nodes];
    updatedNodes.splice(selectedNodeIndex + 1, 0, newNode);

    for (let i = selectedNodeIndex + 1; i < updatedNodes.length; i++) {
      updatedNodes[i] = {
        ...updatedNodes[i],
        position: {
          ...updatedNodes[i].position,
          x:
            updatedNodes[selectedNodeIndex].position.x +
            (i - selectedNodeIndex) * 300,
        },
      };
    }

    // setNodes(updatedNodes);

    const newEdge: Edge = {
      id: `edge-${parentNode}-${newNodeId}`,
      source: parentNode,
      target: newNodeId,
      type: "smoothstep",
    };

    const updatedEdges = [...edges, newEdge];
    // setEdges(updatedEdges);
  };

  /**
   * Handles the addition of a new node below the specified node.
   * @param {string} nodeId - The ID of the node below which the new node will be added.
   */
  const handleAddNodeBelow = (nodeId: string) => {
    // Find the index of the selected node in the nodes array
    const selectedNodeIndex = nodes.findIndex(
      (node: any) => node.id === nodeId
    );
    if (selectedNodeIndex === -1) return; // If the node is not found, exit the function

    // Find the parent node of the selected node from the edges array
    const parentNode = edges.find(
      (edge: any) => edge.target === nodeId
    )?.source;
    if (!parentNode) return; // If no parent node is found, exit the function

    // Generate a new unique ID for the new node
    const newNodeId = `node-${nodes.length + 1}`;
    // Create the new node with specified properties
    const newNode: Node = {
      id: newNodeId,
      type: "textUpdater",
      position: {
        x: nodes[selectedNodeIndex].position.x,
        y: nodes[selectedNodeIndex].position.y + 300, // Position it below the selected node
      },
      data: {
        name: `New Node ${nodes.length + 1}`,
        description: "New Description",
        fields: [],
      },
    };

    // Create a new array of nodes with the new node inserted below the selected node
    const updatedNodes = [...nodes];
    updatedNodes.splice(selectedNodeIndex + 1, 0, newNode);

    // Create a new edge connecting the selected node to the new node
    const newEdge: Edge = {
      id: `edge-${nodeId}-${newNodeId}`,
      source: nodeId,
      target: newNodeId,
      type: "smoothstep",
    };

    dispatch(
      setNodesToStack({
        type: "ADD_NODE_BELOW",
        node: newNode,
        edge: newEdge,
      })
    );

    // Create a new array of edges with the new edge added
    const updatedEdges = [...edges, newEdge];

    // Dispatch the updated nodes and edges to the state management
    dispatch(setNodes({ nodes: updatedNodes, edges: updatedEdges }));
  };

  /**
   * Handles the addition of a new node to the left of the specified node.
   * @param {string} nodeId - The ID of the node to the left of which the new node will be added.
   */
  const handleAddNodeLeft = (nodeId: string) => {
    // Find the index of the selected node in the nodes array
    const selectedNodeIndex = nodes.findIndex(
      (node: any) => node.id === nodeId
    );
    if (selectedNodeIndex === -1) return; // If the node is not found, exit the function

    // Find the parent node of the selected node from the edges array
    const parentNode = edges.find(
      (edge: any) => edge.target === nodeId
    )?.source;
    if (!parentNode) return; // If no parent node is found, exit the function

    // Generate a new unique ID for the new node
    const newNodeId = `node-${nodes.length + 1}`;
    // Get the selected node's data
    const selectedNode = nodes[selectedNodeIndex];
    // Create the new node with specified properties
    const newNode: CustomNode = {
      id: newNodeId,
      type: "textUpdater",
      position: {
        x: selectedNode.position.x - 1, // Position it slightly left of the selected node
        y: selectedNode.position.y,
      },
      data: {
        name: `New Node ${nodes.length + 1}`,
        description: "New Description",
        fields: [],
      },
    };

    // Create a new array of nodes with the new node added
    const updatedNodes = [...nodes, newNode];

    // Adjust the positions of other nodes accordingly
    const adjustedNodes = adjustPositionOfNodes(
      selectedNodeIndex,
      updatedNodes,
      selectedNode,
      "left"
    );

    // Create a new edge connecting the parent node to the new node
    const newEdge: Edge = {
      id: `edge-${nodeId}-${newNodeId}`,
      source: parentNode,
      target: newNodeId,
      type: "smoothstep",
    };

    dispatch(
      setNodesToStack({
        type: "ADD_NODE_LEFT",
        node: newNode,
        edge: newEdge,
      })
    );

    // Create a new array of edges with the new edge added
    const updatedEdges = [...edges, newEdge];

    // Dispatch the updated nodes and edges to the state management
    dispatch(setNodes({ nodes: adjustedNodes, edges: updatedEdges }));
  };

  /**
   * Handles the addition of a new node to the right of the specified node.
   * @param {string} nodeId - The ID of the node to the right of which the new node will be added.
   */
  const handleAddNodeRight = (nodeId: string) => {
    // Find the index of the selected node in the nodes array
    const selectedNodeIndex = nodes.findIndex(
      (node: any) => node.id === nodeId
    );
    if (selectedNodeIndex === -1) return; // If the node is not found, exit the function

    // Find the parent node of the selected node from the edges array
    const parentNode = edges.find(
      (edge: any) => edge.target === nodeId
    )?.source;
    if (!parentNode) return; // If no parent node is found, exit the function

    // Generate a new unique ID for the new node
    const newNodeId = `node-${nodes.length + 1}`;
    // Get the selected node's data
    const selectedNode = nodes[selectedNodeIndex];
    // Create the new node with specified properties
    const newNode: CustomNode = {
      id: newNodeId,
      type: "textUpdater",
      position: {
        x: selectedNode.position.x + 1, // Position it slightly right of the selected node
        y: selectedNode.position.y,
      },
      data: {
        name: `New Node right ${nodes.length + 1}`,
        description: "New Description",
        fields: [],
      },
    };

    // Create a new array of nodes with the new node added
    const updatedNodes = [...nodes, newNode];

    // Adjust the positions of other nodes accordingly
    const adjustedNodes = adjustPositionOfNodes(
      selectedNodeIndex,
      updatedNodes,
      selectedNode,
      "right"
    );

    // Create a new edge connecting the parent node to the new node
    const newEdge: Edge = {
      id: `edge-${nodeId}-${newNodeId}`,
      source: parentNode,
      target: newNodeId,
      type: "smoothstep",
    };

    dispatch(
      setNodesToStack({
        type: "ADD_NODE_RIGHT",
        node: newNode,
        edge: newEdge,
      })
    );

    // Create a new array of edges with the new edge added
    const updatedEdges = [...edges, newEdge];

    // Dispatch the updated nodes and edges to the state management
    dispatch(setNodes({ nodes: adjustedNodes, edges: updatedEdges }));
  };

  // This function handles the removal of a node from the graph
  // But it is not been used yet
  const handleRemoveNode = (nodeId: string) => {
    const selectedNodeIndex = nodes.findIndex(
      (node: any) => node.id === nodeId
    );
    if (selectedNodeIndex === -1) return;

    const updatedNodes = nodes.filter((node: any) => node.id !== nodeId);

    const updatedEdges = edges.filter(
      (edge: any) => edge.source !== nodeId && edge.target !== nodeId
    );

    for (let i = selectedNodeIndex; i < updatedNodes.length; i++) {
      updatedNodes[i] = {
        ...updatedNodes[i],
        position: {
          ...updatedNodes[i].position,
          x: updatedNodes[i].position.x - 300,
        },
      };
    }

    // setNodes(updatedNodes);
    // setEdges(updatedEdges);
  };

  /**
   * Handles the event when an item from the side panel is clicked.
   * Adds a new field to the currently selected node and closes the side panel.
   * @param {string} name - The name of the new field to be added.
   */
  const handlePanelItemClick = (name: string) => {
    // Check if there is a currently selected node
    if (currentNodeId) {
      // Create a new field with the provided name, an empty description, and a unique ID
      const newField = { name, description: "", id: uuidv4() };

      // Dispatch an action to add the new field to the currently selected node
      dispatch(
        addFieldToNode({
          nodeId: currentNodeId,
          field: newField,
          index: selectedIndex,
          replaceNode: replaceNode,
          type: "ADD_FIELD",
        })
      );
    }
    // Dispatch an action to close the side panel
    dispatch(closeSidePanel());
  };

  return (
    <ReactFlow
      className={`mt-[50px]`}
      nodes={nodes.map((node: any) => ({
        ...node,
        data: {
          ...node.id,
          ...node.data,
          onAddNode: () => handleAddNode(node.id, node.position),
          onAddLeft: () => handleAddNodeLeft(node.id),
          onAddRight: () => handleAddNodeRight(node.id),
          onAddBelow: () => handleAddNodeBelow(node.id),
          onRemove: () => handleRemoveNode(node.id),
        },
      }))}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      panOnDrag={getCursorType}
    >
      <Controls />
      
      <Panel position="top-right">
        <button
          className="absolute rounded-xl bg-[#256BFA] top-[10px] right-[50px] flex w-[36.423px] h-[36.441px] px-[7.265px] pt-[6.877px] pb-[7.699px] pl-[7.304px] flex-col justify-center items-center flex-shrink-0"
          onClick={() => {
            dispatch(sidePanelWithEditButton());
          }}
        >
          <Edit />
        </button>
      </Panel>

      {isSidePanelOpen && (
        <Panel position="top-right">
          <div className="absolute w-[350px] h-[800px] top-[10px] right-[100px] gap-[16px] bg-white flex flex-col shadow-md text-[#161616] rounded-[8px] border border-[#EAEAEA] ">
            <div className="flex justify-center items-center border-b border-[#EEE] py-2">
              <h1 className="text-[#091e42] font-inter text-[20px] font-bold leading-normal">
                {replaceNode ? "Switch out a component" : "Add new component"}
              </h1>
            </div>
            <div className="flex flex-col justify-start px-2 gap-[10px]">
              <h1 className="text-[#091e42] font-inter text-[16px] font-semibold leading-normal">
                {replaceNode ? "Change component" : "Add new component"}
              </h1>
              <h1 className="text-[#5e6c84] font-inter text-[14px] font-normal leading-[150%]">
                Replace selected section on the sitemap by selecting from the
                list below
              </h1>
              <div className="">
                <form className="max-w-md mx-auto">
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <Search className="w-[20px] h-[20px] text-[#848EA0]" />
                    </div>
                    <input
                      type="search"
                      id="default-search"
                      className="block w-full p-2 ps-10 text-sm text-[#848EA0] border border-gray-300 rounded-lg bg-gray-50"
                      placeholder="Search Components"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="flex flex-col h-[420px] gap-[10px] overflow-y-auto scrollbar-hide">
                {filteredData.length > 0 ? (
                  filteredData.map((section, index) => (
                    <div key={index}>
                      <div className="grid grid-cols-[auto,1fr,auto] gap-[8px] w-[322px] px-[16px] py-[8px] rounded-[4px] border border-[#eee]">
                        <div className="flex">
                          <Icon />
                        </div>
                        <div className="grid justify-items-start">
                          <h1 className="text-[#091E42] font-inter text-[14px] font-medium leading-[21px] ">
                            {section.name}
                          </h1>
                          <p className="text-[#5e6c84] font-inter text-[12px] font-normal leading-[18px]">
                            Replace selected section on the sitemap by selecting
                            from the list below
                          </p>
                        </div>
                        <div className="flex">
                          <button
                            onClick={() => handlePanelItemClick(section.name)}
                          >
                            {replaceNode ? <Circle /> : <Plus />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                      <div className="flex justify-start px-[16px] items-center h-[30px]">
                        <h2 className="text-[#5E6C84] font-inter text-[12px] font-normal leading-[18px]">
                          Oops! No exact match for {searchTerm}
                        </h2>
                      </div>
                      <div className="border border-[#D3D3D3] flex flex-col justify-start px-[16px] py-[15px] rounded">
                        <h3 className="text-[#091e42] font-inter text-[16px] font-semibold leading-normal">
                          Explore more components:
                        </h3>
                        <div className="mt-[10px] flex flex-col gap-[10px] overflow-y-auto scrollbar-hide">
                          {randomComponents.map((section, index) => (
                            <div key={index}>
                              <div className="grid grid-cols-[auto,1fr,auto] gap-[8px] w-[322px] px-[16px] py-[8px] rounded-[4px]">
                                <div className="flex">
                                  <Icon />
                                </div>
                                <div className="grid justify-items-start">
                                  <h1 className="text-[#091E42] font-inter text-[14px] font-medium leading-[21px] ">
                                    {section.name}
                                  </h1>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Panel>
      )}
    </ReactFlow>
  );
};

export default SiteMap;
