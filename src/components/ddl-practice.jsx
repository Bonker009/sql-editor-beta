"use client";

import { useState, useEffect } from "react";
import Instructions from "./instructions";
import TaskEditor from "./task-editor";
import TaskProgress from "./task-progress";
import { Card } from "@/components/ui/card";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export default function DDLPractice() {
  const openai = createOpenAI({
    apiKey:
      "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",
  });

  const [selectedRDBMS, setSelectedRDBMS] = useState("postgresql");
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateTasks(selectedRDBMS);
  }, [selectedRDBMS]);

  const generateTasks = async (rdbms) => {
    setIsLoading(true);
    setError(null);
    try {
      const exerciseInstructions = `
### Practice Exercise: Creating Tables in SQL

Instructions:
Follow the steps below to create three standalone tables: \`suppliers\`, \`categories\`, and \`reviews\`.

Step 1: Create the Database
1. Create a database named \`practice_db\`.

Step 2: Create the Tables

Task 1: Create the \`suppliers\` Table
- The table should have the following columns:
    - \`supplier_id\` (Primary Key, Auto Increment)
    - \`supplier_name\` (Required)
    - \`contact_name\`
    - \`phone\`
    - \`email\` (Unique)
    - \`address\`
    - \`city\`
    - \`country\`
    - \`created_at\` (Default: Current Timestamp)
**Write an SQL statement to create the \`suppliers\` table.**

Task 2: Create the \`categories\` Table
- The table should have the following columns:
    - \`category_id\` (Primary Key, Auto Increment)
    - \`category_name\` (Required, Unique)
    - \`description\`
    - \`created_at\` (Default: Current Timestamp)
**Write an SQL statement to create the \`categories\` table.**

Task 3: Create the \`reviews\` Table
- The table should have the following columns:
    - \`review_id\` (Primary Key, Auto-Increment)
    - \`customer_name\` (Required)
    - \`product_name\` (Required)
    - \`rating\` (Required, Integer between 1 and 5)
    - \`review_text\`
    - \`created_at\` (Default: Current Timestamp)
**Write an SQL statement to create the \`reviews\` table.**
`;

      const prompt = `
Generate 4 SQL DDL tasks for ${rdbms} based on the following exercise instructions. Each task should be an object with keys: "name", "description", "hint", and "sql". The "description" field should specifically mention the columns for each table, including their names, data types, constraints (e.g., Primary Key, Unique, Required), and any default values.

Return the tasks as a JSON array of these objects.

### Practice Exercise: Creating Tables in SQL

Instructions:
Follow the steps below to create three standalone tables: \`suppliers\`, \`categories\`, and \`reviews\`.

Step 1: Create the Database
1. Create a database named \`practice_db\`.

Step 2: Create the Tables

Task 1: Create the \`suppliers\` Table
- The table should have the following columns:
    - \`supplier_id\` (Primary Key, Auto Increment)
    - \`supplier_name\` (Required)
    - \`contact_name\`
    - \`phone\`
    - \`email\` (Unique)
    - \`address\`
    - \`city\`
    - \`country\`
    - \`created_at\` (Default: Current Timestamp)

Task 2: Create the \`categories\` Table
- The table should have the following columns:
    - \`category_id\` (Primary Key, Auto Increment)
    - \`category_name\` (Required, Unique)
    - \`description\`
    - \`created_at\` (Default: Current Timestamp)

Task 3: Create the \`reviews\` Table
- The table should have the following columns:
    - \`review_id\` (Primary Key, Auto-Increment)
    - \`customer_name\` (Required)
    - \`product_name\` (Required)
    - \`rating\` (Required, Integer between 1 and 5)
    - \`review_text\`
    - \`created_at\` (Default: Current Timestamp)
`;

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: prompt,
      });

      console.log("Generated tasks:", text);

      // Remove markdown syntax before parsing
      const cleanText = text.replace(/```json|```/g, "").trim();

      // Attempt to parse the cleaned text as JSON
      let newTasks;
      try {
        newTasks = JSON.parse(cleanText);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        setError("Failed to generate valid tasks. Please try again.");
        return;
      }

      setTasks(newTasks);
      setCurrentTask(0);
    } catch (err) {
      console.error("Error generating tasks:", err);
      setError("Failed to generate tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRDBMSChange = (value) => {
    setSelectedRDBMS(value);
  };

  if (error) {
    return <div className="text-center text-red-500 mt-4">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-8">
        Practice DDL: Creating Tables in SQL
      </h1>
      <Card className="mb-8">
        <Instructions
          selectedRDBMS={selectedRDBMS}
          onRDBMSChange={handleRDBMSChange}
        />
      </Card>

      {isLoading ? (
        <div className="text-center">Loading tasks...</div>
      ) : (
        tasks.length > 0 && (
          <>
            <Card className="mb-8">
              <TaskEditor
                task={tasks[currentTask]}
                selectedRDBMS={selectedRDBMS}
                onTaskComplete={() =>
                  setCurrentTask((prev) => Math.min(prev + 1, tasks.length - 1))
                }
              />
            </Card>

            <Card>
              <TaskProgress
                tasks={tasks}
                currentTask={currentTask}
                onTaskChange={setCurrentTask}
              />
            </Card>
          </>
        )
      )}
    </div>
  );
}
