/*
 * This file provides the script to allow the AI player to play the game
 * @author Christine Talbot
 */


/**********************************************/
//Variables
/**********************************************/
 // get custom objects
public var GameAction:GameAction ;
public var boardObject:BoardObject ;
public var plantedObject:PlantedObject ;

// initialize state info
private var timeSinceLastUpdate:float = 0; // initialize to 0
private var delayBetweenPlays:float = 20; // set to 20 secs between plays
private var cardInfo:ArrayList ; // holds the cards drawn
private var myDoubled = null;
private var myMisplanted = null;
private var othersPlants = null;
private var myPlanted = null;
private var emptySoils = null;
private var myWrongPlanted = null;
private var wrongEmptySoils = null;
private var curCard:GameAction = null;
private var doWhich:ActionType;
private var cantPlay:boolean = false;



/**********************************************/
//Awake
/**********************************************/

/** AIPlayerScript:Awake
* This method is called when the object is created
*
* @author Christine Talbot
*/
// this initializes the timers and other information when starting the game
function myAwake() {
	// get custom objects
	GameAction = ScriptableObject.CreateInstance('GameAction');
	boardObject = ScriptableObject.CreateInstance('BoardObject');
	plantedObject = ScriptableObject.CreateInstance('PlantedObject');

	// initialize state info
	timeSinceLastUpdate = 0.0; // initialize to 0
	delayBetweenPlays = 20; // set to 20 secs between plays
	
	// initialize objects to null
	myDoubled = null;
	myMisplanted = null;
	myWrongPlanted = null;
	wrongEmptySoils = null;
	othersPlants = null;
	myPlanted = null;
	emptySoils = null;
	curCard = null;
	timeSinceLastUpdate = 0.0;
}

/**AIPlayerScript:Update
*  This is the main loop called during the game loop that determines what and if the AI player will play
*
* @author Christine Talbot
*/
function myUpdate () {
	// check if have waited long enough between plays
	timeSinceLastUpdate += Time.deltaTime;
	
	if (timeSinceLastUpdate >= GameStateScript.delayAI) {
		// can do my playing
		// first will make any choices that I have
		if (GameStateScript.hasAIActions()) {
			for (var i:int=0; i < 3; i++) {
				curCard = GameStateScript.getAIAction(i);

				if (curCard != null && curCard.action == ActionType.Choice) {
					// do all your choices on this pick
					doWhich = pickCardToDraw(i);
					Cards.makeChoice(PlayerType.AI, i, doWhich); // cards script uses 1-3, not 0-1
					
				} else if (curCard != null) {
					// do nothing - not a choice to be made
				}
			}
			// done making all choices
		
			// now will play one card, (should have at least one to get here)
			var cardInfo:ActionType = pickCardToPlay();
		
		} else {
			// then will sleep - nothing to play
		}
		timeSinceLastUpdate = 0.0; // reset to 0 so can do next turn
	}
		
}


/**AIPlayerScript.pickCardToDraw
*  This decides what choice to make based on current board conditions
*
* @author Christine Talbot
*/
function pickCardToDraw(slot:int) :ActionType {
	var type:ActionType = ActionType.Grow; // default to Grow
	var cCardCount:int = GameStateScript.getCardCount(PlayerType.AI, ActionType.Choice);
	var gCardCount:int = GameStateScript.getCardCount(PlayerType.AI, ActionType.Grow);
	var probThreshold:float = (1.0 - (gCardCount/3.0));
	
	// do logic to determine type to draw
	if (GameStateScript.getHumanPlantsInstances(PlayerType.AI).Count + gCardCount > 4) {
		if (Random.value > probThreshold) { // the more grow cards we have, the more likely we'll choose to destroy
			type = ActionType.Destroy;
		} // otherwise will keep the grow decision
		
	} // else will grow if have less than 4 plants on the board
	return type;
}


/**AIPlayerScript.pickCardToPlay
*  This picks and plays a card from the AI player's slots - destroy first if have one, else grow
*
* @author Christine Talbot
*/

