let nodes = [];
let connections = [];
let isConnecting = false;
let startPort = null;

// --- Node Builder Logic ---

function addNode(type) {
    const id = 'node-' + Date.now();
    const x = 50 + (nodes.length * 180) % 600;
    const y = 100 + (Math.floor(nodes.length / 3) * 120);
    const nodeObj = { id, type, x, y };
    nodes.push(nodeObj);

    const nodeEl = document.createElement('div');
    nodeEl.className = 'node-element';
    nodeEl.id = id;
    nodeEl.style.left = nodeObj.x + 'px';
    nodeEl.style.top = nodeObj.y + 'px';
    nodeEl.innerHTML = `
        <div class="node-header">${type}</div>
        <div style="font-size: 0.7rem; color: var(--text-mid);">ID: ${id.slice(-4)}</div>
        <div class="node-port port-in" data-node="${id}" data-type="in"></div>
        <div class="node-port port-out" data-node="${id}" data-type="out"></div>
    `;

    makeDraggable(nodeEl);
    nodeEl.querySelectorAll('.node-port').forEach(port => {
        port.onmousedown = (e) => startConnection(e, port);
    });

    document.getElementById('node-placeholder').style.display = 'none';
    document.getElementById('node-canvas').appendChild(nodeEl);
}

function clearNodes() {
    nodes = [];
    connections = [];
    document.getElementById('node-canvas').innerHTML = `
        <svg id="node-lines"></svg>
        <p id="node-placeholder" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: var(--text-low);"><i class="fas fa-plus"></i> Add nodes to start building</p>
    `;
}

function makeDraggable(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    el.onmousedown = (e) => {
        if (e.target.classList.contains('node-port')) return;
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = () => {
            document.onmouseup = null;
            document.onmousemove = null;
        };
        document.onmousemove = (e) => {
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
            drawConnections();
        };
    };
}

function startConnection(e, port) {
    e.stopPropagation();
    isConnecting = true;
    startPort = port;

    document.onmousemove = (e) => {
        const canvas = document.getElementById('node-canvas').getBoundingClientRect();
        const startRect = startPort.getBoundingClientRect();
        const x1 = startRect.left + 6 - canvas.left;
        const y1 = startRect.top + 6 - canvas.top;
        const x2 = e.clientX - canvas.left;
        const y2 = e.clientY - canvas.top;

        updateTempLine(x1, y1, x2, y2);
    };

    document.onmouseup = (e) => {
        const endPort = e.target.classList.contains('node-port') ? e.target : null;
        if (endPort && endPort !== startPort && endPort.dataset.type !== startPort.dataset.type) {
            connections.push({
                from: startPort.dataset.node,
                to: endPort.dataset.node,
                fromType: startPort.dataset.type,
                toType: endPort.dataset.type
            });
        }
        isConnecting = false;
        startPort = null;
        document.onmousemove = null;
        document.onmouseup = null;
        removeTempLine();
        drawConnections();
    };
}

