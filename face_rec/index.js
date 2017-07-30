let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    MouseConstraint = Matter.MouseConstraint,
    Constraint = Matter.Constraint,
    Mouse = Matter.Mouse;

let engine = Engine.create();

function init() {
    let numm = Math.random();
    $("canvas").remove();

    let width = $(window).width();
    let height = $(window).height();
    let vmin = Math.min(width, height);

    engine.events = {};
    World.clear(engine.world);
    Engine.clear(engine);

    engine = Engine.create();

    let render = Render.create({
        element: document.body,
        engine: engine,
        options: {
        wireframes: false,
        background: 'transparent',
        width: width,
        height: height
        }
    });

    World.add(engine.world, [
        // borders
        Bodies.rectangle(width / 2, height + 50, width, 100, {
        isStatic: true
        }),
        Bodies.rectangle(width / 2, -50, width, 100, {
        isStatic: true
        }),
        Bodies.rectangle(-50, height / 2, 100, height, {
        isStatic: true
        }),
        Bodies.rectangle(width + 50, height / 2, 100, height, {
        isStatic: true
        }),

    /*
    Bodies.rectangle(width / 2, height / 2, vmin * 0.961, vmin * 0.135, {
      isStatic: true,
      render: {
            fillStyle: "white"
      }
    }),
    Bodies.rectangle(width / 2, height / 4 * 3, vmin * 0.37, vmin * 0.131, {
      isStatic: true,
      render: {
            fillStyle: "white"
      }
    }),
    Bodies.circle(width / 2 - (vmin * 0.182), height / 4 * 3, vmin * 0.065, {
      isStatic: true,
      render: {
        fillStyle: "white"
    }
    }),
    Bodies.circle(width / 2 + (vmin * 0.182), height / 4 * 3, vmin * 0.065, {
      isStatic: true,
      render: {
        fillStyle: "white"
        }
    })
    */
  ]);

  /*
  for (let i = 0; i < 150; i++) {
    let radius = Math.round(10 + (Math.random() * vmin / 30));
    World.add(engine.world, Bodies.circle(
      Math.random() * width,
      Math.random() * height / 4,
      radius, {
        render: {
          fillStyle: ['#EA1070', '#EAC03C', '#25DDBC', '#007DB0', '#252B7F', '#FF6040'][Math.round(Math.random() * 6 - 0.5)]
        }
      }
    ))
  }*/

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                // allow bodies on mouse to rotate
                angularStiffness: 0,
                render: {
                    visible: false
                }
            }
        });

    World.add(engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    Engine.run(engine);

    Render.run(render);

    let num = 0;
    function update() {
        engine.world.gravity.x = 0 //Math.sin(num / 100);
        engine.world.gravity.y = 0 //Math.cos(num / 100);
        num += 1.7;
        idRAF = requestAnimationFrame(update.bind(this));
    }
    update();
}

top = ''
bottom = ''
left = ''
right = ''
function set_bounds(){
    World.remove(engine.world, [
    // borders
        top, bottom, left, right
    ]);
    let width = $(window).width();
    let height = $(window).height();
    bottom = Bodies.rectangle(width / 2, height + 50, width, 100, {
      isStatic: true
    }),
    top = Bodies.rectangle(width / 2, -50, width, 100, {
      isStatic: true
    }),
    left = Bodies.rectangle(-50, height / 2, 100, height, {
      isStatic: true
    }),
    right = Bodies.rectangle(width + 50, height / 2, 100, height, {
      isStatic: true
    })
    World.add(engine.world, [
    // borders
        top, bottom, left, right
    ]);
}

function add_image(image, eyes){
    var scale = .2

    let width = $(window).width();
    let height = $(window).height();

    var img_width = image.naturalWidth * scale
    var img_height = image.naturalHeight * scale

    var eye_center_x = function(){ return scale * (eye[0] + eye[2]/2) }
    var eye_center_y = function(){ return scale * (eye[1] + eye[2]/2) }

    var objects = []

    let man = Bodies.rectangle(width/2, height/2, img_width, img_height, {
        collisionFilter: { 
            category: 0x0001
        },
        render: {
            sprite: {
                texture: image.src,
                xScale: scale,
                yScale: scale
            }
        },
        mass: 0
    });
    objects.push(man)
    
    for (eye of eyes){
        objects.push(Bodies.circle((width/2 - img_width/2) + eye_center_x(), (height/2 - img_height/2) + eye_center_y(), eye[2], { 
            collisionFilter: { 
                category: 0x0000
            },
            render: {
                sprite: {
                    texture: '../images/brown_eyes_round.png',
                    xScale: scale * .1,
                    yScale: scale * .1
                }
            },
            mass: 0
        }));

        objects.push(constraint = Constraint.create({
            bodyA: objects[0],
            pointA: { x: eye_center_x() - (img_width/2), y: eye_center_y() - (img_height/2)},
            bodyB: objects[objects.length - 1],
            //pointB: { x: (width/2 - img_width/2) + (scale * eye[0]) , y: (height/2 - img_height/2) + (scale * eye[1])}
        }));
    }
    World.add(engine.world, objects);
    //World.add(engine.world, man);
}

init();

$(window).resize(function() {
    //$('canvas').width($(window).width())
    //$('canvas').height($(window).height())
    //set_bounds()
    init()
});