function pickCardToPlay() :ActionType { // change to use new global variables about the board!!
	var which:ActionType = ActionType.Grow; // default to first card
	var cardNum:int = 0;
	var squares = -1;
	var left:boolean = true;
	cantPlay = false;
	
	
	/*
	If choose a Disaster, will destroy own Veggie that are doubled up on their square first.
	If choose a Disaster, will destroy own Veggie that are misplanted on the wrong soil second.
	If choose a Disaster, will destroy random player's Veggies which have exactly the number of Veggies as the card drawn states, third.
	If choose a Disaster, will destroy random player's Veggies which summed up have exactly the number of Veggies as the card drawn states, fourth.
	If choose a Disaster, will destroy random player's Veggies so that it destroys an entire Veggie (or multiple entire Veggie), plus some of another Veggie (if card drawn is large enough), fifth.
	If choose a Cultivator, will plant in first empty square with the correct soil, if available.
	If choose a Cultivator, will plant in first square with the correct soil AND one of its own Veggies on that square, second.
	If choose a Cultivator, will plant in random empty square on the board, fourth.
	If choose a Cultivator, will plant in random square which has one of its own Veggies on that square, third.
	*/
	
	
	// do logic to determine card to play
	// only play destroy card if other player has some plants
	if (GameStateScript.getHumanPlantsInstances(PlayerType.Human) !== null) {
		// play disaster card first if have one
		cardNum = getDestroyCard();
		if (cardNum != -1) {
			which = ActionType.Destroy;
			
			if (Random.value >= GameStateScript.randomAI) { // do something smart if greater percentage
			
			myDoubled = getMyDoubled();
				if (myDoubled != null) {
					// let's find the smallest plant in that square
					var smallest:int = 0;
					var smallestCount:int = 9999;
					if (myDoubled[0] != null) {
						for (var index:int =0; index < myDoubled[0].planted.Count; index++) {
							if (myDoubled[0].planted[index].num < smallestCount) {
								smallest = index;
								smallestCount = myDoubled[0].planted[index].num;
							}
						}
					}
					left = GameBoardScript.playCard(cardNum, PlayerType.AI, myDoubled[0].row, myDoubled[0].col, smallest);
					
					if (left != 0) {
						// won't do anything with this scenario - when play will destroy all of it
					}
					
				} else {
					
					myMisplanted = getMyMisplanted();
					if (myMisplanted != null) {
					
						// get the largest plant that you can kill
						var largest:int = 0;
						var largestCount:int = 0;
						if (myMisplanted[0] != null) {
							for (var loc:int =0; loc < myMisplanted[0].planted.Count; loc++) {
								if (myMisplanted[loc].planted.Item[0].num > largestCount) {
									largest = index;
									largestCount = myMisplanted[loc].planted[0].num;
								}
							}
						}
						left = GameBoardScript.playCard(cardNum, PlayerType.AI, myMisplanted[0].row, myMisplanted[0].col, 0);
	
						if (left != 0) {
							// won't do anything with this scenario yet
						}
						
					} else {
						
						othersPlants = GameStateScript.getHumanPlantsInstances(PlayerType.Human);
						if (othersPlants != null) {
							var saveMe = 0; // destroy the first plant found if don't find one that's exactly the right size
							if (othersPlants.Count > 0 && othersPlants[0] != null) {
								for (var i:int=0; i < othersPlants.Count; i++) {
									if (othersPlants[i].planted.Item[0].num == GameStateScript.getAIAction(cardNum).num) {
				
										saveMe = i;
									}
								}
								
								// doesn't like something about the below line - get NULLEXCEPTION error here sometimes
								left = GameBoardScript.playCard(cardNum, PlayerType.AI, othersPlants[saveMe].row, othersPlants[saveMe].col, 0);
							} else {
								cantPlay = true;
							}
						} else {
							cantPlay = true;
						}
					}
				}
			} else { // do something random if less than the percentage
				// do a random destroy
				var randWhich:int;
				var theirPlants:System.Collections.ArrayList = GameStateScript.getHumanPlantsInstances(PlayerType.Human);
				var myPlants:System.Collections.ArrayList = GameStateScript.getHumanPlantsInstances(PlayerType.AI);
				var plantNum:int;
				if (theirPlants.Count != 0 && Random.value >= .5) { // destroy mine as likely as one of theirs
					randWhich = Mathf.Floor(Random.value * theirPlants.Count);
					if (theirPlants[randWhich].planted != null && theirPlants[randWhich].planted.Count > 0) {
						plantNum = theirPlants[randWhich].planted.Count - 1;
					} else {
						cantPlay = true; // something happened and should just grow for now, try again next time
					}
					GameBoardScript.playCard(cardNum, PlayerType.AI, theirPlants[randWhich].row, theirPlants[randWhich].col, plantNum);
				} else if (myPlants.Count != 0 ){
					randWhich = Mathf.Floor(Random.value * myPlants.Count);
					if (myPlants[randWhich].planted != null && myPlants[randWhich].planted.Count > 0) {
						plantNum = myPlants[randWhich].planted.Count - 1;
					} else {
						cantPlay = true;
					}
					GameBoardScript.playCard(cardNum, PlayerType.AI, myPlants[randWhich].row, myPlants[randWhich].col, plantNum);
				} else { // can't play
					cantPlay = true;
				}
			}
			
		} else {
			which = ActionType.Grow;
			cardNum = getGrowCard();
			if (cardNum != -1) {
			
				if (Random.value >= GameStateScript.randomAI) { // do something planned unless greater number (ie smarter)
					
					var correctSoil = -1;
					var plantedCorrectSoil = -1;
					var emptySoil = -1;
					var plantedSoil = -1;
					var checkPt:int = 0;
					var soilType:SoilType = getSoil(GameStateScript.getAIAction(cardNum).plant);
					myPlanted = GameStateScript.getHumanPlantsInstances(PlayerType.AI, soilType);
					if (myPlanted.Count != 0) {
						while (checkPt < myPlanted.Count && plantedCorrectSoil == -1) {
							if (myPlanted[checkPt].planted.Count == 1) { // since looking at previously planted squares only, check for only one on there, not two
								plantedCorrectSoil = checkPt;
							}
							checkPt++;
						}
						checkPt = 0;
					}
					// how do I get planted soil that is NOT of the right soil?
					myWrongPlanted = GameStateScript.getHumanPlantsNotOfSoilTypeInstances(PlayerType.AI, soilType);
					if (myWrongPlanted.Count != 0) {
						while (checkPt < myWrongPlanted.Count && plantedSoil == -1) {
							if (myWrongPlanted[checkPt].planted.Count == 1) { // since looking at previously planted squares only, check for only one on there, not two
								plantedSoil = checkPt;
							}
							checkPt++;
						}
						checkPt = 0;
					}
					
					emptySoils = GameStateScript.getEmptyCells(soilType);
					if (emptySoils.Count != 0) {
					
						while (checkPt < emptySoils.Count && correctSoil == -1) {
							if (emptySoils[checkPt].planted.Count == 0 || emptySoils[checkPt].planted.Count == 1) { 
								correctSoil = checkPt;
							}
							checkPt++;
						}
						checkPt = 0;
					}
					wrongEmptySoils = GameStateScript.getEmptyCellsNotOfSoilType(soilType);
					if (wrongEmptySoils.Count != 0 && wrongEmptySoils.Count < 2) {
						while (checkPt < wrongEmptySoils.Count && emptySoil == -1) {
							if (wrongEmptySoils[checkPt].planted.Count == 0 || wrongEmptySoils[checkPt].planted.Count == 1) { 
								emptySoil = checkPt;
							}
							checkPt++;
						}
						checkPt = 0;
					}

					if (correctSoil != -1) {
						GameBoardScript.playCard(cardNum, PlayerType.AI, emptySoils[correctSoil].row, emptySoils[correctSoil].col, 0);
						
					} else {
						if (plantedCorrectSoil != -1) {
							GameBoardScript.playCard(cardNum, PlayerType.AI, myPlanted[plantedCorrectSoil].row, myPlanted[plantedCorrectSoil].col, 0);
	
						} else {
							if (emptySoil != -1) {
								GameBoardScript.playCard(cardNum, PlayerType.AI, wrongEmptySoils[emptySoil].row, wrongEmptySoils[emptySoil].col, 0);
	
							} else {
								if (plantedSoil != -1) {
									GameBoardScript.playCard(cardNum, PlayerType.AI, myWrongPlanted[plantedSoil].row, myWrongPlanted[plantedSoil].col, 0);
								} // should never get to an else here
	
							}
						}
					}
				
				} else { // do something random / not as smart
										
					var randWhich2:int;
					var emptyPlants2:System.Collections.ArrayList = GameStateScript.getEmptyCells();
					var myPlants2:System.Collections.ArrayList = GameStateScript.getHumanPlantsInstances(PlayerType.AI);
					if (emptyPlants2.Count != 0 && Random.value >= .2) { // grow on empty more likely than on mine
						randWhich2 = Mathf.Floor(Random.value * emptyPlants2.Count);
						GameBoardScript.playCard(cardNum, PlayerType.AI, emptyPlants2[randWhich2].row, emptyPlants2[randWhich2].col, 0);
					} else if (myPlants2.Count != 0 ){
						randWhich2 = Mathf.Floor(Random.value * myPlants2.Count);
						while (myPlants2[randWhich2].planted.Count != 1) { // to prevent over choosing the same square
							randWhich2 = Mathf.Floor(Random.value * myPlants2.Count);
						}
						GameBoardScript.playCard(cardNum, PlayerType.AI, myPlants2[randWhich2].row, myPlants2[randWhich2].col, 0);
					} else { // have to go on empty square
						randWhich2 = Mathf.Floor(Random.value * emptyPlants2.Count);
						GameBoardScript.playCard(cardNum, PlayerType.AI, emptyPlants2[randWhich2].row, emptyPlants2[randWhich2].col, 0);
					}
					
				}
			
			}
		}
		if (cantPlay) {
			// then play a grow card instead
			which = ActionType.Grow;
			cardNum = getGrowCard();
			if (cardNum != -1) {
			
				if (Random.value >= GameStateScript.randomAI) {
				
					var correctSoil1 = -1;
					var plantedCorrectSoil1 = -1;
					var emptySoil1 = -1;
					var plantedSoil1 = -1;
					var checkPt1:int = 0;
					var soilType1:SoilType = getSoil(GameStateScript.getAIAction(cardNum).plant);
					myPlanted1 = GameStateScript.getHumanPlantsInstances(PlayerType.AI, soilType1);
					if (myPlanted1.Count != 0) {
						while (checkPt1 < myPlanted1.Count && plantedCorrectSoil1 == -1) {
							if (myPlanted1[checkPt1].planted.Count == 1) { // since looking at previously planted squares only, check for only one on there, not two
								plantedCorrectSoil1 = checkPt1;
							}
							checkPt1++;
						}
						checkPt1 = 0;
					}
					// how do I get planted soil that is NOT of the right soil?
					myWrongPlanted1 = GameStateScript.getHumanPlantsNotOfSoilTypeInstances(PlayerType.AI, soilType1);
					if (myWrongPlanted1.Count != 0) {
						while (checkPt1 < myWrongPlanted1.Count && plantedSoil1 == -1) {
							if (myWrongPlanted1[checkPt1].planted.Count == 1) { // since looking at previously planted squares only, check for only one on there, not two
								plantedSoil1 = checkPt1;
							}
							checkPt1++;
						}
						checkPt1 = 0;
					}

					emptySoils1 = GameStateScript.getEmptyCells(soilType1);
					if (emptySoils1.Count != 0) {
					
						while (checkPt1 < emptySoils1.Count && correctSoil1 == -1) {
							if (emptySoils1[checkPt1].planted.Count == 0 || emptySoils1[checkPt1].planted.Count == 1) { 
								correctSoil1 = checkPt1;
							}
							checkPt1++;
						}
						checkPt1 = 0;
					}
					wrongEmptySoils1 = GameStateScript.getEmptyCellsNotOfSoilType(soilType1);
					if (wrongEmptySoils1.Count != 0 && wrongEmptySoils1.Count < 2) {
						while (checkPt1 < wrongEmptySoils1.Count && emptySoil1 == -1) {
							if (wrongEmptySoils1[checkPt1].planted.Count == 0 || wrongEmptySoils1[checkPt1].planted.Count == 1) { 
								emptySoil1 = checkPt1;
							}
							checkPt1++;
						}
						checkPt1 = 0;
					}

					if (correctSoil1 != -1) {
						GameBoardScript.playCard(cardNum, PlayerType.AI, emptySoils1[correctSoil1].row, emptySoils1[correctSoil1].col, 0);
						
					} else {
						if (plantedCorrectSoil1 != -1) {
							GameBoardScript.playCard(cardNum, PlayerType.AI, myPlanted1[plantedCorrectSoil1].row, myPlanted1[plantedCorrectSoil1].col, 0);
	
						} else {
							if (emptySoil1 != -1) {
								GameBoardScript.playCard(cardNum, PlayerType.AI, wrongEmptySoils1[emptySoil1].row, wrongEmptySoils1[emptySoil1].col, 0);
	
							} else {
								GameBoardScript.playCard(cardNum, PlayerType.AI, myWrongPlanted1[plantedSoil1].row, myWrongPlanted1[plantedSoil1].col, 0);
	
							}
						}
					}
				} else { // do something random
					var randWhich3:int;
					var emptyPlants3:System.Collections.ArrayList = GameStateScript.getEmptyCells();
					var myPlants3:System.Collections.ArrayList = GameStateScript.getHumanPlantsInstances(PlayerType.AI);
					if (emptyPlants3.Count != 0 && Random.value >= .2) { // grow on empty more likely than on mine
						randWhich3 = Mathf.Floor(Random.value * emptyPlants3.Count);
						GameBoardScript.playCard(cardNum, PlayerType.AI, emptyPlants3[randWhich3].row, emptyPlants3[randWhich3].col, 0);
					} else if (myPlants3.Count != 0 ){
						randWhich3 = Mathf.Floor(Random.value * myPlants3.Count);
						while (myPlants3[randWhich3].planted.Count != 1) { // to prevent over choosing the same square
							randWhich3 = Mathf.Floor(Random.value * myPlants3.Count);
						}
						GameBoardScript.playCard(cardNum, PlayerType.AI, myPlants3[randWhich3].row, myPlants3[randWhich3].col, 0);
					} else { // have to go on empty square
						randWhich3 = Mathf.Floor(Random.value * emptyPlants3.Count);
						GameBoardScript.playCard(cardNum, PlayerType.AI, emptyPlants3[randWhich3].row, emptyPlants3[randWhich3].col, 0);
					}
				}
			
			}
			cantPlay = false;
		}
	}
		

	
	
	// play that card, so reset arrays for next turn
	myDoubled = null;
	myMisplanted = null;
	othersPlants = null;
	myPlanted = null;
	emptySoils = null;
	
	return which;	
}

