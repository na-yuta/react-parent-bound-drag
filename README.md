# useBoundedDrag

A React hook that provides drag functionality with configurable boundaries, directions, and thresholds. This hook supports both touch and pointer events, and allows for customizing the drag behavior, including restricting movement to certain axes or ranges.

## Installation
You can install this package via npm:

```bash
npm install react-bounded-drag
```

Or via yarn:
```bash
yarn add react-bounded-drag
```

## Usage
This hook enables draggable elements in React, allowing you to control the drag direction (x, y, or both), set thresholds to prevent small accidental drags, and limit the draggable area.

## Example
```tsx
import React from 'react';
import { useBoundedDrag } from 'react-bounded-drag';  // Import the hook

const DraggableBox = () => {
  const {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onPointerMove,
    onPointerDown,
    onPointerUp,
  } = useBoundedDrag({
    direction: 'both',  // Allow dragging in both X and Y directions
    threshold: 10,  // Minimum threshold before drag starts
    range: {
      x: { min: 0, max: 300 },  // Limit dragging in X axis between 0 and 300 pixels
      y: { min: 0, max: 300 },  // Limit dragging in Y axis between 0 and 300 pixels
    },
    onDrag: (e) => {
      console.log('Dragging...', e);
    },
    onDragStart: (e) => {
      console.log('Drag started', e);
    },
    onDragEnd: (e) => {
      console.log('Drag ended', e);
    },
  });

  return (
    <div
      style={{ width: '400px', height: '400px', border: '1px solid black', position: 'relative' }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          width: '100px',
          height: '100px',
          backgroundColor: 'lightblue',
          position: 'absolute',
        }}
      >
        Drag Me
      </div>
    </div>
  );
};

export default DraggableBox;

```

## Example Explanation
useBoundedDrag Hook: This hook handles both touch and pointer events for dragging. It provides handlers for drag events (onTouchStart, onTouchMove, onPointerDown, etc.) which should be attached to the draggable element.

Direction: The direction prop controls whether the element can be dragged along the 'x', 'y', or 'both' axes. In this example, 'both' allows free movement in both axes.

Threshold: The threshold option sets the minimum distance the user must drag before the drag action begins. In this case, a drag won't start until the user moves the element by 10 pixels.

Range: The range option restricts the draggable area. In this example, the element is limited to moving between 0 and 300 pixels on both the X and Y axes.
If -1 is specified as the max value for either axis, the drag will be unrestricted on that axis.
If no range is specified, the element is constrained to the parent element's boundaries.

## API
Hook: useBoundedDrag
## Arguments
The hook accepts an optional configuration object with the following properties:

|Property  |  Type  |  Default  |  Description|
|:-----------:|:------------:|:------------:|:------------|
|direction  |  'x' \| 'y' \| ''  |  ''  |  Specifies the axis along which the element can be dragged. Empty string means free movement in both directions.|
|threshold  |  number  |  0  |  The minimum distance (in pixels) that must be dragged before the drag starts.|
|range  |  object  |  {}  |  Specifies the boundaries for dragging. Can limit the drag range on both X and Y axes.|
|onDrag  |  function  |  undefined  |  A callback function called during the dragging process.|
|onDragStart  |  function  |  undefined  |  A callback function called when the dragging starts.|
|onDragEnd  |  function  |  undefined  |  A callback function called when the dragging ends.|

### range Object
The range object allows you to specify the boundaries for the draggable element:

```ts
range: {
  x?: { max?: number, min?: number },  // Limits dragging on the X axis
  y?: { max?: number, min?: number },  // Limits dragging on the Y axis
}
```
* x: Specifies the minimum (min) and maximum (max) values for dragging along the X axis.
* y: Specifies the minimum (min) and maximum (max) values for dragging along the Y axis.


## Returned Values
The useBoundedDrag hook returns a set of event handlers that you should attach to the draggable element.

|Handler  |  Description|
|:------------:|:------------|
|onTouchStart  |  Call this on the element's onTouchStart event.|
|onTouchMove  |  Call this on the element's onTouchMove event.|
|onTouchEnd  |  Call this on the element's onTouchEnd event.|
|onPointerDown  |  Call this on the element's onPointerDown event.|
|onPointerMove  |  Call this on the element's onPointerMove event.|
|onPointerUp  |  Call this on the element's onPointerUp event.|


## Example Usage: Direction Control
If you want to restrict the dragging direction to only the X axis, you can configure it like this:

```ts
const { onPointerDown, onPointerMove, onPointerUp } = useBoundedDrag({
  direction: 'x',  // Only allow dragging in the X direction
});
```

Or if you want to restrict it to the Y axis:
```ts
const { onPointerDown, onPointerMove, onPointerUp } = useBoundedDrag({
  direction: 'y',  // Only allow dragging in the Y direction
});
```

## License
This project is licensed under the MIT License.
