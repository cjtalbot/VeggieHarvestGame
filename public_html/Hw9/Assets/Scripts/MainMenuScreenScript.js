/*
 * This file provides the title page and buttons to click on
 *   merged and adapted from 4 separate scripts by Joseph Blair & 3D objects
 * @author Christine Talbot
 */


/**********************************************/
//Variables
/**********************************************/
public var logoImage:Texture2D;
public var unccLogoImage:Texture2D;
public var blueberryImage:Texture2D;
public var cabbageImage:Texture2D;
public var pumpkinImage:Texture2D;
public var tomatoImage:Texture2D;
private var selectedAction:TitleScreenActionType = TitleScreenActionType.start; //current action selected
private enum TitleScreenActionType{start,instructions,configuration,credits}; //types of actions for this scene
private var buttonRate:float = 0.25; //delay before controller button will fire an action
private var nextButton:float = 0.0; //how much time will need to pass before the next button will register


/**********************************************/
//Methods
/**********************************************/

/** MainMenuScreenScript:OnGUI
* Shows the images and buttons for the main title screen of the game
*
* @author Christine Talbot
*/
function OnGUI() {
	
	//show background images
	GUI.Label(new Rect(75, Screen.height/2.3 -50, 300, 220), blueberryImage);
	GUI.Label(new Rect(275, Screen.height/2.3 -50, 300, 220), pumpkinImage);
	GUI.Label(new Rect(475, Screen.height/2.3 -50, 300, 220), tomatoImage);
	GUI.Label(new Rect(675, Screen.height/2.3 -50, 300, 220), cabbageImage);
	
	// show the logo for the game
	GUI.Label(new Rect((Screen.width/2)-255, 10, 512, 128), logoImage);
	
	// show the menu buttons
	GUI.SetNextControlName(TitleScreenActionType.start.ToString());
	if (GUI.Button(new Rect(100, Screen.height - 100,100,25), 'Start' )) {
		showGame();
	}
	GUI.SetNextControlName(TitleScreenActionType.instructions.ToString());
	if (GUI.Button(new Rect(300, Screen.height -100,100,25), 'Instructions' )) {
		showInstructions();
	}
	GUI.SetNextControlName(TitleScreenActionType.configuration.ToString());
	if (GUI.Button(new Rect(500, Screen.height -100,100,25), 'Configuration' )) {
		showConfiguration();
	}
	GUI.SetNextControlName(TitleScreenActionType.credits.ToString());
	if (GUI.Button(new Rect(700, Screen.height-100,100,25), 'Credits' )) {
		showCredits();
	}
	if (PlayerPrefs.GetInt("ControllerValueIndex",0) == 1){
		GUI.FocusControl(selectedAction.ToString());
	}
	// show the UNCC logos
	GUI.Label(new Rect(50, Screen.height-70, 512, 64), unccLogoImage);
}//end OnGUI


/** MainMenuScreenScript:Update
* Gets the buttons pressed on the gamepad and select or performs the corresponding action
*
* @author Todd Dobbs
*/
function Update(){
	var action:int = selectedAction;
	if((Input.GetButton("joystick button 5")) && (Time.time > nextButton)){//right
		nextButton = Time.time + buttonRate;
		action++;
		if (action > 3){
			action = 0;
		}
		selectedAction = action;
	}
	if((Input.GetButton("joystick button 7")) && (Time.time > nextButton)){//left
		nextButton = Time.time + buttonRate;
		action--;
		if (action < 0){
			action = 3;
		}		
		selectedAction = action;
	}
	if((Input.GetButton("joystick button 14")) && (Time.time > nextButton)){//x button
		nextButton = Time.time + buttonRate;
		performSelectedAction();
	}
}//end Update


/** MainMenuScreenScript:performSelectedAction
* performs the action that is selected
*
* @author Todd Dobbs
*/ 
function performSelectedAction(){
	switch(selectedAction){
		case TitleScreenActionType.start:
			showGame();
			break;
		case TitleScreenActionType.instructions:
			showInstructions();
			break;
		case TitleScreenActionType.configuration:
			showConfiguration();
			break;
		case TitleScreenActionType.credits:
			showCredits();
			break;
	}
}//end performSelectedAction


/** MainMenuScreenScript:showGame
* shows the main game
*
* @author Todd Dobbs
*/
function showGame(){
	audio.Play();
	Application.LoadLevel('CountDown');
}//end showGame

/** MainMenuScreenScript:showInstructions
* shows the instructions screen
*
* @author Todd Dobbs
*/
function showInstructions(){
	audio.Play();
	Application.LoadLevel('Instructions');
}//end showInstructions

/** MainMenuScreenScript:showConfiguration
* shows the configuration screen
*
* @author Todd Dobbs
*/
function showConfiguration(){
	audio.Play();
	Application.LoadLevel('configuration');
}//end showConfiguration

/** MainMenuScreenScript:showCredits
* shows the credits screen
*
* @author Todd Dobbs
*/
function showCredits(){
	audio.Play();
	Application.LoadLevel('Credits');
}//end showCredits