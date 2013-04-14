/*
 * This file provides the object for each square on the board 
 * @author Christine Talbot
 * @author Todd Dobbs
 */
class BoardObject extends ScriptableObject {
	
	var soil:SoilType; //the type of soil 
	var row:int; //row of the gameobject
	var col:int; //col of the gameobject
	var planted:System.Collections.ArrayList = new System.Collections.ArrayList(); //array of planted objects
	var gamePadFocus:boolean=false; //true if this object is the focus of the gamepad
	var objectName:String = ""; //ID of the board square to be used by the controller
	
/** BoardObject.plant
* this method plants n vegetables for the specified player
*
* @author Todd Dobbs
*/
	//this method plants n vegetables for the specified player
	function plant(player:PlayerType, plant:PlantType, wrongSoil:boolean):int{
		var plantedObject:PlantedObject = ScriptableObject.CreateInstance('PlantedObject');
		plantedObject.player = player;
		plantedObject.plant = plant;
		plantedObject.num = 1;
		plantedObject.wrongSoil = wrongSoil;
		return planted.Add(plantedObject);
	}
	
/** BoardObject.grow
* this method grows n vegetables for the specified player
*
* @author Todd Dobbs
*/
	//this method grows n vegetables for the specified player
	function grow(index:int){
		planted.Item[index].num += 1;
	}

/** BoardObject.grow
* this method grows n vegetables for the specified player
*
* @author Todd Dobbs
*/
	//this method grows all valid vegetables on the board square
	function grow(){
		for(var i:int = 0; i < planted.Count; i++){
			if ((this.getPlayerUniquePlantCount(planted.Item[i].player) == 1) && (planted.Item[i].step == 6)){
				this.planted.Item[i].num+=1;
			}
		}
	}

/** BoardObject.grow
* this method grows n vegetables for the specified player
*
* @author Todd Dobbs
*/
	//this method returns true if multiple vegetables are planted for any given player, false otherwise
	function hasMultiplePlanted():boolean{
		for(var i:int = 0; i < planted.Count; i++){
			if (this.getPlayerPlantCount(planted.Item[i].player) > 1){
				return true;
			}
		}
		return false;
	}

/** BoardObject.grow
* this method grows n vegetables for the specified player
*
* @author Todd Dobbs
*/
	//this method gets the number of vegetables for the specified player
	function getPlayerUniquePlantCount(player:PlayerType):int{
		var count:int = 0;
		for(var i:int = 0; i < planted.Count; i++){
			var p:PlantedObject = planted.Item[i];
			if (p.player == player){
				count++;
			}
		}
		return count;
	}

/** BoardObject.grow
* this method grows n vegetables for the specified player
*
* @author Todd Dobbs
*/
	//this method destorys n vegetables for the specified player
	function destroy(index:int, num:int):boolean{
		if (planted != null && planted.Count > index) {
			planted[index].num -= num;
			if (planted.Item[index].num <= 0){
				planted.RemoveAt(index);
			}
			return true;
		}
		return false;
	}

/** BoardObject.grow
* this method grows n vegetables for the specified player
*
* @author Todd Dobbs
*/
	//this method returns true if there are no items planted, false otherwise
	function isEmpty(){
		return (planted == null || planted.Count == 0);
	}

/** BoardObject.grow
* this method grows n vegetables for the specified player
*
* @author Todd Dobbs
*/
	//this method returns the number of vegetables planted (including size) for the specified player
	function getPlayerPlantCount(player:PlayerType):int{
		var count:int = 0;
		
		for(var i:int = 0; i < planted.Count; i++){
			var p:PlantedObject = planted.Item[i];
			if (p.player == player){
				count +=planted.Item[i].num;
			}
		}
		//Debug.Log("Get Player Plant Count returns: " + count);
		return count;
	}
	
/** BoardObject.getPlayerPlantInstanceCount
* this method returns the number of vegetables planted (NOT including size) for the specified player - cjt
*
* @author Christine Talbot
*/
	//this method returns the number of vegetables planted (NOT including size) for the specified player - cjt
	function getPlayerPlantInstanceCount(player:PlayerType):int{
		var count:int = 0;
		
		for(var i:int = 0; i < planted.Count; i++){
			var p:PlantedObject = planted.Item[i];
			if (p.player == player){
				count ++;
			}
		}
		//Debug.Log("Get Player Plant Count returns: " + count);
		return count;
	}
	
/** BoardObject.grow
* this method grows n vegetables for the specified player
*
* @author Todd Dobbs
*/
	//this method returns the score of the specified player
	function getScore(player:PlayerType):int{
		var count:int = 0;

		for(var i:int = 0; i < planted.Count; i++){
			var p:PlantedObject = planted.Item[i];
			if (p.player == player){
				if (getSoil(p.plant) == soil){
					if (this.getPlayerUniquePlantCount(p.player) == 1){
						count+=p.num;	
					} else {
						count+=getLargestCount(player);
					}		
				} else {
					count-=p.num;	
				}
			}
		}
		return count;
	}

/** BoardObject.grow
* this method grows n vegetables for the specified player
*
* @author Todd Dobbs
*/
	function getLargestCount(player:PlayerType):int{
		var largestCount:int = 0;

		for(var i:int = 0; i < planted.Count; i++){
			var p:PlantedObject = planted.Item[i];
			if ((p.player == player) && (p.num > largestCount)){
				largestCount = p.num;
			}
		}
		return largestCount;	
	}

/** BoardObject.grow
* this method grows n vegetables for the specified player
*
* @author Todd Dobbs
*/
	function clearGamePadFocus(){
		this.gamePadFocus = false;
		for(var i:int = 0; i < planted.Count; i++){
			var p:PlantedObject = planted.Item[i];
			p.gamePadFocus = false;
		}		
	}

/** BoardObject.getSoil
* this returns the soil type needed for a particular plant
*
* @author Christine Talbot
*/
	function getSoil(cardName:PlantType):SoilType {
		var retVal:SoilType;
		switch (cardName) {
			case PlantType.Blueberries:
			case PlantType.Watermelon:
			case PlantType.Pumpkin:
				retVal = SoilType.Sand;
				break;
			case PlantType.Tomato:
				retVal = SoilType.Volcano;
				break;
			case PlantType.Potato:
			case PlantType.Beet:
			case PlantType.Carrot:
				retVal = SoilType.Topsoil;
				break;
			case PlantType.Cabbage:
			case PlantType.Broccoli:
			case PlantType.Cucumber:
				retVal = SoilType.Clay;
				break;
		}
		return retVal;
	}

} // end of class