/*
 * This file provides the object for the game state
 * @author Todd Dobbs
 */
 
/**********************************************/
//Variables
/**********************************************/
 
static var board:System.Collections.ArrayList = new System.Collections.ArrayList(); //2D array of the board
static var rows:int = 3; //number of rows of the game board
static var columns:int = 6; //number of columns of the game board
static var delayAI:float = 5.0; //AI delay
static var randomAI:float = .5; // how much randomness should be included (tied closely to delayAI)
static var soilTypes:System.Collections.ArrayList = new System.Collections.ArrayList(); //2D array of the board
static var scoreAI:int = 0; //AI player's score
static var scorePlayer:int = 0; //Human player's score
static var humanActions:System.Collections.ArrayList = new System.Collections.ArrayList(); //actions available to the human player
static var AIActions:System.Collections.ArrayList = new System.Collections.ArrayList(); //actions available to the AI player
static var ActionCount:int = 3; //number of actions for each player
static var message:String;
static var img1:String;
static var img2:String;
static var hints:boolean = true;

enum PlayerType {AI, Human};
enum PlantType {Beet, Blueberries, Broccoli, Cabbage, Carrot, Cucumber, Potato, Pumpkin, Watermelon, Tomato};
enum SoilType {Clay, Sand, Topsoil, Volcano};
enum ActionType {Choice, Destroy, Grow};

static var clickedSlot:int = -1;

/**********************************************/
//Awake
/**********************************************/

/** GameStateScript:Awake
* This method is called when the object is created
*
* @author Todd Dobbs
*/
static function myAwake(){
	initSoilTypes();
	initializeBoard();
	initializePlayerActions();
	initializeAIActions();
	initializeDifficulty();
	initializeHints();
}//end myAwake


/**********************************************/
//Initialize
/**********************************************/

/** GameStateScript:initializeDifficulty
* This sets the difficulty for the game based on the player preferences value and sets how long to delay the AI from playing and how smart it should play
*
* @author Christine Talbot
*/
static function initializeDifficulty() {
	if(PlayerPrefs.HasKey("DifficultyValue")){
	   // there is a difficulty value
	   delayAI = 11.0 - PlayerPrefs.GetFloat("DifficultyValue");
	   randomAI = delayAI/10.0;
	}else{
	   // no difficulty value
	  delayAI = 5.0;
	  randomAI = delayAI/10.0;
	}
	//Debug.Log("AI Difficulty = "+PlayerPrefs.GetFloat("DifficultyValue")+",delay="+delayAI+", random="+randomAI);
}//end initializeDifficulty

/** GameStateScript:initializeHints
* This sets the hints to be on/off based on the player preferences
*
* @author Christine Talbot
*/
static function initializeHints() {
	if(PlayerPrefs.HasKey("Hints")){
	   hints = ((PlayerPrefs.GetInt("Hints")==1)?true:false);
	}else{
	   hints = true;
	}

}//end initializeDifficulty

/** GameStateScript:initializeBoard
* This method initializes the board
*
* @author Todd Dobbs
*/
static function initializeBoard(){
	board.Clear();
	for (var row=0; row < rows; row++) {
		var column:System.Collections.ArrayList = new System.Collections.ArrayList();
		board.Add(column);
		for (var col=0; col < columns; col++) {
			var boardObject:BoardObject = ScriptableObject.CreateInstance('BoardObject');
			boardObject.soil = getSoilType(row,col);
			boardObject.row = row;
			boardObject.col = col;
			column.Add(boardObject);
		}//end col for loop
	}//end row for loop
}//end initializeBoard

/** GameStateScript:initializePlayerActions
* This method intializes human player actions
*
* @author Todd Dobbs
*/
static function initializePlayerActions(){
	humanActions.Clear();
	humanActions.Add(null);
	humanActions.Add(null);
	humanActions.Add(null);
}//end initializePlayerActions

/** GameStateScript:initializeAIActions
* This method initializes AI player actions
*
* @author Todd Dobbs
*/
static function initializeAIActions(){
	AIActions.Clear();
	AIActions.Add(null);
	AIActions.Add(null);
	AIActions.Add(null);
}//end initializeAIActions

