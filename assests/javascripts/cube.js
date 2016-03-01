$(document).ready(function() {
    function webglAvailable() {
        try {
            var canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }
    if (webglAvailable()) {
        renderer = new THREE.WebGLRenderer();
    } else {
        renderer = new THREE.CanvasRenderer();
    }
    console.log(renderer);
    var three = THREE;
    var scene = new three.Scene();
    var camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    var geometry = new three.BoxGeometry(2, 2, 2);
    // var material = new three.MeshNormalMaterial();
    var material = new three.MeshBasicMaterial({
        color: 0xffffff
    });
    /* */
    /* */
    var cube = new three.Mesh(geometry, material);
    cube.rotation.x = Math.PI / 4;
    cube.rotation.y = Math.PI / 4;
    scene.add(cube);
    camera.position.z = 5;
    /* */
    var isDragging = false;
    var previousMousePosition = {
        x: 0,
        y: 0
    };
    $(renderer.domElement).on('mousedown', function(e) {
        isDragging = true;
    }).on('mousemove', function(e) {
        //console.log(e);
        var deltaMove = {
            x: e.offsetX - previousMousePosition.x,
            y: e.offsetY - previousMousePosition.y
        };
        if (isDragging) {
            var deltaRotationQuaternion = new three.Quaternion().setFromEuler(new three.Euler(toRadians(deltaMove.y * 1), toRadians(deltaMove.x * 1), 0, 'XYZ'));
            cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);
        }
        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });
    /* */
    $(document).on('mouseup', function(e) {
        isDragging = false;
    });
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();
    var lastFrameTime = new Date().getTime() / 1000;
    var totalGameTime = 0;

    function update(dt, t) {
        //console.log(dt, t);
        //camera.position.z += 1 * dt;
        //cube.rotation.x += 1 * dt;
        //cube.rotation.y += 1 * dt;
        setTimeout(function() {
            var currTime = new Date().getTime() / 1000;
            var dt = currTime - (lastFrameTime || currTime);
            totalGameTime += dt;
            update(dt, totalGameTime);
            lastFrameTime = currTime;
        }, 0);
    }

    function render() {
        renderer.render(scene, camera);
        requestAnimFrame(render);
    }
    render();
    update(0, totalGameTime);

    function toRadians(angle) {
        return angle * (Math.PI / 180);
    }

    function toDegrees(angle) {
        return angle * (180 / Math.PI);
    }
});