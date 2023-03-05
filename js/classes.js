class Sprite{
	constructor({position, imageSrc, scale = 1, frames = 1, currentFrame = 0, framesElapsed = 0, framesHold = 12, offset = {x: 0, y: 0}}){
		this.position = position
		this.width = 50
		this.height = 150
		this.image = new Image()
		this.image.src = imageSrc
		this.scale = scale
		this.frames = frames
		this.currentFrame = currentFrame
		this.framesElapsed = framesElapsed
		this.framesHold = framesHold
		this.offset = offset
	}

	draw(){
		c.drawImage(
			this.image, this.currentFrame * (this.image.width / this.frames), 0,
			this.image.width / this.frames, this.image.height,
		 	this.position.x - this.offset.x, this.position.y - this.offset.y,
		 	this.image.width / this.frames * this.scale, this.image.height * this.scale
	 	)
	}

	animateFrame(){
		if(this.framesElapsed % this.framesHold == 0){
			if(this.currentFrame < this.frames - 1){
				this.currentFrame++
			} else{
				this.currentFrame = 0
			}
		}
		this.framesElapsed++
	}

	update(){
		this.draw()
		this.animateFrame()
	}
}

class Fighter extends Sprite{
	constructor({
		position,
		velocity,
		moveSpeed = {x: 5, y: 10},
		color,
		attackOffSet,
		attackBox = {offset: {}, width: undefined, height: undefined},
		imageSrc, scale = 1, frames = 1,
		currentFrame = 0, framesElapsed = 0,
		framesHold = 12, offset = {x: 0, y: 0},
		sprites,
		protection = 0,
		healthSteal = 0/*,
		hitbox = {x: 0, y: 0, offset: {x: 0, y: 0}, width: 0, height = 0}*/
	}){
		super({
			position, imageSrc, scale, frames, currentFrame, framesElapsed, framesHold, offset
		})

		this.imageSrc = imageSrc
		this.offset = offset
		this.velocity = velocity
		this.width = 50
		this.height = 150
		this.lastkey
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			attackOffSet: attackBox.offset,
			width: attackBox.width,
			height: attackBox.height
		}
		this.color = color
		this.isAttacking
		this.health = 100
		this.sprites = sprites
		this.moveSpeed = moveSpeed
		this.protection = protection
		this.healthSteal = healthSteal
		this.alive = true

		for (const sprite in this.sprites){
			sprites[sprite].image = new Image()
			sprites[sprite].image.src = sprites[sprite].imageSrc
		}

		console.log(this.sprites)
	}
	//attack box
	/*if (this.isAttacking){
		c.fillStyle = 'green'
		c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
	}*/

	update(){
		this.draw()
		if(this.alive) this.animateFrame()
		this.attackBox.position.x = this.position.x + this.attackBox.attackOffSet.x
		this.attackBox.position.y = this.position.y + this.attackBox.attackOffSet.y
		if(this.color == 'red'){
			c.fillStyle = 'green'
		} else{
			c.fillStyle = 'RoyalBlue'
		}
		// Draw attack boxes
		// c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		// Gravity and where is the ground
		if (this.position.y + this.height + this.velocity.y >= canvas.height -30){
			this.velocity.y = 0
			this.position.y = 330
		} else this.velocity.y += gravity
	}

	attack(){
		this.switchSprite('attack')
		this.isAttacking = true
		/*setTimeout(() => {
			this.isAttacking = false
		}, 100)*/
	}

	takeHit(){
		this.health -= 10 - this.protection
		if(this.health <= 0) {this.switchSprite('death')} else {this.switchSprite('hit')}
	}

	/*hit(){
		this.health += this.healthSteal
	}*/

	// Define which sprite will be displayed
	switchSprite(sprite){
		if(this.image === this.sprites.death.image) {
			if(this.currentFrame === this.sprites.death.frames-1) this.alive = false
			return
		}

		// Overriding all other animations with the attack one, etc.
		if(this.image === this.sprites.attack.image && this.currentFrame < this.sprites.attack.frames-1) return
		if(this.image === this.sprites.hit.image && this.currentFrame < this.sprites.hit.frames-1) return
		switch(sprite){
			case 'idle':
				if (this.image !== this.sprites.idle.image){
					this.image = this.sprites.idle.image
					this.frames = this.sprites.idle.frames
					this.currentFrame = 0
				}
			break
			case 'run':
				if (this.image !== this.sprites.run.image){
					this.image = this.sprites.run.image
					this.frames = this.sprites.run.frames
					this.currentFrame = 0
				}
			break
			case 'attack':
				if (this.image !== this.sprites.attack.image){
					this.image = this.sprites.attack.image
					this.frames = this.sprites.attack.frames
					this.currentFrame = 0
				}
			break
			case 'jump':
				if (this.image !== this.sprites.jump.image){
					this.image = this.sprites.jump.image
					this.frames = this.sprites.jump.frames
					this.currentFrame = 0
				}
			break
			case 'fall':
				if (this.image !== this.sprites.fall.image){
					this.image = this.sprites.fall.image
					this.frames = this.sprites.fall.frames
					this.currentFrame = 0
				}
				break
			case 'hit':
				if (this.image !== this.sprites.hit.image){
					this.image = this.sprites.hit.image
					this.frames = this.sprites.hit.frames
					this.currentFrame = 0
				}
			break
			case 'death':
				if (this.image !== this.sprites.death.image){
					this.image = this.sprites.death.image
					this.frames = this.sprites.death.frames
					this.currentFrame = 0
				}
			break
		}
	}
}