/** GameStateScript:initSoilTypes
* initialze the types of soil on the board
*
* @author Todd Dobbs
*/
static function initSoilTypes(){
	soilTypes.Clear();
	soilTypes.Add(SoilType.Volcano);
	soilTypes.Add(SoilType.Clay);
	soilTypes.Add(SoilType.Topsoil);
	soilTypes.Add(SoilType.Topsoil);
	soilTypes.Add(SoilType.Sand);
	soilTypes.Add(SoilType.Sand);	
	soilTypes.Add(SoilType.Volcano);
	soilTypes.Add(SoilType.Clay);
	soilTypes.Add(SoilType.Clay);
	soilTypes.Add(SoilType.Topsoil);
	soilTypes.Add(SoilType.Topsoil);
	soilTypes.Add(SoilType.Sand);
	soilTypes.Add(SoilType.Clay);
	soilTypes.Add(SoilType.Clay);
	soilTypes.Add(SoilType.Topsoil);
	soilTypes.Add(SoilType.Topsoil);
	soilTypes.Add(SoilType.Sand);
	soilTypes.Add(SoilType.Sand);					
}//end initSoilTypes

/**********************************************/
// Has - Boolean conditional checks
/**********************************************/


static function hasFocus(objectName:String){

}

/** GameStateScript:hasPlayerActions
* This method returns true if the human player has actions that can be performed, false otherwise
*
* @author Todd Dobbs
*/
static function hasPlayerActions():boolean{
	return ((humanActions[0] != null)||(humanActions[1] != null)||(humanActions[2] != null));
}//end hasPlayerActions

/** GameStateScript:hasAIActions
* This method returns true if the AI player has actions that can be performed, false otherwise
*
* @author Todd Dobbs
*/
static function hasAIActions():boolean{
	return ((AIActions[0] != null)||(AIActions[1] != null)||(AIActions[2] != null));
}//end hasAIActions

/** GameStateScript:hasMultiplePlanted
* this method returns true if there are more than one plants at location row, col for any one player
*
* @author Todd Dobbs
*/
static function hasMultiplePlanted(row:int, column:int):boolean{
	return board[row][column].hasMultiplePlanted();
}//end hasMultiplePlanted

/** GameStateScript:isBoardFull
* This method returns true if the board is full, false otherwise
*
* @author Todd Dobbs
*/
static function isBoardFull():boolean{
	for (var row=0; row < rows; row++) {
		for (var col=0; col < columns; col++) {
			if (board[row][col].isEmpty()){
				return false;
			}
		}
	}
	return true;	
}//end isBoardFull

/**********************************************/
//Setters
/**********************************************/

/** GameStateScript:setHints
* This method sets / updates the hints being on/off in the game
*
* @param {boolean} val true/false to set the hints to
* @author Christine Talbot
*/

static function setHints(val:boolean) {
	hints = val;
}

/** GameStateScript:setHumanAction
* This method sets the action at the specified index to the specified game ation for the human player
*
* @param {int} index to set
* @param {GameAction} action to set at index
* @author Todd Dobbs
*/
static function setHumanAction(index:int, action:GameAction){
	humanActions.Item[index] = action;
}//end setHumanAction

/** GameStateScript:setAIAction
* This method sets the action at the specified index to the specified game ation for the AI player
*
* @param {int} index to set
* @param {GameAction} action to set at index
* @author Todd Dobbs
*/
static function setAIAction(index:int, action:GameAction){
	AIActions.Item[index] = action;
}//end setAIAction

/** GameStateScript:setMessage
* This updates the text to show in the message center
*
* @param {String} newMessage message to display (text only) in message center
* @author Christine Talbot
*/
static function setMessage(newMessage:String){
	message = newMessage;
	img1 = null;
	img2 = null;

}//end setMessage

/** GameStateScript:setMessage
* This updates the text & images to show in the message center
*
* @param {String} newimg1 first image to show
* @param {String} newimg2 second image to show
* @param {String} newMessage text to show
* @author Christine Talbot
*/
static function setMessage(newimg1:String, newimg2:String, newMessage:String) {
	message = newMessage;
	img1 = newimg1;
	img2 = newimg2;
}//end setMessage

