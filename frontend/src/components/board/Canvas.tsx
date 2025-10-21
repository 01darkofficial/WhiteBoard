"use client";
import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Rect } from "react-konva";
import Konva from "konva";
import { useBoardElementsStore } from "@/store/boardElementStore";
import { useUserStore } from "@/store/userStore";
import { useToolStore } from "@/store/toolStore";
import { useBoardSocket, emitAddElement } from "@/hooks/useBoardSocket";

interface Stroke {
    points: number[];
    color: string;
    thickness: number;
}

interface Shape {
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    color: string;
    thickness: number;
}

export default function Canvas({ boardId }: { boardId: string }) {
    const stageRef = useRef<any>(null);
    const layerRef = useRef<any>(null);
    const currentLineRef = useRef<any>(null);

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const elements = useBoardElementsStore((s) => s.elements);
    const fetchElements = useBoardElementsStore((s) => s.fetchElements);
    const addElement = useBoardElementsStore((s) => s.addElement);
    const removeElement = useBoardElementsStore((s) => s.removeElement);
    const user = useUserStore((s) => s.user);

    const tool = useToolStore((s) => s.tool);
    const color = useToolStore((s) => s.color);
    const thickness = useToolStore((s) => s.thickness);

    const currentStrokeRef = useRef<Stroke | null>(null);
    const [currentShape, setCurrentShape] = useState<Shape | null>(null);
    const [tempElement, setTempElement] = useState<any | null>(null); // for in-progress shapes
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        if (user && boardId) fetchElements(user, boardId);
    }, [user, boardId]);

    useEffect(() => {
        const updateSize = () =>
            setDimensions({ width: window.innerWidth - 480, height: window.innerHeight - 64 });
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    const boardSocket = useBoardSocket(boardId, {
        onElementAdded: (data) => {
            addElement(user!, data.type, data.element, boardId);
        },
    });

    const getPointer = (e: any) => stageRef.current?.getPointerPosition();

    const handleStart = (e: any) => {
        const pos = getPointer(e);
        if (!pos || !user) return;


        setIsDrawing(true); // <-- start drawing

        if (tool === "pencil") {
            const stroke: Stroke = {
                points: [pos.x, pos.y],
                color,
                thickness,
            };
            currentStrokeRef.current = stroke;
            const line = new Konva.Line({
                points: stroke.points,
                stroke: stroke.color,
                strokeWidth: stroke.thickness,
                lineCap: "round",
                lineJoin: "round",
                tension: 0.5,
            });
            currentLineRef.current = line;
            layerRef.current.add(line);
            layerRef.current.batchDraw();
            setTempElement({ id: "currentStroke", type: "stroke", data: stroke });
        } else if (tool === "circle") {
            const shape = { x: pos.x, y: pos.y, radius: 0, color, thickness };
            setCurrentShape(shape);
            setTempElement({ id: "currentShape", type: "circle", data: shape });
        } else if (tool === "rectangle" || tool === "line") {
            const shape = { x: pos.x, y: pos.y, width: 0, height: 0, color, thickness };
            setCurrentShape(shape);
            setTempElement({ id: "currentShape", type: tool, data: shape });
        }
    };

    const handleMove = (e: any) => {
        if (!isDrawing) return; // <-- only update while drawing
        const pos = getPointer(e);
        if (!pos) return;

        if (tool === "pencil" && currentStrokeRef.current && currentLineRef.current) {
            currentStrokeRef.current.points.push(pos.x, pos.y);
            currentLineRef.current.points(currentStrokeRef.current.points);
            layerRef.current.batchDraw();
            setTempElement({ id: "currentStroke", type: "stroke", data: currentStrokeRef.current });
        } else if (tool === "circle" && currentShape) {
            const dx = pos.x - currentShape.x;
            const dy = pos.y - currentShape.y;
            const updated = { ...currentShape, radius: Math.sqrt(dx * dx + dy * dy) };
            setCurrentShape(updated);
            setTempElement({ id: "currentShape", type: "circle", data: updated });
        } else if ((tool === "rectangle" || tool === "line") && currentShape) {
            const updated = { ...currentShape, width: pos.x - currentShape.x, height: pos.y - currentShape.y };
            setCurrentShape(updated);
            setTempElement({ id: "currentShape", type: tool, data: updated });
        }
    };

    const handleEnd = async () => {
        if (!user) return;

        setIsDrawing(false); // <-- stop drawing

        if (tool === "pencil" && currentStrokeRef.current) {
            await addElement(user, "stroke", { user, type: "stroke", data: currentStrokeRef.current }, boardId);
            if (boardSocket)
                emitAddElement(boardSocket, boardId, { user, type: "stroke", data: currentStrokeRef.current });
            currentStrokeRef.current = null;
            currentLineRef.current = null;
            setTempElement(null);
        } else if (currentShape) {
            const type = tool === "circle" ? "circle" : tool === "rectangle" ? "rectangle" : "line";
            await addElement(user, type, { user, type, data: currentShape }, boardId);
            if (boardSocket)
                emitAddElement(boardSocket, boardId, { user, type, data: currentShape });
            setCurrentShape(null);
            setTempElement(null);
        }
    };

    const handleElementClick = async (elId: string) => {
        if (!user) return;
        if (tool === "eraser") {
            await removeElement(user, boardId, elId);
            if (boardSocket) {
                emitAddElement(boardSocket, boardId, { user, type: "erase", elementId: elId });
            }
        }
    };

    return (
        <div className="flex-1 flex justify-center items-center p-2 bg-gray-50">
            <Stage
                width={dimensions.width}
                height={dimensions.height}
                ref={stageRef}
                className="bg-white rounded-lg shadow-lg border border-gray-300"
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                onMouseLeave={handleEnd}
            >
                <Layer ref={layerRef}>
                    {[...elements, ...(tempElement ? [tempElement] : [])].map((el, i) => {
                        if (el.type === "stroke") {
                            return (
                                <Line
                                    key={i}
                                    points={el.data.points}
                                    stroke={el.data.color}
                                    strokeWidth={el.data.thickness}
                                    tension={0.5}
                                    lineCap="round"
                                    lineJoin="round"
                                    onClick={() => handleElementClick(el._id)}
                                />
                            );
                        } else if (el.type === "circle") {
                            return (
                                <Circle
                                    key={i}
                                    x={el.data.x}
                                    y={el.data.y}
                                    radius={el.data.radius}
                                    stroke={el.data.color}
                                    strokeWidth={el.data.thickness}
                                    onClick={() => handleElementClick(el._id)}
                                />
                            );
                        } else if (el.type === "rectangle") {
                            return (
                                <Rect
                                    key={i}
                                    x={el.data.x}
                                    y={el.data.y}
                                    width={el.data.width}
                                    height={el.data.height}
                                    stroke={el.data.color}
                                    strokeWidth={el.data.thickness}
                                    onClick={() => handleElementClick(el._id)}
                                />
                            );
                        } else if (el.type === "line") {
                            return (
                                <Line
                                    key={i}
                                    points={[el.data.x, el.data.y, el.data.x + el.data.width, el.data.y + el.data.height]}
                                    stroke={el.data.color}
                                    strokeWidth={el.data.thickness}
                                    lineCap="round"
                                    onClick={() => handleElementClick(el._id)}
                                />
                            );
                        }
                    })}
                </Layer>
            </Stage>
        </div>
    );
}
