kaboom({
    global: true,
    fullscreen: true,
    scale: 2, 
    clearColor: [0, 0, 1, 0.65]
})

loadRoot('./sprites/')
loadSprite('mario','mexican_dude.png')
loadSprite('bettermario','large_mexican_dude.jpg')
loadSprite('coin','coin.png')
loadSprite('blueBlock','block_blue.png')
loadSprite('block', 'block.png')
loadSprite('dino','dino.png')
loadSprite('evilMushroom', 'evil_mushroom.png')
loadSprite('loop','loop.png')
loadSprite('mushroom','mushroom.png')
loadSprite('pipe','pipe_up.png')
loadSprite('princess','princes.png')
loadSprite('star','star.png')
loadSprite('surprise','surprise.png')
loadSprite('unboxed','unboxed.png')
loadSprite('z', 'z.png')
loadSprite('castle', 'castle.png')
loadSprite('banana', 'banana.png')
loadSound('gameSound', 'gameSound.mp3')
loadSound('jumpSound', 'jumpSound.mp3')

let monies = 0

scene('start', ()=>{
    add([text('welcome to minions:\nrise of gru', 20), pos(width()/4, height()/4)])
    const button = add([rect(450, 50), pos(width()/2-200, height()/2)])
    add([text('press the button to start', 20), pos(width()/2-200, height()/2 + 20), color(255, 255, 0)])
    button.action(()=>{
        if(button.isHovered()){
            button.color = rgb(0.5,0.5,0.5)
        }else{
            button.color = rgb(1, 1, 1)
        }

        if(button.isClicked()){
            go('game')
        }
    })
    const banana = add([
        sprite('banana'),
        pos(250, 250),
    
    ])
})
    scene('lose', ()=>{
        add([text('AAAAAAAAAAAAAAAAAAAAAAAAAA', 20), pos(width()/4, height()/4)])
        keyPress('r', ()=> {
            go('game')
        })
    })
    scene('win', ()=>{
        add([text('WAHOOOOOOOOOOOOO' + "\nYo'ur score is: " + monies, 20), pos(width()/4, height()/4)])
        keyPress('r', ()=> {
            go('game')
        })
    })

    scene("game", () => {
        

        layers(['bg', 'obj', 'ui'], 'obj')
        const ronmap = [
            '       ===========        ============       =       =                                                       ',
            '       =         =        =          =       ==      =                                                       ',
            '       =         =        =          =       = =     =                                                       ',
            '       =         =        =          =       =  =    =                                                       ', 
            '       ===========        =          =       =   =   =                                                       ',
            '       ====               =          =       =    =  =                                                       ',
            '       =   ====           =          =       =     = =                                                       ',
            '       =       ===        =          =       =      ==                                                       ', 
            '       =          =       ============       =       =                                                       ',
            '                                                             @                                               ',
            '          $$$$   ???                                                                                         ',
            '                       ^^^^^^^                              ^            ^                   ^                  ',           '                                                                                         ',
            '=============================================================================================================',
            '=============================================================================================================',

        ]
        
        const map = [
            '                                                                                                             ',
            '                                                                                                             ',
            '                                                                                                             ', '                                                                                                             ',
            '                                                                                                             ',
            '                                                                                                             ',
            '                                                                                                             ',
            '                                                                                                             ', '                                                                                                             ',
            '                                                                                                             ',
            '                                                                                                             ',
            '                                                                                                             ', '                                                                                                             ',
            '                                                             @                                               ',
            '          $$$$   ???                                                                                         ',
            '                        ^                          ^                                                         ', '                                                                                                             ',
            '=============================================================================================================',
            '=============================================================================================================',

        ]
        play("gameSound")
        const mapSymbols = {
            width: 20,
            height: 20,

            '=': [sprite('block'), solid ()],
            '$': [sprite('surprise'), solid (), 'surprise-coin'],
            '?': [sprite('surprise'), solid (), 'surprise-mushroom'],
            'C': [sprite('coin'), 'coin'],
            'v': [sprite('unboxed'), solid(), 'unboxed'],
            'M': [sprite('mushroom'), 'mushroom', body()],
            '^': [sprite('princess'), 'goomba', body(), solid()],
            '@': [sprite('castle'), 'castle', ]
        }

        
        const gameLevel = addLevel(ronmap, mapSymbols);
        //const gameLevel = addLevel(map, mapSymbols);

        const moveSpeed = 120;
        const jumpForce = 400;
        let  isJumping = false;
        let lives = 1;
       

        const player = add([
            sprite('mario'),
            solid(),
            pos(30, 0),
            body(),
            origin('bot')
        ])

        
        const scoreLabel =  add(
            [
                text("Score: " + monies),
                pos(player.pos.x, player.pos.y),
                layer("ui"),
                { value: monies}

            ]
        )

        keyDown('right', ()=> {
            player.move(moveSpeed, 0)
        })
        keyDown('left', ()=> {
            player.move(-moveSpeed, 0)
        })
        keyDown('up', ()=> {
            if(player.grounded()){
                player.jump(jumpForce)
                play("jumpSound")
                isJumping = true;
            }
        })
        
        keyDown('d', ()=> {
            player.move(moveSpeed, 0)
        })
        keyDown('a', ()=> {
            player.move(-moveSpeed, 0)
        })
        keyDown('w', ()=> {
            if(player.grounded()){
                player.jump(jumpForce)
                play("jumpSound")
                isJumping = true;
            }
        })
       
        keyDown('space', ()=> {
            if(player.grounded()){
                player.jump(jumpForce)
                play("jumpSound")
                isJumping = true;
            }
        })
        

        player.on('headbump', (obj) => {
            if(obj.is('surprise-coin')){
                gameLevel.spawn('C', obj.gridPos.sub(0, 1))
                destroy(obj)
                gameLevel.spawn('v', obj.gridPos.sub(0, 0))
            }else if(obj.is('surprise-mushroom')){
                gameLevel.spawn('M', obj.gridPos.sub(0, 1))
                destroy(obj)
                gameLevel.spawn('v', obj.gridPos.sub(0, 0))
            }
        })

        

        player.collides('coin', (obj) => {
            destroy(obj)
            monies+=100
            add([text("Score: " + monies, 10), pos(player.pos.x, player.pos.y - 100)])
        })
        player.collides('mushroom', (obj) => {
           destroy(obj)
           if(lives = 1){
            lives++
            player.changeSprite("bettermario")
           }
           
           monies+=100
           add([text("Score: " + monies, 10), pos(player.pos.x, player.pos.y - 100)])

        })


        action('mushroom', (x) =>{
            x.move(40, 0);
        })
        action('coin', (x) =>{
            let rand = 4 * Math.random()
            if(rand < 1){
                x.move(100 * Math.random(), 100* Math.random());
            }else if(rand < 2){
                x.move(-100 * Math.random(), 100* Math.random());
            }else if(rand < 3){
                x.move(100 * Math.random(), -100* Math.random());
            }else{
                x.move(-100 * Math.random(), -100* Math.random());
            }

            

        })

        action('goomba', (x) =>{
            x.move(-100, 0);
        })
        player.collides('goomba', (obj) => {
            if(isJumping){
                destroy(obj)
                monies+=500
            add([text("Score: " + monies, 10), pos(player.pos.x, player.pos.y - 100)])
                

            }else{
                if(lives === 1){
                    destroy(player)
                    go('lose')
                }else{
                    lives--;
                    player.changeSprite("mario")
                    destroy(obj)
                }
            }
        })

    



        player.action(() => {
            console.log(player.pos.x)

            camPos(player.pos)
            if(player.grounded()){
                isJumping = false
            }else{
                isJumping = true
            }

            if(player.pos.x >= 1255 && player.pos.x <= 1265){
                go('win')
            }
            
        })

        //1820

    })
start('start')