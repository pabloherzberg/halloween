document.addEventListener('DOMContentLoaded', function(){
    const canvas = document.getElementById('screen')
    const ctx = canvas.getContext('2d')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    canvas.addEventListener('click', function(){
        game.addNewEnemy()
    })

    class Game {
        constructor(ctx, width, height){
            this.ctx = ctx
            this.width = width
            this.height = height
            this.enemies = []
            this.enemyInterval = 100
            this.enemyTimer = 0
            this.enemyTypes = ['worm', 'ghost', 'spider']
        }
        update(deltaTime){
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion)
            if (this.enemyTimer > this.enemyInterval){
                //this.#addNewEnemy()
                this.enemyTimer = 0
            } else {
                this.enemyTimer += deltaTime
            }
            this.enemies.forEach(enemy => enemy.update(deltaTime))
        }
        draw(){
            this.enemies.forEach(enemy => enemy.draw(this.ctx))
        }
        addNewEnemy(){
            const ramdomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)]
            if(ramdomEnemy === 'worm'){
                this.enemies.push(new Worm(this))
            }
            if(ramdomEnemy === 'ghost'){
                this.enemies.push(new Ghost(this))
            }
            if(ramdomEnemy === 'spider'){
                this.enemies.push(new Spider(this))
            }
            this.enemies.sort(function(a,b){
                return a.y - b.y
            })
        }
    }



    class Enemy{
        constructor(game){
            this.game = game           
            this.markedForDeletion = false
            this.frameX = 0
            this.maxFrame = 5
            this.frameInterval = 2000
            this.frameTimer = 0
        }
        update(deltaTime){
            this.x -= this.vx * deltaTime
            if (this.x < 0 - this.width){
                this.markedForDeletion = true
            }
            if(this.frameTimer > this.frameInterval){
                if(this.frameX < this.maxFrame){
                    this.frameX++
                }else{
                    this.frameX = 0
                    this.frameTimer = 0
                }
            }else{
                this.frameTimer += deltaTime
            }
        }
        draw(ctx){
            ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
        }
    }

    class Worm extends Enemy {
        constructor(game){
            super(game)
            this.spriteWidth = 229
            this.spriteHeight = 171
            this.x = this.game.width
            this.y = this.game.height - this.spriteHeight/2
            this.width = this.spriteWidth/2
            this.height = this.spriteHeight/2
            this.image = worm
            this.vx = Math.random() * 0.1 + 0.05
        }
    }

    class Ghost extends Enemy {
        constructor(game){
            super(game)
            this.spriteWidth = 261
            this.spriteHeight = 209
            this.x = this.game.width
            this.y = Math.random() * this.game.height/2 * 0.4
            this.width = this.spriteWidth/2
            this.height = this.spriteHeight/2
            this.image = ghost
            this.vx = Math.random() * 0.1 + 0.1
            this.angle = 0
            this.curve = Math.random() * 2
        }
        update(deltaTime){
            super.update(deltaTime)
            this.y +=  Math.sin(this.angle) * this.curve
            this.angle += .02
        }
        draw(ctx){
            ctx.save()
            ctx.globalAlpha = 0.5
            super.draw(ctx)
            ctx.restore()
        }
    }

    class Spider extends Enemy {
        constructor(game){
            super(game)
            this.spriteWidth = 310
            this.spriteHeight = 175
            this.x = Math.random() * this.game.width
            this.y = 0 
            this.width = this.spriteWidth/2
            this.height = this.spriteHeight/2
            this.image = spider
            this.vx = 0
            this.vy = Math.random() * 0.1 + 0.1
            this.maxLength = Math.random() * game.height
        }
        update(deltaTime){
            super.update(deltaTime)
            
            if(this.y < 0 - this.height * 2){
                this.markedForDeletion = true
            }

            this.y += this.vy * deltaTime;
            
            if (this.y > this.maxLength){
                this.vy *= -1
            }
        }
        draw(ctx){
            ctx.beginPath()
            ctx.moveTo(this.x + this.width/2, 0)
            ctx.lineTo(this.x + this.width/2, this.y + 10)
            ctx.stroke()
            super.draw(ctx)
        }
    }

    //INITILIZE

    const game = new Game(ctx, canvas.width, canvas.height)
    let lastTime = 1

    function animate(timeStamp){
        ctx.clearRect(0 , 0, canvas.width, canvas.height)
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp
        game.update(deltaTime)
        game.draw()
        requestAnimationFrame(animate)
    }
    animate(0)
})