/**AIPlayerScript.getDestroyCard
* This finds the first destroy card the AI player has in their hand
*
* @author Christine Talbot
*/
function getDestroyCard():int {
	var cardInfo:GameAction;
	for (var i:int=0; i < 3; i++) {
		cardInfo = GameStateScript.getAIAction(i);
		if (cardInfo != null && cardInfo.action == ActionType.Destroy) {
			return i;
		}
	}
	return -1;
}

/**AIPlayerScript.getGrowCard
* This finds the first grow card the AI player has in their hand
*
* @author Christine Talbot
*/
function getGrowCard():int {
	var cardInfo:GameAction;
	for (var i:int=0; i < 3; i++) {
		cardInfo = GameStateScript.getAIAction(i);
		if (cardInfo != null && cardInfo.action == ActionType.Grow) {
			return i;
		}
	}
	return -1;
}

/**AIPlayerScript.getSoil
* This returns what soil a plant should be planted on
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

/**AIPlayerScript.getMyDoubled
* This gets the list of plants that belong to the AI and are doubled up on the same square/soil
*
* @author Christine Talbot
*/
function getMyDoubled():System.Collections.ArrayList{
	var myPlants:System.Collections.ArrayList = GameStateScript.getHumanPlantsInstances(PlayerType.AI);
	var myDoubled:System.Collections.ArrayList = null;
	if (myPlants !== null) {
		for (var i:int = 0; i < myPlants.Count; i++) {
			if (myPlants[i].planted.Count > 1) { // is this how I want to get my doubled up plants?
				if (myDoubled == null) {
						myDoubled = new System.Collections.ArrayList();
					}
				myDoubled.Add(myPlants[i]);
			}
		}
	}	
	return myDoubled;
}

