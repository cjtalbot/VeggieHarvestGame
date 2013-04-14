/*
* This file provides the GUI elements for the game board scene
* @author Eric Faust
* @author Christine Talbot
*/

// styles for scoring and message center
var style1:GUIStyle;
var style2:GUIStyle;
var countStyleBlack:GUIStyle;

/************************************************************/
//CONSTANTS
/************************************************************/
private var val:int = 0;

private var LABEL_HEIGHT:int = 30;
private var LABEL_WIDTH:int = 70;
private var IMG_HEIGHT:int = 65;
private var IMG_WIDTH:int = 65;

private var ROW_SIZE:int = 105;
private var ROW_POS:int = 75;
private var LBL_ROW_POS:int = 80;

private var COL_SIZE:int = 141;
private var COL_POS:int = 10;
private var LBL_COL_POS:int = 45;

/************************************************************/
//Variables
/************************************************************/
private var row;
private var rowl;
private var col;
private var coll;
private var style:GUIStyle;

private var clickAudio:AudioSource;
private var bkgrdAudio:AudioSource;
private var boingAudio:AudioSource;

public var GameSettingsGroupPosition:Rect;
public var GameSettingsGroupContent:GUIContent;

public var DifficultyLabelPosition:Rect;
public var DifficultyLabelContent:GUIContent;
public var VideoSettingsGroupPosition:Rect;
public var VideoSettingsGroupContent:GUIContent;

public var DifficultyValuePosition:Rect;
public var DifficultyValue:float;
public var DifficultyLeftValue:float;
public var DifficultyRightValue:float;
private var DifficultyLabelStyle:GUIStyle = new GUIStyle();
	

/************************************************************/
//CONSTANTS
/************************************************************/

//Button Labels
private var CHOOSE_GROW:String = "Grow"; 
private var CHOOSE_DESTORY:String = "Destroy"; 

//Button Dimensions
private var BTN_WIDTH:int = 55;
private var BTN_HEIGHT:int = 25;
private var IMG2_WIDTH:int = 65;
private var IMG2_HEIGHT:int = 70;

private var IMG_PLAYER_SLOT_HEIGHT:int = Screen.height - 70;
private var IMG_PLAYER_SLOT_ONE_WIDTH:int = 245;
private var IMG_PLAYER_SLOT_TWO_WIDTH:int = 390;
private var IMG_PLAYER_SLOT_THREE_WIDTH:int = 535;
private var IMG_AI_SLOT_HEIGHT:int = 0;
private var IMG_AI_SLOT_ONE_WIDTH:int = 245;
private var IMG_AI_SLOT_TWO_WIDTH:int = 395;
private var IMG_AI_SLOT_THREE_WIDTH:int = 540;

//Button Positioning: Player side
private var PLAYER_SLOT_HEIGHT_GROW:int = Screen.height - 55;
private var PLAYER_SLOT_HEIGHT_DESTROY:int = PLAYER_SLOT_HEIGHT_GROW + BTN_HEIGHT; 
private var PLAYER_SLOT_ONE_WIDTH:int = 255;
private var PLAYER_SLOT_TWO_WIDTH:int = 400;
private var PLAYER_SLOT_THREE_WIDTH:int = 545;

//Button Positioning: AI side
private var AI_SLOT_HEIGHT_GROW:int = 15;
private var AI_SLOT_HEIGHT_DESTROY:int = AI_SLOT_HEIGHT_GROW + BTN_HEIGHT;
private var AI_SLOT_ONE_WIDTH:int = PLAYER_SLOT_ONE_WIDTH;
private var AI_SLOT_TWO_WIDTH:int = PLAYER_SLOT_TWO_WIDTH;
private var AI_SLOT_THREE_WIDTH:int = PLAYER_SLOT_THREE_WIDTH;

private var selectedAction:GameScreenActionType = GameScreenActionType.mainmenu;//current action selected
private enum GameScreenActionType{hints, mainmenu, difficulty, gamestate};//types of actions for this scene
private var buttonRate:float = 0.25;//delay before controller button will fire an action
private var nextButton:float = 0.0;//how much time will need to pass before the next button will register
private var gameAction:String = "";//game action from the gamestate

/************************************************************/
//Methods
/************************************************************/

