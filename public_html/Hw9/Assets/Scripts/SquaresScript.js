/*
 * This file is a single reusable version of the files created by Joseph Blair for handling clicks on the board by the player
 * @auther Joseph Blair
 * @author Christine Talbot
 */


/**********************************************/
//Variables
/**********************************************/
var counter: int=1;
var AIOccupied: boolean=false;
var PlayerOccupied: boolean=false;
var gameStateScript:GameStateScript; 
public var slot:String;
public var column: int;
public var row: int;
var cardType: String;
var veggieNum: int;

private var clickAudio:AudioSource;
private var bkgrdAudio:AudioSource;
private var boingAudio:AudioSource;


/**********************************************/
//Methods
/**********************************************/

/** SquaresScript:Awake
* Sets up the audio for playing in the game
*
* @author Christine Talbot
*/
function Awake () {
	var cameraSrc = GameObject.Find("Main Camera");
	var sources = cameraSrc.GetComponents(AudioSource);
	clickAudio = sources[0];
	bkgrdAudio = sources[1];
	boingAudio = sources[2];
	
}//end Awake


/** SquaresScript:OnMouseUp
* Checks if a card is selected and if so, plays the card, else makes error sound
*
* @author Christine Talbot
*/
function OnMouseUp() {
	if (GameStateScript.getClicked() != -1) {
		GameStateScript.setMessage("");
		if (GameBoardScript.playCard(GameStateScript.getClicked(), PlayerType.Human, row-1, column-1, 0)) {
			clickAudio.Play();
		} else {
			boingAudio.Play();
		}
	} else {
		boingAudio.Play(); // can't click the squares when nothing is selected
	}
}//end OnMouseUp