var time:int = 5;
var timeDiff:float = 0.0;
public var style1:GUIStyle;
public var style2:GUIStyle;

public var gameOverImage:Texture2D;
public var unccLogoImage:Texture2D;
public var blueberryImage:Texture2D;
public var cabbageImage:Texture2D;
public var pumpkinImage:Texture2D;
public var tomatoImage:Texture2D;

/** CountDownScreenScript::Awake
* init countdown screen gui
*
* @author Christine Talbot
*/
function Awake() {
	// setup timers
	time = 5;
	timeDiff = 0.0;
	
}

/** CountDownScreenScript::OnGUI
* setup countdown screen gui
*
* @author Christine Talbot
*/
function OnGUI () {
	// show countdown
	timeDiff += Time.deltaTime;
	if (timeDiff >= 2.0) {
		time--;
		timeDiff = 0.0;
	}
	if (time > 0) { // show countdown
		GUI.Label(new Rect(Screen.width/2 - 150, Screen.height/2 - 50, 300, 50), "Game Beginning in...", style1);
		
		GUI.Label(new Rect(Screen.width/2 -50, Screen.height/2+50, 100, 50), time.ToString(), style2);
	
	} else if (time == -1) { // showed countdown and message to start
		GUI.Label(new Rect(Screen.width/2 - 150, Screen.height/2, 300, 50), "Start Planting!!", style1);
		Application.LoadLevel('Game');
	} else { // show message to start when = 0
		GUI.Label(new Rect(Screen.width/2 - 150, Screen.height/2, 300, 50), "Start Planting!!", style1);
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
}