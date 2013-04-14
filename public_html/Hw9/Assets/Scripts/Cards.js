/*
 *This code handles card movement for the player and AI as well as keeping track of 
 *which card is selected and the number of cards for the player and AI
 *@Joseph Blair
 */ 


/************************************************************/
//Variables
/************************************************************/
static var SELECTED: String='';
static var COUNT: int=0;
var num: int=0;
var cur: String='';


/************************************************************/
//Update
/************************************************************/

/**Cards:Update
* Update what card the player has selected.
*
* @author Joseph Blair
*/
function Update () {
	cur=SELECTED;
}


/************************************************************/
//OnGUI
/************************************************************/

/**Cards:makeChoice
* Places card on a card slot when a grow or destroy button is clicked
*
* @param playerType
* @param slot
* @param choice
* @author Joseph Blair
*/
static function makeChoice(playerType: int, slot: int, choice: ActionType) {
	var action:GameAction;
	
	if(playerType==PlayerType.Human) {
		if(choice==ActionType.Grow) {
			// cjt randomly calculate which veggie to give
			action = generateGrowCard();
			action.objectName = "u" + slot;
			// cjt update gamestate 
			GameStateScript.setHumanAction(slot, action);
			// cjt added message center info
			GameStateScript.setMessage(getMsgText(action));
		} else {
			// cjt randomly calculate which destroy card to give
			action = generateDestroyCard();
			action.objectName = "u" + slot;
			// cjt update gamestate
			GameStateScript.setHumanAction(slot, action);
			// cjt added message center info
			GameStateScript.setMessage(getMsgText(action));
		} //end grow if statement
	}//end human if statement
	
	if(playerType==PlayerType.AI) {
		if(choice==ActionType.Grow) {
			// cjt randomly calculate which veggie to give
			action = generateGrowCard();
			// cjt update gamestate
			GameStateScript.setAIAction(slot, action);
			// need to show in UI the plant
		} else {
			// cjt randomly calculate which destroy card to give
			action = generateDestroyCard();
			// cjt update gamestate
			GameStateScript.setAIAction(slot, action);
			// need to show in UI the plant
		}//end grow if statement
	}//end AI if statement
}//end makeChoice

/************************************************************/
//Generate
/************************************************************/

/**Cards:generateGrowCard
* Generates a random grow card and returns it to calling function
*
* @return 
* @author Christine Talbot
*/
static function generateGrowCard():GameAction {
	var action:GameAction = ScriptableObject.CreateInstance('GameAction');
	// cjt randomly calculate which veggie to give
	var maxNum:int = System.Enum.GetValues(PlantType).Length;
	var intValue:int = Mathf.Floor(Random.value * maxNum);
	var whichPlant:PlantType = intValue;
	action.plant = whichPlant;
	action.action = ActionType.Grow;
	return action;
}//end generateGrowCard

/**Cards:generateDestoryCard
* Generates a random destroy card and returns it to calling function
*
* @author Christine Talbot
*/
static function generateDestroyCard():GameAction {
	var action:GameAction = ScriptableObject.CreateInstance('GameAction');
	var howMany:int = Mathf.Floor(Random.value * 6)+1;
	action.action = ActionType.Destroy;
	action.num = howMany;
	return action;
}//end growDestroyCard

/**Cards:getImgTarget
*
* @param action
* @return 
* @author 
*/
static function getImgTarget(action:GameAction):String {
	var retMsg:String = " x";
	switch(action.action) {
		case ActionType.Grow:
			switch (action.plant) {
				case PlantType.Blueberries:
				case PlantType.Watermelon:
				case PlantType.Pumpkin:
					retMsg = SoilType.Sand.ToString().ToLower();
					break;
				case PlantType.Tomato:
					retMsg = SoilType.Volcano.ToString().ToLower();
					break;
				case PlantType.Potato:
				case PlantType.Beet:
				case PlantType.Carrot:
					retMsg = SoilType.Topsoil.ToString().ToLower();
					break;
				case PlantType.Cabbage:
				case PlantType.Broccoli:
				case PlantType.Cucumber:
					retMsg = SoilType.Clay.ToString().ToLower();
					break;
				default:
					break;
			}//end plant switch statement
			break;
		case ActionType.Destroy:		
			retMsg = action.num.ToString();
			break;
		default:
			break;
	}//end action switch statement
	
	return retMsg;
}//end getImgTarget

/**Cards:getMsgText
* Creates the text message to show in the message center
*
* @param action
* @return 
* @author Christine Talbot
*/
static function getMsgText(action:GameAction):String {
	var retMsg:String = " x";
	var retVal:String = " x";
	switch(action.action) {
		case ActionType.Grow:
			switch (action.plant) {
				case PlantType.Blueberries:
				case PlantType.Watermelon:
				case PlantType.Pumpkin:
					retVal = SoilType.Sand.ToString() + " (Yellow)";
					break;
				case PlantType.Tomato:
					retVal = SoilType.Volcano.ToString() + " (Maroon)";
					break;
				case PlantType.Potato:
				case PlantType.Beet:
				case PlantType.Carrot:
					retVal = SoilType.Topsoil.ToString() + " (Green)";
					break;
				case PlantType.Cabbage:
				case PlantType.Broccoli:
				case PlantType.Cucumber:
					retVal = SoilType.Clay.ToString() + " (Gray)";
					break;
				default:
					break;
			}//end plant switch statement
			retMsg = action.plant.ToString() + " grow best\nin " + retVal + " soils.";
			break;
		case ActionType.Destroy:		
			retMsg = "You can destroy up to " + action.num+ " parts\nof any single plant on the board";
			break;
		default:
			break;
	}//end action switch statement
	
	return retMsg;
 }//end getMsgText