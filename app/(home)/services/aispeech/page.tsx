// @ts-nocheck
// TODO: Fix TypeScript errors
"use client";
import React, { useState, useEffect, useRef } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// import { getTokenOrRefresh } from "@/lib/actions/speech";

// TODO: Transfer these variables to server side for security
const SPEECH_KEY = process.env.NEXT_PUBLIC_SPEECH_KEY;
const SPEECH_REGION = process.env.NEXT_PUBLIC_SPEECH_REGION;

// TODO: Fix TypeScript errors

export default function SpeechToTextComponent() {
  const [isListening, setIsListening] = useState(false);
  const speechConfig = useRef<null>(null);
  const audioConfig = useRef<null>(null);
  const recognizer = useRef(null);

  const [myTranscript, setMyTranscript] = useState("");
  const [recognizingTranscript, setRecTranscript] = useState("");

  useEffect(() => {
    speechConfig.current = sdk.SpeechConfig.fromSubscription(SPEECH_KEY,SPEECH_REGION)
    speechConfig.current.speechRecognitionLanguage = "ja-JP";

    audioConfig.current = sdk.AudioConfig.fromDefaultMicrophoneInput();
    recognizer.current = new sdk.SpeechRecognizer(
      speechConfig.current,
      audioConfig.current
    );


    const processRecognizedTranscript = (event) => {
      console.log("event", event);
      const result = event.result;
      console.log("Recognition result:", result);

      if (result.reason === sdk.ResultReason.RecognizedSpeech) {
        const transcript = result.text;
        console.log("Transcript: -->", transcript);
        // Call a function to process the transcript as needed

        setMyTranscript(transcript);
      }
    };

    const processRecognizingTranscript = (event) => {
      const result = event.result;
      console.log("Recognition result:", result);
      if (result.reason === sdk.ResultReason.RecognizingSpeech) {
        const transcript = result.text;
        console.log("Transcript: -->", transcript);
        // Call a function to process the transcript as needed

        setRecTranscript(transcript);
      }
    };

    recognizer.current.recognized = (s, e) => processRecognizedTranscript(e);
    recognizer.current.recognizing = (s, e) => processRecognizingTranscript(e);

    recognizer.current.startContinuousRecognitionAsync(() => {
      console.log("Speech recognition started.");
      setIsListening(true);
    });

    return () => {
      recognizer.current.stopContinuousRecognitionAsync(() => {
        setIsListening(false);
      });
    };
  }, [isListening]);


  // const processRecognizedTranscript = (event) => {
  //   const result = event.result;
  //   console.log("Recognition result:", result);

  //   if (result.reason === sdk.ResultReason.RecognizedSpeech) {
  //     const transcript = result.text;
  //     console.log("Transcript: -->", transcript);
  //     // Call a function to process the transcript as needed

  //     setMyTranscript(transcript);
  //   }
  // };

  // const processRecognizingTranscript = (event) => {
  //   const result = event.result;
  //   console.log("Recognition result:", result);
  //   if (result.reason === sdk.ResultReason.RecognizingSpeech) {
  //     const transcript = result.text;
  //     console.log("Transcript: -->", transcript);
  //     // Call a function to process the transcript as needed

  //     setRecTranscript(transcript);
  //   }
  // };

  const pauseListening = () => {
    setIsListening(false);
    recognizer.current.stopContinuousRecognitionAsync();
    console.log("Paused listening.");
  };

  const resumeListening = () => {
    if (!isListening) {
      setIsListening(true);
      recognizer.current.startContinuousRecognitionAsync(() => {
        console.log("Resumed listening...");
      });
    }
  };

  const stopListening = () => {
    setIsListening(false);
    recognizer.current.stopContinuousRecognitionAsync(() => {
      console.log("Speech recognition stopped.");
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="max-w-fit"
          onClick={pauseListening}
        >
          リスニングを一時停止
        </Button>
        <Button
          variant="outline"
          className="max-w-fit"
          onClick={resumeListening}
        >
          リスニングを再開
        </Button>
        <Button variant="outline" className="max-w-fit" onClick={stopListening}>
          リスニングを停止
        </Button>
      </div>
      {/* // <button onClick={pauseListening} className="w-[20px] bg-dark-300">
      //   Pause Listening
      // </button> */}
      {/* <button onClick={resumeListening}>Resume Listening</button> */}
      {/* <button onClick={stopListening}>Stop Listening</button> */}

      <div>
        <h2>認識している音声</h2>
        <Textarea value={recognizingTranscript} readOnly/>
        {/* <div>Recognizing Transcript : {recognizingTranscript}</div> */}
        {/* <div>RecognizedTranscript : {myTranscript}</div> */}
        <h2>認識した音声</h2>
        <Textarea value={myTranscript} readOnly/>
      </div>
    </div>
  );
}
