"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { Background, Panel, ReactFlowProvider } from "reactflow";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Draggable from "react-draggable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CornerUpLeft,
  CornerUpRight,
  GripVertical,
  MousePointer2,
} from "lucide-react";
import EditPrompt from "./sitemap/assets/EditPrompt";
import Hand from "./sitemap/assets/Hand";
import { Textarea } from "@/components/ui/textarea";
import Line from "./sitemap/assets/Line";
import { useDispatch, useSelector } from "react-redux";
import { redo, setCursorType, undo } from "@/redux/Nodes/nodeSlice";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";

function SitebuilderLayout({ children }: { children: ReactNode }) {

  const dispatch = useDispatch();
  const getCursorType = useSelector((state:RootState) => state.nodes.cursorPointer);
  const [sitemap, setSitemap] = useState(true);
  const route = useRouter();
  const pathName = usePathname();
  useEffect(() => {
    if (pathName === "/sitemap") {
      setSitemap(true);
    } else {
      setSitemap(false);
    }
  }, [pathName]);

  const handleTabValue = (value: string) => {
    if(value === "pointer"){
      dispatch(setCursorType({ cursorPointer: false }));
    }else{
      dispatch(setCursorType({ cursorPointer: true }));
    }
  };

  return (
    <>
      <div style={{ height: "100vh" }} className={`${getCursorType ? "cursor-grab" : "cursor-pointer"}`}>
        <ReactFlowProvider>
          <Panel position={"top-center"} className="toggle-container">
            <Tabs defaultValue="sitemap">
              <TabsList>
                <TabsTrigger
                  onClick={() => route.push("/sitemap")}
                  value="sitemap"
                >
                  Sitemap
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => route.push("/wireframe")}
                  value="wirefrme"
                >
                  Wireframe
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </Panel>
          <Panel position="bottom-center">
            <Draggable>
              <div className="cursor-grab w-[400px] rounded-xl px-[8px] py-[10px] flex flex-row justify-start items-center gap-2 bg-white border border-solid ">
                <div>
                  <GripVertical className="text-[#6B778C]" />
                </div>
                <div>
                  <Popover>
                    <PopoverTrigger>
                      <div className="w-[130px] flex flex-row justify-between items-center px-[10px] py-[6px] border border-solid border-[#DC79FF] rounded-sm">
                        <EditPrompt />
                        <span className="bg-gradient-text font-inter text-base font-medium leading-[130%]">
                          Edit prompt
                        </span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="">
                      <Textarea placeholder="Enter prompt here.." />
                      <Button className="mt-2 bg-[#256BFA]" >Send</Button>
                    </PopoverContent>
                  </Popover>
                </div>
                <Line />
                <div className="">
                  <Tabs defaultValue="pointer" className="w-[110px]" onValueChange={handleTabValue}>
                    <TabsList>
                      <TabsTrigger value="pointer">
                        <MousePointer2 className="text-[#6B778C]" />
                      </TabsTrigger>
                      <TabsTrigger value="hand" className="text-[#6B778C]">
                        <Hand />
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <Line />
                <div className="flex flex-row justify-start items-center gap-3">
                  <button onClick={() => dispatch(undo())}>
                    <CornerUpLeft className="text-[#6B778C]" />
                  </button>
                  <button onClick={() => dispatch(redo())}>
                    <CornerUpRight className="text-[#6B778C]" />
                  </button>
                </div>
              </div>
            </Draggable>
          </Panel>
          <Background />
          {children}
        </ReactFlowProvider>
      </div>
    </>
  );
}

export default SitebuilderLayout;
