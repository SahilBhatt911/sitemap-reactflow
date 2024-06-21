import { useCallback, useRef, useState } from "react";
import { Handle, Panel, Position } from "reactflow";
import { Reorder, useDragControls } from "framer-motion";
import { EllipsisVertical, GripVertical, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkReplaceNode,
  deleteSitemap,
  openSidePanel,
  selectFieldsByNodeId,
  updateNodeFields,
  duplicateNode,
} from "@/redux/Nodes/nodeSlice";
import { RootState } from "@/redux/store";

const handleStyle = { left: 10 };

interface HeaderNodeProps {
  id: string;
  data: any;
  isConnectable: any;
}

function CustomNode({ id, data, isConnectable }: HeaderNodeProps) {
  const dispatch = useDispatch();
  const replaceNode = useSelector(checkReplaceNode);
  const fields = useSelector((state: RootState) =>
    selectFieldsByNodeId(state, id)
  );
  const allNodes = useSelector((state: RootState) => state.nodes.nodes);
  const dragControls = useDragControls();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);
  const [optionsClicked, setOptionsClicked] = useState(false);

  const handleOpenSidePanel = useCallback(
    (index: number,replace:boolean) => {
      dispatch(openSidePanel({ nodeId: id, index: index,replaceNode:replace }));
    },
    [dispatch, id]
  );

  const handleDeleteSitemap = useCallback(() => {
    dispatch(deleteSitemap());
    setOptionsClicked(false);
  }, [dispatch]);

  const handleDuplicateNode = useCallback(() => {
    dispatch(duplicateNode({ nodeId: id }));
    setOptionsClicked(false);
  }, [dispatch, id]);

  const handleOptionsClick = () => {
    setOptionsClicked(!optionsClicked);
  };

  return (
    <>
      <div
        className="relative flex justify-between h-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute w-[30px] h-screen -mt-[3px] -left-[35px] top-[355px] transform -translate-y-1/2">
          {isHovered && !id.startsWith("p") && (
            <button
              className="w-[24px] h-[24px] flex justify-center items-center bg-[#346ef1] text-white rounded-full"
              onClick={data.onAddLeft}
            >
              <Plus className="icon w-[15px]" />
            </button>
          )}
        </div>

        <div className="col-span-2 flex flex-col z-[1]">
          <div className="col-start-2 row-start-1 flex justify-center w-[200px]">
            <div className="text-updater-node h-auto border border-[#cbcbcb99] rounded-[10px] bg-[#fcfcfc] relative">
              <header
                className={`pl-[10px] pr-[10px] h-[30px] rounded-t-[10px] ${
                  isHovered ? "bg-[#1E56C8]" : " bg-[#7A869A]"
                }`}
              >
                <div className="flex flex-row justify-between items-center p-[8px]">
                  <h2 className="font-medium text-white text-[12px] leading-[9px]">
                    {data.name}
                  </h2>
                  <button className="text-white" onClick={handleOptionsClick}>
                    <EllipsisVertical className="w-[15px] h-[20px]" />
                  </button>
                </div>
              </header>
              <Handle
                style={{ visibility: "hidden" }}
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
              />
              <div className="flex justify-around p-[8px]">
                {fields.length === 0 ? (
                  <>
                    <button
                      onClick={() => handleOpenSidePanel(0,false)}
                      className="flex flex-row justify-between px-[12px] py-2 w-[200px] bg-white border border-[#cbcbcb99] hover:border-[#DC79FF] border-solid rounded-[4px]"
                    >
                      <span className="text-[#848EA0] text-center font-inter text-base font-medium leading-[21px]">
                        Add Section
                      </span>
                      <Plus className="text-[#848EA0]" />
                    </button>
                  </>
                ) : (
                  <>
                    <Reorder.Group
                      values={fields}
                      onReorder={(newFields) =>
                        dispatch(
                          updateNodeFields({ nodeId: id, fields: newFields })
                        )
                      }
                      style={{ padding: "0px" }}
                    >
                      {fields.map((field: any, index: any) => (
                        <Reorder.Item
                          key={field.id}
                          value={field}
                          className={`flex flex-row gap-[4px] border border-[#cbcbcb99] hover:border-[#DC79FF] border-solid rounded-[4px] bg-white p-2 mt-[7px] h-[60px] w-[200px] ${replaceNode && hoveredFieldId === field.id ? 'border-gradient' : 'border-[#cbcbcb99]'}`}
                          onMouseEnter={() => setHoveredFieldId(field.id)}
                          onMouseLeave={() => setHoveredFieldId(null)}
                          onClick={() => handleOpenSidePanel(index,true)}
                          transition={{ duration: 0 }}
                          dragControls={dragControls}
                        >
                          <div className="flex justify-center items-center w-[24px] ">
                            <GripVertical
                              onPointerDown={(event) =>
                                dragControls.start(event)
                              }
                              className="w-22 h-22 text-[#AEAEAE]"
                            />
                          </div>
                          <div className="flex flex-col">
                            <input
                              style={handleStyle}
                              type="text"
                              defaultValue={field.name}
                              onChange={data.onChange}
                              placeholder="Name"
                              className="text-[#091e42] font-inter font-medium text-base w-[150px]"
                            />
                            <input
                              style={handleStyle}
                              type="text"
                              defaultValue={field.description}
                              onChange={data.onChange}
                              placeholder="Description"
                              className="text-[#5e6c84] font-inter text-base font-normal leading-[150%] w-[150px]"
                            />
                            {hoveredFieldId === field.id && (
                              <button
                                className="w-[24px] h-[24px] rounded-md cursor-pointer mt-[-7px] ml-[50px] bg-[#346ef1] border-none flex justify-center items-center text-white"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleOpenSidePanel(index,false)
                                }}
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </>
                )}
              </div>
              <Handle
                style={{ visibility: "hidden" }}
                type="source"
                position={Position.Bottom}
                id="b"
                isConnectable={isConnectable}
              />
            </div>
          </div>
          <div className="w-[30px] col-start-2 row-start-2 text-center mt-2 ml-[88px]">
            {isHovered && (allNodes.length === 1 || !id.startsWith('p') ) && (
              <button
                className="w-[24px] h-[24px] flex justify-center items-center bg-[#346ef1] text-white rounded-full"
                onClick={data.onAddBelow}
              >
                <Plus className="icon w-[15px]" />
              </button>
            )}
          </div>
        </div>

        <div className="absolute w-[30px] h-screen left-[220px] top-[333px] transform -translate-y-1/2 ">
          {isHovered && !id.startsWith("p") && (
            <button
              className="w-[24px] h-[24px] flex justify-center items-center bg-[#346ef1] text-white rounded-full absolute top-[20px] left-[-10px]"
              onClick={data.onAddRight}
            >
              <Plus className="icon w-[15px]" />
            </button>
          )}
        </div>
      </div>

      {optionsClicked  && (
        <Panel position="top-right" className="imp-zIndex">
          <div className="absolute grid grid-cols-[1fr] justify-items-start p-2 -top-[-25px] left-[-72px] bg-white w-[170px] rounded-md border border-solid border-gray-400">
            <button onClick={handleDuplicateNode} className="p-1  w-full flex flex-row justify-between text-black font-inter text-base font-normal leading-normal">
              <span>Duplicate</span>
              <span>⌘ D</span>
            </button>
            <button onClick={handleDeleteSitemap} className="p-1 w-full flex flex-row justify-between">
              <span className="text-[#FD2929]">Delete</span>{" "}
              <span className="text-[#FD2929]">D</span>
            </button>
            <div className="w-[150px] h-[1px]  bg-gray-500"></div>
            <button className="p-1">View on Wireframe</button>
          </div>
        </Panel>
      )}
    </>
  );
}

export default CustomNode;
