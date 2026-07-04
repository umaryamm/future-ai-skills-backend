import React, { useState } from "react";
import type { EntityConfig, FieldConfig } from "../config/entities";
import type { AnyRecord } from "../types";

interface Props {
  entity: EntityConfig;
  record: AnyRecord | null; // null = creating new
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
}

// ---- curriculum helpers: Title | Duration | Body per line ----
interface CurriculumItem {
  title: string;
  dur: string;
  body: string;
}
function curriculumToText(items: CurriculumItem[] | undefined): string {
  return (items || []).map((m) => `${m.title} | ${m.dur || ""} | ${m.body || ""}`).join("\n");
}
function textToCurriculum(text: string): CurriculumItem[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, dur, body] = line.split("|").map((s) => (s || "").trim());
      return { title, dur, body };
    });
}

function initialValues(fields: FieldConfig[], record: AnyRecord | null): Record<string, any> {
  const values: Record<string, any> = {};
  const outline = record?.courseOutline || {};

  fields.forEach((f) => {
    if (f.special === "curriculum") {
      values[f.name] = curriculumToText(outline.curriculum);
      return;
    }

    const raw = record ? record[f.name] : undefined;
    if (f.type === "checkbox") {
      values[f.name] = raw ?? f.default ?? false;
    } else {
      values[f.name] = raw ?? f.default ?? "";
    }
  });
  return values;
}

export default function EntityForm({ entity, record, onSubmit, onCancel }: Props) {
  const [values, setValues] = useState<Record<string, any>>(() => initialValues(entity.fields, record));

  function setField(name: string, value: any) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data: Record<string, any> = {};
    const hasCurriculumField = entity.fields.some((f) => f.special === "curriculum");

    entity.fields.forEach((f) => {
      if (f.special === "curriculum") return; // handled separately below
      if (f.type === "number") {
        const v = values[f.name];
        data[f.name] = v === "" || v === null || v === undefined ? null : Number(v);
      } else {
        data[f.name] = values[f.name];
      }
    });

    if (hasCurriculumField) {
      const curriculumFieldName = entity.fields.find((f) => f.special === "curriculum")!.name;
      data.courseOutline = {
        curriculum: textToCurriculum(values[curriculumFieldName] || ""),
      };
    }

    onSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      {entity.fields.map((f) => (
        <FieldInput key={f.name} field={f} value={values[f.name]} onChange={(v) => setField(f.name, v)} />
      ))}
      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{record ? "Save changes" : "Create"}</button>
      </div>
    </form>
  );
}

function FieldInput({ field, value, onChange }: { field: FieldConfig; value: any; onChange: (v: any) => void }) {
  if (field.type === "checkbox" || field.name === "is_active" || field.name === "active") {
    return (
      <div className="field">
        <label>{field.label}</label>
        <select
          value={value ? "true" : "false"}
          onChange={(e) => onChange(e.target.value === "true")}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="field">
        <label>
          {field.label}
          {field.required ? " *" : ""}
        </label>
        <textarea
          rows={field.rows || 3}
          required={field.required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.hint}
        />
        {field.hint && <small className="field-hint">{field.hint}</small>}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="field">
        <label>{field.label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {(field.options || []).map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "file") {
    return (
      <div className="field">
        <label>{field.label}</label>
        <input type="file" onChange={() => onChange(value)} />
        {field.hint && <small className="field-hint">{field.hint}</small>}
      </div>
    );
  }

  return (
    <div className="field">
      <label>
        {field.label}
        {field.required ? " *" : ""}
      </label>
      <input
        type={field.type}
        step={field.step}
        required={field.required}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.hint}
      />
    </div>
  );
}