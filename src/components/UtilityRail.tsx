import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const COMFORT_TIPS = [
  "짧아도 괜찮아요. 오늘의 한 줄부터 시작해요.",
  "태그를 달면 응원을 더 빨리 받아요.",
  "닉네임이 비어 있으면 '익명'으로 표시돼요.",
  "작은 공감이 큰 힘이 돼요.",
];

export const UtilityRail = () => {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % COMFORT_TIPS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden xl:block w-80 shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* Comfort Tip */}
        <div className="glass-card p-6 space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-semibold">오늘의 팁</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed animate-fade-in">
            {COMFORT_TIPS[currentTip]}
          </p>
        </div>

        {/* Best Replies - Placeholder */}
        <div className="glass-card p-6 space-y-3">
          <h3 className="font-semibold">베스트 응원</h3>
          <p className="text-sm text-muted-foreground">
            아직 등록된 베스트 응원이 없어요.
          </p>
        </div>

        {/* Recent Views - Placeholder */}
        <div className="glass-card p-6 space-y-3">
          <h3 className="font-semibold">최근 본 고민</h3>
          <p className="text-sm text-muted-foreground">
            최근 본 고민이 없어요.
          </p>
        </div>
      </div>
    </div>
  );
};