/**GUIScripts:Awake
* Initialize.
* @author Eric Faust
* @author Christine Talbot -- audio updates
*/
function Awake() {
	initializeRow();
	initializeCol();
	style = new GUIStyle();
	style.normal.textColor = Color.black;
	var sources = GetComponents(AudioSource);
	clickAudio = sources[0];
	bkgrdAudio = sources[1];
	boingAudio = sources[2];
	
	countStyleBlack = new GUIStyle();
	countStyleBlack.normal.textColor = Color.black;
	countStyleBlack.fontStyle = FontStyle.Bold;
	countStyleBlack.fontSize = 24;
	DifficultyValue = PlayerPrefs.GetFloat("DifficultyValue");
	
}//end Awake

/**GUIScripts:Update
* Controller updates and difficulty settings updates
* @author Todd Dobbs
* @author Christine Talbot
*/
function Update(){
	//Debug.Log(selectedAction.ToString());
	var action:int = selectedAction;
	if((Input.GetButton("joystick button 5")) && (Time.time > nextButton)){//right
		nextButton = Time.time + buttonRate;
		action++;
		if (action > 2){
		 	gameAction = GameStateScript.getNextAction();
		 	if (gameAction == ""){
				action = 0;
			}
		}
		selectedAction = action;
		//GameStateScript.getNextValidGameAction(action);
	}
	if((Input.GetButton("joystick button 7")) && (Time.time > nextButton)){//left
		nextButton = Time.time + buttonRate;
		action--;
		if (action < 0){
		 	gameAction = GameStateScript.getPrevAction();
		 	if (gameAction == ""){
				action = 2;
			}
		}
		selectedAction = action;
		//GameStateScript.getPrevValidGameAction(action);
	}
	if((Input.GetButton("joystick button 14")) && (Time.time > nextButton)){//x button
		nextButton = Time.time + buttonRate;
		performSelectedAction();
	}
	PlayerPrefs.SetFloat("DifficultyValue", DifficultyValue);
	GameStateScript.initializeDifficulty();
}//end Update

