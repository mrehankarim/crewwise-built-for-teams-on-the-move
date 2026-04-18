import { Icon } from "@iconify/react";

const WorkerCard = ({ worker }) => {
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-100 px-4 py-6 w-full max-w-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{worker.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-md ${worker.statusColor}`}>
          {worker.status}
        </span>
      </div>

      <p className="text-sm text-gray-500 mt-1 capitalize">
        {worker.role}
      </p>
      <div className="mt-3 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Icon icon="mdi:email-outline" />
          {worker.email}
        </div>
        <div className="flex items-center gap-2">
          <Icon icon="mdi:phone-outline" />
          {worker.phone}
        </div>
        <div className="flex items-center gap-2">
          <Icon icon="mdi:map-marker-outline" />
          {worker.location}
        </div>
      </div>

      <div className="flex justify-between mt-4 text-sm">
        <div>
          <p className="text-gray-400">Active Jobs</p>
          <p className="font-semibold">{worker.activeJobs}</p>
        </div>
        <div>
          <p className="text-gray-400">Completed</p>
          <p className="font-semibold">{worker.completed}</p>
        </div>
        <div>
          <p className="text-gray-400">Rating</p>
          <p className="font-semibold flex items-center gap-1">
            ⭐ {worker.rating}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {worker.skills.map((skill, index) => (
          <span
            key={index}
            className="text-xs bg-gray-100 px-2 py-1 rounded-md"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <button className="flex-1 border rounded-lg py-2 text-sm transition-all duration-200 hover:bg-gray-900 hover:scale-102 hover:text-white active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
          View Profile
        </button>
        <button className="flex-1 bg-black text-white rounded-lg py-2 text-sm transition-all duration-200 hover:bg-gray-900 hover:scale-102 active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
          Assign Job
        </button>
      </div>
    </div>
  );
};

export default WorkerCard;