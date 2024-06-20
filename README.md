# Gemstone

Gemstone is a small 3D graphics engine that can render basic 3D shapes like cubes, cones, spheres and icosahedrons. This repository contains a demo scene that uses the engine to render basic shapes as well as the code of the engine in the `gemstone` folder.

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Basic setup](#basic-setup)
  - [Drawing the scene](#drawing-the-scene)
  - [Shapes](#shapes)
    - [Box](#box)
    - [Sphere](#sphere)
    - [Icosahedron](#icosahedron)
    - [Cone](#cone)
  - [Adding and removing items from the scene](#adding-and-removing-items-from-the-scene)
  - [Move objects](#move-objects)
  - [Rotate objects](#rotate-objects)
  - [Scale objects](#scale-objects)
  - [Change the drawing mode of an object (wireframe)](#change-the-drawing-mode-of-an-object-wireframe)
  - [Collision Detection](#collision-detection)
  - [Moving and rotating camera](#moving-and-rotating-camera)
  - [Changing the position and the rotation of the lighting](#changing-the-position-and-the-rotation-of-the-lighting)
  - [Changing the projection mode](#changing-the-projection-mode)

## Getting Started

Clone this repository to your desired location.

```bash
git clone https://github.com/vahan-gev/projectgemstone.git
```

Navigate into the folder and install the dependencies.

```bash
cd projectgemstone/
npm install
```

Edit the demo code in `App.js` and run `npm start`

## Usage

### Basic setup

```javascript
const camera = new Camera();
const universe = new Universe(canvas, camera); // You should pass your own canvas element here
const scene = new Scene();
const gl = universe.gl;
```

### Drawing the scene

To draw items in the screen you need some sort of an animation loop. I use `window.requestAnimationFrame` for this. Here is a basic example:

```javascript
const animate = () => {
  universe.draw(scene); // You need this line to tell the engine what to draw
  window.requestAnimationFrame(animate);
};
animate();
```

### Shapes

#### Box

```javascript
/*
    ARGUMENTS:
    1. gl = You will have this variable after the basic setup. It is basically canvas.getContext('webgl');
    2. new Color(r, g, b) = The color of the object
    3. new Vector(x, y, z) = The position of the object
    4. new Vector(x, y, z) = The scale of the object
*/
let box = new Box(
  gl,
  new Color(r, g, b),
  new Vector(x, y, z),
  new Vector(x, y, z)
);
```

#### Sphere

```javascript
/*
    ARGUMENTS:
    1. gl = You will have this variable after the basic setup. It is basically canvas.getContext('webgl');
    2. new Color(r, g, b) = The color of the object
    3. new Vector(x, y, z) = The position of the object
    4. new Vector(x, y, z) = The scale of the object
    5. The fifth argument is the resolution of the sphere (integer). For a smooth sphere I recommend using 20.
*/
let sphere = new Sphere(
  gl,
  new Color(r, g, b),
  new Vector(x, y, z),
  new Vector(x, y, z),
  resolution
);
```

#### Icosahedron

```javascript
/*
    ARGUMENTS:
    1. gl = You will have this variable after the basic setup. It is basically canvas.getContext('webgl');
    2. new Color(r, g, b) = The color of the object
    3. new Vector(x, y, z) = The position of the object
    4. new Vector(x, y, z) = The scale of the object
*/
let icosahedron = new Icosahedron(
  gl,
  new Color(0, 0, 1),
  new Vector(2, 0, 0),
  new Vector(0.5, 0.5, 0.5)
);
```

#### Cone

```javascript
/*
    ARGUMENTS:
    1. gl = You will have this variable after the basic setup. It is basically canvas.getContext('webgl');
    2. new Color(r, g, b) = The color of the object
    3. new Vector(x, y, z) = The position of the object
    4. new Vector(x, y, z) = The scale of the object
    5. The fifth argument is the resolution of the cone (integer). For a smooth cone I recommend using 20.
    6. The sixth argument is the height (integer)
    7. The seventh argument is the radius (integer)
*/
let cone = new Cone(
  gl,
  new Color(r, g, b),
  new Vector(x, y, z),
  new Vector(x, y, z),
  resolution,
  height,
  radius
);
```

### Adding and removing items from the scene

```javascript
// Adding an object to the scene
scene.add(cone);

// Removing an object from the scene
scene.remove(cone);
```

### Move objects

You can move objects using their position property. Example:

```javascript
cone.position.x += x;
cone.position.y -= y;
cone.position.z = z;
cone.position = new Vector(x, y, z);
```

### Rotate objects

You can rotate objects using their rotation property. Example:

```javascript
box.rotation.x += x;
box.rotation.y -= y;
box.rotation.z = z;
box.rotation = new Vector(x, y, z);
```

### Scale objects

You can scale objects using their scale property. Example:

```javascript
sphere.scale.x += x;
sphere.scale.y -= y;
sphere.scale.z = z;
sphere.scale = new Vector(x, y, z);
```

### Change the drawing mode of an object (wireframe)

You can draw objects as solids or wireframes. To do that you can use `box.wireframe = true;`.

### Collision detection

Engine also supports basic collision detection using `collidesWith` function. Usage: 
```javascript
box.collidesWith(sphere); // returns boolean
```

### Moving and rotating camera

You can move and rotate camera to your liking. Example:

```javascript
camera.position = new Vector(x, y, z);
camera.rotation = new Vector(x, y, z);
```

### Changing the position and the rotation of the lighting

```javascript
universe.lightPosition = new Vector(x, y, z);
universe.lightDirection = new Vector(x, y, z);
```

### Changing the projection mode

You can also change the projection mode for the engine. You can either set the projection to `perspective` or `orthographic`. Example:

```javascript
universe.projectionMode = "perspective";
universe.projectionMode = "orthographic";
```
