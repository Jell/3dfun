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


function makeAngle(offset) {
  var size = 1000;
  var angle = [];
  for (var i = 0; i < size; i++) {
    angle.push(new THREE.Vector3(offset, (i + Math.random() - (size/2))*10, Math.random() * 10))
  }
  return angle;
}

function makePairSurface(faces, offset, leftLength, rightLength) {

  for (var i = 0; i < leftLength - 1; i++) {
    faces.push(
      new THREE.Face3(offset + i+1, offset + i, offset + Math.min(rightLength, i + 1) + leftLength - 1)
    )
  }

  for (var i = 0; i < rightLength - 1; i++) {
    faces.push(
      new THREE.Face3(offset + Math.min(leftLength - 1, i + 1), offset + leftLength + i, offset + leftLength + i + 1)
    )
  }
}

function triangulate(faces, vertices, angles) {
  var left, right, leftLength, rightLength;
  var offset = 0;
  for (var i = 0; i < angles.length - 1; i++) {
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

var faces = [];
var vertices = [];

var angles = [];
for (var i = 0; i < 2000; i++) {
  angles.push(makeAngle((i - 1000)*10));
}

triangulate(faces, vertices, angles);


var geometry = new THREE.Geometry();
geometry.vertices = vertices;
geometry.faces = faces;
geometry.computeFaceNormals();

var mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial({side: THREE.DoubleSide}) );
scene.add( mesh );

camera.position.z = 600;

function animate() {
  requestAnimationFrame( animate );
  mesh.rotation.y += 0.01;
  renderer.render( scene, camera );
}
animate();
