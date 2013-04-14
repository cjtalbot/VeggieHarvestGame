/*
 * This file exposes and interface to manipulate configuration values and
 * loads configuration values and applys them to a scene.
 * @author Todd Dobbs
 */
using UnityEngine;
using System.Collections;

public class Configuration : MonoBehaviour {
	
	//variables exposed for UI access
	private enum ConfigScreenActionType{music, sound, controller, difficulty, hints, gamma, mainmenu};
	private float buttonRate = 0.25f;
	private float nextButton = 0.0f;
	private ConfigScreenActionType selectedAction = ConfigScreenActionType.mainmenu;
	private int actionModifier = 0;
	public Rect BackgroundBoxRectangle;
	public GUIContent BackgroundBoxContent;
	public GUIStyle BackgroundBoxStyle;
	public Rect TitlePosition;
	public GUIContent TitleContent;
	public GUIStyle TitleStyle;
	public Rect AudioSettingsGroupPosition;
	public GUIContent AudioSettingsGroupContent;
	public Rect BackgroundMusicLabelPosition;
	public GUIContent BackgroundMusicLabelContent;
	private GUIStyle BackgroundMusicLabelStyle = new GUIStyle();
	public Rect BackgroundMusicValuePosition;
	public int BackgroundMusicValueIndex;
	public GUIContent[] BackgroundMusicValueContent;
	public Rect SoundEffectsLabelPosition;
	public GUIContent SoundEffectsLabelContent;
	private GUIStyle SoundEffectsLabelStyle = new GUIStyle();
	public Rect SoundEffectsValuePosition;
	public int SoundEffectsValueIndex;
	public GUIContent[] SoundEffectsValueContent;
	public Rect InputSettingsGroupPosition;
	public GUIContent InputSettingsGroupContent;
	public Rect ControllerLabelPosition;
	public GUIContent ControllerLabelContent;
	private GUIStyle ControllerLabelStyle = new GUIStyle();
	public Rect ControllerValuePosition;
	public int ControllerValueIndex;
	public GUIContent[] ControllerValueContent;
	public Rect GameSettingsGroupPosition;
	public GUIContent GameSettingsGroupContent;
	public Rect DifficultyLabelPosition;
	public GUIContent DifficultyLabelContent;
	public Rect DifficultyValuePosition;
	public float DifficultyValue;
	public float DifficultyLeftValue;
	public float DifficultyRightValue;
	private GUIStyle DifficultyLabelStyle = new GUIStyle();
	public Rect HintsLabelPosition;
	public GUIContent HintsLabelContent;
	private GUIStyle HintsLabelStyle = new GUIStyle();
	public Rect HintsValuePosition;
	public int HintsValueIndex;
	public GUIContent[] HintsValueContent;
	public Rect VideoSettingsGroupPosition;
	public GUIContent VideoSettingsGroupContent;
	public Rect GammaLabelPosition;
	public GUIContent GammaLabelContent;
	private GUIStyle GammaLabelStyle = new GUIStyle();
	public Rect GammaValuePosition;
	public float GammaValue;
	public float GammaLeftValue;
	public float GammaRightValue;
	public Rect MainMenuButtonPosition;
	public GUIContent MainMenuButtonLabelContent;	
	
	// This is a shared method to set configuration values
	public void setConfiguration(){
		Screen.lockCursor = (ControllerValueIndex == 1);
		RenderSettings.ambientLight = Color.Lerp(Color.black, Color.white, GammaValue);
		AudioSource _audio = new AudioSource();
		Component[] audioSource = GetComponents(_audio.GetType());
		for (int i = 0; i < audioSource.Length; i++){
			_audio = (AudioSource)audioSource[i];
			// if the audio is looping, then it is music (in this game)
			if (_audio.loop){
				_audio.mute = (BackgroundMusicValueIndex == 1);
			}else{
				_audio.mute = (SoundEffectsValueIndex == 1);
			}
		}
	}
	
	// Use this for initialization
	void Start () {
		BackgroundMusicValueIndex = PlayerPrefs.GetInt("BackgroundMusicValueIndex",0);
		SoundEffectsValueIndex = PlayerPrefs.GetInt("SoundEffectsValueIndex",0);
		ControllerValueIndex = PlayerPrefs.GetInt("ControllerValueIndex",0);
		DifficultyValue = PlayerPrefs.GetFloat("DifficultyValue",(float)6.0);
		GammaValue = PlayerPrefs.GetFloat("GammaValue",(float)50.0);
		HintsValueIndex = PlayerPrefs.GetInt("hints",0);
	}
	
