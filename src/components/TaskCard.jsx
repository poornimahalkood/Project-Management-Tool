export default function TaskCard({ task, deleteTask, provided, snapshot }) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`bg-white rounded-lg p-3 shadow hover:shadow-lg transition duration-200 cursor-pointer ${
        snapshot.isDragging ? "bg-blue-50" : ""
      }`}
    >
      {/* Title & Delete */}
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-800 line-clamp-1">
          {task.title}
        </h3>
        <button
          onClick={() => deleteTask(task.id)}
          className="text-red-400 hover:text-red-600 text-sm ml-2"
        >
          ✕
        </button>
      </div>

     
      {/* ✅ Smaller Description */}
      {task.desc && (
        <p className="mt-1 text-sm text-gray-600 line-clamp-3">
          {task.desc}
        </p>
      )}

      {/* Story Points in pill */}
      {task.storypoints && (
        <div className="mt-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300">
            {task.storypoints}
          </span>
        </div>
      )}
    </div>
  );
}