/**GUIScripts:OnGUI
* Checks the GameState. For every slot, either on the player
* or the AI side, that has a choice available to it will display
* the choice buttons.
*
* The choice buttons will consist of a Grow and a Destroy option.
*
* Selecting one of the buttons will replace the choice buttons with
* a randomly generated card of the selected type and remove the choice
* buttons from view.
*
* @author Eric Faust
* @author Christine Talbot
* @author Todd Dobbs
*/
function OnGUI() {
	/**
	* DisplayPlantedVeggies Info moved into one file
	*/

	var img;
	var which:String;

	for(var r:int = 0; r < row.length; r++) {
		for (var c:int = 0; c < col.length; c++ ) {
			for (var slot:int = 0; slot < 4; slot++) { // cjt added to conditionally show the counts in the UI
				val = GameStateScript.getPlantNum(r, c, slot); // cjt added to conditionally show the counts in the UI
				GameStateScript.updateTimer(r,c,slot);
				if (val != 0) { // cjt added to conditionally show the counts in the UI
					if (slot < 2) {
						// cjt added to show images for plants
						which = getWhich(r,c,slot);
						img = Resources.Load(which);
						GUI.SetNextControlName("s0");
						if(GUI.Button(	new Rect(	col[c] + Mathf.CeilToInt((slot%2)*(COL_SIZE/2)), 
							row[r], 
							IMG_WIDTH, 
							IMG_HEIGHT), 
							img)) {
								performPlayCard( r, c, slot);
							}
						GUI.Label( new Rect(	coll[c] + Mathf.CeilToInt((slot%2)*(COL_SIZE/2)), 
							rowl[r], 
							LABEL_WIDTH, 
							LABEL_HEIGHT), 
							val.ToString(), countStyleBlack);
					} else {
						// cjt added to show images for plants
						which = getWhich(r,c,slot);
						img = Resources.Load(which);
						GUI.SetNextControlName("s0");
						if(GUI.Button(	new Rect(	col[c] + Mathf.CeilToInt((slot%2)*(COL_SIZE/2)), 
						row[r] + Mathf.CeilToInt(ROW_SIZE/2), 
						IMG_WIDTH, 
						IMG_HEIGHT), 
						img)) {
							performPlayCard( r, c, slot);
						}
						// shows the size of the plant on top
						GUI.Label(new Rect(	coll[c] + Mathf.CeilToInt((slot%2)*(COL_SIZE/2)), 
						rowl[r] + Mathf.CeilToInt(ROW_SIZE/2), 
						LABEL_WIDTH, 
						LABEL_HEIGHT), 
						val.ToString(), countStyleBlack);
					}
				}//end val!=0 if statement
			}//end slot for loop
		}//end col for loop
	}//end row for loop

	/**
	* end of display planted veggies counts
	*/

	/**
	* start of display slot choices
	*/
	var temp:GameAction;
	var img3;
	var which3:String;

	//Player:Slot#1
	temp = GameStateScript.getHumanAction(0);
	if (temp != null && temp.action == ActionType.Choice) {
		GUI.SetNextControlName("g0");
		// added condition to play sound and apply selected images
		if (GUI.Button(new Rect(PLAYER_SLOT_ONE_WIDTH, PLAYER_SLOT_HEIGHT_GROW, BTN_WIDTH, BTN_HEIGHT), CHOOSE_GROW )) { //Player:slot#1:Grow
			pickGrow(0);
		}
		GUI.SetNextControlName("d0");
		if (GUI.Button(new Rect(PLAYER_SLOT_ONE_WIDTH, PLAYER_SLOT_HEIGHT_DESTROY, BTN_WIDTH, BTN_HEIGHT), CHOOSE_DESTORY)) { //Player:slot#1:Destroy
			pickDestroy(0);
		}
	}//end Player:Slot#1 if statement
	else if (temp != null) { // cjt added so can see something while we are waiting on images
		which3 = ((temp.action == ActionType.Grow)?(temp.plant.ToString().ToLower()+"_"+((GameStateScript.getClicked() == 0)?("selected"):("chip"))):("destroy"+temp.num + ((GameStateScript.getClicked() == 0)?("_selected"):(""))));
		//Debug.Log("image="+which3);
		img3 = Resources.Load(which3);
		GUI.SetNextControlName("u0");
		if (GUI.Button(new Rect (IMG_PLAYER_SLOT_ONE_WIDTH, IMG_PLAYER_SLOT_HEIGHT, IMG2_WIDTH, IMG2_HEIGHT), img3)) {
			useAction(0);
		}
	}

	//Player:Slot#2
	temp = GameStateScript.getHumanAction(1);
	if (temp != null && temp.action == ActionType.Choice) { 
		GUI.SetNextControlName("g1");
		// added condition to play sound and apply selected images
		if (GUI.Button(new Rect(PLAYER_SLOT_TWO_WIDTH, PLAYER_SLOT_HEIGHT_GROW, BTN_WIDTH, BTN_HEIGHT), CHOOSE_GROW )) { //Player:Slot#2:Grow
			pickGrow(1);
		}
		GUI.SetNextControlName("d1");
		if (GUI.Button(new Rect(PLAYER_SLOT_TWO_WIDTH, PLAYER_SLOT_HEIGHT_DESTROY, BTN_WIDTH, BTN_HEIGHT), CHOOSE_DESTORY)) { //Player:Slot#2:Destroy
			pickDestroy(1);
		}

	}//end Player:Slot#2 if statement
	else if (temp != null) {// cjt added so can see something while we are waiting on images
		which3 = ((temp.action == ActionType.Grow)?(temp.plant.ToString().ToLower()+"_"+((GameStateScript.getClicked() == 1)?("selected"):("chip"))):("destroy"+temp.num + ((GameStateScript.getClicked() == 1)?("_selected"):(""))));
		//Debug.Log("image="+which3);
		img3 = Resources.Load(which3);
		GUI.SetNextControlName("u1");
		if (GUI.Button(new Rect (IMG_PLAYER_SLOT_TWO_WIDTH, IMG_PLAYER_SLOT_HEIGHT, IMG2_WIDTH, IMG2_HEIGHT), img3)) {
			useAction(1);
		}
	}

	//Player:Slot#3
	temp = GameStateScript.getHumanAction(2);
	if (temp != null && temp.action == ActionType.Choice)  { 
		GUI.SetNextControlName("g2");
		if (GUI.Button(new Rect(PLAYER_SLOT_THREE_WIDTH, PLAYER_SLOT_HEIGHT_GROW, BTN_WIDTH, BTN_HEIGHT), CHOOSE_GROW )) { //Player:Slot#3:Grow
			pickGrow(2);
		}
		GUI.SetNextControlName("d2");
		if (GUI.Button(new Rect(PLAYER_SLOT_THREE_WIDTH, PLAYER_SLOT_HEIGHT_DESTROY, BTN_WIDTH, BTN_HEIGHT), CHOOSE_DESTORY)) { //Player:Slot#2:Destroy
			pickDestroy(2);
		}

	}//end Player:Slot#3 if statement
	else if (temp != null) {// cjt added so can see something while we are waiting on images
		which3 = ((temp.action == ActionType.Grow)?(temp.plant.ToString().ToLower()+"_"+((GameStateScript.getClicked() == 2)?("selected"):("chip"))):("destroy"+temp.num + ((GameStateScript.getClicked() == 2)?("_selected"):(""))));
		//Debug.Log("image="+which3);
		img3 = Resources.Load(which3);
		GUI.SetNextControlName("u2");
		if (GUI.Button(new Rect (IMG_PLAYER_SLOT_THREE_WIDTH, IMG_PLAYER_SLOT_HEIGHT, IMG2_WIDTH, IMG2_HEIGHT), img3)) {
			useAction(2);
		}
	}

	//////////////////////////////////////////////////
	//AI:Slot#1
	temp = GameStateScript.getAIAction(0);
	if (temp != null && temp.action == ActionType.Choice) { 
		// cjt removed the check for button clicks on the AI slots since don't need the sounds or calls
		if(GUI.Button(new Rect(AI_SLOT_ONE_WIDTH, AI_SLOT_HEIGHT_GROW, BTN_WIDTH, BTN_HEIGHT), CHOOSE_GROW )) {
			boingAudio.Play();
		}
		if(GUI.Button(new Rect(AI_SLOT_ONE_WIDTH, AI_SLOT_HEIGHT_DESTROY, BTN_WIDTH, BTN_HEIGHT), CHOOSE_DESTORY)) {
			boingAudio.Play();
		}
	}//end AI:Slot#1 if statement
	else if (temp != null) {// cjt added so can see something while we are waiting on images
		which3 = (temp.action == ActionType.Grow)?(temp.plant.ToString().ToLower()+"_chip"):("destroy"+temp.num);
		img3 = Resources.Load(which3);
		if(GUI.Button(new Rect (IMG_AI_SLOT_ONE_WIDTH, IMG_AI_SLOT_HEIGHT, IMG2_WIDTH, IMG2_HEIGHT), img3)) {
			boingAudio.Play();
		}

	}

	//AI:Slot#2
	temp = GameStateScript.getAIAction(1);
	if (temp != null && temp.action == ActionType.Choice)  { // cjt added for conditionally showing the buttons
		// cjt removed the check for button clicks on the AI slots since don't need the sounds or calls
		if(GUI.Button(new Rect(AI_SLOT_TWO_WIDTH, AI_SLOT_HEIGHT_GROW, BTN_WIDTH, BTN_HEIGHT), CHOOSE_GROW )) {
			boingAudio.Play();
		}
		if(GUI.Button(new Rect(AI_SLOT_TWO_WIDTH, AI_SLOT_HEIGHT_DESTROY, BTN_WIDTH, BTN_HEIGHT), CHOOSE_DESTORY)) {
			boingAudio.Play();
		}
	}//end AI:Slot#2 if statement
	else if (temp != null) {// cjt added so can see something while we are waiting on images
		which3 = (temp.action == ActionType.Grow)?(temp.plant.ToString().ToLower()+"_chip"):("destroy"+temp.num);
		img3 = Resources.Load(which3);
		if(GUI.Button(new Rect (IMG_AI_SLOT_TWO_WIDTH, IMG_AI_SLOT_HEIGHT, IMG2_WIDTH, IMG2_HEIGHT), img3)) {
			boingAudio.Play();
		}
	}

	//AI:Slot#3
	temp = GameStateScript.getAIAction(2);
	if (temp != null && temp.action == ActionType.Choice) { 
		// cjt removed the check for button clicks on the AI slots since don't need the sounds or calls
		if(GUI.Button(new Rect(AI_SLOT_THREE_WIDTH, AI_SLOT_HEIGHT_GROW, BTN_WIDTH, BTN_HEIGHT), CHOOSE_GROW )) {
			boingAudio.Play();
		}
		if(GUI.Button(new Rect(AI_SLOT_THREE_WIDTH, AI_SLOT_HEIGHT_DESTROY, BTN_WIDTH, BTN_HEIGHT), CHOOSE_DESTORY)) {
			boingAudio.Play();
		}
	}//end AI:Slot#3 if statement
	else if (temp != null) {// cjt added so can see something while we are waiting on images
		which3 = (temp.action == ActionType.Grow)?(temp.plant.ToString().ToLower()+"_chip"):("destroy"+temp.num);
		img3 = Resources.Load(which3);
		if(GUI.Button(new Rect (IMG_AI_SLOT_THREE_WIDTH, IMG_AI_SLOT_HEIGHT, IMG2_WIDTH, IMG2_HEIGHT), img3)) {
			boingAudio.Play();
		}
	}

	/**
	* end of displayslotchoices
	*/

	/**
	* start scoring and message center displays
	* @author Christine Talbot
	*/

	// loop through all the gamestate buttons and played items and display
	GUI.Label( new Rect(20, 15,200,50)    ,"AI Score: " + GameStateScript.getAIScore().ToString(), style1);
	GUI.Label( new Rect(20, Screen.height - 70,200,50)   ,"Player Score: " + GameStateScript.getPlayerScore().ToString(), style1);
	
	// shows hints and turns it on/off within the game, as desired
	if (GameStateScript.HintsOn()) {
		var msg:String = GameStateScript.getMessage();
		var img1:String = GameStateScript.getImg1();
		var img2:String = GameStateScript.getImg2();

		if (img1 != null && img2 != null) {
			GUI.Label( new Rect(Screen.width - 250, Screen.height - 80, 245, 75), " ", style2); // general message
			GUI.Label( new Rect(Screen.width - 230, Screen.height - 70, 60, 60), Resources.Load(img1)); // veggie to show
			GUI.Label( new Rect(Screen.width - 155, Screen.height - 60, 60, 60), Resources.Load('arrow'));
			GUI.Label( new Rect(Screen.width - 80, Screen.height - 70, 60, 60), Resources.Load(img2)); // ground to show or ? with # on it?
		} else {
			GUI.Label( new Rect(Screen.width - 250, Screen.height - 80, 245, 75), (msg == null)?" ":msg, style1);
		}
		GUI.SetNextControlName(GameScreenActionType.hints.ToString());
		if (GUI.Button( new Rect(Screen.width - 190, 5, 100, 25), "Hints are On")) {
			GameStateScript.setHints(false);
		}

	} else {
		GUI.SetNextControlName(GameScreenActionType.hints.ToString());
		if (GUI.Button( new Rect(Screen.width - 190, 5, 100, 25), "Hints are Off")) {
			GameStateScript.setHints(true);
		}
	}
	
	// shows difficulty level and can change it during the game
	GUI.Box(GameSettingsGroupPosition, GameSettingsGroupContent);//, GameSettingsGroupStyle);
	
	GUI.Label(DifficultyLabelPosition, DifficultyLabelContent,DifficultyLabelStyle);
	GUI.SetNextControlName(GameScreenActionType.difficulty.ToString());
	DifficultyValue = GUI.HorizontalSlider (DifficultyValuePosition, DifficultyValue, DifficultyLeftValue, DifficultyRightValue);
	
		
	if (PlayerPrefs.GetInt("ControllerValueIndex",0) == 1){
		GUI.FocusControl(selectedAction.ToString());
	}
}//end OnGUI


