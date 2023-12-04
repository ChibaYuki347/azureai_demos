import { ChatWindow } from "@/components/chat/ChatWindow";

export default function Home() {
  const InfoCard = (
    <div className="max-h-[85%] w-full overflow-hidden rounded bg-light-800 p-4 md:p-8">
      <h2>シンプルチャットボット</h2>
    </div>
  );
  return (
    <ChatWindow
      endpoint="../api/chat"
      emoji="🤖"
      titleText="AIアシスタント"
      placeholder="私はAIチャットボットです。なんでも聞いてください。"
      emptyStateComponent={InfoCard}
    ></ChatWindow>
  );
}
