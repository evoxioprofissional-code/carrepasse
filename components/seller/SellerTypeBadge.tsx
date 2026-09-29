import { Building2, Handshake, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { SELLER_TYPE_LABEL } from "@/lib/labels";
import type { SellerType } from "@/types/user";

const ICONS = { lojista: Building2, corretor: Handshake, particular: UserRound } as const;

export function SellerTypeBadge({ type }: { type: SellerType }) {
  const Icon = ICONS[type];
  return (
    <Badge variant={type === "particular" ? "neutral" : "brand"} icon={<Icon aria-hidden className="size-3" />}>
      {SELLER_TYPE_LABEL[type]}
    </Badge>
  );
}
