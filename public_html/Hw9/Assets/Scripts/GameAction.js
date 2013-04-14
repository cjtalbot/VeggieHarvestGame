/*
 * This file provides the object for a game action
 * @author Christine Talbot
 * @author Todd Dobbs
 */
 
 class GameAction extends ScriptableObject {
	var action:ActionType; //The type of action being performed 
	var plant:PlantType; //enum for the vegetable to perform 
	var num:int; //The number of vegetable growths for the 'd' action
	var gamePadFocus:boolean=false;//true if this object is the focus of the gamepad
	var objectName:String = ""; //id to xref to UI for controller code
	
	/** GameAction:setActionType
	* Setter method for 
	*
	* @author Eric Faust
	*/
	function setActionType(a:ActionType) {
		action = a;
	}//end setActionType
}//end GameAction