import React, { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

export default function Board({ data, addTask, deleteTask }) {
  const [inputs, setInputs] = useState({}); // store inputs per column

  // update input fields
  const recordInput = (columnId, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        [field]: value,
      },
    }));
  };

  // clear inputs after adding a task
  const clearInput = (columnId) => {
    setInputs((prev) => ({
      ...prev,
      [columnId]: { title: "", desc: "" },
    }));
  };

  // handle adding a task
  const handleAddTask = (columnId) => {
    const taskData = inputs[columnId];
    if (taskData?.title?.trim()) {
      addTask(columnId, taskData);
      clearInput(columnId);
    }
  };

  return (
    <div className="flex gap-4 w-full">
      {data.columnOrder.map((columnId) => {
        const column = data.columns[columnId];
        const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

        return (
          <div
            key={column.id}
            className="bg-gray-50 rounded-xl shadow-sm w-80 flex-shrink-0 flex flex-col"
          >
            {/* Column Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-700">{column.title}</h2>
              <span className="text-sm text-gray-400">{tasks.length}</span>
            </div>

            {/* Tasks List */}
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-1 p-4 space-y-3 min-h-[100px]"
                >
                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <TaskCard
                          task={task}
                          deleteTask={deleteTask}
                          provided={provided}
                          snapshot={snapshot}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Input Fields */}
            <div className="space-y-3 px-3 w-full mt-2">
              <input
                aria-label="Task Title"
                value={inputs[columnId]?.title || ""}
                onChange={(e) => recordInput(column.id, "title", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTask(column.id)}
                className="border-2 border-gray-400 rounded px-3 py-2 w-full pr-10 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300"
                placeholder="Add a task..."
              />
              <input
                aria-label="Task Description"
                value={inputs[columnId]?.desc || ""}
                onChange={(e) => recordInput(column.id, "desc", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTask(column.id)}
                className="border-2 border-gray-400 rounded px-3 py-2 w-full pr-10 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300"
                placeholder="Add description of the task..."
              />
            </div>

            {/* Add Task Button */}
            <button
              onClick={() => handleAddTask(column.id)}
              className="px-4 py-2 m-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full"
            >
              + Add Task
            </button>
          </div>
        );
      })}
    </div>
  );
}