/** GameStateScript:setClicked
* This sets which slot is selected and updates the message center for relevant information
*
* @param {Number} which which slot for the Human player to mark as selected
* @author Christine Talbot
*/
static function setClicked(which:int) {
	
	clickedSlot = which;
	if (which != -1) {
		var useImg;
		var whichAction:GameAction = getHumanAction(which);
		if (whichAction.action == ActionType.Grow)  {
			useImg = whichAction.plant.ToString().ToLower() + "_chip";
		} else {
			useImg = "destroy"+whichAction.num;
		}
		setMessage(useImg, Cards.getImgTarget(whichAction), Cards.getMsgText(getHumanAction(which)));
	} else {
		setMessage("");
	}
}//end setClicked

/**********************************************/
//Getters
/**********************************************/

/** GameStateScript:getPrevAction
* This returns the next action in the gamestate based on the directional button pushon the controller
*
* @return {String} ID of the next action
* @author Todd Dobbs
*/
static function getPrevAction():String{
	return "";
}

/** GameStateScript:getNextAction
* This returns the previous action in the gamestate based on the directional button pushon the controller
*
* @return {Number} ID of the next action
* @author Todd Dobbs
*/
static function getNextAction():String{
	return "";
}

/** GameStateScript:getClicked
* This returns which slot's card is currently selected by the player
*
* @return {Number} slot number which is selected for the human
* @author Christine Talbot
*/
static function getClicked():int {
	return clickedSlot;
}//end getClicked

/** GameStateScript:getMessage
* this returns the current text message for message center
* @return {String} message
* @author Christine Talbot
*/
static function getMessage():String{
	return message;
}//end getMessage

/** GameStateScript:getImg1
* this returns the first image name for message center
* @return {String} name of image1
* @author Christine Talbot
*/
static function getImg1():String {
	return img1;
}//end getImg1

/** GameStateScript:getImg2
* this returns the second image name for message center
* @return {String} name of image2
* @author Christine Talbot
*/
static function getImg2():String {
	return img2;
}//end getImg2

/** GameStateScript:getHumanAction
* This method gets the action at the specified index for the human player
*
* @param {int} index of the action
* @return {GameAction} game action at index
* @author Todd Dobbs
*/
static function getHumanAction(index:int):GameAction{
	if (humanActions.Count <= index) {
		return null;
	} else {
		return humanActions.Item[index];
	}
}//end getHumanAction

/** GameStateScript:getAIAction
* This method gets the action at the specified index for the AI player
*
* @param {int} index of the action
* @return {GameAction} game action at index
* @author Todd Dobbs
*/
static function getAIAction(index:int):GameAction{
	if (AIActions.Count <= index) {
		return null;
	} else {
		return AIActions.Item[index];
	}
}//end getAIAction

/** GameStateScript:getHumanPlants
* This method returns the board objects on the board for a specified player
*
* @param {PlayerType} the player to get plants for
* @return {ArrayList} a list of plants for specified player
* @author Todd Dobbs
*/
static function getHumanPlants(player:PlayerType):ArrayList{
	var playerCells:System.Collections.ArrayList = new System.Collections.ArrayList();
	for (var row=0; row < rows; row++) {
		for (var col=0; col < columns; col++) {
			if (board[row][col] != null && board[row][col].getPlayerPlantCount(player) > 0){
				playerCells.Add(board[row][col]);
			}
		}
	}
	return playerCells;	
}//end getHumanPlants

/** GameStateScript:getHumanPlantsInstances
* This method returns the board objects on the board for a specified player NOT summed for growth
*
* @param {PlayerType} player which player to get info for
* @return {Array} list of plant cells which have at least one plant in them for the specified player
* @author Christine Talbot
*/
static function getHumanPlantsInstances(player:PlayerType):ArrayList{
	var playerCells:System.Collections.ArrayList = new System.Collections.ArrayList();
	for (var row=0; row < rows; row++) {
		for (var col=0; col < columns; col++) {
			if (board[row][col] != null && board[row][col].getPlayerPlantInstanceCount(player) > 0){
				playerCells.Add(board[row][col]);
			}
		}
	}
	return playerCells;	
}//end getHumanPlantsInstances

