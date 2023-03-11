const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let gameOver = false;

canvas.width = windowWidth * 0.5929721815519765739385065885798 //810
canvas.height = windowHeight * 0.77625570776255707762557077625571 //510
c.fillStyle = 'black'
c.fillRect(0, 0, canvas.width, canvas.width)

const gravity = 0.65

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: "./Assets/Backgrounds/oak-woods/oak_woods_background.png"
})

const shop = new Sprite({
	position: {
		x: 620,
		y: canvas.height -225
	},
	imageSrc: "./Assets/Backgrounds/oak-woods/shop.png",
	scale: 1.5,
	frames: 6
})

const player = new Fighter({
	position: {
		x: 70,
		y: 100		
	},
	velocity: {
		x: 0,
		y: 0
	},
	attackBox: {
		offset: {
			x: 24,
			y: 50
		},
		width: 158,
		height: 50
	},
	color: 'red',
	imageSrc: "./Assets/Characters/Martial Hero/Sprites/Idle.png",
	frames: 8,
	framesHold: 5,
	scale: 2.1,
	offset: {
		x: 215,
		y: 104
	},
	sprites: {
		idle: {
			imageSrc: "./Assets/Characters/Martial Hero/Sprites/Idle.png",
			frames: 8
		},
		run: {
			imageSrc: "./Assets/Characters/Martial Hero/Sprites/Run.png",
			frames: 8
		},
		attack: {
			imageSrc: "./Assets/Characters/Martial Hero/Sprites/Attack1.png",
			frames: 6
		},
		jump: {
			imageSrc: "./Assets/Characters/Martial Hero/Sprites/Jump.png",
			frames: 2
		},
		fall: {
			imageSrc: "./Assets/Characters/Martial Hero/Sprites/Fall.png",
			frames: 2
		},
		hit: {
			imageSrc: "./Assets/Characters/Martial Hero/Sprites/Take Hit.png",
			frames: 4
		},
		death: {
			imageSrc: "./Assets/Characters/Martial Hero/Sprites/Death.png",
			frames: 6
		}
	},
	protection: 0
})


const enemy = new Fighter({
	position: {
		x: 400,
		y: 100
	},
	velocity: {
		x: 0,
		y: 0
	},
	moveSpeed: {
		x: 7.5,
		y: 0
	},
	attackBox: {
		offset: {
			x: -184,
			y: 65
		},
		width: 140,
		height: 50
	},
	color: 'blue',
	imageSrc: "./Assets/Characters/Martial Hero 2/Sprites/Idle.png",
	frames: 4,
	framesHold: 8,
	scale: 1.8,
	offset: {
		x: 215,
		y: 82
	},
	sprites: {
		idle: {
			imageSrc: "./Assets/Characters/Martial Hero 2/Sprites/Idle.png",
			frames: 4
		},
		run: {
			imageSrc: "./Assets/Characters/Martial Hero 2/Sprites/Run.png",
			frames: 8	
		},
		attack: {
			imageSrc: "./Assets/Characters/Martial Hero 2/Sprites/Attack1.png",
			frames: 4
		},
		jump: {
			imageSrc: "./Assets/Characters/Martial Hero 2/Sprites/Jump.png",
			frames: 2
		},
		fall: {
			imageSrc: "./Assets/Characters/Martial Hero 2/Sprites/Fall.png",
			frames: 2
		},
		hit: {
			imageSrc: "./Assets/Characters/Martial Hero 2/Sprites/Take hit.png",
			frames: 3
		},
		death: {
			imageSrc: "./Assets/Characters/Martial Hero 2/Sprites/Death.png",
			frames: 7
		}
	},
	healthSteal: 1,
	xSide: -1
})

const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	w: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	},
	ArrowUp: {
		pressed: false
	}
}

decreaseTimer()
function animate(){
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)
	background.update()
	shop.update()
	/*c.fillStyle = 'rgba(255, 255, 255, 0.06)'
	c.fillRect(0,0,canvas.width,canvas.height)*/
	player.update()
	enemy.update()

	player.velocity.x = 0
	enemy.velocity.x = 0

	//Player movement
	if(keys.a.pressed && player.lastKey === 'a'){
		player.velocity.x = -player.moveSpeed.x
		player.switchSprite('run')
	} else if (keys.d.pressed && player.lastKey === 'd'){
		player.velocity.x = player.moveSpeed.x
		player.switchSprite('run')
	} else{
		player.switchSprite('idle')
	}

	//Jumping
	if (player.velocity.y < 0){
		player.switchSprite('jump')
	} else if (player.velocity.y > 0){
		player.switchSprite('fall')
	}

	//Enemy movement
	if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
		enemy.velocity.x = -enemy.moveSpeed.x
		enemy.switchSprite('run')
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
		enemy.velocity.x = enemy.moveSpeed.x
		enemy.switchSprite('run')
	} else{
		enemy.switchSprite('idle')
	}

	//Jumping
	if (enemy.velocity.y < 0){
		enemy.switchSprite('jump')
	} else if (enemy.velocity.y > 0){
		enemy.switchSprite('fall')
	}

	//Detect for colision
	if ( player.isAttacking && rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.currentFrame === 4 ){
		player.isAttacking = false
		enemy.takeHit()
		if(enemy.health >= 0){gsap.to('#enemyHealth', {
				width: enemy.health + '%'
			})
		}
		else{gsap.to('#enemyHealth', {
				width: '0%'
			})
		}
		// document.querySelector('#playerHealth').style.width = player.health + '%'
		// player.hit()
	}
	if ( enemy.isAttacking && rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.currentFrame === 2 ){
		enemy.isAttacking = false
		player.takeHit()
		if(player.health >= 0){gsap.to('#playerHealth', {
				width: player.health + '%'
			})
		}
		else{gsap.to('#playerHealth', {
				width: '0%'
			})
		}
		// document.querySelector('#enemyHealth').style.width = enemy.health + '%'
		// enemy.hit()
	}

	if(player.isAttacking && player.currentFrame === 4) player.isAttacking = false
	if(enemy.isAttacking && enemy.currentFrame === 2) enemy.isAttacking = false

	// End game based on health
	if (!gameOver && (enemy.health <= 0 || player.health <= 0)) determineWinner(player, enemy)
}

animate()

window.addEventListener('keydown', (event) => {
	if(player.alive){
		switch(event.key){
			case 'a':
				keys.a.pressed = true
				player.lastKey = 'a'
				break
			case 'd':
				keys.d.pressed = true
				player.lastKey = 'd'
				break
			case 'w':
				player.velocity.y = -14
				break
			case 's':
				player.attack()
				break
		}
	}
	if(enemy.alive){
		switch(event.key){
			case 'ArrowLeft':
				keys.ArrowLeft.pressed = true
				enemy.lastKey = 'ArrowLeft'
				break
			case 'ArrowRight':
				keys.ArrowRight.pressed = true
				enemy.lastKey = 'ArrowRight'
				break
			case 'ArrowUp':
				enemy.velocity.y = -14
				break
			case 'ArrowDown':
				enemy.attack()
				break
		}
	}
})

window.addEventListener('keyup', (event) => {
	switch(event.key){
		case 'a':
			keys.a.pressed = false
			break
		case 'd':
			keys.d.pressed = false
			break
		case 'w':
			keys.w.pressed = false
			break
		case 's':
			//player.attack()
			break
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false
			break
		case 'ArrowRight':
			keys.ArrowRight.pressed = false
			break
		case 'ArrowUp':
			keys.ArrowUp.pressed = false
			break
		case 'ArrowDown':
			//enemy.attack()
			break
	}
})