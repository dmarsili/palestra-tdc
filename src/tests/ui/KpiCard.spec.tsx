import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KpiCard } from "@/ui/components/KpiCard";

describe("KpiCard", () => {
  it("renderiza título e valor", () => {
    render(<KpiCard title="Deploys" value={5} />);
    expect(screen.getByText("Deploys")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});