/** GameStateScript:getHumanPlants
* This method returns the board objects on the board for a specified player and soil type
*
* @param {PlayerType} the player to get plants for
* @param {Soiltype} the soiltype to get plants for
* @return {ArrayList} a list of plants for specified player and soil type
* @author Todd Dobbs
*/
static function getHumanPlants(player:PlayerType, soil:SoilType):ArrayList{
	var playerCells:System.Collections.ArrayList = new System.Collections.ArrayList();
	for (var row=0; row < rows; row++) {
		for (var col=0; col < columns; col++) {
			var p:BoardObject = board[row][col];
			if ((p.soil == soil) && (p.getPlayerPlantCount(player) > 0)){
				playerCells.Add(board[row][col]);
			}
		}
	}
	return playerCells;	
}//end getHumanPlants

/** GameStateScript:getHumanPlantsInstances
* This method returns the board objects on the board for a specified player and soil type
*
* @param {PlayerType} player which player to look for info for
* @param {SoilType} soil which soil type to check for within the board
* @return {Array} list of plants for the player on that soil
* @author Christine Talbot
*/
static function getHumanPlantsInstances(player:PlayerType, soil:SoilType):ArrayList{
	var playerCells:System.Collections.ArrayList = new System.Collections.ArrayList();
	for (var row=0; row < rows; row++) {
		for (var col=0; col < columns; col++) {
			var p:BoardObject = board[row][col];
			if ((p.soil == soil) && (p.getPlayerPlantInstanceCount(player) > 0)){
				playerCells.Add(board[row][col]);
			}
		}
	}
	return playerCells;	
}//end getHumanPlantsInstances

/** GameStateScript:getHumanPlantsNotOfSoilType
* This method returns the board objects on the board for a specified player and soil type
*
* @param {PlayerType} the player to get plants for
* @param {Soiltype} the soiltype to get plants for
* @return {ArrayList} a list of plants for specified player and soil type
* @author Todd Dobbs
*/
static function getHumanPlantsNotOfSoilType(player:PlayerType, soil:SoilType):ArrayList{
	var playerCells:System.Collections.ArrayList = new System.Collections.ArrayList();
	for (var row=0; row < rows; row++) {
		for (var col=0; col < columns; col++) {
			var p:BoardObject = board[row][col];
			if ((p.soil != soil) && (p.getPlayerPlantCount(player) > 0)){
				playerCells.Add(board[row][col]);
			}
		}
	}
	return playerCells;	
}//end getHumanPlantsNotOfSoilType

/** GameStateScript:getHumanPlantsNotOfSoilTypeInstances
* This method returns the board objects on the board for a specified player and soil type not summed for growth
*
* @param {PlayerType} player player to check for info for
* @param {SoilType} soil soil type to NOT pull (all but that type)
* @return {Array} list of plants for the player NOT planted on the soiltype specified
* @author Christine Talbot
*/
static function getHumanPlantsNotOfSoilTypeInstances(player:PlayerType, soil:SoilType):ArrayList{
	var playerCells:System.Collections.ArrayList = new System.Collections.ArrayList();
	for (var row=0; row < rows; row++) {
		for (var col=0; col < columns; col++) {
			var p:BoardObject = board[row][col];
			if ((p.soil != soil) && (p.getPlayerPlantInstanceCount(player) > 0)){
				playerCells.Add(board[row][col]);
			}
		}
	}
	return playerCells;	
}//end getHumanPlantsNotOfSoilTypeInstances

/** GameStateScript:getPlants
* This method returns the planted objects of a given row, col
*
* @param {int} row row of plant
* @param {col} col of plant
* @return {ArrayList} list of planted objects
* @author Todd Dobbs
*/
static function getPlants(row:int, col:int):ArrayList{
	return board[row][col].planted;
}//getPlants

/** GameStateScript:getEmptyCells
* This method returns the board objects on the board that are empty
*
* @author Todd Dobbs
*/
static function getEmptyCells():ArrayList{
	var playerCells:System.Collections.ArrayList = new System.Collections.ArrayList();
	for (var row=0; row < rows; row++) {
		for (var col=0; col < columns; col++) {
			if (board[row][col].isEmpty()){
				playerCells.Add(board[row][col]);
			}
		}
	}
	return playerCells;	
}//end getEmptyCells

