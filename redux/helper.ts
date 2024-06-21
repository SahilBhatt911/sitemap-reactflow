import { AppDispatch, RootState } from "./store";
import { setNodes, setEdges } from "./Nodes/nodeSlice";

export const handleAddNodeLeft = (nodeId: string) => (dispatch: AppDispatch, getState: () => RootState) => {

    const state = getState();
    const nodes = state.nodes.nodes;
    const edges = state.nodes.edges;
    const selectedNodeIndex = nodes.findIndex(
      (node: any) => node.id === nodeId
    );
    if (selectedNodeIndex === -1)
      return { updatedNodes: nodes, updatedEdges: edges };

    const parentNode = edges.find(
      (edge: any) => edge.target === nodeId
    )?.source;
    if (!parentNode) return { updatedNodes: nodes, updatedEdges: edges };

    const newNodeId = `node-${nodes.length + 1}`;
    const selectedNode = nodes[selectedNodeIndex];
    const newNode: any = {
      id: newNodeId,
      type: "textUpdater",
      position: {
        x: nodes[selectedNodeIndex].position.x - 1,
        y: nodes[selectedNodeIndex].position.y,
      },
      data: {
        name: `New Node ${nodes.length + 1}`,
        description: "New Description",
        fields: [{ name: "Name", description: "Description" }],
      },
    };

    const updatedNodes = [...nodes, newNode];

    adjustPositionOfNodes(
      selectedNodeIndex,
      updatedNodes,
      selectedNode,
      "left",
      edges
    );

    const newEdge: any = {
      id: `edge-${nodeId}-${newNodeId}`,
      source: parentNode,
      target: newNodeId,
      type: "smoothstep",
    };

    const updatedEdges = [...edges, newEdge];

    dispatch(setNodes(updatedNodes));
    dispatch(setEdges(updatedEdges));
  };

const adjustPositionOfNodes = (
  selectedNodeIndex: number,
  updatedNodes: any[],
  selectedNode: any,
  direction: "left" | "right",
  allEdges: any[]
) => {
  if (direction === "left") {
    updatedNodes.forEach((node, index) => {
      if (
        index !== selectedNodeIndex &&
        node.position.y === selectedNode.position.y &&
        node.position.x < selectedNode.position.x
      ) {
        allEdges.forEach((edge) => {
          if (edge.source === node.id) {
            const targetNode = updatedNodes.find((n) => n.id === edge.target);
            if (targetNode) {
              targetNode.position = {
                ...targetNode.position,
                x: targetNode.position.x - 300,
              };
            }
          }
        });

        updatedNodes[index] = {
          ...node,
          position: {
            ...node.position,
            x: node.position.x - 300,
          },
        };
      }
    });
  } else if (direction === "right") {
    updatedNodes.forEach((node, index) => {
      if (
        index !== selectedNodeIndex &&
        node.position.y === selectedNode.position.y &&
        node.position.x > selectedNode.position.x
      ) {
        allEdges.forEach((edge) => {
          if (edge.source === node.id) {
            const targetNode = updatedNodes.find((n) => n.id === edge.target);
            if (targetNode) {
              targetNode.position = {
                ...targetNode.position,
                x: targetNode.position.x + 300,
              };
            }
          }
        });

        updatedNodes[index] = {
          ...node,
          position: {
            ...node.position,
            x: node.position.x + 300,
          },
        };
      }
    });
  }
};