	// Update is called once per frame
	void Update () {
		actionModifier = 0;
		int action = (int)selectedAction;
		if((Input.GetButton("joystick button 5") || Input.GetButton("joystick button 6")) && (Time.time > nextButton)){//right or down
			nextButton = Time.time + buttonRate;
			action++;
			if (action > 6){
				action = 0;
			}
			selectedAction = (ConfigScreenActionType)action;
		}
		if((Input.GetButton("joystick button 7") || Input.GetButton("joystick button 4")) && (Time.time > nextButton)){//left or up
			nextButton = Time.time + buttonRate;
			action--;
			if (action < 0){
				action = 6;
			}		
			selectedAction = (ConfigScreenActionType)action;
		}
		if((Input.GetButton("joystick button 14")) && (Time.time > nextButton)){//x button
			nextButton = Time.time + buttonRate;
			actionModifier = 1;
			performSelectedAction();
		}
		if((Input.GetButton("joystick button 13")) && (Time.time > nextButton)){//o button
			nextButton = Time.time + buttonRate;
			actionModifier = -1;
			performSelectedAction();
		}		
		PlayerPrefs.SetInt("BackgroundMusicValueIndex",BackgroundMusicValueIndex);
		PlayerPrefs.SetInt("SoundEffectsValueIndex",SoundEffectsValueIndex);
		PlayerPrefs.SetInt("ControllerValueIndex",ControllerValueIndex);
		PlayerPrefs.SetFloat("DifficultyValue",DifficultyValue);
		PlayerPrefs.SetFloat("GammaValue",GammaValue);
		PlayerPrefs.SetFloat("hints",HintsValueIndex);
		setConfiguration();
		//Debug.Log(selectedAction.ToString());
	}
	
	// Create GUI items
	void OnGUI(){
		GUI.Box(BackgroundBoxRectangle,BackgroundBoxContent, BackgroundBoxStyle);
		GUI.Label(TitlePosition, TitleContent, TitleStyle);
		GUI.Box(AudioSettingsGroupPosition, AudioSettingsGroupContent);
		if (selectedAction == Configuration.ConfigScreenActionType.music){
			BackgroundMusicLabelStyle.normal.textColor = Color.red;
		}else{
			BackgroundMusicLabelStyle.normal.textColor = Color.white;
		}
		GUI.Label(BackgroundMusicLabelPosition, BackgroundMusicLabelContent, BackgroundMusicLabelStyle);
		GUI.SetNextControlName(ConfigScreenActionType.music.ToString());
		BackgroundMusicValueIndex = GUI.Toolbar(BackgroundMusicValuePosition, BackgroundMusicValueIndex, BackgroundMusicValueContent);
		if (selectedAction == Configuration.ConfigScreenActionType.sound){
			SoundEffectsLabelStyle.normal.textColor = Color.red;
		}else{
			SoundEffectsLabelStyle.normal.textColor = Color.white;
		}		
		GUI.Label(SoundEffectsLabelPosition, SoundEffectsLabelContent, SoundEffectsLabelStyle);
		GUI.SetNextControlName(ConfigScreenActionType.sound.ToString());
		SoundEffectsValueIndex = GUI.Toolbar(SoundEffectsValuePosition, SoundEffectsValueIndex, SoundEffectsValueContent);
		GUI.Box (InputSettingsGroupPosition, InputSettingsGroupContent);
		if (selectedAction == Configuration.ConfigScreenActionType.controller){
			ControllerLabelStyle.normal.textColor = Color.red;
		}else{
			ControllerLabelStyle.normal.textColor = Color.white;
		}			
		GUI.Label(ControllerLabelPosition, ControllerLabelContent, ControllerLabelStyle);
		GUI.SetNextControlName(ConfigScreenActionType.controller.ToString());
		ControllerValueIndex = GUI.Toolbar(ControllerValuePosition, ControllerValueIndex, ControllerValueContent);
		GUI.Box(GameSettingsGroupPosition, GameSettingsGroupContent);
		GUI.Box(VideoSettingsGroupPosition, VideoSettingsGroupContent);
		// cjt added difficulty setting instead of learn alerts on/off
		if (selectedAction == Configuration.ConfigScreenActionType.difficulty){
			DifficultyLabelStyle.normal.textColor = Color.red;
		}else{
			DifficultyLabelStyle.normal.textColor = Color.white;
		}		
		GUI.Label(DifficultyLabelPosition, DifficultyLabelContent,DifficultyLabelStyle);
		GUI.SetNextControlName(ConfigScreenActionType.difficulty.ToString());
		DifficultyValue = GUI.HorizontalSlider (DifficultyValuePosition, DifficultyValue, DifficultyLeftValue, DifficultyRightValue);
		
		if (selectedAction == Configuration.ConfigScreenActionType.hints){
			HintsLabelStyle.normal.textColor = Color.red;
		}else{
			HintsLabelStyle.normal.textColor = Color.white;
		}
		GUI.Label(HintsLabelPosition, HintsLabelContent, HintsLabelStyle);
		GUI.SetNextControlName(ConfigScreenActionType.music.ToString());
		HintsValueIndex = GUI.Toolbar(HintsValuePosition, HintsValueIndex, HintsValueContent);
		GUI.SetNextControlName(ConfigScreenActionType.gamma.ToString());
		if (selectedAction == Configuration.ConfigScreenActionType.gamma){
			GammaLabelStyle.normal.textColor = Color.red;
		}else{
			GammaLabelStyle.normal.textColor = Color.white;
		}			
		GUI.Label(GammaLabelPosition, GammaLabelContent, GammaLabelStyle);
		GammaValue = GUI.HorizontalSlider (GammaValuePosition, GammaValue, GammaLeftValue, GammaRightValue);
		GUI.SetNextControlName(ConfigScreenActionType.mainmenu.ToString());
		if (GUI.Button(MainMenuButtonPosition, MainMenuButtonLabelContent)){
			performMainMenuAction();
		}
		if (PlayerPrefs.GetInt("ControllerValueIndex",0) == 1){
			GUI.FocusControl(selectedAction.ToString());
		}
	}
	