/** GameStateScript:getEmptyCells
* This method returns the board objects on the board that are empty for the specific soil type
*
* @param {SoilType} the type of soil to filter on
* @return {ArrayList} list of board objets
* @author Todd Dobbs
*/
static function getEmptyCells(soil:SoilType):ArrayList{
	var playerCells:System.Collections.ArrayList = new System.Collections.ArrayList();
	for (var row=0; row < rows; row++) {
 		for (var col=0; col < columns; col++) {
			var temp:BoardObject = board[row][col];
  			if ((board[row][col].isEmpty()) && (temp.soil == soil)){
   				playerCells.Add(board[row][col]);
  			}
 		}
	}
	return playerCells; 
}//end getEmptyCells

/** GameStateScript:getEmptyCellsNotOfSoilType
* This method returns the board objects on the board that are empty and do not have the specific soil type
*
* @param {SoilType} the type of soil to filter on
* @return {ArrayList} list of board objets
* @author Todd Dobbs
*/
static function getEmptyCellsNotOfSoilType(soil:SoilType):ArrayList{
	var playerCells:System.Collections.ArrayList = new System.Collections.ArrayList();
	for (var row=0; row < rows; row++) {
 		for (var col=0; col < columns; col++) {
			var temp:BoardObject = board[row][col];
  			if ((board[row][col].isEmpty()) && (temp.soil != soil)){
   				playerCells.Add(board[row][col]);
  			}
 		}
	}
	return playerCells; 
}//end getEmptyCellsNotOfSoilType

/** GameStateScript:getSoilType
* this method gets the soil type at row, col
*
* @param
* @param
* @return 
* @author Todd Dobbs
*/
static function getSoilType(row:int, col:int):SoilType {
	var index:int;
	//vcttss vcctts ccttss
	index = columns*(row%3)+col;
	if (index < soilTypes.Count){
		return soilTypes[index];	
	}
}//end getSoilType

/** GameStateScript:getUsableCardCount
* this method gets the number of usable game actions for the specified player
*
* @param {PlayerType} filter for player
* @return {int} count given the filter
* @author Todd Dobbs
*/
static function getUsableCardCount(playerNum:PlayerType):int{
	if (playerNum == PlayerType.Human){
		return getUsablePlayerCardCount();
	}
	if (playerNum == PlayerType.AI){
		return getUsableAICardCount();
	}
}//end getUsableCardCount

/** GameStateScript:getUsablePlayerCardCount
* this method gets the number of usable game actions for the human player
*
* @return {int} count given the filter
* @author Todd Dobbs
*/
static function getUsablePlayerCardCount():int{
	var count = 0;
	for (var i = 0; i < humanActions.Count; i++) {
		if (getHumanAction(i) != null) {
			count++;
		}
	}
	return count;
}//end getUsablePlayerCardCount

/** GameStateScript:getUsableCardCount
* this method gets the number of usable game actions for the AI player
*
* @return {int} count given the filter
* @author Todd Dobbs
*/
static function getUsableAICardCount():int{
	var count = 0;
	for (var i = 0; i < AIActions.Count; i++) {
		if (getAIAction(i) != null) {
			count++;
		}
	}
	return count;
}//end getUsableCardCount

/** GameStateScript:getCardCount
* this method gets the number of usable game actions for the specified player and action
* @param {PlayerType} filter for player
* @param {ActionType} filter for action
* @return {int} count given the filter
* @author Todd Dobbs
*/
static function getCardCount(playerNum:PlayerType, action:ActionType ):int{
	if (playerNum == PlayerType.Human){
		return getHumanCardCount(action);
	}
	if (playerNum == PlayerType.AI){
		return getAICardCount(action);
	}
}//end getCardCount

/** GameStateScript:getHumanCardCount
* this method gets the number of usable game actions for the human player and specified action
*
* @param {ActionType} filter for action
* @return {int} count given the filter
* @author Todd Dobbs
*/
static function getHumanCardCount(action:ActionType):int{
	var count = 0;
	for (var i = 0; i < humanActions.Count; i++) {
		if (getHumanAction(i).action == action) {
			count++;
		}
	}
	return count;
}//end getHumanCardCount

