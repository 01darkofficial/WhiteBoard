"use client";
import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Rect } from "react-konva";
import Konva from "konva";
import { useBoardElementsStore } from "@/store/boardElementStore";
import { useUserStore } from "@/store/userStore";
import { useToolStore } from "@/store/toolStore";
import { ToolType } from "@/store/types";
import { useBoardSocket, emitAddElement } from "@/hooks/useBoardSocket";

interface Stroke {
    points: number[];
    color: string;
    thickness: number;
    isEraser?: boolean;
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
    const user = useUserStore((s) => s.user);

    const tool = useToolStore((s) => s.tool);
    const color = useToolStore((s) => s.color);
    const thickness = useToolStore((s) => s.thickness);

    const currentStrokeRef = useRef<Stroke | null>(null);
    const [currentShape, setCurrentShape] = useState<Shape | null>(null);

    // Fetch existing elements
    useEffect(() => {
        if (user && boardId) fetchElements(user, boardId);
    }, [user, boardId]);

    // Resize canvas
    useEffect(() => {
        const updateSize = () =>
            setDimensions({ width: window.innerWidth - 480, height: window.innerHeight - 64 });
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    // --- Use board-specific socket ---
    const boardSocket = useBoardSocket(boardId, {
        onElementAdded: (data) => {
            addElement(user!, data.type, data.element, boardId);
        },
    });

    const getPointer = (e: any) => stageRef.current?.getPointerPosition();

    const handleStart = (e: any) => {
        const pos = getPointer(e);
        if (!pos || !user) return;

        if (tool === "pencil" || tool === "eraser") {
            const stroke: Stroke = {
                points: [pos.x, pos.y],
                color,
                thickness,
                isEraser: tool === "eraser",
            };
            currentStrokeRef.current = stroke;

            const line = new Konva.Line({
                points: stroke.points,
                stroke: stroke.color,
                strokeWidth: stroke.thickness,
                lineCap: "round",
                lineJoin: "round",
                tension: 0.5,
                globalCompositeOperation: stroke.isEraser ? "destination-out" : "source-over",
            });
            currentLineRef.current = line;
            layerRef.current.add(line);
            layerRef.current.batchDraw();
        } else if (tool === "circle") {
            setCurrentShape({ x: pos.x, y: pos.y, radius: 0, color, thickness });
        } else if (tool === "rectangle" || tool === "line") {
            setCurrentShape({ x: pos.x, y: pos.y, width: 0, height: 0, color, thickness });
        }
    };

    const handleMove = (e: any) => {
        const pos = getPointer(e);
        if (!pos) return;

        if ((tool === "pencil" || tool === "eraser") && currentStrokeRef.current && currentLineRef.current) {
            currentStrokeRef.current.points.push(pos.x, pos.y);
            currentLineRef.current.points(currentStrokeRef.current.points);
            layerRef.current.batchDraw();
        } else if (tool === "circle" && currentShape) {
            const dx = pos.x - currentShape.x;
            const dy = pos.y - currentShape.y;
            setCurrentShape((prev) => prev ? { ...prev, radius: Math.sqrt(dx * dx + dy * dy) } : null);
        } else if ((tool === "rectangle" || tool === "line") && currentShape) {
            setCurrentShape((prev) =>
                prev ? { ...prev, width: pos.x - prev.x, height: pos.y - prev.y } : null
            );
        }
    };

    const handleEnd = async () => {
        if (!user) return;

        if ((tool === "pencil" || tool === "eraser") && currentStrokeRef.current) {
            await addElement(user, "stroke", { user, type: "stroke", data: currentStrokeRef.current }, boardId);
            if (boardSocket) emitAddElement(boardSocket, boardId, { user, type: "stroke", data: currentStrokeRef.current });

            currentStrokeRef.current = null;
            currentLineRef.current = null;
        } else if (currentShape) {
            const type = tool === "circle" ? "circle" : tool === "rectangle" ? "rectangle" : "line";
            await addElement(user, type, { user, type, data: currentShape }, boardId);
            if (boardSocket) emitAddElement(boardSocket, boardId, { user, type, data: currentShape });
            setCurrentShape(null);
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
                    {elements.map((el, i) => {
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
                                    globalCompositeOperation={el.data.isEraser ? "destination-out" : "source-over"}
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
                                />
                            );
                        }
                    })}

                    {/* Current shape */}
                    {currentShape && tool === "circle" && (
                        <Circle
                            x={currentShape.x}
                            y={currentShape.y}
                            radius={currentShape.radius}
                            stroke={currentShape.color}
                            strokeWidth={currentShape.thickness}
                        />
                    )}
                    {currentShape && (tool === "rectangle" || tool === "line") && (
                        <>
                            {tool === "rectangle" && (
                                <Rect
                                    x={currentShape.x}
                                    y={currentShape.y}
                                    width={currentShape.width}
                                    height={currentShape.height}
                                    stroke={currentShape.color}
                                    strokeWidth={currentShape.thickness}
                                />
                            )}
                            {tool === "line" && (
                                <Line
                                    points={[
                                        currentShape.x,
                                        currentShape.y,
                                        currentShape.x + currentShape.width!,
                                        currentShape.y + currentShape.height!,
                                    ]}
                                    stroke={currentShape.color}
                                    strokeWidth={currentShape.thickness}
                                    lineCap="round"
                                />
                            )}
                        </>
                    )}
                </Layer>
            </Stage>
        </div>
    );
}
