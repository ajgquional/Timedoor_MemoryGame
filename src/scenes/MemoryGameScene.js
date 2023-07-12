import Phaser from 'phaser';

// 2D array represents placement of the animals in the game
// 0 - bear
// 1 - chicken
// 2 - duck
// 3 - parrot
// 4 - penguin
const level = [
        [1, 0, 3],
        [2, 4, 1],
        [3, 4, 2]
    ]

export default class MemoryGameScene extends Phaser.Scene
{
	constructor()
	{
		super('memory-game-scene');
	}

    init()
    {
        // getting the center of the game screen
        this.halfWidth = this.scale.width / 2;
        this.halfHeight = this.scale.height / 2;

        // for all the created boxes
        this.boxGroup = undefined;

        // player
        this.player = undefined;
        
        // keyboard object for controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // for checking if the box is active or not
        this.activeBox = undefined;

        // for the animals
        this.itemsGroup = undefined;

        // to hold the boxes already selected by the player
        this.selectedBoxes = [];

        // number of matched animals
        this.matchesCount = 0;

        // for the countdown timer
        this.timerLabel = undefined;
        this.countdownTimer = 40; // game is set to be played within 40 seconds but can be changed as per preference
        this.timedEvent = undefined;
    }

	preload()
    {
        // loading the assets
        this.load.image('bg', 'images/bg.jpg');
        this.load.spritesheet('tilesheet', 'images/sokoban_tilesheet.png',
                {frameWidth:64, frameHeight:64});
        this.load.image('chicken', 'images/chicken.png');
        this.load.image('duck', 'images/duck.png');
        this.load.image('bear', 'images/bear.png');
        this.load.image('parrot', 'images/parrot.png');
        this.load.image('penguin', 'images/penguin.png');
        this.load.image('play', 'images/play.png');
    }

    create()
    {
		// =============== OBJECT CREATION ===============

		// creating the background
		// CODE BELOW IS THE ORIGINAL CODE IN THE BOOK
		// this.add.image(this.halfWidth, this.halfHeight, 'bg').setScale(2);
		// CODE BELOW IS THE EDITED VERSION (to be able to see the player near the top of the screen)
		this.add.image(this.halfWidth, 30, "bg").setScale(4);

		// re-initializing the box group
		this.boxGroup = this.physics.add.staticGroup();

		// creating the boxes
		this.createBoxes();

		// creating the player
		this.player = this.createPlayer();

		// each animal is part of a group
		this.itemsGroup = this.add.group();

		// creating the timer text
		this.timerLabel = this.add.text(this.halfWidth, 30, null);

		// =============== COLLISIONS AND OVERLAPS ===============

		// colliding the player and the boxes
		this.physics.add.collider(
			this.player,
			this.boxGroup,
			this.handlePlayerBoxCollide,
			undefined,
			this
		);

		// =======================================================

		// calling the gameOver method every second
		this.timedEvent = this.time.addEvent({
			delay: 1000,
			callback: this.gameOver,
			callbackScope: this,
			loop: true,
		});
	}

    update()
    {
        // always calls the method to move the player within the game screen
        this.movePlayer(this.player);
        
        // setting the depth/layer of all game objects to their respective y-coordinates
        // the lower the objects are placed in the game screen, the more that they're placed on the top layer
        this.children.each(c => {
            const child = c

            // ensures that the sorted boxes (i.e., animals that appear) would have the same layer
            if (child.getData('sorted'))
            {
                return;
            } 

            child.setDepth(child.y);
        });

        this.updateActiveBox();

        // always updating the timer text
        this.timerLabel.setStyle({
            fontSize: '30px',
            fill : '#00ff22',
            fontStyle: 'bold',
            align : 'center'
        }).setText(this.countdownTimer)
    }

    // method to create all the boxes
    createBoxes()
    {
        // setting references
        const width = this.scale.width;
        let xPer = 0.25;
        let y = 150;

        // creating the boxes one by one, row by row, and uniformly placing them in the game screen
        // there are 3 rows and 3 boxes per row for a total of 9 boxes in the game
        for (let row = 0; row < 3; row++)
        {
            for (let col = 0; col < 3; col++)
            {
                // creating one box using a chosen frame within the game screen
                // setting a uniform size for all the boxes
                // adding a data for each box corresponding the 2D array created at the beginning
                this.boxGroup.get(width * xPer, y, 'tilesheet', 8)
                .setSize(64, 32)
                .setOffset(0, 32)
                .setData('itemType', level[row][col]);
                
                // increments the x-coordinate by 25% of the whole game screen width
                // placing the next box on the next 25%-mark of the whole game screen width
                xPer += 0.25;
            }

            // sets the x-coordinate of the box back to the first 25%-mark of the whole game screen width
            // increments the y-coordinate to 150 pixels (meaning, the next row of boxes would now be created)
            xPer = 0.25;
            y += 150;
        }
    }

