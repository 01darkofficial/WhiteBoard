"use client";
import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import { useBoardElementsStore } from "@/store/boardElementStore";
import { useUserStore } from "@/store/userStore"; // to get the logged-in user

interface Stroke {
    points: number[];
    color: string;
    thickness: number;
}

export default function Canvas({ boardId }: { boardId: string }) {
    const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
    const stageRef = useRef<any>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    // console.log("board: ", boardId);
    const elements = useBoardElementsStore((state) => state.elements);
    const fetchElements = useBoardElementsStore((state) => state.fetchElements);
    const addElement = useBoardElementsStore((state) => state.addElement);
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        if (user && boardId) {
            fetchElements(user, boardId); // fetch all existing strokes for this board
        }
    }, [user, boardId]);

    // Update stage size
    useEffect(() => {
        setDimensions({ width: window.innerWidth - 480, height: window.innerHeight - 64 });
        const handleResize = () => setDimensions({ width: window.innerWidth - 480, height: window.innerHeight - 64 });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getPointer = (e: any) => {
        const stage = stageRef.current;
        if (!stage) return null;
        if (e.evt.touches && e.evt.touches.length > 0) {
            const touch = e.evt.touches[0];
            const rect = stage.container().getBoundingClientRect();
            return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
        }
        return stage.getPointerPosition();
    };

    const handleStart = (e: any) => {
        const point = getPointer(e);
        if (!point) return;
        setCurrentStroke({ points: [point.x, point.y], color: "#000", thickness: 2 });
    };

    const handleMove = (e: any) => {
        if (!currentStroke) return;
        const point = getPointer(e);
        if (!point) return;

        setCurrentStroke((prev) => {
            if (!prev) return null;
            return { ...prev, points: [...prev.points, point.x, point.y] };
        });
    };


    const handleEnd = async () => {
        // console.log("hello0");
        // console.log(user, currentStroke);
        if (!currentStroke || !user) return;
        // console.log("hello");

        // Add stroke to Zustand store (and backend)
        await addElement(user, "stroke", {
            user: user,
            type: "stroke",
            data: currentStroke
        }, boardId);

        setCurrentStroke(null);
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
                <Layer>
                    {elements.map((el, i) => (
                        <Line
                            key={i}
                            points={el.data.points}
                            stroke={el.data.color}
                            strokeWidth={el.data.thickness}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                        />
                    ))}
                    {currentStroke && (
                        <Line
                            points={currentStroke.points}
                            stroke={currentStroke.color}
                            strokeWidth={currentStroke.thickness}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                        />
                    )}
                </Layer>
            </Stage>
        </div>
    );
}
