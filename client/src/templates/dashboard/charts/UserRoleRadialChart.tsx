"use client";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { RoleType } from "@/types";
import { useTranslation } from "react-i18next";
import { RadialBarChart, RadialBar, LabelList } from "recharts";


const chartConfig = {
    users: {
        label: "Users",
    },
    Admin: {
        label: "Admin",
        color: "var(--chart-1)",
    },
    Contributor: {
        label: "Contributor",
        color: "var(--chart-3)",
    },
    Reviewer: {
        label: "Reviewer",
        color: "var(--chart-4)",
    },
    Viewer: {
        label: "Viewer",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig


interface Props {
    stats?: Record<RoleType, number>;
}

export default function UserRoleRadialChart({ stats }: Props) {
    const { t } = useTranslation();
    // 👉 Replace with your backend data later
    const chartData = [
        {
            role: t("role.options.admin"),
            users: stats?.ADMIN || 0,
            fill: "var(--color-admin)"
        },
        {
            role: t("role.options.contributor"),
            users: stats?.CONTRIBUTOR || 0,
            fill: "var(--color-contributor)"
        },
        {
            role: t("role.options.reviewer"),
            users: stats?.REVIEWER || 0,
            fill: "var(--color-reviewer)"
        },
        {
            role: t("role.options.viewer"),
            users: stats?.VIEWER || 0,
            fill: "var(--color-viewer)"
        },
    ];

    return (
        <div className="w-full flex justify-center">

            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square w-52 max-h-[250px]"
            >
                <RadialBarChart
                    data={chartData}
                    startAngle={-90}
                    endAngle={380}
                    innerRadius={30}
                    outerRadius={110}
                >
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel nameKey="role" />}
                    />

                    <RadialBar dataKey="users" background>
                        <LabelList
                            position="insideStart"
                            dataKey="role"
                            className="fill-white capitalize mix-blend-luminosity"
                            fontSize={11}
                        />
                    </RadialBar>
                </RadialBarChart>
            </ChartContainer>
        </div>
    );
}
