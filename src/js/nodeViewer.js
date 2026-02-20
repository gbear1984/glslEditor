(function () {
    var workspace = document.getElementById('workspace');
    var connectionsSvg = document.getElementById('connections');
    var nextId = 1;
    var pendingSource = null;
    var links = [];

    function drawLinks() {
        connectionsSvg.innerHTML = '';
        links.forEach(function (link) {
            var sourceNode = document.getElementById(link.from);
            var targetNode = document.getElementById(link.to);

            if (!sourceNode || !targetNode) {
                return;
            }

            var startX = sourceNode.offsetLeft + sourceNode.offsetWidth;
            var startY = sourceNode.offsetTop + sourceNode.offsetHeight / 2;
            var endX = targetNode.offsetLeft;
            var endY = targetNode.offsetTop + targetNode.offsetHeight / 2;
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            var midX = (startX + endX) / 2;

            path.setAttribute('d', 'M ' + startX + ' ' + startY + ' C ' + midX + ' ' + startY + ', ' + midX + ' ' + endY + ', ' + endX + ' ' + endY);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', '#58a6ff');
            path.setAttribute('stroke-width', '2.5');
            connectionsSvg.appendChild(path);
        });
    }

    function makeDraggable(node, handle) {
        handle.addEventListener('mousedown', function (event) {
            var startX = event.clientX;
            var startY = event.clientY;
            var originX = node.offsetLeft;
            var originY = node.offsetTop;

            function move(moveEvent) {
                node.style.left = originX + (moveEvent.clientX - startX) + 'px';
                node.style.top = originY + (moveEvent.clientY - startY) + 'px';
                drawLinks();
            }

            function up() {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            }

            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });
    }

    function createNode(kind) {
        var id = 'node-' + nextId++;
        var node = document.createElement('section');
        node.className = 'node' + (kind === 'group' ? ' group' : '');
        node.id = id;
        node.style.left = (300 + Math.random() * 260) + 'px';
        node.style.top = (90 + Math.random() * 260) + 'px';

        var header = document.createElement('header');
        header.className = 'node-header';
        header.innerHTML = '<span>' + kind.toUpperCase() + ' #' + id.split('-')[1] + '</span><span>⇲</span>';

        var content = document.createElement('div');
        content.className = 'node-content';

        if (kind === 'image') {
            content.innerHTML = '<input type="file" accept="image/png, image/jpeg">' +
                '<img alt="Image preview" hidden>' +
                '<textarea rows="3" placeholder="Comment on this image"></textarea>';
            var fileInput = content.querySelector('input');
            var img = content.querySelector('img');
            fileInput.addEventListener('change', function (event) {
                var file = event.target.files[0];

                if (!file) {
                    return;
                }

                img.src = URL.createObjectURL(file);
                img.hidden = false;
            });
        }
        else if (kind === 'text') {
            content.innerHTML = '<input type="text" placeholder="Title">' +
                '<textarea rows="7" placeholder="Notes / comments"></textarea>';
        }
        else {
            content.innerHTML = '<input type="text" placeholder="Group label">' +
                '<textarea rows="6" placeholder="What belongs in this group?"></textarea>';
        }

        var actions = document.createElement('div');
        actions.className = 'actions';

        var setSource = document.createElement('button');
        setSource.textContent = 'Connect from';
        setSource.addEventListener('click', function () {
            pendingSource = node.id;
            setSource.textContent = 'Source selected';
            setTimeout(function () {
                setSource.textContent = 'Connect from';
            }, 800);
        });

        var connectTo = document.createElement('button');
        connectTo.textContent = 'Connect to this';
        connectTo.addEventListener('click', function () {
            if (!pendingSource || pendingSource === node.id) {
                return;
            }

            links.push({
                from: pendingSource,
                to: node.id
            });
            pendingSource = null;
            drawLinks();
        });

        actions.appendChild(setSource);
        actions.appendChild(connectTo);
        content.appendChild(actions);

        node.appendChild(header);
        node.appendChild(content);
        workspace.appendChild(node);
        makeDraggable(node, header);
        drawLinks();
    }

    document.getElementById('add-image').addEventListener('click', function () {
        createNode('image');
    });

    document.getElementById('add-text').addEventListener('click', function () {
        createNode('text');
    });

    document.getElementById('add-group').addEventListener('click', function () {
        createNode('group');
    });

    createNode('image');
    createNode('text');
}());
