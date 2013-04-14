/*
 * This file provides main game loop for the game - will call all other "update" scripts from the update loop here to ensure timed properly
 * @author Christine Talbot
 */
 
 
/************************************************************/
//Variables
/************************************************************/
var Timer_SetIntervalScript:Timer_SetIntervalScript;
var Timer_VariableIntervalScript:Timer_VariableIntervalScript;
var AIPlayerScript:AIPlayerScript;

/************************************************************/
//Methods
/************************************************************/

/** GameLoop:Awake
* Initializes all the game loop items and objects
*
* @author Christine Talbot
*/
function Awake() {
	Timer_SetIntervalScript = gameObject.AddComponent('Timer_SetIntervalScript');
	Timer_VariableIntervalScript = gameObject.AddComponent('Timer_VariableIntervalScript');
	AIPlayerScript = gameObject.AddComponent('AIPlayerScript');
	// initialize any objects we need beforehand, like the GameState and other Objects
	GameStateScript.myAwake();
	Timer_SetIntervalScript.myAwake();
	Timer_VariableIntervalScript.myAwake();
	AIPlayerScript.myAwake();
}//end Awake

/** GameLoop:Update
* Runs the game loop on a regular schedule to avoid conflicting/overlapping tasks
*
* @author Christine Talbot
* @author Todd Dobbs
*/
function Update () {
	// call the update functions for all the other files within this loop so timed properly/in sequence
	Timer_SetIntervalScript.myUpdate();
	Timer_VariableIntervalScript.myUpdate();
	AIPlayerScript.myUpdate();
	GameStateScript.refreshScore();
}//end Update