    // method to create the player and its animations
    createPlayer()
    {
		// creating the player
		const player = this.physics.add
			.sprite(this.halfWidth, this.halfHeight + 30, "tilesheet")
			.setSize(40, 16)
			.setOffset(12, 38);

		// specifying that the player should not go out of bounds
		player.setCollideWorldBounds(true);

		// =============== PLAYER ANIMATIONS ===============

		// standby animation
		this.anims.create({
			key: "standby",
			frames: [{ key: "tilesheet", frame: 52 }],
		});

		// downward movement animation
		this.anims.create({
			key: "down",
			frames: this.anims.generateFrameNumbers("tilesheet", {
				start: 52,
				end: 54,
			}),
			frameRate: 10,
			repeat: -1,
		});

		// upward movement animation
		this.anims.create({
			key: "up",
			frames: this.anims.generateFrameNumbers("tilesheet", {
				start: 55,
				end: 57,
			}),
			frameRate: 10,
			repeat: -1,
		});

		// left movement animation
		this.anims.create({
			key: "left",
			frames: this.anims.generateFrameNumbers("tilesheet", {
				start: 81,
				end: 83,
			}),
			frameRate: 10,
			repeat: -1,
		});

		// right movement animation
		this.anims.create({
			key: "right",
			frames: this.anims.generateFrameNumbers("tilesheet", {
				start: 78,
				end: 80,
			}),
			frameRate: 10,
			repeat: -1,
		});
		// =================================================

        // returns the player after it has been created along with its animations
		return player;
	}

    // method specifying the player controls
    movePlayer(player) 
    {
        // checks first if the player is active
        // if not active (that is, if the game is over already), disable player controls 
        if (!this.player.active) 
        {
            return;
        }

        // specifying the speed of the player
        const speed = 200;

        // if left arrow key is pressed, move the player to the left
        if (this.cursors.left.isDown)
        {
            this.player.setVelocity(-speed, 0);
            this.player.anims.play('left', true);
        }

        // if right arrow key is pressed, move the player to the right
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocity(speed, 0);
            this.player.anims.play('right', true);
        }

        // if up arrow key is pressed, move the player up
        else if (this.cursors.up.isDown)
        {
            this.player.setVelocity(0, -speed);
            this.player.anims.play('up', true);
        }

        // if down arrow key is pressed, move the player down
        else if (this.cursors.down.isDown)
        {
            this.player.setVelocity(0, speed);
            this.player.anims.play('down', true);
        }

        // if no key is pressed, stop the player
        else
        {
            this.player.setVelocity(0, 0);
            this.player.anims.play('standby', true);
        }

        // pressing the spacebar would open a box
        const spaceJustPressed = Phaser.Input.Keyboard.JustUp(this.cursors.space)
        
