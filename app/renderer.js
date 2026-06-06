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

function acceptSetup() {
    document.getElementById('setup-agreement').classList.add('hidden');
    document.getElementById('launcher').classList.remove('hidden');
}

// --- API & Monitoring ---

async function fetchHW() {
    try {
        const response = await fetch('http://127.0.0.1:8000/hardware');
        const data = await response.json();
        document.getElementById('cpu-stat').innerText = data.cpu_usage + " %";
        document.getElementById('cpu-fill').style.width = data.cpu_usage + "%";
        document.getElementById('ram-stat').innerText = data.specs.ram_total_gb + " GB";
        document.getElementById('gpu-stat').innerText = data.specs.gpus.length > 0 ? data.specs.gpus[0].name : "NO GPU DETECTED";
    } catch (e) {}
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
setInterval(fetchHW, 3000);
fetchHW();
