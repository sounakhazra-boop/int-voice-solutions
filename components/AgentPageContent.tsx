type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type JsonObject = { [key: string]: JsonValue };

interface AgentPageContentProps {
  pageTitle: string;
  brandName: string;
  description?: string;
  assistantName?: string;
  pageContent: JsonValue;
}

interface ContentSection {
  title: string;
  items: JsonValue[];
}

function isObject(value: JsonValue): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function labelize(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isPrimitive(value: JsonValue): boolean {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function toText(value: JsonValue): string {
  if (value === null) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return "";
  return String(value);
}

function ItemCard({ item }: { item: JsonObject }) {
  const entries = Object.entries(item).filter(
    ([key, value]) => key !== "status_color" && value !== null,
  );
  const titleEntry = entries.find(([key]) =>
    ["title", "name", "label", "type", "id"].includes(key),
  );

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {titleEntry && (
        <h3 className="text-base font-semibold text-slate-900">
          {toText(titleEntry[1])}
        </h3>
      )}
      <dl className={titleEntry ? "mt-4 space-y-3" : "space-y-3"}>
        {entries
          .filter(([key]) => key !== titleEntry?.[0])
          .map(([key, value]) => (
            <div key={key} className="flex items-start justify-between gap-5">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {labelize(key)}
              </dt>
              <dd className="max-w-[68%] text-right text-sm text-slate-700">
                {isPrimitive(value) ? (
                  toText(value)
                ) : Array.isArray(value) && value.every(isPrimitive) ? (
                  value.map(toText).join(" · ")
                ) : (
                  <span className="text-slate-400">
                    Available in this section
                  </span>
                )}
              </dd>
            </div>
          ))}
      </dl>
    </article>
  );
}

function SectionView({ section }: { section: ContentSection }) {
  const isChipSection =
    section.items.length > 0 &&
    section.items.every(
      (item) =>
        isObject(item) &&
        Object.keys(item).every((key) => key === "label" || key === "value"),
    ) &&
    section.items.every((item) => {
      const object = item as JsonObject;
      return Object.keys(object).length === 1 && "label" in object;
    });

  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          {section.title}
        </h2>
        <span className="text-xs text-slate-400">
          {section.items.length} {section.items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {isChipSection ? (
        <div className="flex flex-wrap gap-2">
          {section.items.map((item, index) => (
            <span
              key={index}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            >
              {toText((item as JsonObject).label)}
            </span>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {section.items.map((item, index) =>
            isObject(item) ? (
              <ItemCard key={index} item={item} />
            ) : (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm"
              >
                {toText(item)}
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}

export default function AgentPageContent({
  pageTitle,
  brandName,
  description,
  assistantName,
  pageContent,
}: AgentPageContentProps) {
  const content = isObject(pageContent) ? pageContent : {};
  const summary =
    typeof content.summary === "string" ? content.summary : description;
  const sections = Array.isArray(content.sections)
    ? content.sections.filter(
        (section): section is JsonObject =>
          isObject(section) &&
          typeof section.title === "string" &&
          Array.isArray(section.items),
      )
    : [];

  return (
    <section className="bg-[#f6f8fc] px-5 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-7xl">
        <header className="relative overflow-hidden rounded-[2rem] bg-[#0b1736] px-7 py-10 text-white shadow-xl md:px-12 md:py-14">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              {brandName}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
              {pageTitle}
            </h1>
            {summary && (
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                {summary}
              </p>
            )}
            {assistantName && (
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {assistantName}
              </div>
            )}
          </div>
        </header>

        <div className="mt-6 space-y-5">
          {sections.map((section, index) => (
            <SectionView
              key={index}
              section={{
                title: section.title as string,
                items: section.items as JsonValue[],
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
