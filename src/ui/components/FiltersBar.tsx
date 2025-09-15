"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Option = { label: string; value: string };

type FiltersBarProps = {
  years: number[];
  companies: string[];
};

export const FiltersBar: React.FC<FiltersBarProps> = ({ years, companies }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const yearFromQs = params.get("year");
  const companyFromQs = params.get("company");

  function updateQs(next: Record<string, string | null>) {
    const sp = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v === null || v === "") sp.delete(k);
      else sp.set(k, String(v));
    });
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-zinc-900/60 p-3">
      <label className="text-sm text-gray-600 dark:text-gray-300">
        Ano
        <select
          className="ml-2 rounded-md border bg-transparent px-2 py-1"
          value={yearFromQs ?? ""}
          onChange={(e) => updateQs({ year: e.target.value || null })}
        >
          <option value="">Todos</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-gray-600 dark:text-gray-300">
        Empresa
        <select
          className="ml-2 rounded-md border bg-transparent px-2 py-1"
          value={companyFromQs ?? ""}
          onChange={(e) => updateQs({ company: e.target.value || null })}
        >
          <option value="">Todas</option>
          {companies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};


