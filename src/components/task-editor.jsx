"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateText } from "ai";
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});
import { createOpenAI } from "@ai-sdk/openai";

export default function TaskEditor({ task, selectedRDBMS, onTaskComplete }) {
  const [editorContent, setEditorContent] = useState("");
  const [executionResult, setExecutionResult] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const executeSQL = async () => {
    console.log("Checking SQL...");
    setIsChecking(true);
    const userSql = editorContent.trim();
    console.log("User's SQL:", userSql);

    try {
      const prompt = `You are an SQL expert. Evaluate the following SQL statement. If the SQL statement is correct for the task described, reply with "Correct". If the SQL is incorrect, reply with "Incorrect" followed by an explanation of what’s wrong and a hint for fixing it.
  
Task: ${task.description}
  
User's SQL:
${userSql}`;

      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: prompt,
      });
      console.log("AI Response:", text);

      const responseText = text.trim().toLowerCase();
      if (responseText.startsWith("correct")) {
        console.log("Correct SQL!");
        setExecutionResult("Success! Your SQL command is correct.");
        onTaskComplete();
        setEditorContent("");
      } else {
        setExecutionResult("Try again.");
      }
    } catch (error) {
      console.error("Error checking SQL:", error);
      setExecutionResult(
        "An error occurred while checking your SQL. Please try again."
      );
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>{task.name}</CardTitle>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 h-[300px]">
          <MonacoEditor
            height="100%"
            defaultLanguage="sql"
            theme="vs-dark"
            value={editorContent}
            onChange={(value) => setEditorContent(value || "")}
          />
        </div>
        <Button onClick={executeSQL} disabled={isChecking}>
          {isChecking ? "Checking..." : "Execute SQL"}
        </Button>
        {executionResult && (
          <div
            className={`mt-4 p-4 rounded ${
              executionResult.startsWith("Success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {executionResult}
          </div>
        )}
      </CardContent>
    </>
  );
}
