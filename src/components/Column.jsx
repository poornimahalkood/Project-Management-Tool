import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

export default function Column({ column, tasks, addTask, deleteTask }) {
  return (
    // <div className="bg-gray-50 rounded-xl shadow-sm w-80 flex-shrink-0 flex flex-col">
    <div className="bg-gray-50 rounded-xl shadow-sm h-full flex flex-col">
      {/* Column Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-semibold text-gray-700">{column.title}</h2>
        <span className="text-sm text-gray-400">{tasks.length}</span>
      </div>

      {/* Task List */}
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

      {/* Add Task Button */}
      <button
        onClick={() => {
          const title = prompt("Enter task title");
          if (title) addTask(column.id, title);
        }}
        className="px-4 py-2 m-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        + Add Task
      </button>
    </div>
  );
}

