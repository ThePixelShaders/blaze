function animateShoot(x, z)
{
    var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var sphere = new THREE.Mesh( geometry, material );
    

    //voxel.position.set(-2125+x*50,height,-2125+y*50);
    sphere.y = 400;
    sphere.x = -2125+x*50;
    sphere.z = -2125+z*50;

    this.scene.add( sphere );


}