function updateTempLine(x1, y1, x2, y2) {
    let svg = document.getElementById('node-lines');
    let line = document.getElementById('temp-line');
    if (!line) {
        line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        line.id = 'temp-line';
        line.classList.add('connection-line');
        line.style.strokeDasharray = "5,5";
        svg.appendChild(line);
    }
    const d = `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;
    line.setAttribute('d', d);
}

function removeTempLine() {
    const line = document.getElementById('temp-line');
    if (line) line.remove();
}

function drawConnections() {
    const svg = document.getElementById('node-lines');
    const canvas = document.getElementById('node-canvas').getBoundingClientRect();

    // Clear existing paths except temp
    svg.querySelectorAll('.connection-line:not(#temp-line)').forEach(l => l.remove());

    connections.forEach(conn => {
        const fromEl = document.getElementById(conn.from);
        const toEl = document.getElementById(conn.to);
        if (!fromEl || !toEl) return;

        const fromPort = fromEl.querySelector(`.port-${conn.fromType}`);
        const toPort = toEl.querySelector(`.port-${conn.toType}`);

        const r1 = fromPort.getBoundingClientRect();
        const r2 = toPort.getBoundingClientRect();

        const x1 = r1.left + 6 - canvas.left;
        const y1 = r1.top + 6 - canvas.top;
        const x2 = r2.left + 6 - canvas.left;
        const y2 = r2.top + 6 - canvas.top;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add('connection-line');
        const cp1x = x1 + (x2 - x1) / 2;
        const cp2x = x1 + (x2 - x1) / 2;
        const d = `M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`;
        path.setAttribute('d', d);
        svg.appendChild(path);
    });
}

// --- Navigation & Overlays ---

function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.nav-icon').forEach(n => n.classList.remove('active'));

    const targetTab = document.getElementById('tab-' + tab);
    if (targetTab) targetTab.classList.remove('hidden');

    // Find the nav icon that was clicked
    const icons = document.querySelectorAll('.nav-icon');
    icons.forEach(icon => {
        if (icon.getAttribute('onclick').includes(tab)) {
            icon.classList.add('active');
        }
    });
}

function startProject(type) {
    document.getElementById('launcher').classList.add('hidden');
    if (type === 'blank') {
        switchTab('builder');
    }
}

function showLauncher() {
    document.getElementById('launcher').classList.remove('hidden');
    document.getElementById('setup-agreement').classList.add('hidden');
}

async function acceptSetup() {
    const box = document.querySelector('.setup-box');
    const originalHtml = box.innerHTML;

    box.innerHTML = `
        <h1 style="font-size: 2rem;">Installing Professional AI Suite...</h1>
        <p id="setup-status">Starting setup...</p>
        <div style="height: 10px; background: #334155; border-radius: 5px; margin: 20px 0;">
            <div id="setup-progress" style="width: 0%; height: 100%; background: var(--accent); border-radius: 5px; transition: 0.5s;"></div>
        </div>
        <div id="setup-log" style="text-align: left; font-family: monospace; font-size: 0.8rem; color: var(--text-mid); max-height: 150px; overflow-y: auto;"></div>
    `;

    try {
        const response = await fetch('http://127.0.0.1:8000/setup-system', { method: 'POST' });
        const data = await response.json();

        const log = document.getElementById('setup-log');
        const progress = document.getElementById('setup-progress');
        const status = document.getElementById('setup-status');

        for (let i = 0; i < data.steps.length; i++) {
            status.innerText = data.steps[i];
            log.innerHTML += `> ${data.steps[i]}<br>`;
            progress.style.width = ((i + 1) / data.steps.length * 100) + '%';
            await new Promise(r => setTimeout(r, 800)); // Visual spacing
        }

        status.innerHTML = '<span style="color: var(--success);">Setup Complete!</span>';
        await new Promise(r => setTimeout(r, 1000));

        document.getElementById('setup-agreement').classList.add('hidden');
        const launcher = document.getElementById('launcher');
        launcher.classList.remove('hidden');
    } catch (e) {
        box.innerHTML = `<h3>Setup Error</h3><p>Could not connect to backend.</p><button class="btn-pro" onclick="location.reload()">Retry</button>`;
    }
}

// --- API & Monitoring ---
let lossHistory = [];

async function fetchHW() {
    try {
        const response = await fetch('http://127.0.0.1:8000/hardware');
        const data = await response.json();
        document.getElementById('cpu-stat').innerText = data.cpu_usage + " %";
        document.getElementById('cpu-fill').style.width = data.cpu_usage + "%";
        document.getElementById('ram-stat').innerText = data.specs.ram_total_gb + " GB";
        document.getElementById('gpu-stat').innerText = data.specs.gpus.length > 0 ? data.specs.gpus[0].name : "NO GPU DETECTED";

        // Data Pool Stats
        if (data.data_pool) {
            document.getElementById('pool-count').innerText = data.data_pool.file_count + " Files";
            document.getElementById('pool-size').innerText = data.data_pool.total_size_kb + " KB total";
            document.getElementById('pool-readiness').innerText = data.data_pool.status;
            document.getElementById('pool-readiness').style.color = data.data_pool.file_count > 0 ? 'var(--success)' : 'var(--text-mid)';
        }

        // Update Training Chart
        const statusRes = await fetch('http://127.0.0.1:8000/training-status');
        const statusData = await statusRes.json();
        if (statusData.is_training) {
            lossHistory.push(statusData.loss);
            if (lossHistory.length > 50) lossHistory.shift();
            drawChart();
            updateLog(statusData);
        }
    } catch (e) {}
}

function drawChart() {
    const svg = document.getElementById('dashboard-chart');
    if (!svg) return;
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    svg.innerHTML = '';

    if (lossHistory.length < 2) return;

    const maxLoss = Math.max(...lossHistory);
    const minLoss = Math.min(...lossHistory);
    const range = maxLoss - minLoss || 1;

    let points = '';
    lossHistory.forEach((val, i) => {
        const x = (i / (lossHistory.length - 1)) * width;
        const y = height - ((val - minLoss) / range) * (height - 20) - 10;
        points += `${x},${y} `;
    });

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    path.setAttribute('points', points);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'var(--accent)');
    path.setAttribute('stroke-width', '2');
    svg.appendChild(path);
}

function updateLog(status) {
    const log = document.getElementById('train-log');
    if (!log) return;
    const entry = document.createElement('div');
    entry.innerHTML = `<span style="color: var(--text-low)">[EPOCH ${status.epoch}]</span> Loss: <span style="color: white">${status.loss}</span> | System Smoothness: <span style="color: var(--success)">OPTIMAL</span>`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;

    document.getElementById('training-status-badge').innerText = 'TRAINING ACTIVE';
    document.getElementById('training-status-badge').style.color = 'var(--success)';
}

async function startTraining() {
    const type = document.getElementById('model-type').value;
    const throttle = document.getElementById('throttle-slider').value / 100;

    // Send nodes and connections if in builder mode
    const config = {
        type,
        throttle_limit: throttle,
        nodes: nodes.length > 0 ? { nodes, connections } : null
    };

    await fetch('http://127.0.0.1:8000/start-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
    });
    switchTab('training');
    lossHistory = []; // Reset chart for new run
}

async function stopTraining() {
    await fetch('http://127.0.0.1:8000/stop-training', { method: 'POST' });
    document.getElementById('training-status-badge').innerText = 'IDLE';
    document.getElementById('training-status-badge').style.color = 'var(--text-low)';
}

async function runTest() {
    const inputStr = document.getElementById('test-input').value || "0,0,0,0,0,0,0,0,0,0";
    const data = inputStr.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));

    // Ensure exactly 10 inputs for the SimpleModel
    while(data.length < 10) data.push(0);
    const finalData = data.slice(0, 10);

    try {
        const response = await fetch('http://127.0.0.1:8000/test-model', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: finalData })
        });
        const result = await response.json();
        document.getElementById('test-result').innerText = `Result: ${result.prediction.toFixed(4)}`;
        addChatBubble(`Model Test Success: Predicted value is ${result.prediction.toFixed(4)}`, 'var(--success)');
    } catch (e) {
        document.getElementById('test-result').innerText = `Result: Error`;
    }
}

// --- Data Lab Logic ---

async function processData() {
    const path = document.getElementById('data-input').value;
    const res = await fetch('http://127.0.0.1:8000/upload-data?file_path=' + encodeURIComponent(path), { method: 'POST' });
    const data = await res.json();

    const results = document.getElementById('data-results');
    const card = document.createElement('div');
    card.className = 'glass-card';
    card.style.padding = '12px';
    card.innerHTML = `
        <div style="font-size: 0.8rem; font-weight: bold; margin-bottom: 8px;">${path.split('/').pop()}</div>
        <div style="font-size: 0.7rem; color: var(--success);"><i class="fas fa-check-circle"></i> ${data.status}</div>
    `;
    results.appendChild(card);
}

async function dataAction(action) {
    const path = document.getElementById('data-input').value;
    const res = await fetch(`http://127.0.0.1:8000/data-action?action=${action}&file_path=` + encodeURIComponent(path), { method: 'POST' });
    const data = await res.json();
    addChatBubble(`Action ${action} completed: ${data.status}`, 'var(--success)');
}

