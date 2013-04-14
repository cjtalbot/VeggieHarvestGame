/*
 * This file provides the scrolling effect of the credits for the Credit view
 * @author Christine Talbot
 */


/************************************************************/
//Variables
/************************************************************/
public var titles:String[];
public var people:String[];
private var off:float = 0;
public var speed = 100;
public var myStyleTitles:GUIStyle = new GUIStyle();
public var myStylePeople:GUIStyle = new GUIStyle();
public var myStyleThanks:GUIStyle = new GUIStyle();
//public var buttonStyle:GUIStyle = new GUIStyle();
public var titleImage:Texture2D; 
private var initialDraw:boolean = true;

/************************************************************/
//OnGUI
/************************************************************/

/** CreditsScreenScroller:OnGUI
 * This function provides the scrolling of the text that is defined on the object
 *   Modified from http://answers.unity3d.com/questions/43490/scroll-intro-text.html
 *
 * @author Christine Talbot
 * @author Todd Dobbs
 */
function OnGUI() {

	GUI.Label(new Rect((Screen.width/2)-120, 10, 381, 123), titleImage);

	// modified from http://answers.unity3d.com/questions/43490/scroll-intro-text.html
	off += Time.deltaTime * speed;
	
	// if done scrolling, show the thank you & restart scrolling if show thank you long enough
	if (off > 40 && (300 - (titles.Length*-25 + off) + 100 < 100)) {
		GUI.Label(new Rect(0,0,Screen.width, Screen.height), 'Thank you!', myStyleThanks);
		if (off > 700) {
			off = 0; // restart scrolling
		}
	} else { // otherwise scroll the titles and names
		for (var i = 0; i < titles.Length; i++) {
			var roff = (Screen.height - 300 + (i*-25 + off));
			var alph = Mathf.Sin((roff/(Screen.height))*180*Mathf.Deg2Rad);
			if ((Screen.height - roff + 100 < Screen.height - 110) && (Screen.height - roff + 100 > 130)) {
				//GUI.color = new Color(1,1,1,alph);
				GUI.Label(new Rect(0,Screen.height - roff + 100, (Screen.width/2)-10, 25), titles[i], myStyleTitles);
				GUI.Label(new Rect((Screen.width/2) + 10,Screen.height - roff + 100, Screen.width, 25), people[i], myStylePeople);
			}
			GUI.color = new Color(1,1,1,1);
		}
	}
	
	GUI.SetNextControlName("returnMainMenu");
	// show the return to main menu button
	if (GUI.Button(new Rect((Screen.width/2)-75, Screen.height - 50,150,25), 'Return to Main Menu' )) {
		returnMainMenu();
	}
	if (PlayerPrefs.GetInt("ControllerValueIndex",0) == 1){
		GUI.FocusControl("returnMainMenu");
	}
}//end OnGUI


/************************************************************/
//Update
/************************************************************/

/**CreditsScreenScroller:Update
* register if correct gamepad button is selelcted
*
* @author Todd Dobbs
*/
function Update(){
	if(Input.GetButton("joystick button 14")){
		returnMainMenu();
	}
}//end Update

/**CreditsScreenScroller:returnMainMenu
* exit to title screen
*
* @author Todd Dobbs
*/
function returnMainMenu(){
	audio.Play();
	Application.LoadLevel(0);
}//end returnMainMenu
