var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf0f0f0 );

var camera = new THREE.PerspectiveCamera(
  50, window.innerWidth / window.innerHeight, 1, 20000
);

var light = new THREE.PointLight( 0xffffff, 0.8 );

camera.add( light );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var anglesCount = 100;
var sphereSize = anglesCount;
var cameraDist = 100;
var spikiness = 0.3;

function makeAngle(offset) {
  var angle = [];
  var radianHorizontal;
  var radianVertical;
  var spike;
  for (var i = 0; i <= sphereSize; i++) {
    radianHorizontal = 2 * Math.PI * offset / anglesCount;
    radianVertical = Math.PI * i / sphereSize - Math.PI / 2;

    spike = sphereSize * spikiness * (0.5 - Math.random());

    angle.push(
      new THREE.Vector3(
        (sphereSize + spike) * Math.cos(radianHorizontal) * Math.cos(radianVertical),
        (sphereSize + spike) * Math.sin(radianHorizontal) * Math.cos(radianVertical),
        (sphereSize + spike) * Math.sin(radianVertical),
      )
    )
  }
  return angle;
}

var faces = [];
var vertices = [];
var angles = [];
for (var i = 0; i < anglesCount; i++) {
  angles.push(makeAngle(i));
}
angles.push(angles[0]);

function makePairSurface(faces, offset, leftLength, rightLength) {
  for (var i = 0; i < leftLength - 1; i++) {
    faces.push(
      new THREE.Face3(
        offset + i+1,
        offset + i,
        offset + (leftLength-1) + Math.min(rightLength, i + 1)
      )
    )
  }
  for (var i = 0; i < rightLength - 1; i++) {
    faces.push(
      new THREE.Face3(
        offset + Math.min(leftLength - 1, i+1),
        offset + leftLength + i,
        offset + leftLength + i+1)
    )
  }
}

function triangulate(faces, vertices, angles) {
  var left, right, leftLength, rightLength;
  var offset = 0;
  for (var i = 0; i < angles.length-1; i++) {
    left = angles[i];
    leftLength = left.length;

    right = angles[i+1];
    rightLength = right.length;

    Array.prototype.push.apply(vertices, left)

    makePairSurface(faces, offset, leftLength, rightLength);

    offset += leftLength;
  }
  Array.prototype.push.apply(vertices, right)
}

triangulate(faces, vertices, angles);

var geometry = new THREE.Geometry();
geometry.vertices = vertices;
geometry.faces = faces;
geometry.computeFaceNormals();

var mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial({
  side: THREE.DoubleSide,
  opacity: 0.1,
  transparent: true
}));
scene.add( mesh );

var wireframe = new THREE.WireframeGeometry( geometry );

var line = new THREE.LineSegments( wireframe );
line.material.depthTest = true;
line.material.opacity = 0.5;
line.material.transparent = true;

scene.add( line );

camera.position.z = cameraDist;

function animate() {
  requestAnimationFrame( animate );
  controls.update();
  renderer.render( scene, camera );
}

var controls = new THREE.OrbitControls( camera );
controls.update();

animate();
