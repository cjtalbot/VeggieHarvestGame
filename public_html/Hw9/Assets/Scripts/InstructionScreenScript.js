/**********************************************/
//Variables
/**********************************************/
public var style: GUIStyle;
public var bold: GUIStyle;
private var GOAL_HEIGHT:float = 150;
private var GOAL_WIDTH:float = 50;
private var HEIGHT:float = 200;
private var WIDTH:float = 50;
private var GOAL_LABEL_HEIGHT:float = 50;
private var GOAL_LABEL_WIDTH:float = 600;
private var LABEL1_HEIGHT:float = 100;
private var LABEL1_WIDTH:float = 100;
private var LABEL2_HEIGHT:float = 350;
private var LABEL2_WIDTH:float = 630;
private var GOAL_COL_SIZE:float = 100;
private var COL_SIZE:float = 125;
private var ROW_SIZE:float = 100;
private var CUR_PAGE:int = 0;
private var MAX_PAGES:int = 4;
private var selectedAction:InstructionScreenActionType = InstructionScreenActionType.next;//current action selected
private enum InstructionScreenActionType{prev,next,mainmenu};//types of actions for this scene
private var buttonRate:float = 0.25;//delay before controller button will fire an action
private var nextButton:float = 0.0;//how much time will need to pass before the next button will register

/**********************************************/
// Methods
/**********************************************/

/** InstructionScreenScript:Awake
* Initialize.
*
* @author Christine Talbot
*/ 
function Awake() {
	CUR_PAGE = 0;
}//end Awake


/** InstructionScreenScript:OnGUI
* Display the instructions required to play the game, grouped by pages
*
* @author Eric Faust
* @author Christine Talbot
*/
function OnGUI () {
	var text1:String;
	var text2:String;
	var text3:String;
	var text4:String;
	var img1;
	var img2;
	var img3;
	var img4;

	// always show the goal
	
	//Goal
	var goal:String = "Goal:";
	var goalTxt:String = "To grow the most veggies on the board before the shared garden is full.";
	var divider:String = "----------------------------------------------------------------------------------------------------------------------------";
			
	GUI.Label(	new Rect(GOAL_WIDTH, GOAL_HEIGHT, GOAL_LABEL_WIDTH, GOAL_LABEL_HEIGHT),
				goal,
				bold);
				
	GUI.Label(	new Rect(GOAL_WIDTH+GOAL_COL_SIZE, GOAL_HEIGHT, GOAL_LABEL_WIDTH, GOAL_LABEL_HEIGHT),
				goalTxt,
				style);
				
	GUI.Label( new Rect(GOAL_WIDTH, GOAL_HEIGHT+25, 800, 50), divider, style);
				
	switch(CUR_PAGE) {
		case 0:	// about chips in the game
			img1 = Resources.Load('allveggiechips');
			img2 = Resources.Load('alldestroychips');
			
			text1 = "You are given veggies to grow within the shared garden:\n\nbeets, blueberries, broccoli, cabbage,\ncarrots, cucumbers, potatoes,\npumpkins, tomatoes, watermelons";
			text2 = "Destroy chips are given to simulate natural disasters.\n\nYou can use them to destroy your own plants or the AI player's plants.\nThey will destroy up to that many of whatever veggie you use it on.";
			break;
		case 1: // about board and slots
			img1 = Resources.Load('Board');
			img2 = Resources.Load('choices');
			
			text1 = 'The shared garden consists of a 3 by 6 grid of different soils.\n\nEach veggie will grow best if planted in the right soil in the garden.\nSome will prefer sand, others topsoil, clay, or volcanic soil';
			text2 = '\nYou will be given choices to grow or destroy veggies in the shared garden.\nThese chips can be played as quickly as you wish.\n\nChoose wisely as you can only have up to three actions at a time!';
			break;
		case 2: // Playing info
			img1 = Resources.Load('selectedchips');
			img2 = Resources.Load('growingplants');
			
			text1 = 'The chips in your action pile will have a blue background when selected.\nThey can be selected by:\n\nMaking a choice (grow/destroy)\nClicking on a chip in one of your action piles';
			text2 = 'You can plant your veggies on any open square OR any square with only ONE of your own veggies planted on it.\n\nThe longer the plant is planted, the more veggies it will produce, as long as it is planted alone.\nThis is represented by the number shown on top of the veggie on the board.';
			break;
		case 3: // Ownership info
			img1 = Resources.Load('AIchips');
			img2 = Resources.Load('Humanchips');
			
			text1 = 'The AI player\'s plants will have a yellow background when planted in the optimal soil.\n\nA red bar on the bottom of the plant means it was planted in the wrong soil, and will count negatively against the AI\'s score as it grows.';
			text2 = 'Your plants will have a light blue background when planted in the optimal soil.\n\nA red bar on the bottom of the plant means it was planted in the wrong soil, and will count negatively against your score as it grows.';
			break;
		case 4: // scoring and message center
			img1 = Resources.Load('scoring');
			img2 = Resources.Load('msgcenter');
			
			text1 = 'Your current score is shown at the bottom of the screen, while the AI player\'s score is shown at the top of the screen.\nScoring =\n+1 per plant planted alone on correct soil\n-1 per plant planted on wrong soil';
			text2 = 'As a reminder, the message center on the bottom right of the screen will remind you where to plant your veggies to optimize their growth.\n\nThis can be turned on/off by player, along with the level of difficulty of the game.';
			break;
		
	} // end switch
	
	// show what was calculated above
	GUI.Label(	new Rect(WIDTH, HEIGHT, LABEL1_WIDTH, LABEL1_HEIGHT),
				img1,
				bold);
				
	GUI.Label(	new Rect(WIDTH+COL_SIZE, HEIGHT, LABEL2_WIDTH, LABEL2_HEIGHT),
				text1,
				style);

	GUI.Label( new Rect(WIDTH, HEIGHT+LABEL1_HEIGHT, 800, 50), divider, style);
	//////////////////////////////////////////////////
	GUI.Label(	new Rect(WIDTH, HEIGHT+(ROW_SIZE)+25, LABEL1_WIDTH, LABEL1_HEIGHT),
				img2,
				bold);

	GUI.Label(	new Rect(WIDTH+COL_SIZE, HEIGHT+(ROW_SIZE)+25, LABEL2_WIDTH, LABEL2_HEIGHT),
				text2,
				style);
						
	GUI.SetNextControlName(InstructionScreenActionType.prev.ToString());
	// Always have the buttons for next & previous pages
	if (GUI.Button(new Rect(Screen.width/2-100-5-28, 440, 100, 25), "Previous Page")) {
		showPrev();
	}
	
	GUI.Label(new Rect(Screen.width/2-25, 443, 100, 25), (CUR_PAGE+1).ToString()+" / "+(MAX_PAGES+1).ToString(), bold); // show current page number
	GUI.SetNextControlName(InstructionScreenActionType.next.ToString());
	if (GUI.Button(new Rect(Screen.width/2+25+10, 440, 100, 25), "Next Page")) {
		showNext();
	}
	
	if (PlayerPrefs.GetInt("ControllerValueIndex",0) == 1){
		GUI.FocusControl(selectedAction.ToString());
	}
	
}//end onGUI


