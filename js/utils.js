function rectangularCollision({rectangle1, rectangle2}) {
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
		&& rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
		&& rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
		&& rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
	)
}

function determineWinner(){
	clearTimeout(timerId)
	document.querySelector('#resultDisplay').style.display = 'flex'
	if(player.health === enemy.health){
		document.querySelector('#resultDisplay').innerHTML = 'Empate'
	} else if(player.health > enemy.health){
		document.querySelector('#resultDisplay').innerHTML = 'Jogador 1 vence'
	} else{
		document.querySelector('#resultDisplay').innerHTML = 'Jogador 2 vence'
	}
}

let timer = 100
let timerId
function decreaseTimer(){
	if (timer > 0){
		if(timer<12){
			if(timer%2!==0){
				document.querySelector('.timer').style.color = 'red'
			} else document.querySelector('.timer').style.color = 'white'
		}
		timerId = setTimeout(decreaseTimer, 1000)
		timer--
		document.querySelector('#timer').innerHTML = timer
	}
	if (timer === 0){
		determineWinner(player, enemy, timerId)
	}
}