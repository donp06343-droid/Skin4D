// ============================================================
// parts.js - Definición de las partes del modelo 3D
// ============================================================

const parts = {
    head: {
        name: 'Cabeza',
        x: 0, y: 24, z: 0,
        w: 8, h: 8, d: 8,
        inflate: 0,
        scale: 1,
        uv: [0, 0]
    },
    hat: {
        name: 'Sombrero',
        x: 0, y: 24, z: 0,
        w: 8, h: 8, d: 8,
        inflate: 0.5,
        scale: 1,
        uv: [32, 0]
    },
    body: {
        name: 'Cuerpo',
        x: 0, y: 12, z: 0,
        w: 8, h: 12, d: 4,
        inflate: 0,
        scale: 1,
        uv: [16, 16]
    },
    jacket: {
        name: 'Chaqueta',
        x: 0, y: 12, z: 0,
        w: 8, h: 12, d: 4,
        inflate: 0.5,
        scale: 1,
        uv: [16, 16]
    },
    left_arm: {
        name: 'Brazo Izq',
        x: -5, y: 22, z: 0,
        w: 4, h: 12, d: 4,
        inflate: 0,
        scale: 1,
        uv: [40, 16]
    },
    left_sleeve: {
        name: 'Manga Izq',
        x: -5, y: 22, z: 0,
        w: 4, h: 12, d: 4,
        inflate: 0.5,
        scale: 1,
        uv: [40, 16]
    },
    right_arm: {
        name: 'Brazo Der',
        x: 5, y: 22, z: 0,
        w: 4, h: 12, d: 4,
        inflate: 0,
        scale: 1,
        uv: [40, 32]
    },
    right_sleeve: {
        name: 'Manga Der',
        x: 5, y: 22, z: 0,
        w: 4, h: 12, d: 4,
        inflate: 0.5,
        scale: 1,
        uv: [40, 32]
    },
    left_leg: {
        name: 'Pierna Izq',
        x: -2, y: 0, z: 0,
        w: 4, h: 12, d: 4,
        inflate: 0,
        scale: 1,
        uv: [0, 16]
    },
    left_pants: {
        name: 'Pantalón Izq',
        x: -2, y: 0, z: 0,
        w: 4, h: 12, d: 4,
        inflate: 0.5,
        scale: 1,
        uv: [0, 16]
    },
    right_leg: {
        name: 'Pierna Der',
        x: 2, y: 0, z: 0,
        w: 4, h: 12, d: 4,
        inflate: 0,
        scale: 1,
        uv: [0, 32]
    },
    right_pants: {
        name: 'Pantalón Der',
        x: 2, y: 0, z: 0,
        w: 4, h: 12, d: 4,
        inflate: 0.5,
        scale: 1,
        uv: [0, 32]
    }
};

// Orden de dibujo (de atrás hacia adelante)
const DRAW_ORDER = [
    'left_leg', 'left_pants',
    'right_leg', 'right_pants',
    'left_arm', 'left_sleeve',
    'right_arm', 'right_sleeve',
    'body', 'jacket',
    'head', 'hat'
];

// Lista de nombres de partes para los controles
const PART_NAMES = Object.keys(parts);
