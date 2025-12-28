import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface ProjectTasksProps {
  tasks: Array<{ id: string; title: string; completed: boolean }>;
}

export function ProjectTasks({ tasks }: ProjectTasksProps) {
  if (tasks.length === 0) return null;

  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tareas</span>
          <span className="text-sm font-normal text-muted-foreground">
            {completedTasks}/{tasks.length} completadas
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
            >
              <Checkbox checked={task.completed} disabled />
              <span
                className={
                  task.completed ? "line-through text-muted-foreground" : ""
                }
              >
                {task.title}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
