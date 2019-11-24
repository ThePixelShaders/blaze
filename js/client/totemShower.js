
let list = [];
function addTotemInList(totem, x, z)
{
    let a = {};
    a.x = x;
    a.z = z;
    list.push(a);
    console.log("lololllolllllllllllllllllololo2");
}

function showOwnTotems()
{
    list.forEach(e => {
    
        let height = heightmap[e.x][e.z];
        let totem = TotemLoader.cloneMesh( TotemTypes.mark, height );
        totem.position.set(-2125+e.x*50,height+25,-2125+e.z*50);
    });
    
}

function hideOwnTotems()
{


}

showOwnTotems();