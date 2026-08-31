// ============================================================
// app.js - Lógica principal de la aplicación
// ============================================================

// Elementos del DOM
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const uploadArea = document.getElementById('uploadArea');
const statusBox = document.getElementById('statusBox');
const btnGenerate = document.getElementById('btnGenerate');
const btnReset = document.getElementById('btnReset');
const btnResetAll = document.getElementById('resetAllBtn');
const btnApplyAll = document.getElementById('applyAllBtn');
const loader = document.getElementById('loader');
const downloadHint = document.getElementById('downloadHint');

// Estado
let imageDataURL = null;
let selectedFile = null;

// ===== FUNCIONES DE LOG =====
function log(msg, type = 'info') {
    statusBox.textContent = msg;
    statusBox.className = 'status-box';
    if (type === 'success') statusBox.classList.add('success');
    if (type === 'error') statusBox.classList.add('error');
}

// ===== CARGAR SKIN =====
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        log('❌ No es una imagen válida.', 'error');
        return;
    }
    
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = function(ev) {
        imageDataURL = ev.target.result;
        const img = new Image();
        img.onload = function() {
            // Guardar imagen para renderizado
            window.skinImage = img;
            fileInfo.textContent = `✅ ${file.name} (${img.width}x${img.height})`;
            uploadArea.classList.add('has-image');
            btnGenerate.disabled = false;
            log('✅ Skin cargada correctamente.', 'success');
            renderPreview();
        };
        img.onerror = function() {
            log('❌ Error al cargar la imagen.', 'error');
        };
        img.src = imageDataURL;
    };
    reader.readAsDataURL(file);
});

uploadArea.addEventListener('click', function(e) {
    if (e.target.tagName !== 'INPUT') fileInput.click();
});

// ===== GENERAR SKIN 4D =====
btnGenerate.addEventListener('click', function() {
    if (!imageDataURL) {
        log('❌ Carga una skin primero.', 'error');
        return;
    }
    
    btnGenerate.disabled = true;
    loader.style.display = 'block';
    log('⏳ Generando modelo 4D...', 'info');
    
    generateSkinPack(imageDataURL, selectedFile ? selectedFile.name : 'skin')
        .then(content => {
            const nombre = selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "skin4d";
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `4D_${nombre}.mcpack`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            log('🎉 ¡Skin 4D generada con éxito!', 'success');
            downloadHint.style.display = 'block';
            btnGenerate.disabled = false;
            loader.style.display = 'none';
        })
        .catch(error => {
            log(`❌ Error: ${error.message}`, 'error');
            btnGenerate.disabled = false;
            loader.style.display = 'none';
        });
});

// ===== RESETEAR CONTROLES =====
btnResetAll.addEventListener('click', function() {
    PART_NAMES.forEach(key => {
        const p = parts[key];
        p.scale = 1;
        p.inflate = (key.includes('hat') || key.includes('jacket') || key.includes('sleeve') || key.includes('pants')) ? 0.5 : 0;
        p.y = 0;
    });
    
    // Actualizar sliders
    document.querySelectorAll('.control-group input[type="range"]').forEach(input => {
        const part = input.dataset.part;
        const prop = input.dataset.prop;
        let defaultVal = 1;
        if (prop === 'inflate') {
            defaultVal = (part.includes('hat') || part.includes('jacket') || part.includes('sleeve') || part.includes('pants')) ? 0.5 : 0;
        }
        if (prop === 'y') defaultVal = 0;
        input.value = defaultVal;
        
        const labelId = (prop === 'scale' ? 's' : prop === 'inflate' ? 'i' : 'y') + '_' + part;
        const label = document.getElementById(labelId);
        if (label) {
            label.textContent = defaultVal.toFixed(prop === 'scale' ? 2 : 1) + (prop === 'scale' ? 'x' : '');
        }
    });
    
    renderPreview();
    log('🔄 Todos los valores reseteados', 'info');
});

// ===== APLICAR A TODAS LAS PARTES =====
btnApplyAll.addEventListener('click', function() {
    const head = parts.head;
    PART_NAMES.forEach(key => {
        if (key === 'head') return;
        const p = parts[key];
        p.scale = head.scale;
        p.inflate = head.inflate;
        p.y = head.y;
    });
    
    document.querySelectorAll('.control-group input[type="range"]').forEach(input => {
        const part = input.dataset.part;
        const prop = input.dataset.prop;
        const val = parts[part][prop];
        input.value = val;
        
        const labelId = (prop === 'scale' ? 's' : prop === 'inflate' ? 'i' : 'y') + '_' + part;
        const label = document.getElementById(labelId);
        if (label) {
            label.textContent = val.toFixed(prop === 'scale' ? 2 : 1) + (prop === 'scale' ? 'x' : '');
        }
    });
    
    renderPreview();
    log('📌 Valores aplicados a todas las partes', 'success');
});

// ===== REINICIAR APP =====
btnReset.addEventListener('click', function() {
    selectedFile = null;
    imageDataURL = null;
    window.skinImage = null;
    fileInput.value = '';
    uploadArea.classList.remove('has-image');
    fileInfo.textContent = 'Ninguna skin cargada';
    btnGenerate.disabled = true;
    downloadHint.style.display = 'none';
    loader.style.display = 'none';
    log('✨ App reiniciada. Carga una skin.', 'info');
    renderPreview();
});

// ===== INICIALIZAR =====
log('🎮 Listo. Carga tu skin y ajusta los parámetros.', 'info');
renderPreview();