/************************************************************/
//Perform
/************************************************************/


/**GUIScripts:performQuit
* quit the game
*
* @author Todd Dobbs
*/
function performQuit(){
	audio.Play();
	Application.LoadLevel('Title Screen');
}//end performQuit

/**GUIScripts:performPlayCard
* plays a card on row r and col c in slot.
*
* @param r
* @param c
* @param slot
* @author Todd Dobbs
*/
function performPlayCard(r:int, c:int, slot:int){
	// cjt added to capture selected & audio
	if(GameStateScript.getClicked() != -1) {
		if(GameBoardScript.playCard(GameStateScript.getClicked(), PlayerType.Human, r, c, slot)) {
			clickAudio.Play();
		} else {
			boingAudio.Play();
		}
	}  else {
		boingAudio.Play(); // can't select squares unless something in the slots are chosen
	}
}//end performPlayCard

/**GUIScripts:performSelectedAction
* performs the action that is selected
*
* @author Todd Dobbs
*/
function performSelectedAction(){
	switch(selectedAction){
	case GameScreenActionType.mainmenu:
		performQuit();
		break;
	case GameScreenActionType.hints:	
		toggleHints();
		break;
	case GameScreenActionType.difficulty:
		performDifficultyAction();
		break;
	case GameScreenActionType.gamestate:
		
		break;
	}
}//end performSelectedAction

