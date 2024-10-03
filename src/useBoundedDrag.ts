import { useRef } from "react";

const handleTouchMove = (event: TouchEvent) => {
  event.preventDefault();
};

export const useBoundedDrag = (options?: {
  direction?: 'x'|'y'|'',
  threshold?: number,
  range?: {
    x?: { max?: number | 'infinity', min?: number | 'infinity' },
    y?: { max?: number | 'infinity', min?: number | 'infinity' },
  },
  reverseBounds?: boolean,
  onDrag?: (e: React.PointerEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void,
  onDragEnd?: (e: React.PointerEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void,
  onDragStart?: (e: React.PointerEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void,
}) => {

  const dragging = useRef(false);
  const overThreshold = useRef(false);
  const dragXVal = useRef(0);
  const dragYVal = useRef(0);

  const startY = useRef(0);
  const startX = useRef(0);
  const startYPos = useRef(0);
  const startXPos = useRef(0);

  const updatePosition = (element: HTMLElement, left: string, top: string) => {
    requestAnimationFrame(() => {
      element.style.left = left;
      element.style.top = top;
      element.style.position = 'absolute';
    });
  };

  const calcX = (val: number, target: HTMLElement) => {
    let max = options?.range?.x?.max;
    let min = options?.range?.x?.min;

    if (max === 'infinity') {
      max = Infinity;
    } else if (max != null) {
      max = Number(max);
    } else if (target.parentElement) {
      max = options?.reverseBounds ? 0 : (target.parentElement.clientWidth - target.clientWidth);
    } else {
      max = Infinity;
    }

    if (min === 'infinity') {
      min = -Infinity;
    } else if (min != null) {
      min = Number(min);
    } else if (target.parentElement) {
      min = options?.reverseBounds ? (target.parentElement.clientWidth - target.clientWidth) : 0;
    } else {
      min = 0;
    }
    return `${Math.min(max, Math.max(min, val))}px`;
  };

  const calcY = (val: number, target: HTMLElement) => {
    let max = options?.range?.y?.max;
    let min = options?.range?.y?.min;

    if (max === 'infinity') {
      max = Infinity;
    } else if (max != null) {
      max = Number(max);
    } else if (target.parentElement) {
      max = options?.reverseBounds ? 0 : (target.parentElement.clientHeight - target.clientHeight);
    } else {
      max = Infinity;
    }

    if (min === 'infinity') {
      min = -Infinity;
    } else if (min != null) {
      min = Number(min);
    } else if (target.parentElement) {
      min = options?.reverseBounds ? (target.parentElement.clientHeight - target.clientHeight) : 0;
    } else {
      min = 0;
    }
    return `${Math.min(max, Math.max(min, val))}px`;
  };

  const onCommonDragStart = (e: React.PointerEvent<HTMLElement> | React.TouchEvent<HTMLElement>, callback: () => void) => {
    options?.onDragStart && options.onDragStart(e);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    callback();
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'input') return;
    onCommonDragStart(e, () => {
      startY.current = e.currentTarget.offsetTop - e.touches[0].pageY;
      startX.current = e.currentTarget.offsetLeft - e.touches[0].pageX;
      startYPos.current = e.touches[0].pageY;
      startXPos.current = e.touches[0].pageX;
    });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'input') return;
    e.currentTarget.draggable = false;
    onCommonDragStart(e, () => {
      dragging.current = true;
      dragYVal.current = 0;
      dragXVal.current = 0;
    });
  };

  const onTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    options?.onDrag && options.onDrag(e);
    e.currentTarget.draggable = false;
    if (options?.direction === 'x') {
      if (options?.threshold && !overThreshold.current) {
        if (Math.abs(e.changedTouches[0].pageX - startXPos.current) < options.threshold) return;
        overThreshold.current = true;
      }
      const left = calcX(e.changedTouches[0].pageX + startX.current, e.currentTarget);
      updatePosition(e.currentTarget, left, e.currentTarget.style.top);
    } else if (options?.direction === 'y') {
      if (options?.threshold && !overThreshold.current) {
        if (Math.abs(e.changedTouches[0].pageY - startYPos.current) < options.threshold) return;
        overThreshold.current = true;
      }
      const top = calcY(e.changedTouches[0].pageY + startY.current, e.currentTarget);
      updatePosition(e.currentTarget, e.currentTarget.style.left, top);
    } else {
      if (options?.threshold && !overThreshold.current) {
        if (Math.max(Math.abs(e.changedTouches[0].pageX - startXPos.current), Math.abs(e.changedTouches[0].pageY - startYPos.current)) < options.threshold) return;
        overThreshold.current = true;
      }
      const left = calcX(e.changedTouches[0].pageX + startX.current, e.currentTarget);
      const top = calcY(e.changedTouches[0].pageY + startY.current, e.currentTarget);
      updatePosition(e.currentTarget, left, top);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!e.buttons || !dragging.current) return;
    options?.onDrag && options.onDrag(e);
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.draggable = false;
    if (options?.direction === 'x') {
      dragXVal.current += e.movementX;
      if (options?.threshold && !overThreshold.current) {
        if (Math.abs(dragXVal.current) < options.threshold) return;
        overThreshold.current = true;
        e.movementX += dragXVal.current;
      }
      const left = calcX(e.currentTarget.offsetLeft + e.movementX, e.currentTarget);
      updatePosition(e.currentTarget, left, e.currentTarget.style.top);
    } else if (options?.direction === 'y') {
      dragYVal.current += e.movementY;
      if (options?.threshold && !overThreshold.current) {
        if (Math.abs(dragYVal.current) < options.threshold) return;
        overThreshold.current = true;
        e.movementY += dragYVal.current;
      }
      const top = calcY(e.currentTarget.offsetTop + e.movementY, e.currentTarget);
      updatePosition(e.currentTarget, e.currentTarget.style.left, top);
    } else {
      dragXVal.current += e.movementX;
      dragYVal.current += e.movementY;
      if (options?.threshold && !overThreshold.current) {
        if (Math.max(Math.abs(dragYVal.current), Math.abs(dragXVal.current)) < options.threshold) return;
        overThreshold.current = true;
        e.movementX += dragXVal.current;
        e.movementY += dragYVal.current;
      }
      const left = calcX(e.currentTarget.offsetLeft + e.movementX, e.currentTarget);
      const top = calcY(e.currentTarget.offsetTop + e.movementY, e.currentTarget);
      updatePosition(e.currentTarget, left, top);
    }
  };

  const onCommonDragEnd = (e: React.PointerEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
    dragging.current = false;
    overThreshold.current = false;
    dragXVal.current = 0;
    dragYVal.current = 0;
    options?.onDragEnd && options.onDragEnd(e);
    document.removeEventListener('touchmove', handleTouchMove);
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd: onCommonDragEnd,
    onPointerMove,
    onPointerDown,
    onPointerUp: onCommonDragEnd,
  };
};