        // if the spacebar is pressed, open the box then change the color of the box
        if (spaceJustPressed && this.activeBox)
        {
            this.openBox(this.activeBox);
            this.activeBox.setFrame(8);
            this.activeBox = undefined;
        } 
    }

    // method to handle the collision of player and each box
    // just changes the color of the box and sets it active if it's touched by the player
    handlePlayerBoxCollide(player, box) 
    {
        // getting the data about the box (is it opened or not?)
        const opened = box.getData('opened');

        // if the box is already opened (out of the game), don't open it
        if (opened)
        {
            return;
        }
        
        // if the box has been collided before (just waiting for another box to be opened to check for match), don't open it
        if (this.activeBox) 
        {
            return;
        }

        this.activeBox = box;
        // frame would change to green (frame 9) but other frames can be used
        this.activeBox.setFrame(9);
    }

    // method to update the status of the box
    updateActiveBox()
    {
        // if the box is not active anymore, don't update its status
        if (!this.activeBox)
        {
            return;
        }

        // measuring the distance between the player and the box
        const distance = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.activeBox.x, this.activeBox.y
        );

        // if the player and the box is still close to each other, do nothing
        if (distance < 64)
        {
            return;
        }

        // returns the box to its original blue frame if the player is far from the box
        // resets its activeBox status
        this.activeBox.setFrame(8); 
        this.activeBox = undefined;
    }

    // method to actually open the box
    openBox(box)
    {
        // if box is already opened, do nothing
        if(!box) 
        {
            return;
        }

        // gets the data (0-4) stored in the box
        const itemType = box.getData('itemType');
        let item;

        // sets each data to a corresponding animal texture
        switch (itemType)
        {
            // bear
            case 0:
            item = this.itemsGroup.get(box.x, box.y);
            item.setTexture('bear');
            break;
            
            // chicken
            case 1:
            item = this.itemsGroup.get(box.x, box.y);
            item.setTexture('chicken');
            break;
            
            // duck
            case 2:
            item = this.itemsGroup.get(box.x, box.y);
            item.setTexture('duck');
            break;

            // parrot
            case 3:
            item = this.itemsGroup.get(box.x, box.y);
            item.setTexture('parrot');
            break;

            // penguin
            case 4:
            item = this.itemsGroup.get(box.x, box.y);
            item.setTexture('penguin');
            break;
        }
        
        if (!item) 
        {
            return;
        }
        
        // if the box is open, set its state to "opened"
        box.setData('opened', true);

        // the animal that comes out of the box would have equal depth with the other animals
        // they would be active, visible, and opaque
        // setting the initial state of the animal before animating it
        item.setData('sorted', true);
        item.setDepth(2000);
        item.setActive(true);
        item.setVisible(true);
        item.scale = 0;
        item.alpha = 0;

        // store the selected box to the array
        this.selectedBoxes.push({ box, item });
        
        // animating the animal using tween method
        this.tweens.add({
            targets: item,
            y: '-=50',
            alpha: 1,
            scale: 1,
            duration: 500,
            onComplete: () => {
                // after animating, check if the selected box contains data of 0
                // which means, a bear would appear
                if (itemType === 0)
                {
                    // call method to let out the bear
                    this.handleBearSelected();
                    return;
                }

                // if there is only one animal chosen, don't check yet for a match
                if (this.selectedBoxes.length < 2) 
                {
                    return;
                }
                
                // check for matching if there are already two animals who appeared
                this.checkForMatch();
            }
        });

    } 

    // method to call if the box containing the bear is selected
    handleBearSelected()
    {
        // sets the color of the bear and the box
        // removes the selected box and animal from the selectedBoxes array
        const { box, item } = this.selectedBoxes.pop()
        item.setTint(0xff0000);          // change bear color
        box.setFrame(20);                // change box frame, color of the box when bear comes out
        
        // momentarily disable and stop the player
        this.player.active = false;
        this.player.setVelocity(0, 0);

        // after 1 second, bring the bear back to its box
        this.time.delayedCall(1000, () => {
            item.setTint(0xffffff);
            box.setFrame(8);                // color of the box after the bear goes back inside
            box.setData('opened', false);   // resets "opened" status of the box
        
            // bring the bear back again to its box using tween animation
            this.tweens.add({
                targets: item,
                y: '+=50',
                alpha: 0,
                scale: 0,
                duration: 300,
                onComplete: () => {
					// player becomes active after bear goes back to the box
					this.player.active = true;
				}
            });
        });
    }

    // method to handle checking for match
    checkForMatch()
    {
		// getting the first and second boxes from the array
		const second = this.selectedBoxes.pop();
		const first = this.selectedBoxes.pop();

		// if the first animal is not equal to the second animal, bring them back simultaneously to their boxes
		if (first.item.texture !== second.item.texture) {
			// simultaneously animating both animals
			this.tweens.add({
				targets: [first.item, second.item],
				y: "+=50",
				alpha: 0,
				scale: 0,
				duration: 300,
				delay: 1000,
				onComplete: () => {
					// resetting the status of both boxes to the original statuses
					this.itemsGroup.killAndHide(first.item);
					this.itemsGroup.killAndHide(second.item);
					first.box.setData("opened", false);
					second.box.setData("opened", false);
				},
			});

			return;
		}

		// if the animals are the same, increase number of matches
		++this.matchesCount;

		// after a second, set the boxes to a different color to indicate that the boxes are already matched
		this.time.delayedCall(1000, () => {
			first.box.setFrame(6);
			second.box.setFrame(6);

			// additionally, check if the number of matches is greater than or equal to 4
			// if it is, deactivate the player, stop the player, then print a "You Win!" message
			if (this.matchesCount >= 4) {
				this.player.active = false;
				this.player.setVelocity(0, 0);

				this.add
					.text(this.halfWidth, this.halfHeight + 250, "You Win!", {
						fontSize: 60,
						fill: "#30CFE0",
					})
					.setOrigin(0.5);
				this.countdownTimer = undefined;
			}
		});
	}

    // method to repeatedly call every second
    gameOver()
    {
        // decreasing the time
        this.countdownTimer -= 1

        // if the timer goes down to 0 before matching all boxes, 
        // print a message "You Lose!" then stop the game
        if (this.countdownTimer == 0) 
        {
            this.add.text(this.halfWidth, this.halfHeight + 
                250, 'You Lose!', {fontSize: 60, fill: '#fc03ec'})
                .setOrigin(0.5)
            this.countdownTimer = undefined;
            this.player.active = false;
            this.player.setVelocity(0,0);
        }
   }
}