let GOOGLY = false

let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    MouseConstraint = Matter.MouseConstraint,
    Constraint = Matter.Constraint,
    Events = Matter.Events,
    Mouse = Matter.Mouse;

let bounds = []

let engine = Engine.create();

function init() {
    let numm = Math.random();
    $("canvas").remove();

    let width = $(window).width();
    let height = $(window).height();

    engine.events = {};
    World.clear(engine.world);
    Engine.clear(engine);

    engine = Engine.create();

    let render = Render.create({
        element: $('#canvas-container')[0],
        engine: engine,
        options: {
            wireframes: false,
            background:  'transparent',
            width: width,
            height: height
        }
    });

    update_bounds()

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                // allow bodies on mouse to rotate
                angularStiffness: 0,
                render: {
                    visible: true
                }
            }
        });

    World.add(engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    Engine.run(engine);

    Render.run(render);

    var BEAT_FPS = Music.frames_per_beat() * 1
    var frame = 0
    var sub_loop_id = ''
    function update() {
        main_loop = requestAnimationFrame(update.bind(this));
        if (GOOGLY == true && sub_loop_id == ''){
            function subloop(){
                sub_loop_id = requestAnimationFrame(subloop.bind(this))
                frame += 1
                if (frame >= BEAT_FPS){
                    frame = 0
                    count = 1

                    for (body of engine.world.bodies) {
                        // If body is person, move randomly
                        if (body.label == 'person'){
                            x_force =  ( Math.random() * .05) * body.mass
                            if ( Math.random() > 0.5 ){
                                x_force = - x_force
                            }
                            body.force = {'x':x_force, 'y': -.05 * body.mass }
                        }
                        count += 1
                    }
                }
            }
            subloop()
        }
        if (GOOGLY == false && sub_loop_id != ''){
            cancelAnimationFrame(sub_loop_id)
        }
    }
    update();
}

function update_bounds(){
    let width = $(window).width();
    let height = $(window).height();

    if (bounds.length > 0){
      World.remove(engine.world, bounds)
    }
    bounds = [ Bodies.rectangle(width / 2, height + 50, width, 100, {
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
              })]

    World.add(engine.world, bounds);
}


function add_image(image, eyes){
    var scale = 1

    let width = $(window).width();
    let height = $(window).height();

    var img_width = image.naturalWidth * scale
    var img_height = image.naturalHeight * scale

    // Set scale to ensure tha no pic takes up more than a third of screen
    var max_screen_percent = 0.5
    while (img_width > (max_screen_percent * width) || img_height > (max_screen_percent * height)){
        scale -= 0.05
        img_width = image.naturalWidth * scale
        img_height = image.naturalHeight * scale
        
        // Edge cases
        if (scale < 0){
            scale = .1
            break;
        }
    }


    var eye_center_x = function(){ return scale * (eye[0] + eye[2]/2) }
    var eye_center_y = function(){ return scale * (eye[1] + eye[2]/2) }

    var eye_size = function(){ return scale * eye[2]}
    var pupil_size = function(){ return scale * eye[2] / 2}

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
    });

    // If an object has eyes, label it as a person
    if (eyes.length) {
        man.label = 'person'
    }

    objects.push(man)

    for (eye of eyes){
        // Whites of Eyes
        objects.push(Bodies.circle((width/2 - img_width/2) + eye_center_x(), (height/2 - img_height/2) + eye_center_y(), eye_size(), {
            collisionFilter: {
                category: 0x0000
            },
            render: {
                fillStyle: 'white'
            },
        }));

        objects[objects.length - 1].mass = 0.0000000001

        objects.push(constraint = Constraint.create({
            bodyA: objects[0],
            pointA: { x: eye_center_x() - (img_width/2), y: eye_center_y() - (img_height/2)},
            bodyB: objects[objects.length - 1],
            render: {
                visible: false
            },
            stiffness: 1,
            damping: 1,
        }));

        // Pupils
        objects.push(Bodies.circle((width/2 - img_width/2) + eye_center_x(), (height/2 - img_height/2) + eye_center_y(), pupil_size(), {
            collisionFilter: {
                category: 0x0000
            },
            render: {
                fillStyle: 'black'
            },
        }));

        objects[objects.length - 1].mass = 0.0000000001

        objects.push(constraint = Constraint.create({
            // Link to Whites of Eyes
            bodyA: objects[0],
            pointA: { x: eye_center_x() - (img_width/2), y: eye_center_y() - (img_height/2)},
            bodyB: objects[objects.length - 1],
            stiffness: 0.1,
            damping: 0.1,
            render: {
                visible: false
            }
        }));
    }

    World.add(engine.world, objects);
}

init();

$(window).resize(function() {
    Music.stop_song()
    GOOGLY = false
    init()
});
