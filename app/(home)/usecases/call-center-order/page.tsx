import { ChatWindowWithSpeech } from "@/components/usecase/call-center-order/ChatWindowWithSpeech";

export default function Home() {
  const InfoCard = (
    <div className="max-h-[85%] w-full overflow-hidden rounded bg-light-800 p-4 md:p-8">
      <h2>コールセンター注文デモ</h2>
    </div>
  );
  return (
    <ChatWindowWithSpeech
      endpoint="../api/call-center-order"
      emoji="🤖"
      titleText="AI注文アシスタント"
      placeholder="注文の希望をお聞かせてください。"
      emptyStateComponent={InfoCard}
    ></ChatWindowWithSpeech>
  );
}
