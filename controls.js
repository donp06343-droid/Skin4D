// ============================================================
// controls.js - Genera los sliders de control para cada parte
// ============================================================

function buildControls() {
    const container = document.getElementById('controlsContainer');
    container.innerHTML = '';
    
    PART_NAMES.forEach(key => {
        const p = parts[key];
        const div = document.createElement('div');
        div.className = 'control-group';
        
        div.innerHTML = `
            <div class="part-name">${p.name}</div>
            <div class="slider-row">
                <label>📐</label>
                <input type="range" min="0.5" max="2" step="0.05" 
                       value="${p.scale}" data-part="${key}" data-prop="scale">
                <span class="val" id="s_${key}">${p.scale.toFixed(2)}x</span>
            </div>
            <div class="slider-row">
                <label>💨</label>
                <input type="range" min="-0.5" max="1.5" step="0.05" 
                       value="${p.inflate}" data-part="${key}" data-prop="inflate">
                <span class="val" id="i_${key}">${p.inflate.toFixed(2)}</span>
            </div>
            <div class="slider-row">
                <label>⬆</label>
                <input type="range" min="-2" max="2" step="0.1" 
                       value="${p.y}" data-part="${key}" data-prop="y">
                <span class="val" id="y_${key}">${p.y.toFixed(1)}</span>
            </div>
        `;
        
        container.appendChild(div);
    });
    
    // Asignar eventos a los sliders
    document.querySelectorAll('.control-group input[type="range"]').forEach(input => {
        // Actualizar el valor en tiempo real
        input.addEventListener('input', function() {
            const part = this.dataset.part;
            const prop = this.dataset.prop;
            const val = parseFloat(this.value);
            parts[part][prop] = val;
            
            const labelId = (prop === 'scale' ? 's' : prop === 'inflate' ? 'i' : 'y') + '_' + part;
            const label = document.getElementById(labelId);
            if (label) {
                label.textContent = val.toFixed(prop === 'scale' ? 2 : 1) + (prop === 'scale' ? 'x' : '');
            }
        });
        
        // Renderizar vista previa al soltar el slider (menos lag en móvil)
        input.addEventListener('change', function() {
            if (typeof renderPreview === 'function') {
                renderPreview();
            }
        });
    });
}

// Inicializar controles cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildControls);
} else {
    buildControls();
}