/**GUIScripts:useAction
*  uses action in slot
*
* @param slot
* @author Todd Dobbs
*/
function useAction(slot:int){
	clickAudio.Play();
	GameStateScript.setClicked(slot);
}//end useAction

/************************************************************/
//Initialize
/************************************************************/

/**GUIScripts:initializeRow
* Helper method that initializes the row and rowl variables
*
* @author Eric Faust
*/
function initializeRow() {
	row = new Array();
	rowl = new Array();
	row.length = 3;
	rowl.length = 3;
	for (var i = 0; i < row.length; i++) {
		row[i] = ROW_POS + (i*ROW_SIZE);
		rowl[i] = LBL_ROW_POS + (i*ROW_SIZE);
	}//end i for loop
}//end initializeRow

/**GUIScripts:initializeCol
* Helper method that initializes the col and coll variables
*
* @author Eric Faust
*/
function initializeCol() {
	col = new Array();
	coll = new Array();
	col.length = 6;
	coll.length = 6;
	for (var i = 0; i < col.length; i++) {
		col[i] = COL_POS + (i*COL_SIZE);
		coll[i] = LBL_COL_POS + (i*COL_SIZE);
	}//end i for loop
}//end initializeCol


/************************************************************/
//GET
/************************************************************/

/**GUIScripts:getWhich
* Gets the name of the image to show for the specified row,col, and slot
*
* @param r
* @param c
* @param slot
* @return
* @author Christine Talbot
*/
function getWhich(r:int, c:int, slot:int):String {
	var retVal:String = "";
	switch (GameStateScript.getGrowState(r,c,slot)) {
		case 1:
			retVal = 'growing1';
			break;
		case 2:
			retVal = 'growing2';
			break;
		case 3:
			retVal = 'growing3';
			break;
		case 4:
			retVal = GameStateScript.getPlants(r,c).Item[slot].plant.ToString().ToLower() + '-growing4';
			break;
		case 5:
			retVal = GameStateScript.getPlants(r,c).Item[slot].plant.ToString().ToLower() + '-growing5';
			break;
		default:
			var wrong:boolean = GameStateScript.getPlants(r,c).Item[slot].wrongSoil;
			retVal = GameStateScript.getPlants(r,c).Item[slot].plant.ToString().ToLower()+"_"+GameStateScript.getPlants(r,c).Item[slot].player.ToString().ToLower() + ((wrong)?"_wrong":"");
			break;
	}//end switch

	return retVal; 
}//end getWhich


