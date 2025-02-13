import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TaskProgress({ tasks, currentTask, onTaskChange }) {
  return (
    <>
      <CardHeader>
        <CardTitle>Task Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={currentTask.toString()}
          onValueChange={(value) => onTaskChange(Number.parseInt(value))}
        >
          <TabsList className="grid w-full grid-cols-4">
            {tasks.map((task, index) => (
              <TabsTrigger key={index} value={index.toString()}>{`Task ${
                index + 1
              }`}</TabsTrigger>
            ))}
          </TabsList>
          {tasks.map((task, index) => (
            <TabsContent key={index} value={index.toString()}>
              <h3 className="text-xl font-semibold mb-2">{task.name}</h3>
              <p>{task.description}</p>
              <p className="mt-2">
                <strong>Hint:</strong> {task.hint}
              </p>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </>
  );
}
