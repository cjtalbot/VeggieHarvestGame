/*
 * This file loads configuration values and applys them to a scene.
 * @author Todd Dobbs
 */
using UnityEngine;
using System.Collections;

public class ConfigurationLoad : MonoBehaviour {
	
	public int BackgroundMusicValueIndex;
	public int SoundEffectsValueIndex;
	public int ControllerValueIndex;
	public int MouseValueIndex;
	public int LearnValueIndex;
	public float DifficultyValue;
	public float GammaValue;	
	
	// Use this for initialization
	void Start () {
		
		BackgroundMusicValueIndex = PlayerPrefs.GetInt("BackgroundMusicValueIndex",0);
		SoundEffectsValueIndex = PlayerPrefs.GetInt("SoundEffectsValueIndex",0);
		ControllerValueIndex = PlayerPrefs.GetInt("ControllerValueIndex",0);
		MouseValueIndex = PlayerPrefs.GetInt("MouseValueIndex",0);
		LearnValueIndex = PlayerPrefs.GetInt("LearnValueIndex",0);
		DifficultyValue = PlayerPrefs.GetFloat("DifficultyValue", (float)6.0);
		GammaValue = PlayerPrefs.GetFloat("GammaValue",(float)50.0);		
		setConfiguration();
	}
	
	// Update is called once per frame
	void Update () {
		
	}
	
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
}
