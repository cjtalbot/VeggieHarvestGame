/**********************************************/
//Variables
/**********************************************/
private var startTime;
private var roundedRestSeconds : int;

/**********************************************/
//Constants
/**********************************************/
private var INTERVAL : int = 120; //in seconds --btd

/**********************************************/
//Methods
/**********************************************/

/** Timer_SetIntervalScript::myAwake()
* Initialize.
*
* @author Eric Faust
*/
function myAwake() {
    startTime = Time.time;
}//end Awake

/** Timer_SetIntervalScript::myUpdate()
* Updates every frame.
*
* Waits for timer trigger condition, then grows attempts to 
* grow all plants on the board.
*
* Timer trigger condition is set to fire every 10 seconds.
*
* @author Eric Faust
* @author Todd Dobbs
*/
function myUpdate () {
    //make sure that the time is based on when this script was first called
    //instead of when the game started
	if (startTime == null) throw ("start is null");
    var guiTime = Time.time - startTime;
    roundedRestSeconds = Mathf.CeilToInt(guiTime);
	
    if ( (roundedRestSeconds % (INTERVAL/6)) == 0 ) {//timerTriggered
	    startTime = Time.time - 1;

        //grow plants on board:
        //update GameState for each item +1
        GameStateScript.grow();
        
        //update UI for each slot
        
        
        //run animation on each slot
    }//end timerTriggered if statement
}//end myUpdate