async function sendAiMessage() {
    const input = document.getElementById('ai-input');
    const text = input.value;
    if (!text) return;

    input.value = '';
    addChatBubble(text, 'white');

    try {
        const response = await fetch('http://127.0.0.1:8000/ai-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: text })
        });
        const data = await response.json();
        addChatBubble(data.response, 'var(--accent)');
    } catch (e) {
        addChatBubble("Error connecting to local AI.", 'var(--warning)');
    }
}

function addChatBubble(text, color) {
    const chat = document.getElementById('ai-chat');
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.style.borderLeftColor = color;
    bubble.innerText = text;
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
}

// Init
document.getElementById('ai-input').onkeypress = (e) => { if(e.key === 'Enter') sendAiMessage(); };

// Settings Tab logic
document.getElementById('save-settings').addEventListener('click', async () => {
    const licenseKey = document.getElementById('license-key').value;
    try {
        const res = await fetch('http://127.0.0.1:8000/activate-license', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: licenseKey })
        });
        const data = await res.json();
        if (data.status === 'success') {
            showNotification(`${data.tier} License Activated!`);
            document.querySelector('.version-badge').textContent = `v1.0.0-${data.tier}`;
            document.querySelector('.version-badge').style.background = 'var(--accent)';
        } else {
            showNotification(`License error: ${data.error || 'Invalid key'}`);
        }
    } catch (e) {
        showNotification(`Connection error to activation server.`);
    }
});

function showNotification(msg) {
    addChatBubble(`System: ${msg}`, 'var(--accent)');
}

setInterval(fetchHW, 3000);
fetchHW();
