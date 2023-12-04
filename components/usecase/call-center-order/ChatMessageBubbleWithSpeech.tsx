import { Button } from "@/components/ui/button";
import type { Message } from "ai/react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

export function ChatMessageBubbleWithSpeech(props: {
  message: Message;
  aiEmoji?: string;
  sources: any[];
}) {
  const colorClassName =
    props.message.role === "user" ? "bg-sky-600" : "bg-slate-50 text-black";
  const alignmentClassName =
    props.message.role === "user" ? "ml-auto" : "mr-auto";
  const prefix = props.message.role === "user" ? "👤" : props.aiEmoji;

  // Text to Speech
  function synthesizeSpeech(message: Message) {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_SPEECH_KEY!,
      process.env.NEXT_PUBLIC_SPEECH_REGION!
    );
    const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);

    const voice = message.role === "user" ? "ja-JP-ShioriNeural" : "ja-JP-NanamiNeural";

    const ssml = `<speak version='1.0' xml:lang='en-US' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'> \r\n \
        <voice name='${voice}'> \r\n \
            <mstts:viseme type='redlips_front'/> \r\n \
            ${message.content} \r\n \
        </voice> \r\n \
    </speak>`;

    speechSynthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        if (result.errorDetails) {
          console.error(result.errorDetails);
        } else {
          console.log(JSON.stringify(result));
        }

        speechSynthesizer.close();
      },
      (error) => {
        console.log(error);
        speechSynthesizer.close();
      }
    );
  }
  return (
    <div
      className={`${alignmentClassName} ${colorClassName} mb-8 flex max-w-[80%] rounded px-4 py-2`}
    >
            <Button className="h-8 w-8" variant="secondary" onClick={() => synthesizeSpeech(props.message)}>
              {/* <Image src="/assets/icons/play.svg" width={24} height={24} alt="play"/> */}
              音声
            </Button>
      <div className="mr-2">{prefix}</div>
      <div className="flex flex-col whitespace-pre-wrap">
        <span>{props.message.content}</span>
        {props.sources && props.sources.length ? (
          <>
            <code className="mr-auto mt-4 rounded bg-slate-600 px-2 py-1">
              <h2>🔍 Sources:</h2>
            </code>
            <code className="mr-2 mt-1 rounded bg-slate-600 px-2 py-1 text-xs">
              {props.sources?.map((source, i) => (
                <div className="mt-2" key={"source:" + i}>
                  {i + 1}. &quot;{source.pageContent}&quot;
                  {source.metadata?.loc?.lines !== undefined ? (
                    <div>
                      <br />
                      Lines {source.metadata?.loc?.lines?.from} to{" "}
                      {source.metadata?.loc?.lines?.to}
                    </div>
                  ) : (
                    ""
                    )}
                </div>
              ))}
            </code>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
