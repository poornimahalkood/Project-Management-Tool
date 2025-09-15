import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Board from "./components/Board";
import "./index.css";

// helper to generate unique IDs
const uid = () => Math.random().toString(36).slice(2, 9);

// initial dummy data
const initialData = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Design login screen",
      desc: "UI with email & password fields and validation",
      storypoints: 3,
    },
    "task-2": {
      id: "task-2",
      title: "Create invoice list component",
      desc: "Table to display invoices with pagination and filters",
      storypoints: 2,
    },
    "task-3": {
      id: "task-3",
      title: "Integrate auth API",
      desc: "Connect frontend login with backend authentication service",
      storypoints: 5,
    },
  },
  columns: {
    "col-1": { id: "col-1", title: "To Do", taskIds: ["task-1", "task-2"] },
    "col-2": { id: "col-2", title: "In Progress", taskIds: ["task-3"] },
    "col-3": { id: "col-3", title: "Done", taskIds: [] },
  },
  columnOrder: ["col-1", "col-2", "col-3"],
};

export default function App() {
  const [data, setData] = useState(initialData);

  // add new task to a column
  const addTask = (columnId, taskData) => {
  if (!taskData?.title?.trim()) return;

  const id = 'task-' + uid();
  const newTask = {
    id,
    title: taskData.title.trim(),
    desc: taskData.desc?.trim() || "", // ✅ empty string fallback
  };

  setData(prev => ({
    ...prev,
    tasks: { ...prev.tasks, [id]: newTask },
    columns: {
      ...prev.columns,
      [columnId]: {
        ...prev.columns[columnId],
        taskIds: [...prev.columns[columnId].taskIds, id],
      },
    },
  }));
};
  // delete a task
  const deleteTask = (taskId) => {
    setData((prev) => {
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];

      const newColumns = { ...prev.columns };
      Object.values(newColumns).forEach((col) => {
        col.taskIds = col.taskIds.filter((id) => id !== taskId);
      });

      return { ...prev, tasks: newTasks, columns: newColumns };
    });
  };

  // handle drag & drop logic
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    // same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, taskIds: newTaskIds };
      setData((prev) => ({
        ...prev,
        columns: { ...prev.columns, [newColumn.id]: newColumn },
      }));
      return;
    }

    // move to another column
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    setData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    }));
  };

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Project Management Tool</h1>
          <div className="text-sm text-slate-500">
            logged in : poohalkood@gmail.com
          </div>
        </header>

        <DragDropContext onDragEnd={onDragEnd}>
          <Board data={data} addTask={addTask} deleteTask={deleteTask} />
        </DragDropContext>
      </div>
    </div>
  );
}
