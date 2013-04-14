/*
 * This file provides the script to return to the main menu screen
 * @author Christine Talbot
 */


/************************************************************/
//Variables
/************************************************************/

public var textForButton:String; // the text to show on the button
private var clickAudio:AudioSource;
private var bkgrdAudio:AudioSource;
public var xLoc:float = Screen.width - 80.0;
public var yLoc:float = 5.0;
public var width:float = 75.0;
public var height:float = 25.0;

/************************************************************/
//Methods
/************************************************************/ 

/** ExitGameScript:Awake
* initializes the audio to be played
*
* @author Christine Talbot
*/
function Awake() {
	var sources = GetComponents(AudioSource);
	clickAudio = sources[0];
	bkgrdAudio = sources[1];
}//end Awake
 
/** ExitGameScript:OnGUI
* places the exit / quit button to return to main screen
*
* @author Todd Dobbs
*/
function OnGUI() {
	GUI.SetNextControlName("mainmenu");
	if (GUI.Button(new Rect(xLoc, yLoc, width, height), textForButton )) {
		returnMainMenu();
	}
}//end OnGUI

/** ExitGameScript:returnMainMenu
* exit to title screen
*
* @author Todd Dobbs
*/
function returnMainMenu(){
	audio.Play();
	Application.LoadLevel('Title Screen');
}//end returnMainMenu