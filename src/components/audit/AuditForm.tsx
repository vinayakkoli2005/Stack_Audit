"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, ArrowRight } from "lucide-react";

import { auditFormSchema, type AuditFormValues } from "@/lib/audit/schema";
import { VENDOR_LABELS, VENDOR_TIERS, ALL_VENDORS } from "@/lib/audit/vendors";
import type { Vendor } from "@/lib/audit/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STORAGE_KEY = "stackaudit_form_v1";

const DEFAULT_TOOL: AuditFormValues["tools"][0] = {
  vendor: "cursor",
  tier: "pro",
  monthlySpend: 20,
  seats: 1,
};

const USE_CASE_OPTIONS = [
  { value: "coding",   label: "Software development / coding" },
  { value: "writing",  label: "Writing & content creation" },
  { value: "data",     label: "Data analysis & BI" },
  { value: "research", label: "Research & information gathering" },
  { value: "mixed",    label: "Mixed / multiple use cases" },
] as const;

interface AuditFormProps {
  onSubmit: (values: AuditFormValues) => void;
  isLoading?: boolean;
}

function getSaved(): Partial<AuditFormValues> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

export function AuditForm({ onSubmit, isLoading = false }: AuditFormProps) {
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<AuditFormValues, any, AuditFormValues>({
    resolver: zodResolver(auditFormSchema) as any, // Zod v4 / RHF v5 input-vs-output type mismatch
    defaultValues: {
      tools: [{ ...DEFAULT_TOOL }],
      teamSize: 1,
      primaryUseCase: "coding",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tools",
  });

  // After hydration, restore saved form values from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = getSaved();
    if (saved.tools?.length) form.reset({
      tools: saved.tools,
      teamSize: saved.teamSize ?? 1,
      primaryUseCase: saved.primaryUseCase ?? "coding",
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced localStorage persistence
  useEffect(() => {
    if (!mounted) return;
    const sub = form.watch((values) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      }, 600);
    });
    return () => {
      sub.unsubscribe();
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [form, mounted]);

  function handleVendorChange(index: number, vendor: Vendor) {
    const tiers = VENDOR_TIERS[vendor];
    const firstTier = tiers[0];
    form.setValue(`tools.${index}.vendor`, vendor);
    form.setValue(`tools.${index}.tier`, firstTier.value);
    form.setValue(`tools.${index}.monthlySpend`, firstTier.defaultPrice);
  }

  function handleTierChange(index: number, vendor: Vendor, tier: string) {
    const match = VENDOR_TIERS[vendor]?.find((t) => t.value === tier);
    form.setValue(`tools.${index}.tier`, tier);
    if (match) form.setValue(`tools.${index}.monthlySpend`, match.defaultPrice);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
      {/* Tool cards */}
      <div className="space-y-4">
        {fields.map((field, index) => {
          const vendor = (form.watch(`tools.${index}.vendor`) ?? "cursor") as Vendor;
          const tiers = VENDOR_TIERS[vendor] ?? [];

          return (
            <Card key={field.id} className="border border-border bg-card">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Tool {index + 1}
                  </span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
                      aria-label={`Remove tool ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Vendor */}
                  <div className="space-y-1.5">
                    <Label htmlFor={`vendor-${index}`}>AI tool</Label>
                    <Controller
                      control={form.control}
                      name={`tools.${index}.vendor`}
                      render={({ field: f }) => (
                        <Select
                          value={f.value}
                          onValueChange={(v) => handleVendorChange(index, v as Vendor)}
                        >
                          <SelectTrigger id={`vendor-${index}`} className="w-full">
                            <SelectValue placeholder="Select tool" />
                          </SelectTrigger>
                          <SelectContent>
                            {ALL_VENDORS.map((v) => (
                              <SelectItem key={v} value={v}>
                                {VENDOR_LABELS[v]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.tools?.[index]?.vendor && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.tools[index]?.vendor?.message}
                      </p>
                    )}
                  </div>

                  {/* Plan/tier */}
                  <div className="space-y-1.5">
                    <Label htmlFor={`tier-${index}`}>Plan</Label>
                    <Controller
                      control={form.control}
                      name={`tools.${index}.tier`}
                      render={({ field: f }) => (
                        <Select
                          value={f.value}
                          onValueChange={(v) => v && handleTierChange(index, vendor, v)}
                        >
                          <SelectTrigger id={`tier-${index}`} className="w-full">
                            <SelectValue placeholder="Select plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {tiers.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.tools?.[index]?.tier && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.tools[index]?.tier?.message}
                      </p>
                    )}
                  </div>

                  {/* Monthly spend — valueAsNumber so RHF gets a real number */}
                  <div className="space-y-1.5">
                    <Label htmlFor={`spend-${index}`}>
                      Monthly spend{" "}
                      <span className="text-muted-foreground font-normal">(USD, actual)</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        $
                      </span>
                      <Input
                        id={`spend-${index}`}
                        type="number"
                        min={0}
                        step={1}
                        className="pl-6"
                        {...form.register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
                      />
                    </div>
                    {form.formState.errors.tools?.[index]?.monthlySpend && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.tools[index]?.monthlySpend?.message}
                      </p>
                    )}
                  </div>

                  {/* Seats */}
                  <div className="space-y-1.5">
                    <Label htmlFor={`seats-${index}`}>Seats / users</Label>
                    <Input
                      id={`seats-${index}`}
                      type="number"
                      min={1}
                      step={1}
                      {...form.register(`tools.${index}.seats`, { valueAsNumber: true })}
                    />
                    {form.formState.errors.tools?.[index]?.seats && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.tools[index]?.seats?.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add tool button */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={() => append({ ...DEFAULT_TOOL })}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add another tool
      </Button>

      {/* Team context */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
        <div className="space-y-1.5">
          <Label htmlFor="teamSize">Team size</Label>
          <Input
            id="teamSize"
            type="number"
            min={1}
            step={1}
            {...form.register("teamSize", { valueAsNumber: true })}
          />
          {form.formState.errors.teamSize && (
            <p className="text-xs text-destructive">
              {form.formState.errors.teamSize.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="primaryUseCase">Primary use case</Label>
          <Controller
            control={form.control}
            name="primaryUseCase"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="primaryUseCase" className="w-full">
                  <SelectValue placeholder="Select use case" />
                </SelectTrigger>
                <SelectContent>
                  {USE_CASE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base"
        disabled={isLoading}
      >
        {isLoading ? (
          "Running audit…"
        ) : (
          <>
            Run my audit
            <ArrowRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}
