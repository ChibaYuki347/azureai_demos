"use client"

import React, { useState } from 'react';
import { Container } from 'reactstrap';
import { getTokenOrRefresh } from '@/lib/actions/speech'
// import './custom.css'
import { Recognizer, ResultReason, SpeechRecognizer, SpeechSynthesizer, Synthesizer } from 'microsoft-cognitiveservices-speech-sdk';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

export default function SpeechDemo() { 
    const [displayText, setDisplayText] = useState('INITIALIZED: ready to test speech...');
    const [player, updatePlayer] = useState({p: undefined, muted: false});

    async function sttFromMicOnce() {
        const tokenObj = await getTokenOrRefresh();
        const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
        speechConfig.speechRecognitionLanguage = 'ja-JP';
        
        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer: SpeechRecognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

        setDisplayText('speak into your microphone...');

        recognizer.recognizeOnceAsync(result => {
            console.log("result",result);
            switch (result.reason) {
                case speechsdk.ResultReason.RecognizedSpeech:
                setDisplayText(`RECOGNIZED: Text=${result.text}`);
                recognizer.close();
                break
            case speechsdk.ResultReason.NoMatch:
                console.log("NOMATCH: Speech could not be recognized.");
                recognizer.close();
                break;
            case speechsdk.ResultReason.Canceled: {
            const cancellation = speechsdk.CancellationDetails.fromResult(result);
            console.log(`CANCELED: Reason=${cancellation.reason}`);
    
            if (cancellation.reason === speechsdk.CancellationReason.Error) {
                console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                console.log("CANCELED: Did you set the speech resource key and region values?");
            }
            recognizer.close();
            break;
            }
    }});
    }
    
    const micStop = (recognizer: SpeechRecognizer) => {
        recognizer.stopContinuousRecognitionAsync(
            () => {
                console.log('stopped');
            },
            (err) => {
                console.log(err);
            }
        );
    }

    async function textToSpeech() {
        const tokenObj = await getTokenOrRefresh();
        const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
        const myPlayer = new speechsdk.SpeakerAudioDestination();
        updatePlayer(p => {p.p = myPlayer; return p;});
        const audioConfig = speechsdk.AudioConfig.fromSpeakerOutput(player.p);

        let synthesizer:SpeechSynthesizer = new speechsdk.SpeechSynthesizer(speechConfig, audioConfig);

        const textToSpeak = 'This is an example of speech synthesis for a long passage of text. Pressing the mute button should pause/resume the audio output.';
        setDisplayText(`speaking text: ${textToSpeak}...`);
        synthesizer.speakTextAsync(
        textToSpeak,
        result => {
            let text;
            if (result.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
                text = `synthesis finished for "${textToSpeak}".\n`
            } else if (result.reason === speechsdk.ResultReason.Canceled) {
                text = `synthesis failed. Error detail: ${result.errorDetails}.\n`
            }
            synthesizer.close();
            synthesizer = undefined;
            setDisplayText(text);
        },
        function (err) {
            setDisplayText(`Error: ${err}.\n`);

            synthesizer.close();
            synthesizer = undefined;
        });
    }

    async function handleMute() {
        updatePlayer(p => { 
            if (!p.muted) {
                p.p.pause();
                return {p: p.p, muted: true}; 
            } else {
                p.p.resume();
                return {p: p.p, muted: false}; 
            }
        });
    }

    async function fileChange(event) {
        const audioFile = event.target.files[0];
        console.log(audioFile);
        const fileInfo = audioFile.name + ` size=${audioFile.size} bytes `;

        setDisplayText(fileInfo);

        const tokenObj = await getTokenOrRefresh();
        const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
        speechConfig.speechRecognitionLanguage = 'en-US';

        const audioConfig = speechsdk.AudioConfig.fromWavFileInput(audioFile);
        const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognizeOnceAsync(result => {
            let text;
            if (result.reason === ResultReason.RecognizedSpeech) {
                text = `RECOGNIZED: Text=${result.text}`
            } else {
                text = 'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
            }

            setDisplayText(fileInfo + text);
        });
    }

    return (
        <div className='flex flex-col'>
            <h1>スピーチサービスサンプル</h1>

            <Button onClick={sttFromMicOnce} variant='outline' className='max-w-fit'>マイクから音を拾う</Button>
            <Button onClick={sttFromMicOnce} variant='outline' className='max-w-fit'>マイクから音を拾う</Button>
            <Textarea value={displayText} className='max-w-fit' readOnly/>
        </div>
 
    );
}