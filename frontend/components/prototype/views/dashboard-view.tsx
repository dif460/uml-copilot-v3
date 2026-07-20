import { useLocale } from "@/lib/i18n";
import type { PrototypeSchema } from "@/types/prototype-schema";

export function DashboardView({ schema }: { schema: PrototypeSchema }) {
  const max = Math.max(...schema.chart.values);
  const { t } = useLocale();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3">
        {schema.kpis.map((kpi) => (
          <div key={kpi.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="text-[11px] text-neutral-500">{kpi.label}</div>
            <div className="mt-3 text-xl font-semibold">{kpi.value}</div>
            <div className="mt-1 text-[10px] text-emerald-700">{kpi.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] gap-3">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold">{schema.chart.title}</div>
          <div className="text-[10px] text-neutral-400">{schema.chart.subtitle}</div>
          <div className="mt-5 flex h-48 items-end gap-2 border-b border-dashed px-3">
            {schema.chart.values.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center justify-end">
                <div
                  className="w-full rounded-t bg-[#714B67]/70"
                  style={{ height: `${Math.max(8, (value / max) * 160)}px` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-12 text-center text-[9px] text-neutral-400">
            {"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ").map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold">{t("dashboard.pipeline")}</div>
          <div className="mt-4 space-y-4">
            {schema.pipeline.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-[10px]">
                  <span>{item.label}</span>
                  <span className="text-neutral-500">{item.value}</span>
                </div>
                <div className="h-1.5 rounded bg-neutral-100">
                  <div
                    className="h-1.5 rounded bg-[#714B67]"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] gap-3">
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b px-4 py-3 text-xs font-semibold">{schema.table.title}</div>
          {schema.table.rows.map((row) => (
            <div key={row.id} className="grid grid-cols-[1fr_120px_100px] items-center border-b px-4 py-2.5 text-[10px] last:border-0">
              <div>
                <div>{row.customer}</div>
                <div className="text-neutral-400">{row.order}</div>
              </div>
              <div className="text-right font-semibold">{row.amount}</div>
              <div className="text-right">
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] text-emerald-700">
                  {row.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold">{t("dashboard.teamActivity")}</div>
          <div className="mt-4 space-y-4 text-[10px]">
            {[
              "Sarah Kim closed a deal with Acme Corporation",
              "James Lee created invoice INV-2048",
              "Nora Diaz added 120 units to inventory",
              "Tom Blake updated the Q3 sales forecast",
            ].map((activity) => (
              <div key={activity} className="flex gap-2">
                <div className="h-6 w-6 rounded-full bg-neutral-100" />
                <div>
                  <div>{activity}</div>
                  <div className="text-neutral-400">{t("dashboard.recently")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
