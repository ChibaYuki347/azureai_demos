// @ts-nocheck
// TODO: Fix TypeScript errors
import { useState, useEffect, useRef } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { getTokenOrRefresh } from "@/lib/actions/speech";

interface Props {
    recognizedText: string | null; // 認識済みのテキスト
    setRecognizedText: (text: string | null) => void;
    recognizingText: string | null; // 認識中のテキスト
    setRecognizingText: (text: string | null) => void;
}

interface SpeechRecognitionOutput {
    isListening: boolean;
    pauseListening: () => void;
    resumeListening: () => void;
    stopListening: () => void;
}

export function useSpeechRecognition({ recognizedText, setRecognizedText, recognizingText, setRecognizingText }: Props): SpeechRecognitionOutput {
  const [isListening, setIsListening] = useState(false);
  const speechConfig = useRef<null | sdk.SpeechConfig>(null);
  const audioConfig = useRef<null | sdk.AudioConfig>(null);
  const recognizer = useRef<null | sdk.SpeechRecognizer>(null);

  useEffect(() => {
    const initializeRecognizer = async () => {
      const tokenObj = await getTokenOrRefresh();
      speechConfig.current = sdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
      speechConfig.current.speechRecognitionLanguage = "ja-JP";

      audioConfig.current = sdk.AudioConfig.fromDefaultMicrophoneInput();
      recognizer.current = new sdk.SpeechRecognizer(speechConfig.current, audioConfig.current);

      recognizer.current.startContinuousRecognitionAsync(() => {
        console.log("Speech recognition started.");
        setIsListening(true);
      });
    };
    
    
    
    const processRecognizedTranscript = (event) => {
        console.log("event", event);
        const result = event.result;
        console.log("Recognition result:", result);
  
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          const transcript = result.text;
          console.log("Transcript: -->", transcript);
          // Call a function to process the transcript as needed
  
          setRecognizedText(transcript);
        }
      };
  
      const processRecognizingTranscript = (event) => {
        const result = event.result;
        console.log("Recognition result:", result);
        if (result.reason === sdk.ResultReason.RecognizingSpeech) {
          const transcript = result.text;
          console.log("Transcript: -->", transcript);
          // Call a function to process the transcript as needed
  
          setRecognizingText(transcript);
        }
      };
    
    initializeRecognizer().then(() => {
        if (recognizer.current) {
          recognizer.current.recognized = (s, e) => processRecognizedTranscript(e);
          recognizer.current.recognizing = (s, e) => processRecognizingTranscript(e);
        } else {
          console.error('音声認識の初期化に失敗しました。');
        }
        console.log("recognizer.current", recognizer.current);
    })


  
      
    return () => {
        if( recognizer.current !== null){
            recognizer.current.stopContinuousRecognitionAsync(() => {
                setIsListening(false);
            });
        }
    };
  }, []);

  const pauseListening = () => {
    setIsListening(false);
    if( recognizer.current !== null){
        recognizer.current.stopContinuousRecognitionAsync();
        console.log("Paused listening.");
    }
  };

  const resumeListening = () => {
    if (!isListening) {
      setIsListening(true);
      if( recognizer.current !== null){
          recognizer.current.startContinuousRecognitionAsync(() => {
            console.log("Resumed listening...");
        });
      }
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if( recognizer.current !== null){
        recognizer.current.stopContinuousRecognitionAsync(() => {
          console.log("Speech recognition stopped.");
        });
    }
  };

  return { isListening, pauseListening, resumeListening, stopListening };
}