	//performs an action based on the action selected by the controller
	void performSelectedAction(){
		switch(selectedAction){
		case ConfigScreenActionType.controller:
			performControllerAction();
			break;
		case ConfigScreenActionType.difficulty:
			performDifficultyAction();
			break;
		case ConfigScreenActionType.gamma:
			performGammaAction();
			break;
		case ConfigScreenActionType.hints:
			performHints();
			break;
		case ConfigScreenActionType.mainmenu:
			performMainMenuAction();
			break;
		case ConfigScreenActionType.music:
			performMusicAction();
			break;
		case ConfigScreenActionType.sound:
			performSoundAction();
			break;					
		}
	}
	
	//toggle controller type
	void performControllerAction(){
		if (ControllerValueIndex == 0){
			ControllerValueIndex = 1;
		}else{
			ControllerValueIndex = 0;
		}
	}
	
	//toggle hints
	void performHints(){
		if (HintsValueIndex == 0){
			HintsValueIndex = 1;
		}else{
			HintsValueIndex = 0;
		}
	}
	
	//modify AI difficulty
	void performDifficultyAction(){
		DifficultyValue += actionModifier;
		if (DifficultyValue > DifficultyRightValue){
			DifficultyValue = DifficultyLeftValue;
		}		
	}
	
	//modify gamma
	void performGammaAction(){
		GammaValue += actionModifier;
		if (GammaValue > GammaRightValue){
			GammaValue = GammaLeftValue;
		}
	}
	
	//return to main menu
	void performMainMenuAction(){
		audio.Play();
		Application.LoadLevel(0);
	}
	
	//toggle music
	void performMusicAction(){
		if (BackgroundMusicValueIndex == 0){
			BackgroundMusicValueIndex = 1;
		}else{
			BackgroundMusicValueIndex = 0;
		}		
	}
	
	//toggle sound
	void performSoundAction(){
		if (SoundEffectsValueIndex == 0){
			SoundEffectsValueIndex = 1;
		}else{
			SoundEffectsValueIndex = 0;
		}			
	}
	
}
