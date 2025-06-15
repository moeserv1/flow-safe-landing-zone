
import { useRef, useEffect } from "react";

/**
 * This hook enables basic draggable behavior on desktop devices only.
 * Returns refs and style to be spread on a container, and whether it's dragging.
 */
export function useDraggable(defaultPosition = { x: 0, y: 0 }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const position = useRef({ ...defaultPosition });
  const offset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(".drag-handle")) {
        dragging.current = true;
        offset.current = {
          x: e.clientX - position.current.x,
          y: e.clientY - position.current.y,
        };
        document.body.style.userSelect = "none";
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (dragging.current) {
        position.current = {
          x: e.clientX - offset.current.x,
          y: e.clientY - offset.current.y,
        };
        el.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`;
      }
    };

    const onMouseUp = () => {
      dragging.current = false;
      document.body.style.userSelect = "";
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return { ref };
}
