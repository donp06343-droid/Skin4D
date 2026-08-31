// ============================================================
// render.js - Renderizado de la vista previa 3D isométrica
// ============================================================

const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');
let skinImage = null;
let isRendering = false;

function renderPreview() {
    if (isRendering) return;
    isRendering = true;
    
    ctx.clearRect(0, 0, 300, 300);
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, 300, 300);
    
    if (!skinImage) {
        ctx.fillStyle = '#21262d';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Carga una skin', 150, 150);
        isRendering = false;
        return;
    }
    
    const cx = 150, cy = 160, s = 5.5;
    
    DRAW_ORDER.forEach(key => {
        const p = parts[key];
        if (!p) return;
        
        const isoX = cx + (p.x - p.z) * s * 0.7;
        const isoY = cy + (p.x + p.z) * s * 0.4 - p.y * s * 0.8;
        
        const w = p.w * p.scale * s * 0.7;
        const h = p.h * p.scale * s * 0.8;
        const d = p.d * p.scale * s * 0.4;
        const infl = p.inflate * s * 0.3;
        
        ctx.save();
        ctx.translate(isoX, isoY);
        
        // Sombra
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 8;
        
        // Obtener textura de la skin
        const imgData = getTextureRegion(p.uv[0], p.uv[1], p.w, p.h);
        if (imgData) {
            ctx.drawImage(imgData, -w/2 - infl, -h/2 - infl, w + infl*2, h + infl*2);
        } else {
            ctx.fillStyle = '#444';
            ctx.fillRect(-w/2 - infl, -h/2 - infl, w + infl*2, h + infl*2);
        }
        
        // Lado derecho (sombra)
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.moveTo(w/2 + infl, -h/2 - infl);
        ctx.lineTo(w/2 + infl + d/2, -h/2 - infl - d/4);
        ctx.lineTo(w/2 + infl + d/2, h/2 + infl - d/4);
        ctx.lineTo(w/2 + infl, h/2 + infl);
        ctx.closePath();
        ctx.fill();
        
        // Parte superior (luz)
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.beginPath();
        ctx.moveTo(-w/2 - infl, -h/2 - infl);
        ctx.lineTo(-w/2 - infl + d/4, -h/2 - infl - d/4);
        ctx.lineTo(w/2 + infl + d/4, -h/2 - infl - d/4);
        ctx.lineTo(w/2 + infl, -h/2 - infl);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    });
    
    isRendering = false;
}

function getTextureRegion(ux, uy, w, h) {
    if (!skinImage) return null;
    try {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = h;
        const tCtx = tempCanvas.getContext('2d');
        tCtx.drawImage(skinImage, ux, uy, w, h, 0, 0, w, h);
        return tempCanvas;
    } catch(e) {
        return null;
    }
}

// Exponer función para que otros scripts la usen
window.renderPreview = renderPreview;
window.skinImage = skinImage;
