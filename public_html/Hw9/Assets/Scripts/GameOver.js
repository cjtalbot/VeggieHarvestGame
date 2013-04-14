/************************************************************/
//Variables
/************************************************************/
var AIScore:int;
var PlayerScore:int;
var cheersAudio:AudioSource;
var applauseAudio:AudioSource;
var booAudio:AudioSource;
var clickAudio:AudioSource;
public var gameOverImage:Texture2D;
public var unccLogoImage:Texture2D;
public var blueberryImage:Texture2D;
public var cabbageImage:Texture2D;
public var pumpkinImage:Texture2D;
public var tomatoImage:Texture2D;

public var style:GUIStyle;

/************************************************************/
//Variables
/************************************************************/

/** GameOver:Awake
* int scene
*
* @author Christine Talbot
* @author Tod Dobbs
*/
function Awake() {
	AIScore = GameStateScript.getAIScore();
	PlayerScore = GameStateScript.getPlayerScore();
	
	Destroy(GetComponent (GameStateScript));
	var sources = GetComponents(AudioSource);
	clickAudio = sources[0];
	applauseAudio = sources[1];
	cheersAudio = sources[2];
	booAudio = sources[3];
	if (AIScore > PlayerScore) {
		booAudio.Play();
	} else if (AIScore == PlayerScore) {
		applauseAudio.Play();
	} else {
		cheersAudio.Play();
	}
}//end Awake

/** GameOver:OnGUI
* setup game over ui
* focus on button for controller if controller config set
* @author Christine Talbot
* @author Todd Dobbs
*/
function OnGUI () {
	if (AIScore > PlayerScore) {
		GUI.Label(new Rect(Screen.width/2-115, Screen.height/2-75, 200, 100), "You lost.", style);
	} else if (AIScore == PlayerScore) {
		GUI.Label(new Rect(Screen.width/2-115, Screen.height/2-75, 200, 100), "You tied!!", style);
	} else {
		GUI.Label( new Rect(Screen.width/2-115, Screen.height/2-75, 200, 100), "You won!!!", style);
	}
	GUI.SetNextControlName("returnMainMenu");
	
	if (GUI.Button( new Rect(Screen.width/2-65, Screen.height - 100, 100, 25), "Play Again")) {
		returnMainMenu();
	}
	
	GUI.Label(new Rect(Screen.width/2-215, Screen.height/2-13, 400, 100), "Final Score "+PlayerScore+" : "+AIScore, style);
	
	if (AIScore > PlayerScore) {
		GUI.Label(new Rect(Screen.width/2-115, Screen.height/2+50, 200, 200), "Better luck", style);
		GUI.Label(new Rect(Screen.width/2-115, Screen.height/2+100, 200, 100), "next time!", style);
	} else if (AIScore == PlayerScore) {
		GUI.Label(new Rect(Screen.width/2-115, Screen.height/2+50, 200, 200), "Great job!", style);
	} else {
		GUI.Label( new Rect(Screen.width/2-115, Screen.height/2+50, 200, 200), "Keep up the", style);
		GUI.Label( new Rect(Screen.width/2-115, Screen.height/2+100, 200, 100), "great work!", style);
	}
	if (PlayerPrefs.GetInt("ControllerValueIndex",0) == 1){
		GUI.FocusControl("returnMainMenu");
	}
	
	//show background images
	GUI.Label(new Rect(35, Screen.height/2.3 -50, 300, 220), blueberryImage);
	GUI.Label(new Rect(160, Screen.height/2.3 -50, 300, 220), pumpkinImage);
	GUI.Label(new Rect(575, Screen.height/2.3 -50, 300, 220), tomatoImage);
	GUI.Label(new Rect(700, Screen.height/2.3 -50, 300, 220), cabbageImage);
	
	// show the logo for the game
	GUI.Label(new Rect((Screen.width/2)-255, 10, 512, 128), gameOverImage);
	
	// show the UNCC logos
	GUI.Label(new Rect(50, Screen.height-70, 512, 64), unccLogoImage);
}//end OnGUI

/** GameOver:returnMainMenu
* restarts game
*
* @author Todd Dobbs
*/
function returnMainMenu(){
	clickAudio.Play();
	GameStateScript.myAwake();
	Application.LoadLevel('CountDown');
}//end returnMainMenu

/** GameOver:Update
* registers gamepad button pressed
*
* @author Todd Dobbs
*/
function Update(){
	if(Input.GetButton("joystick button 14")){
		returnMainMenu();
	}
}//end Update