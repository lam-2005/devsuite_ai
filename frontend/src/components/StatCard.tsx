import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { type LucideIcon } from "lucide-react";
type StatCardProps = {
  title: string;
  value: number;
  icon: LucideIcon;
  bgClass: string;
  iconClass: string;
  action?: React.ReactNode;
};
const StatCard = ({
  title,
  value,
  icon: Icon,
  bgClass,
  iconClass,
  action,
}: StatCardProps) => {
  return (
    <Card className="bg-primary-foreground -space-y-5">
      <CardHeader>
        <CardTitle className={`${bgClass} w-fit rounded-lg p-2`}>
          <Icon size={20} className={iconClass} />
        </CardTitle>

        <CardDescription>{title}</CardDescription>

        {action && <CardAction>{action}</CardAction>}
      </CardHeader>

      <CardContent className="text-lg font-bold">{value}</CardContent>
    </Card>
  );
};

export default StatCard;
