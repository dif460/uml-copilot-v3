import type { FormField, PrototypeSchema } from "@/types/prototype-schema";

export function FormView({ schema }: { schema: PrototypeSchema }) {
  return (
    <div className="mx-auto max-w-6xl rounded-lg border bg-white shadow-sm">
      <div className="flex items-center border-b px-5 py-3">
        <button className="rounded bg-[#714B67] px-3 py-1.5 text-xs text-white">Confirm</button>
        <button className="ml-2 rounded border px-3 py-1.5 text-xs">Cancel</button>
        <div className="ml-auto flex items-center">
          {schema.form.status.map((status, index) => (
            <div key={status} className="flex items-center">
              <div
                className={`rounded-full px-3 py-1 text-[10px] ${
                  status === schema.form.activeStatus
                    ? "bg-[#714B67] text-white"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {status}
              </div>
              {index < schema.form.status.length - 1 && (
                <div className="h-px w-5 bg-neutral-300" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-7">
        <div className="text-2xl font-semibold">{schema.form.title}</div>
        <div className="mt-1 text-xs text-neutral-400">New</div>

        <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-5">
          {schema.form.fields.map((field) => (
            <FieldRenderer key={field.id} field={field} />
          ))}
        </div>

        {schema.businessRules.length > 0 && (
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="text-xs font-semibold text-amber-900">Business Rules</div>
            <ul className="mt-2 space-y-1 text-[11px] text-amber-900">
              {schema.businessRules.map((rule) => (
                <li key={rule.id}>• {rule.description}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 border-t pt-4">
          <div className="text-xs font-semibold">Order Lines</div>
          <div className="mt-3 rounded border">
            <div className="grid grid-cols-[1fr_100px_120px_120px] bg-neutral-50 px-3 py-2 text-[10px] text-neutral-500">
              <span>Product</span><span>Quantity</span><span>Unit Price</span><span>Subtotal</span>
            </div>
            <div className="grid grid-cols-[1fr_100px_120px_120px] px-3 py-3 text-[11px]">
              <span>Custom Product</span><span>10</span><span>$1,240</span><span>$12,400</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldRenderer({ field }: { field: FormField }) {
  return (
    <label className={field.width === "full" ? "col-span-2" : ""}>
      <div className="mb-1.5 text-[11px] font-medium text-neutral-600">{field.label}</div>
      {field.type === "statusbar" ? (
        <div className="flex gap-2 rounded border p-2">
          {(field.options ?? []).map((option) => (
            <span
              key={option}
              className={`rounded-full px-2 py-1 text-[10px] ${
                option === field.value ? "bg-[#714B67] text-white" : "bg-neutral-100"
              }`}
            >
              {option}
            </span>
          ))}
        </div>
      ) : (
        <div className="min-h-9 rounded border bg-white px-3 py-2 text-xs">
          {field.value || "—"}
        </div>
      )}
    </label>
  );
}
