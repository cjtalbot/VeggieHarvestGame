/*
 * This file provides the script to put a title on the page
 * @author Christine Talbot
 */
 
 
/************************************************************/
//Variables
/************************************************************/
public var titleImage:Texture2D; // the image to show on the label
public var dims:Rect; // location & size of image
 
/************************************************************/
//OnGUI
/************************************************************/

/** AddTitleScript:OnGUI
* Posts title image with the given dimensions onto the screen.
*
* @author Christine Talbot
*/
function OnGUI() {
	GUI.Label(new Rect(dims), titleImage);
}