/** InstructionScreenScript:Update
* Gets the buttons pressed on the gamepad and select or performs the corresponding action
*
* @author Todd Dobbs
*/
function Update(){
	var action:int = selectedAction;
	if((Input.GetButton("joystick button 5")) && (Time.time > nextButton)){//right
		nextButton = Time.time + buttonRate;
		action++;
		if (action > 2){
			action = 0;
		}
		selectedAction = action;
	}
	if((Input.GetButton("joystick button 7")) && (Time.time > nextButton)){//left
		nextButton = Time.time + buttonRate;
		action--;
		if (action < 0){
			action = 2;
		}		
		selectedAction = action;
	}
	if((Input.GetButton("joystick button 14")) && (Time.time > nextButton)){//x button
		nextButton = Time.time + buttonRate;
		performSelectedAction();
	}
}//end Update

/** InstructionScreenScript:performSelectedAction
* performs the action that is selected
* @author Todd Dobbs
*/
function performSelectedAction(){
	switch(selectedAction){
		case InstructionScreenActionType.prev:
			showPrev();
			break;
		case InstructionScreenActionType.next:
			showNext();
			break;
		case InstructionScreenActionType.mainmenu:
			showMainMenu();
			break;
	}
}//end performSelectedAction

/** InstructionScreenScript:showPrev
* Updates the page to display to the previous one
* @author Christine Talbot
*/
function showPrev(){
	if (CUR_PAGE == 0) {
		CUR_PAGE = MAX_PAGES;
	} else {
		CUR_PAGE -= 1;
	}
}//end showPrev


/** InstructionScreenScript:showNext
* Updates the page to display to the next one
* @author Christine Talbot
*/
function showNext(){
	if (CUR_PAGE == MAX_PAGES) {
		CUR_PAGE = 0;
	} else {
		CUR_PAGE += 1;
	}
}//end showNext

/** InstructionScreenScript:showMainMenu
* shows the main menu
* @author Todd Dobbs
*/
function showMainMenu(){
	audio.Play();
	Application.LoadLevel('Title Screen');
}//end showMainMenu