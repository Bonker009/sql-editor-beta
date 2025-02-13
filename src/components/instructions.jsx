import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Instructions({ selectedRDBMS, onRDBMSChange }) {
  return (
    <>
      <CardHeader>
        <CardTitle>Instructions</CardTitle>
        <CardDescription>
          Follow the steps below to create a database and three tables.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal list-inside mb-4">
          <li>Select your RDBMS below.</li>
          <li>Complete each task as instructed.</li>
          <li>Execute your SQL to check if it&apos;s correct.</li>
        </ol>
        <Select onValueChange={onRDBMSChange} value={selectedRDBMS}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select RDBMS" />
          </SelectTrigger>
          <SelectContent>
         
            <SelectItem value="postgresql">PostgreSQL</SelectItem>
         
          </SelectContent>
        </Select>
      </CardContent>
    </>
  );
}
