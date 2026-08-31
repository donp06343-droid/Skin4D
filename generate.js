// ============================================================
// generate.js - Genera el archivo .mcpack con la skin 4D
// ============================================================

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r = Math.random() * 16 | 0;
        let v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generateSkinPack(imageDataURL, fileName) {
    return new Promise((resolve, reject) => {
        try {
            // Construir bones con los parámetros actuales
            const bones = PART_NAMES.map(key => {
                const p = parts[key];
                const cube = {
                    origin: [-p.w/2 * p.scale, p.y - p.h/2 * p.scale, -p.d/2 * p.scale],
                    size: [p.w * p.scale, p.h * p.scale, p.d * p.scale],
                    uv: p.uv
                };
                if (p.inflate !== 0) cube.inflate = p.inflate;
                return {
                    name: key,
                    pivot: [p.x, p.y, p.z],
                    cubes: [cube]
                };
            });
            
            const geometry = {
                "format_version": "1.16.0",
                "minecraft:geometry": [{
                    "description": {
                        "identifier": "geometry.humanoid.custom",
                        "texture_width": 64,
                        "texture_height": 64,
                        "visible_bounds_width": 3,
                        "visible_bounds_height": 3,
                        "visible_bounds_offset": [0, 0.75, 0]
                    },
                    "bones": bones
                }]
            };
            
            const manifest = {
                "format_version": 2,
                "header": {
                    "description": "Skin 4D personalizada",
                    "name": "Skin 4D Editada",
                    "uuid": generateUUID(),
                    "version": [1, 0, 0],
                    "min_engine_version": [1, 16, 0]
                },
                "modules": [{
                    "type": "skin_pack",
                    "uuid": generateUUID(),
                    "version": [1, 0, 0]
                }]
            };
            
            const skinsJson = {
                "skins": [{
                    "localization_name": "MiSkin4D",
                    "geometry": "geometry.humanoid.custom",
                    "texture": "skin.png",
                    "type": "free"
                }],
                "geometry": "geometry.json",
                "serialize_name": "Skin4D_Editada",
                "localization_name": "Skin4D_Editada"
            };
            
            const zip = new JSZip();
            zip.file("geometry.json", JSON.stringify(geometry, null, 2));
            zip.file("manifest.json", JSON.stringify(manifest, null, 2));
            zip.file("skins.json", JSON.stringify(skinsJson, null, 2));
            
            // Agregar la imagen
            const byteString = atob(imageDataURL.split(',')[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            zip.file("skin.png", new Blob([ab], { type: 'image/png' }));
            
            zip.generateAsync({ type: "blob" }).then(content => {
                resolve(content);
            }).catch(reject);
        } catch (e) {
            reject(e);
        }
    });
}
