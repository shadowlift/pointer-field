var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
	window.setTimeout(callback, 1000 / 60)
};
var canvas = document.createElement("canvas");
var width = window.innerWidth-4;
var height = window.innerHeight-4;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
var player = new Player();
var computer = new Computer();
var ball = new Ball();

var keysDown = {};

var render = function () {
	context.fillStyle = "#232323";
	context.fillRect(0, 0, width, height);
	context.fillStyle = "#FFffFF";
	context.fillRect(width/2 - width * 0.001, 0, width * 0.001, height);
	player.render();
	computer.render();
	ball.render();
};

var update = function () {
	player.update(ball);
	computer.update(ball);
	ball.update(player.paddle, computer.paddle);
};

var step = function () {
	update();
	render();
	animate(step);
};

function Paddle(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.x_speed = 0;
	this.y_speed = 0;
}

Paddle.prototype.render = function () {
	context.fillStyle = "#FEfeFE";
	context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function () {
	this.y = ball.y - this.height / 2;
	if (this.y < 0) {
		this.y = 0;
		this.y_speed = 0;
	} else if (this.y + this.width > width) {
		this.y = 0;
		this.y_speed = 0;
	}
};

function Computer() {
	this.paddle = new Paddle(width * 0.05, height * 0.5, width * 0.005,50);
}

Computer.prototype.render = function () {
	this.paddle.render();
};

Computer.prototype.update = function (ball) {
		this.paddle.move();
		if (this.paddle.y < 0) {
			this.paddle.y = 0;
		} else if (this.paddle.y + this.paddle.height > height) {
			this.paddle.y = height - this.paddle.height;
		}
};

function Player() {
	this.paddle = new Paddle(width * 0.95, height * 0.5, width * 0.005,50);
}

Player.prototype.render = function () {
	this.paddle.render();
};

Player.prototype.update = function () {
	this.paddle.move();
	if (this.paddle.y < 0) {
		this.paddle.y = 0;
	} else if (this.paddle.y + this.paddle.height > height) {
		this.paddle.y = height - this.paddle.height;
	}

	// for (var key in keysDown) {
	// 	var value = Number(key);
	// 	if (value == 81) {
	// 		this.paddle.move(0, -4);
	// 	} else if (value == 65) {
	// 		this.paddle.move(0, 4);
	// 	} else {
	// 		this.paddle.move(0, 0);
	// 	}
	// }
};

function Ball() {
	this.x = width / 2;
	this.preX = width / 2;
	this.y = height / 2;
	this.y_speed = 6;
	this.x_speed = 12;
}

Ball.prototype.render = function () {
	context.beginPath();
	context.arc(this.x, this.y, 7, 2 * Math.PI, false);
	context.fillStyle = "#FF2323";
	context.fill();
};

Ball.prototype.update = function (paddle1, paddle2) {
	this.preX = this.x;
	this.x += this.x_speed;
	this.y += this.y_speed;
	var top_x = this.x - 7;
	var top_y = this.y - 7;
	var bottom_x = this.x + 7;
	var bottom_y = this.y + 7;
	if (top_y < 0) {
		this.y = 5;
		this.y_speed = -this.y_speed;
	} else if (bottom_y > height) {
		this.y = height - 5;
		this.y_speed = -this.y_speed;
	}

	if (this.x < 0 || this.x > width) {
		this.y_speed = 6;
		this.x_speed = 12;
		this.x = width / 2;
		this.y = height / 2;
	}

	if (top_y < (paddle1.y + paddle1.height)
		&& bottom_y > paddle1.y
		&& top_x < (paddle1.x + paddle1.width)
		&& this.x > paddle1.x) {
		this.x_speed = -this.x_speed;
		this.y_speed += (paddle1.y_speed / 2);
		this.x += this.x_speed;
	} else
	if (top_y < (paddle2.y + paddle2.height)
		&& bottom_y > paddle2.y
		&& top_x < (paddle2.x + paddle2.width)
		&& bottom_x > paddle2.x) {
		this.x_speed = -this.x_speed;
		this.y_speed += (paddle2.y_speed / 2);
		this.x += this.x_speed;
	}
};

document.addEventListener("DOMContentLoaded", function(event) { 
	document.body.appendChild(canvas);
	animate(step);
});

window.addEventListener("keydown", function (event) {
	keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
	delete keysDown[event.keyCode];
});
