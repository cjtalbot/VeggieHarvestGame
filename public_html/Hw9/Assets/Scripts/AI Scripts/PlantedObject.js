/*
 * This file provides the object for a planted object
 * @author Christine Talbot
 * @author Todd Dobbs
 */
 
 class PlantedObject extends ScriptableObject {
	var player:PlayerType; //enum of the player that owns the planted object
	var plant:PlantType; //enum of the vegetable
	var num:int; //The number of vegetable growths
	var seq:int; //sequence number for the same vegetables planted on the same square
	var timer:float=0; // when planted
	var step:int=1; // which grow step being shown 1,2,3,4,5,then normal chip is #6
	var wrongSoil:boolean=false;
	var gamePadFocus:boolean=false;//true if this object is the focus of the gamepad
	var objectName:String = ""; //ID of UI object for controller
}