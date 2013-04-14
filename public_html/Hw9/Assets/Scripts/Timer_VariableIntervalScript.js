/**********************************************/
//Variables
/**********************************************/
private var startTime;
private var roundedRestSeconds : int;
private var randomFactor : int;
private var choices_AI : int; //random value between 0 and max # of card slots available
private var choices_player : int; //random value between 0 and max # of card slots available

private var timeSinceLast:float = 0.0;
private var timeUntil:float = 0.0;

/**********************************************/
//Constants
/**********************************************/
private var INTERVAL : float = 10.0+ (2.0*(11.0-GameStateScript.delayAI)); //seconds -btd - cjt made faster based on difficulty level
private var RAND_FACTOR_LOWER_BOUND = 1;
private var RAND_FACTOR_UPPER_BOUND = 5;

/**********************************************/
//Methods
/**********************************************/

/** Timer_VariableIntervalScript::myAwake
* Initialize.
*
* @author Eric Faust
* @author Christine Talbot
*/
function myAwake() {
	//initialize
	timeUntil = 0.0;
	timeSinceLast = 0.0;

    startTime = Time.time;
    randomFactor = Mathf.Floor(Random.Range(RAND_FACTOR_LOWER_BOUND,RAND_FACTOR_UPPER_BOUND));
}//end Awake

/** Timer_VariableIntervalScript::myUpdate
* Updates every frame.
* 
* Waits for timer trigger condition, then
* gives player and the AI a random number of choices
* 
* Timer trigger condition currently set to 10 + [0-5] seconds
*
* NOTE: Update Conditions are based on the player and AI actions
* being set to NULL if there is nothing in the slot.
*
* @author Eric Faust
* @author Todd Dobbs
*/
function myUpdate () {
    //make sure that the time is based on when this script was first called
    //instead of when the game started
 	
	timeSinceLast += Time.deltaTime; // increment how long it's been since the last update
	if (timeSinceLast >= timeUntil) {
		// update the random next time to give choices
		timeUntil = (Random.value * 3.0)+ (3.0*GameStateScript.delayAI/2);
		// above will give 2 seconds - 23 seconds, based on the difficulty level (faster for the harder game)
		
		timeSinceLast = 0.0;
        
        //Give some # of choices to both AI and Player	
		choices_player = Mathf.Floor(Random.value * 3)+1; // Mathf.CeilToInt(Random.Range(0.1, 2.99));
		choices_AI = Mathf.Floor(Random.value * 3)+1;
		//Debug.Log("Gave "+choices_player+" choices to human, and "+choices_AI+" to AI");
        //Update GameState to reflect new choices
       	//Update player choices:
       	if ( choices_player == 1 ) { //player gets 1 choice
       		updatePlayerSlotGameState();
       	} else if (choices_player == 2) { //player gets 2 chioces
       		updatePlayerSlotGameState();
       		updatePlayerSlotGameState();
       	} else if (choices_player == 3) {//else choices_player == 3
			updatePlayerSlotGameState();
			updatePlayerSlotGameState();
			updatePlayerSlotGameState();
		} else { // in case something happens, give one
			updatePlayerSlotGameState();
		}
       		        
        //Update AI choices:
       	if ( choices_AI == 1 ) { //AI gets 1 choice
       		updateAISlotGameState();
       	} else if (choices_AI == 2) { //AI gets 2 chioces
       		updateAISlotGameState();
       		updateAISlotGameState();
       	} else if (choices_AI == 3) { //else choices_ai == 0, do nothing
			updateAISlotGameState();
			updateAISlotGameState();
			updateAISlotGameState();
		} else { // in case something happens
			updateAISlotGameState();
		}
        
        //Update UI with given choices:
        //Will be handled by DisplaySlotChoices.js
    }//end timerTrigger if statement	
}//end myUpdate

/**Timer_VariableIntervalScript:updatePlayerSlotGameState()
* Updates the player's game state to reflect new choices being
* made available.
*
* @author Eric Faust
* @author Todd Dobbs
*/
function updatePlayerSlotGameState() {
		//create a blank "choice" GameAction
        var g:GameAction = ScriptableObject.CreateInstance('GameAction');
        g.setActionType(ActionType.Choice);

		//check if the slots are occupied, if not, add a GameAction to it
       	var playerSlotOne:GameAction = GameStateScript.getHumanAction(0);
       	var playerSlotTwo:GameAction = GameStateScript.getHumanAction(1);
       	var playerSlotThree:GameAction = GameStateScript.getHumanAction(2);
        if ( playerSlotOne == null ) {
	        GameStateScript.setHumanAction(0, g);
        } else if (playerSlotTwo == null) {
	        GameStateScript.setHumanAction(1, g);
        } else if (playerSlotThree == null) {
	        GameStateScript.setHumanAction(2, g);        
        } //else all player slots are full, do nothing
}//end updatePlayerSlotGameState

/**Timer_VariableIntervalScript:updateAISlotGameState()
* Updates the AI's game state to reflect new choices being
* made available.
*
* @author Eric Faust
* @author Todd Dobbs
*/
function updateAISlotGameState() {
		//create a blank "choice" GameAction
        var g:GameAction = ScriptableObject.CreateInstance('GameAction');
        g.setActionType(ActionType.Choice);

		//check if the slots are occupied, if not, add a GameAction to it
       	var aiSlotOne:GameAction = GameStateScript.getAIAction(0);
       	var aiSlotTwo:GameAction = GameStateScript.getAIAction(1);
       	var aiSlotThree:GameAction = GameStateScript.getAIAction(2);
        if ( aiSlotOne == null ) {
	        GameStateScript.setAIAction(0, g);
        } else if (aiSlotTwo == null) {
	        GameStateScript.setAIAction(1, g);
        } else if (aiSlotThree == null) {
	        GameStateScript.setAIAction(2, g);        
        } //else all player slots are full, do nothing
}//end updatePlayerSlotGameState