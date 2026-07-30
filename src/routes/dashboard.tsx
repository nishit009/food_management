import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, Users, ClipboardList, Crown } from "lucide-react";
import { quoteRequests, menuNames } from "@/data/dashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Quote Requests Dashboard — Sree Ram Catering" },
      {
        name: "description",
        content:
          "Internal dashboard showing catering quote requests, customer details, selected menus and item counts for Sree Ram Catering.",
      },
      { property: "og:title", content: "Quote Requests Dashboard — Sree Ram Catering" },
      {
        property: "og:description",
        content: "Track customers, menus and item counts across incoming catering requests.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

const PAGE_SIZE = 6;

function Dashboard() {
  const [query, setQuery] = useState("");
  const [menuFilter, setMenuFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return quoteRequests.filter(
      (r) =>
        (menuFilter === "all" || r.menu === menuFilter) &&
        (q === "" || r.name.toLowerCase().includes(q) || r.phone.includes(q)),
    );
  }, [query, menuFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const topMenu = useMemo(() => {
    const counts = new Map<string, number>();
    quoteRequests.forEach((r) => counts.set(r.menu, (counts.get(r.menu) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }, []);

  const stats = [
    { label: "Total Customers", value: String(new Set(quoteRequests.map((r) => r.name)).size), icon: Users },
    { label: "Total Requests", value: String(quoteRequests.length), icon: ClipboardList },
    { label: "Most Selected Menu", value: topMenu, icon: Crown },
  ];

  return (
    <div className="stone-wash min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <header>
          <h1 className="text-3xl text-primary sm:text-4xl">Quote Requests</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Mock data preview of incoming catering enquiries.
          </p>
        </header>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="panel-carved grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-lg p-6"
            >
              <div className="min-w-0">
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  {s.label}
                </p>
                <p className="mt-2 truncate font-display text-2xl text-primary">{s.value}</p>
              </div>
              <s.icon className="h-8 w-8 shrink-0 text-secondary" />
            </motion.div>
          ))}
        </div>

        <div className="panel-carved mt-8 rounded-lg p-5">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="relative min-w-0">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name or phone"
                aria-label="Search requests"
                className="w-full rounded-md border border-input bg-background py-2 pr-3 pl-9 text-sm outline-none focus:border-secondary"
              />
            </div>
            <select
              value={menuFilter}
              onChange={(e) => {
                setMenuFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by menu"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-secondary"
            >
              <option value="all">All menus</option>
              {menuNames.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b-2 border-secondary/60 text-xs tracking-[0.15em] text-muted-foreground uppercase">
                  <th className="py-3 pr-4">Customer</th>
                  <th className="py-3 pr-4">Phone</th>
                  <th className="py-3 pr-4">Selected Menu</th>
                  <th className="py-3 pr-4">Items</th>
                  <th className="py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-border/70 hover:bg-accent/30">
                    <td className="py-3 pr-4 font-medium">{r.name}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{r.phone}</td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full border border-secondary bg-accent/50 px-3 py-1 text-xs">
                        {r.menu}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{r.items}</td>
                    <td className="py-3 text-muted-foreground">{r.date}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No requests match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Showing {rows.length} of {filtered.length} requests
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={current === 1}
                className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                {current} / {pageCount}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={current === pageCount}
                className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
