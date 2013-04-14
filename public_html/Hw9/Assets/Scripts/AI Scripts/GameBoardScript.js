/*
 * This file provides the interactions with the board like playing cards & plays error sound if cannot plant in a location
 * @author Christine Talbot
 */

/** GameBoardScript.playCard
* this plays a card for the AI or human player on the board and returns whether it is allowed or not
*
* @author Christine Talbot
*/
static function playCard(slot:int, who:PlayerType, row:int, col:int, plant:int):boolean {

	if (plant != 0 && plant == null) {
		plant = -1;
	}
	// check to see if can play this card at selected location
	var playOK:boolean = false;
	var plantList:System.Collections.ArrayList = GameStateScript.getPlants(row, col);
	var item:PlayerType;
	if (plantList != null && plantList.Count >0) {
		var temp = plantList.Item[0];
		if (temp != null) {
			item = temp.player;
		} else {
			item = PlayerType.AI ;
		}
	} else {
		item = PlayerType.AI;
	}
	
	if (plantList == null || plantList.Count == 0 || item == who ) {
		playOK = true;
	}
	playOK = playOK && (plantList.Count == 0 || plantList.Count == 1); // only ok to play if there's no plants or only one plant there
	
	if (who == PlayerType.AI) {
		if (playOK == true && GameStateScript.getAIAction(slot).action == ActionType.Grow) { // make sure if we're planting we plant in an ok spot
			// if can, update game state

			if (GameStateScript.getAIAction(slot).action == ActionType.Grow) {
				GameStateScript.plant(row, col, who, GameStateScript.getAIAction(slot).plant);
				// show in UI
			} else {
				GameStateScript.destroy(row, col, 0, GameStateScript.getAIAction(slot).num);
			// show in ui -- if destroy only update the removal of entire plant, else just update gamestate
			}
			GameStateScript.useAIAction(slot);
			
			if (GameStateScript.isBoardFull()) {

				DontDestroyOnLoad(GameObject.Find("GameStateScript"));
				Application.LoadLevel('GameOver');
				
			}
				// return true
				
			return true;
		} else if (GameStateScript.getAIAction(slot).action == ActionType.Destroy && plant != -1) {
			// allow us to destroy
				
			GameStateScript.destroy(row, col,  plant, GameStateScript.getAIAction(slot).num);
			// show in ui -- if destroy only update the removal of entire plant, else just update gamestate
			
			GameStateScript.useAIAction(slot);
			
			return true;
			
		} else {
			// if cannot, show red & return false

			var saveAudio:GameObject = GameObject.Find('boing2');
			saveAudio.audio.Play(); // play error sound & do nothing for now
			return false;
		}
	} else {
	
		if (playOK == true && GameStateScript.getHumanAction(slot).action == ActionType.Grow) { // make sure if we're planting we plant in an ok spot
			// if can, update game state
			
				if (GameStateScript.getHumanAction(slot).action == ActionType.Grow) {
					GameStateScript.plant(row, col, who, GameStateScript.getHumanAction(slot).plant);
					// show in UI
					GameStateScript.usePlayerAction(slot);
					
					if (GameStateScript.isBoardFull()) {

						DontDestroyOnLoad(GameObject.Find("GameStateScript"));
						Application.LoadLevel('GameOver');
						
					}
					// return true
					GameStateScript.setClicked(-1);
					return true;
				} else {
					if(GameStateScript.destroy(row, col, 0, GameStateScript.getHumanAction(slot).num)) {
						GameStateScript.usePlayerAction(slot);
						
						if (GameStateScript.isBoardFull()) {

							DontDestroyOnLoad(GameObject.Find("GameStateScript"));
							Application.LoadLevel('GameOver');
							
						}
						// return true
						GameStateScript.setClicked(-1);
						return true;
					} else {
						return false;
					}
					// show in UI
				}
				
			
			
		} else if (GameStateScript.getHumanAction(slot).action == ActionType.Destroy && plant != -1) {
			// allow us to destroy
			
				
				if(GameStateScript.destroy(row, col, plant, GameStateScript.getHumanAction(slot).num)) {
					// show in UI
				
					GameStateScript.usePlayerAction(slot);
					GameStateScript.setClicked(-1);
					
					return true;
				} else {
					return false; // can't play
				}
			
		} else {
			// if cannot, show red & return false

			return false;
		}
	
	
	}
	
	// default return false since hit a bad scenario
	return false;
	
}