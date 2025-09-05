import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    valueClassName?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, valueClassName }) => (
    <Card>
        <CardContent className="p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
                </div>
                {icon}
            </div>
        </CardContent>
    </Card>
);