/** GameStateScript:getAICardCount
* this method gets the number of usable game actions for the AI player and specified action
*
* @param {ActionType} filter for action
* @return {int} count given the filter 
* @author Todd Dobbs
*/
static function getAICardCount(action:ActionType):int{
	var count = 0;
	for (var i = 0; i < AIActions.Count; i++) {
		if (getAIAction(i) != null && getAIAction(i).action == action) {
			count++;
		}
	}
	return count;
}//end getAICardCount

/** GameStateScript:getNextValidGameAction
* Gets the next valid action in teh gamestate
*
* @param {GameScreenActionType} current action
* @return {GameScreenActionType} next action based on the current action
* @author Todd Dobbs
*/
static function getNextValidGameAction(action:GameScreenActionType):GameScreenActionType{
	return GameScreenActionType.mainmenu;
}//end getNextValidGameAction

/** GameStateScript:getPrevValidGameAction
* Gets the prevoius valid action in the gamestate
* @param {GameScreenActionType} current action
* @return {GameScreenActionType} prev action based on the current action
* @author Todd Dobbs
*/
static function getPrevValidGameAction(action:GameScreenActionType):GameScreenActionType{
	return GameScreenActionType.mainmenu;
}//end getPrevValidGameAction

/**********************************************/
//Use - Set actions for either player
/**********************************************/

/** GameStateScript:usePlayerAction
* This method uses the action at the specified index for the human player
*
* @param {int} index of action
* @author Todd Dobbs
*/
static function usePlayerAction(index:int){
	humanActions.Item[index] = null;
	clickedSlot = -1;
}//end usePlayerAction

/** GameStateScript:useAIAction
* This method uses the action at the specified index for the AI player
*
* @param {int} index of action
* @author Todd Dobbs
*/
static function useAIAction(index:int){
	AIActions.Item[index] = null;
	//clickedSlot = -1;
}//end useAIAction

/** GameStateScript:clearGamePadFocus
*
*
* @author Todd Dobbs
*/
static function clearGamePadFocus(){
	clearAIActionFocus();
	clearHumanActionFocus();
	for (var row=0; row < rows; row++) {
		for (var col=0; col < columns; col++) {
			board[row][col].clearGamePadFocus();
		}
	}
}//end clearGamePadFocus

/** GameStateScript:clearAIActionFocus
* clear all AI actions gamepad focus
*
* @author Todd Dobbs
*/
static function clearAIActionFocus(){
	AIActions.Item[0].gamePadFocus = false;
	AIActions.Item[1].gamePadFocus = false;
	AIActions.Item[2].gamePadFocus = false; 
}//end clearAIActionFocus

/** GameStateScript:clearHumanActionFocus
* clear all human actions gamepad focus
*
* @author Todd Dobbs
*/
static function clearHumanActionFocus(){
	humanActions.Item[0].gamePadFocus = false;
	humanActions.Item[1].gamePadFocus = false;
	humanActions.Item[2].gamePadFocus = false; 
}//end clearHumanActionFocus

/**********************************************/
//Plant-Destroy
/**********************************************/

/** GameStateScript:plant
* this method plants n vegetbles at row, column for the player specified
*
* @param {int} row - row of the plant to destroy
* @param {int} col - col of the plant to destroy
* @param {PlayerType} player - player of the plant to destroy
* @param {PlantType} plant - plant type to destroy
* @return {int} index of the plant
* @author Todd Dobbs
*/
static function plant(row:int, column:int, player:PlayerType, plant:PlantType):int{
	var wrongSoil = false;
	if (board[row][column].getSoil(plant) != board[row][column].soil) {
		wrongSoil = true;
	}
	return board[row][column].plant(player, plant, wrongSoil);
}//end plant

/** GameStateScript:grow
* This method grows n vegetbles at row, column for the player specified
*
* @param {int} row - row of the plant to destroy
* @param {int} col - col of the plant to destroy
* @param {PlayerType} player - player of the plant to destroy
* @return {PlantType} plant - plant type to destroy
* @author Todd Dobbs
*/
static function grow(row:int, column:int, player:PlayerType, plant:PlantType){
	board[row][column].grow(player, plant);
}//end grow

/** GameStateScript:grow
* this method grows all valid vegetables on the board by 1
*
* @author Todd Dobbs
*/
static function grow(){
	for (var row=0; row < rows; row++) {
		for (var col=0; col < columns; col++) {
			board[row][col].grow();
		}
	}
	//Debug.Log("GameStateScript.grow() has been called.");
}//end grow

