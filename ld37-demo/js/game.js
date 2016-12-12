var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ld37;
(function (ld37) {
    var GameLevel = (function (_super) {
        __extends(GameLevel, _super);
        function GameLevel() {
            var _this = _super.apply(this, arguments) || this;
            _this.playerSpeed = 100;
            _this.lastTick = 0;
            return _this;
        }
        GameLevel.prototype.preload = function () {
            this.time.advancedTiming = true;
            this.load.tilemap('tilemap', 'tilemap/level1_map.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles', 'tilemap/tilemap.png');
            this.load.spritesheet('player', 'sprites/player.png', 32, 32);
            this.load.spritesheet('box', 'sprites/box.png', 32, 32);
        };
        GameLevel.prototype.create = function () {
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.map = this.add.tilemap('tilemap');
            this.map.addTilesetImage('tilemap', 'tiles');
            this.map.addTilesetImage('box', 'box');
            this.layer = this.map.createLayer('Level1');
            this.layer.resizeWorld();
            this.map.setCollision([3, 4]);
            this.getGameZones(this.map);
            this.cursors = this.input.keyboard.createCursorKeys();
            this.restartKey = this.input.keyboard.addKey(Phaser.Keyboard.R);
            this.finishKey = this.input.keyboard.addKey(Phaser.Keyboard.F);
            this.player = this.add.sprite(this.playerZone.x, this.playerZone.y, 'player', 0);
            this.player.animations.add('down', [0, 1, 2, 3], 10, true);
            this.player.animations.add('up', [4, 5, 6, 7], 10, true);
            this.player.animations.add('right', [8, 9, 10, 11], 10, true);
            this.player.animations.add('left', [12, 13, 14, 15], 10, true);
            this.physics.enable(this.player, Phaser.Physics.ARCADE);
            this.player.body.setSize(18, 28, 2, 1);
            this.camera.follow(this.player);
            this.objects = this.add.group();
            this.objects.enableBody = true;
            this.objects.physicsBodyType = Phaser.Physics.ARCADE;
            this.map.createFromObjects('objects', 9, 'box', 0, true, false, this.objects);
            this.objects.setAll('body.width', 28);
            this.objects.setAll('body.height', 28);
            this.text = this.game.add.text(12, 500, '', { font: "25pt Courier", fill: "#FFFFFF", stroke: "#119f4e", strokeThickness: 2 });
        };
        GameLevel.prototype.update = function () {
            this.player.body.velocity.set(0);
            this.physics.arcade.collide(this.player, this.objects, this.objectCollisionCallback);
            this.physics.arcade.collide(this.objects, this.objects);
            this.physics.arcade.collide(this.player, this.layer);
            this.physics.arcade.collide(this.objects, this.layer);
            var updateCursors = this.cursors;
            if (updateCursors.left.isDown) {
                this.player.body.velocity.x = -100;
                this.player.play('left');
            }
            else if (updateCursors.right.isDown) {
                this.player.body.velocity.x = 100;
                this.player.play('right');
            }
            else if (updateCursors.up.isDown) {
                this.player.body.velocity.y = -100;
                this.player.play('up');
            }
            else if (updateCursors.down.isDown) {
                this.player.body.velocity.y = 100;
                this.player.play('down');
            }
            else {
                this.player.animations.stop();
            }
            if (this.restartKey.isDown) {
                this.game.state.start(this.game.state.current);
            }
            if (this.finishKey.isDown) {
                this.finishLevel();
            }
            this.lastTick = this.time;
        };
        GameLevel.prototype.render = function () {
            this.game.debug.text(this.time.fps + '' || '--', 2, 14, "#FFFFFF");
        };
        GameLevel.prototype.getGameZones = function (tilemap) {
            var objects = tilemap.objects.objects;
            for (var i = 0; i < objects.length; i++) {
                if (objects[i].name == "room") {
                    this.roomZone = objects[i];
                }
                else if (objects[i].name == "player") {
                    this.playerZone = objects[i];
                }
            }
        };
        GameLevel.prototype.objectCollisionCallback = function (obj1, obj2) {
        };
        GameLevel.prototype.finishLevel = function () {
            var obj = this.map.objects;
            var count = 0;
            for (var i = 0; i < this.objects.children.length; i++) {
                var item = this.objects.children[i];
                if (item.x >= this.roomZone.x && (item.x + 32) <= (this.roomZone.x + this.roomZone.width)
                    && item.y >= this.roomZone.y && (item.y + 32) <= (this.roomZone.y + this.roomZone.height)) {
                    count++;
                }
            }
            if (count === this.objects.children.length) {
                this.text.setText("You moved all objects to the room. \nYou won!");
            }
            else {
                this.text.setText("You moved " + count + " objects of " + this.objects.children.length + " to the room.\nContinue moving!!");
            }
        };
        return GameLevel;
    }(Phaser.State));
    ld37.GameLevel = GameLevel;
})(ld37 || (ld37 = {}));
var ld37;
(function (ld37) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, 800, 600, Phaser.AUTO, 'game-container', null) || this;
            _this.state.add('GameLevel', ld37.GameLevel, false);
            _this.state.start('GameLevel');
            return _this;
        }
        return Game;
    }(Phaser.Game));
    ld37.Game = Game;
    window.onload = function () {
        var game = new Game();
    };
})(ld37 || (ld37 = {}));