/**GUIScripts:pickGrow
* picks the grow action 
*
* @param slot
* @author Todd Dobbs
*/
function pickGrow(slot:int){
	clickAudio.Play();
	Cards.makeChoice(PlayerType.Human, slot, ActionType.Grow); // cjt added to process the click and give veggie/destroy card
	GameStateScript.setClicked(slot); // defaults this one to be clicked so we trigger the message center
}//end pickGrow

/**GUIScripts:toggleHints
* toggles hints on/off 
*
* @param slot
* @author Todd Dobbs
*/
function toggleHints(){
	if (GameStateScript.HintsOn()){
		GameStateScript.setHints(false);
	}else{
		GameStateScript.setHints(true);
	}
}

/**GUIScripts:pickDestroy
* picks the destroy action in slot
*
* @param slot
* @author Todd Dobbs
*/
function pickDestroy(slot:int){
	clickAudio.Play();
	Cards.makeChoice(PlayerType.Human, slot, ActionType.Destroy); // cjt added to process the click and give veggie/destroy card
	GameStateScript.setClicked(slot); // defaults this one to be clicked so we trigger the message center
}//end pickDestroy

/**GUIScripts:performDifficultyAction
* changes difficulty
*
* @param slot
* @author Todd Dobbs
*/
function performDifficultyAction(){
	DifficultyValue++;
	if (DifficultyValue > DifficultyRightValue){
		DifficultyValue = DifficultyLeftValue;
	}		
}