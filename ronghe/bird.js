var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
let nimage = new Image();
		nimage.src = "img/down_pipe.png";	
function init()
{
	imgs.loadImg();
}
function Bird(x, y, image) {
	this.x = x,
	this.y = y,
	this.width = image.width / 2,
	this.height = image.height,
	this.image = image;
	this.draw = function(context, state) {
		if (state === "up")
			context.drawImage(image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
		else{
			context.drawImage(image, this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
		}
	}
};

function FlappyBird() {}
FlappyBird.prototype = {
	 // bird
	bg: null, // background

	mapWidth: 340, // width
	mapHeight: 453, // height
	startX: 90, // intinal position
	startY: 225,
	upSpeed: 7, // Up speed
	downSpeed: 3, // Down speed
	line: 56, // height of land
	
	CreateMap: function() {
		// back ground
		this.bg = new Image();
		this.bg.src = "img/bg.png";
		var startBg = new Image();
		startBg.src = "img/start.jpg";
		// draw imgs
		startBg.onload = function(){
			c.drawImage(startBg, 0, 0);
		};

		//bird
		var image = new Image();
		image.src = "img/bird.png";		
		image.onload = function(){
			this.bird = new Bird(this.startX, this.startY, image);
		}.bind(this);

		
	},


	CanMove: function() { 
		if (this.bird.y < 0 || this.bird.y > this.mapHeight - this.bird.height - this.line) {
			this.gameOver = true;
		} else {
			var boundary = [{
				x: this.bird.x,
				y: this.bird.y
			}, {
				x: this.bird.x + this.bird.width,
				y: this.bird.y
			}, {
				x: this.bird.x,
				y: this.bird.y + this.bird.height
			}, {
				x: this.bird.x + this.bird.width,
				y: this.bird.y + this.bird.height
			}];
		}
	},
	CheckTouch: function() {       
		if (this.touch) {
			this.bird.y -= this.upSpeed;
			this.bird.draw(c, "up");
		} else {
			this.bird.y += this.downSpeed;
			this.bird.draw(c, "down");
		}
	},
	ClearScreen: function() { // when begin the game, clean the screen and add bird and pipes
		c.drawImage(this.bg, 0, 0);
	},
	ShowOver: function() {
		var overImg = new Image();
		overImg.src = "img/over.png";
		overImg.onload = function(){
			c.drawImage(overImg, (this.mapWidth - overImg.width) / 2, (this.mapHeight - overImg.height) / 2 - 50);
		}.bind(this);
		return;
	}
};



function component(img,width, height, color, x, y) {
    this.width = width;
	this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        //c.fillStyle = color;
		c.drawImage(img,this.x, this.y, this.width, this.height);
		
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
};

var game = new FlappyBird();
var Speed = 15;
var IsPlay = false;
var GameTime = null;
var btn_start;
let bg_sound = new sound("sound/bensound-perception.mp3");
let crash_sound = new sound("sound/076932073-crash-impact.m4a");
let myObstacles = new Array();
window.onload = InitGame;
let count = 0;
let h = 120;
let up_img = new Image();
up_img.src = "img/camp_up.jpeg";
let down_img = new Image();
down_img.src = "img/camp_down.jpeg";
let seconds = 0;
let stop = false;
function obstacle(){
	
	count += 1;
	if ((count == 1) || ((count%150) == 0)) {
		let x = game.mapWidth;
		let y=0;
		myObstacles.push(new component(down_img,20, h, "green", x, y));
		myObstacles.push(new component(up_img,20, game.mapHeight-h-205, "green", x, h+150));
		if (h>160){
			h += -Math.random()*80;
		}
		else{
			h += Math.random()*80;
		}
	  }
	for (i = 0; i < myObstacles.length; i += 1) {
		myObstacles[i].x += -1;
		myObstacles[i].update();
	}
}

function InitGame() {
	c.font = "40px Arial";
	
	game.CreateMap();
	
    
	canvas.onmousedown = function() {
		game.touch = true;
	}
	canvas.onmouseup = function() {
		game.touch = false;
	};
	canvas.onclick = function() {
		if (!IsPlay) {
			IsPlay = true;
			GameTime = RunGame(Speed);
		}
	}
}
function kd(e) {
    if (e.keyCode === 32) {
      bird2.speed = -10;
    }
  }

function RunGame(speed) {
	bg_sound.play();
	
	   
	let s = setInterval(function () {
		seconds++;
		document.getElementById('timer').innerHTML = "Time elapsed: " + seconds + "s";
		if(stop){
			clearInterval(s);
		}
	  }, 1000);
	var updateTimer = setInterval(function() {
		
		game.CanMove();
		if (game.gameOver) {
			stop =  true;
			bg_sound.stop();
			crash_sound.play();
			game.ShowOver();
			clearInterval(updateTimer);
			return;
		}
		game.ClearScreen();
		game.CheckTouch();
		for (i = 0; i < myObstacles.length; i += 1) {
			if (myObstacles[i].crashWith(game.bird)) {
				stop=true;
				bg_sound.stop();
				crash_sound.play();
				game.ShowOver();
				clearInterval(updateTimer);
				return;
			} 
		}
		obstacle();
		init();
		bird2.birdfly();
		window.addEventListener('keydown',kd,false)
	}, speed);
}