/** GameStateScript:destroy
* this method destroys n vegetbles at row, column for the player specified
*
* @param {int} row - row of the plant to destroy
* @param {int} col - col of the plant to destroy
* @param {index} index - index of the plant to destroy
* @return {boolean} true if destroyed, false otherwise
* @author Todd Dobbs
*/
static function destroy(row:int, col:int, index:int, num:int):boolean{
	return board[row][col].destroy(index, num);
}//end destroy


/**********************************************/
//Score
/**********************************************/

/** GameStateScript:refreshScore
* this method updates the human and AI score
*
* @author Todd Dobbs
*/
static function refreshScore(){
	var scoreAITotal:int = 0;
	var scorePlayerTotal:int = 0;
	for (var row=0; row < rows; row++) {
		for (var col=0; col < columns; col++) {
			scoreAITotal+=board[row][col].getScore(PlayerType.AI);
			scorePlayerTotal+=board[row][col].getScore(PlayerType.Human);
		}
	}
	scoreAI = scoreAITotal;
	scorePlayer = scorePlayerTotal;
}//end refreshScore

/** GameStateScript:getAIScore
* This method gets the AI score
* @return {int} score of AI
* @author Todd Dobbs
*/
static function getAIScore():int {
	//refreshScore();
	return scoreAI;
}//end getAIScore

/** GameStateScript:getPlayerScore
* This method gets the human score
* @return {int} score of player
* @author Todd Dobbs
*/
static function getPlayerScore():int {
	//refreshScore();
	return scorePlayer;
}//end getPlayerScore

/** GameStateScript:getPlayerNum
* Gets the number of a specific plant at row,col
* 
* @param {int} row row of plant
* @param {int} col col of plant
* @param {int} plantNum plant type
* @return {int} number of plants
* @author Todd Dobbs
*/
static function getPlantNum(row:int, col:int, plantNum:int):int {
	if (board[row][col].planted.Count > plantNum) {
		return board[row][col].planted.Item[plantNum].num;
	} else {
		return 0;
	}
}//end getPlayerNum

/** GameStateScript:updateTimer
* This updates the timer for a plant on the board that is in the growing animations
*
* @param {Number} row which row the plant is in
* @param {Number} col which column the plant is in
* @param {Number} slot which slot the plant is in
* @author Christine Talbot
*/
static function updateTimer(row:int, col:int, slot:int) {
	if (board[row][col].planted.Count > slot) {
		if (board[row][col].planted.Item[slot].step == 6) {
			 // do nothing
		} else {
			board[row][col].planted.Item[slot].timer += Time.deltaTime; // determine how long since last animation
			if (board[row][col].planted.Item[slot].timer >= 1) { // prepare for next animation if 1 sec has passed already
				board[row][col].planted.Item[slot].timer = 0; // reset timer
				board[row][col].planted.Item[slot].step +=1; // update state
			} // else stay at current step
		}
	}
}//end updateTimer

/** GameStateScript:getGrowState
* this returns what state the plant is currently in (important for when doing growing animations)
*
* @param {Number} row row the plant is in
* @param {Number} col column the plant is in
* @param {Number} slot slot the plant is in
* @author Christine Talbot
*/
static function getGrowState(row:int, col:int, slot:int) {
	if (board[row][col].planted.Count > slot) {
		return board[row][col].planted.Item[slot].step;
	}
	return -1; // shouldn't hit this
}//end getGrowState


/** GameStateScript:getPlantType
* This returns what type of plant is in the specified location
*
* @param {Number} row row the plant is in
* @param {Number} col column the plant is in
* @param {Number} slot slot the plant is in
* @author Christine Talbot
*/
static function getPlantType(row:int, col:int, slot:int):PlantType {
	if (board[row][col].planted.Count > slot) {
		return board[row][col].planted.Item[slot].plant;
	}
	return PlantType.Beet; // shouldn't hit this
}

/** GameStateScript:HintsOn
* This method returns whether hints are on or not
*
* @return {boolean} whether hints are on / off
* @author Christine Talbot
*/

static function HintsOn():boolean {
	return hints;
}