/**AIPlayerScript.getMyMisplanted
* This gets the list of plants that belong to the AI and are on the wrong soil type
*
* @author Christine Talbot
*/
function getMyMisplanted():System.Collections.ArrayList {
	var myPlants:System.Collections.ArrayList = GameStateScript.getHumanPlantsInstances(PlayerType.AI, SoilType.Volcano);
	var myMisplanted:System.Collections.ArrayList = null;
	if (myPlants !== null) {
		for (var i:int = 0; i < myPlants.Count; i++) {
			for (var p:int = 0; p < myPlants[i].planted.Count; p++) {
				if (getSoil(myPlants[i].planted.Item[p].plant) != SoilType.Volcano) {
					if (myMisplanted == null) {
						myMisplanted = new System.Collections.ArrayList();
					}
					myMisplanted.Add(myPlants[i]);
				}
			}
		}
	}
	myPlants = GameStateScript.getHumanPlantsInstances(PlayerType.AI, SoilType.Clay);
	if (myPlants !== null) {
		for (var j:int = 0; j < myPlants.Count; j++) {
			for (var q:int=0; q<myPlants[j].planted.Count; q++) {
				if (getSoil(myPlants[j].planted.Item[q].plant) != SoilType.Clay) {
					if (myMisplanted == null) {
						myMisplanted = new System.Collections.ArrayList();
					}
					myMisplanted.Add(myPlants[j]);
				}
			}
		}
	}
	myPlants = GameStateScript.getHumanPlantsInstances(PlayerType.AI, SoilType.Topsoil);
	if (myPlants !== null) {
		for (var k:int = 0; k < myPlants.Count; k++) {
			for (var r:int = 0; r < myPlants[k].planted.Count; r++) {
				if (getSoil(myPlants[k].planted.Item[r].plant) != SoilType.Topsoil) {
					if (myMisplanted == null) {
						myMisplanted = new System.Collections.ArrayList();
					}
					myMisplanted.Add(myPlants[k]);
				}
			}
		}
	}
	myPlants = GameStateScript.getHumanPlantsInstances(PlayerType.AI, SoilType.Sand);
	if (myPlants !== null) {
		for (var l:int = 0; l < myPlants.Count; l++) {
			for (var s:int = 0; s < myPlants[l].planted.Count; s++) {
				if (getSoil(myPlants[l].planted.Item[s].plant) != SoilType.Sand) {
					if (myMisplanted == null) {
						myMisplanted = new System.Collections.ArrayList();
					}
					myMisplanted.Add(myPlants[l]);
				}
			}
		}
	}
	
	return myMisplanted;
}

