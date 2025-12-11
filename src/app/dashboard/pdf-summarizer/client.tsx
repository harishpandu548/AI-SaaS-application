"use client";

import { useState } from "react";

export default function PdfSummarizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  //when user selects a pdf and submit it
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSummary("");

    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (instructions.trim()) {
        formData.append("instructions", instructions);
      }

      const res = await fetch("/api/ai/pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error body:", text);
        setError("Something went wrong with PDF API");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      setError("Failed to summarize PDF");
    } finally {
      setLoading(false);
    }
  }

  //when user try to choose a pdf file
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">AI PDF Summarizer</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm mb-1">Upload PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full text-sm"
          />
          {file && (
            <p className="text-xs text-gray-500 mt-1">
              Selected: {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">
            Extra Instructions (optional)
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full border rounded px-3 py-2 h-24 text-black"
            placeholder="e.g. Focus on main arguments, ignore references..."
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading || !file}
          className="border rounded px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Summarizing..." : "Summarize PDF"}
        </button>
      </form>

      {summary && (
        <div className="border rounded p-4 whitespace-pre-wrap leading-relaxed">
          {summary}
        </div>
      )}
    </div>
  );
}
