"use client";

import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function BlogWriterClient() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("friendly");
  const [loading, setloading] = useState(false);
  const [result, setResult] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setloading(true);
    setResult("");
    try {
      const res = await axios.post("/api/ai/blog", { topic, tone });
      setResult(res.data.blog);
    } catch (error) {
      console.error("Failed to call AI API", error);
      alert("Failed to call AI API");
    } finally {
      setloading(false);
    }
  }
  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold">AI Blog Writer</h1>
          <p className="text-sm text-slate-600 mt-1">
            Enter a topic and tone — the AI will generate a long-form,
            SEO-friendly blog for you.
          </p>
        </header>

        {/* Form Card */}
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Blog Topic
              </label>
              <input
                className="w-full rounded-md border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="eg. How to build AI SaaS with Next.js"
              />
            </div>

            <div className="flex gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="rounded-md border px-3 py-2"
                >
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="technical">Technical</option>
                </select>
              </div>

              <div className="ml-auto mt-6">
                <button
                  type="submit"
                  disabled={loading || !topic.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {loading ? "Generating..." : "Generate Blog"}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Result */}
        {result && (
          <section
            id="generated-blog"
            className="mt-8 bg-white border rounded-xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Generated blog</h2>
                <p className="text-sm text-slate-500 mt-1">
                  You can copy or download the content below.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-3 py-2 rounded-md border hover:bg-slate-50 text-sm">
                  Copy
                </button>
                <button className="px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-sm">
                  Download .md
                </button>
              </div>
            </div>

            {/* Content container: preserve line breaks */}
            <article className="prose max-w-none whitespace-pre-wrap text-slate-800">
              <ReactMarkdown >{result}</ReactMarkdown>
            </article>
          </section>
        )}

        {/* Empty state / example */}
        {!result && !loading && (
          <section className="mt-6 text-sm text-slate-500">
            <p>
              Tip: be specific in the topic and choose 'technical' for
              code-heavy posts.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

export default BlogWriterClient;
