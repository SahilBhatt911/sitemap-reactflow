import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface Field {
  name: string;
  description: string;
  id: string;
}

interface Node {
  id: string;
  data: {
    name: string;
    description: string;
    fields: Field[];
  };
  position: {
    x: number;
    y: number;
  };
  type?: string | "textUpdater";
}

interface ActionType {
  type: string;
  nodePayload?: {
    node?: Node;
    edge?: any[];
  };
  fieldPayload?: {
    nodeId: string;
    field: Field;
    index: number;
    replaceNode: boolean;
  };
}

interface NodeState {
  nodes: Node[];
  edges: any;
  isSidePanelOpen: boolean;
  currentNodeId: string | null;
  fieldIndex: number;
  replaceNode: boolean;
  undoStack?: ActionType[] | undefined;
  redoStack?: ActionType[] | undefined;
  cursorPointer?: boolean;
}

const initialState: NodeState = {
  nodes: [],
  edges: [],
  isSidePanelOpen: false,
  currentNodeId: null,
  fieldIndex: 0,
  replaceNode: false,
  undoStack: [],
  redoStack: [],
  cursorPointer: false,
};

const nodesSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {
    setNodes: (
      state,
      action: PayloadAction<{ nodes: any[]; edges: any[] }>
    ) => {
      const { nodes, edges } = action.payload;
      state.nodes = nodes;
      state.edges = edges;
    },
    setCursorType:(state,action:PayloadAction<{cursorPointer:boolean}>)=>{
      state.cursorPointer = action.payload.cursorPointer;
    },
    addFieldToNode: (
      state,
      action: PayloadAction<{
        nodeId: string;
        field: Field;
        index: number;
        replaceNode: boolean;
        type: string;
      }>
    ): void => {
      const { nodeId, field, index, replaceNode, type } = action.payload;
      const node = state.nodes.find((node) => node.id === nodeId);
      if (node) {
        if (nodeId.startsWith("p") && !replaceNode) {
          state.nodes.forEach((node: any) => {
            if (node.id !== nodeId) {
              node.position = { ...node.position, y: node.position.y + 50 };
            }
          });
        }

        if (!replaceNode) {
          const leftFields = node.data.fields.slice(0, index + 1);
          const rightFields = node.data.fields.slice(index + 1);
          const updatedFields = [...leftFields, field, ...rightFields];
          node.data.fields = updatedFields;
        } else {
          // replace the field
          node.data.fields[index] = field;
        }
      }

      if (type === "ADD_FIELD" && state.undoStack && state.redoStack) {
        state.undoStack.push({
          type,
          fieldPayload: { nodeId, field, index, replaceNode },
        });
        // state.redoStack = [];
      }
    },
    updateNodeFields: (
      state,
      action: PayloadAction<{ nodeId: string; fields: Field[] }>
    ) => {
      const { nodeId, fields } = action.payload;
      const node = state.nodes.find((node) => node.id === nodeId);
      if (node) {
        node.data.fields = fields;
      }
    },
    openSidePanel: (
      state,
      action: PayloadAction<{
        nodeId: string;
        index: number;
        replaceNode?: boolean;
      }>
    ) => {
      if (action.payload.replaceNode) {
        state.replaceNode = action.payload.replaceNode;
      }
      state.isSidePanelOpen = true;
      state.fieldIndex = action.payload.index;
      state.currentNodeId = action.payload.nodeId;
    },
    sidePanelWithEditButton: (state) => {
      state.isSidePanelOpen = !state.isSidePanelOpen;
    },
    closeSidePanel: (state) => {
      state.replaceNode = false;
      state.isSidePanelOpen = false;
      state.currentNodeId = null;
    },
    deleteSitemap: (state) => {
      const parentNode = state.nodes.find((node: any) => node.id === "pnode-1");
      if (parentNode) {
        parentNode.data.fields = [];
      }
      state.nodes = [];
      state.edges = [];
      if (parentNode) {
        state.nodes.push(parentNode);
      }
    },
    duplicateNode: (state, action: PayloadAction<{ nodeId: string }>) => {
      const { nodeId } = action.payload;
      const leftMostNode = state.nodes.reduce((acc, node) => {
        if (node.position.x < acc.position.x) {
          return node;
        }
        return acc;
      });
      const currNode = state.nodes.find((node) => node.id === nodeId);
      if (currNode) {
        if (nodeId.startsWith("p")) {
          const newNode = {
            ...currNode,
            id: `node-${state.nodes.length + 1}`,
            position: {
              x: leftMostNode.position.x - 300,
              y: leftMostNode.position.y,
            },
          };

          const newEdge = {
            id: `edge-${nodeId}-copy`,
            source: nodeId,
            target: `${newNode.id}`,
            type: "smoothstep",
          };

          state.nodes.push(newNode);
          state.edges.push(newEdge);
        } else {
          // from the current node shift all the nodes to the left

          state.nodes.forEach((node: any) => {
            if (currNode.position.x > node.position.x) {
              node.position = { ...node.position, x: node.position.x - 300 };
            }
          });

          const newNode = {
            ...currNode,
            id: `node-${state.nodes.length + 1}`,
            position: {
              x: currNode.position.x - 300,
              y: currNode.position.y,
            },
          };

          const sourceEdge = state.edges.find(
            (edge: any) => edge.target === nodeId
          );

          const newEdge = {
            id: `edge-${nodeId}-copy`,
            source: sourceEdge.source,
            target: `${newNode.id}`,
            type: "smoothstep",
          };

          state.nodes.push(newNode);
          state.edges.push(newEdge);
        }
      }
    },
    setNodesToStack: (
      state,
      action: PayloadAction<{ node: any; edge: any; type?: string }>
    ) => {
      const { node, edge, type } = action.payload;
      if (type) {
        state.undoStack?.push({
          type,
          nodePayload: { node: node, edge: edge },
        });
      }
    },
    undo: (state) => {
      if (state.undoStack && state.undoStack.length > 0) {
        const action = state.undoStack.pop();
        if (action?.type === "ADD_FIELD") {
          if (state.redoStack) state.redoStack.push(action);
          const node = state.nodes.find(
            (node) => node.id === action.fieldPayload?.nodeId
          );
          if (node) {
            const fieldIndex = node.data.fields.findIndex(
              (f) => f.id === action.fieldPayload?.field.id
            );
            if (fieldIndex !== -1) {
              const updatedFields = [
                ...node.data.fields.slice(0, fieldIndex),
                ...node.data.fields.slice(fieldIndex + 1),
              ];
              node.data.fields = updatedFields;
            }
          }
        } else {
          const removedNode = state.nodes.find(
            (node) => node.id === action?.nodePayload?.node?.id
          );
          const removedNodesX = removedNode?.position?.x ?? 0;
          const removedNodesY = removedNode?.position?.y ?? 0;

          if (action?.type === "ADD_NODE_LEFT") {
            if (state.redoStack) state.redoStack.push(action);
            state.nodes = state.nodes.filter(
              (node) => node.id !== action?.nodePayload?.node?.id
            );

            state.edges = state.edges.filter(
              (edge: any) => edge.target !== action?.nodePayload?.node?.id
            );

            state.nodes.forEach((node) => {
              if (node.position.x < removedNodesX) {
                node.position.x += 300;
              }
            });
          } else if (action?.type === "ADD_NODE_RIGHT") {
            if (state.redoStack) state.redoStack.push(action);
            state.nodes = state.nodes.filter(
              (node) => node.id !== action?.nodePayload?.node?.id
            );

            state.edges = state.edges.filter(
              (edge: any) => edge.target !== action?.nodePayload?.node?.id
            );

            state.nodes.forEach((node) => {
              if (node.position.x > removedNodesX) {
                node.position.x -= 300; 
              }
            });
          } else if (action?.type === "ADD_NODE_BELOW") {
            if (state.redoStack) state.redoStack.push(action);
            state.nodes = state.nodes.filter(
              (node) => node.id !== action?.nodePayload?.node?.id
            );
            state.edges = state.edges.filter(
              (edge: any) => edge.target !== action?.nodePayload?.node?.id
            );
            state.nodes.forEach((node) => {
              if (node.position.y > removedNodesY) {
                node.position.y -= 100; // Adjust the y position upwards
              }
            });
          }
        }
      }
    },
    redo: (state) => {
      if (state.redoStack && state.redoStack.length > 0) {
        const action = state.redoStack.pop();
        if (action?.type === "ADD_FIELD") {
          if (state.undoStack) state.undoStack.push(action);
          const node = state.nodes.find(
            (node) => node.id === action.fieldPayload?.nodeId
          );
          if (node) {
            const fieldIndex = action.fieldPayload?.index || 0;
            const replaceNode = action.fieldPayload?.replaceNode || false;
            if (replaceNode) {
              node.data.fields[fieldIndex] = action.fieldPayload?.field!;
            } else {
              const updatedFields = [
                ...node.data.fields.slice(0, fieldIndex + 1),
                action.fieldPayload?.field!,
                ...node.data.fields.slice(fieldIndex + 1),
              ];
              node.data.fields = updatedFields;
            }
          }
        } else {
          const removedNode = state.nodes.find(
            (node) => node.id === action?.nodePayload?.node?.id
          );
          const removedNodesX = removedNode?.position?.x ?? 0;
          const removedNodesY = removedNode?.position?.y ?? 0;
          if (action?.type === "ADD_NODE_LEFT") {
            if (state.undoStack) state.undoStack.push(action);

            state.nodes.push(action.nodePayload?.node!);
            state.edges.push(action.nodePayload?.edge!);

            const addedNodePositionX = action.nodePayload?.node?.position.x ?? 0;
            
            state.nodes.forEach((node) => {
              if (node.position.x <= addedNodePositionX) {
                node.position.x -= 300; 
              }
            });
          }else if(action?.type === "ADD_NODE_RIGHT") {
            if (state.undoStack) state.undoStack.push(action);

            state.nodes.push(action.nodePayload?.node!);
            state.edges.push(action.nodePayload?.edge!);

            const addedNodePositionX = action.nodePayload?.node?.position.x ?? 0;
            
            state.nodes.forEach((node) => {
              if (node.position.x >= addedNodePositionX) {
                node.position.x += 300; 
              }
            });
          }else if (action?.type === "ADD_NODE_BELOW") {
            if (state.undoStack) state.undoStack.push(action);

            state.nodes.push(action.nodePayload?.node!);
            state.edges.push(action.nodePayload?.edge!);

            const addedNodePositionY = action.nodePayload?.node?.position.y ?? 0;
            
            state.nodes.forEach((node) => {
              if (node.position.y > addedNodePositionY) {
                node.position.y += 100; 
              }
            });
          }
        }
      }
    },
  },
});

export const {
  setNodes,
  setCursorType,
  addFieldToNode,
  openSidePanel,
  closeSidePanel,
  updateNodeFields,
  deleteSitemap,
  sidePanelWithEditButton,
  duplicateNode,
  setNodesToStack,
  undo,
  redo,
} = nodesSlice.actions;

export const checkReplaceNode = (state: RootState) => state.nodes.replaceNode;
export const selectCurrentNodeId = (state: RootState) =>
  state.nodes.currentNodeId;
export const getFieldIndex = (state: RootState) => state.nodes.fieldIndex;
export const selectIsSidePanelOpen = (state: RootState) =>
  state.nodes.isSidePanelOpen;
export const selectFieldsByNodeId = (state: RootState, nodeId: string) => {
  const node = state.nodes.nodes.find((node) => node.id === nodeId);
  return node ? node.data.fields : [];
};

export default nodesSlice.reducer;
