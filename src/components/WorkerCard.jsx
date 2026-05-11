import { Icon } from "@iconify/react";

const WorkerCard = ({ worker, onRemove, onViewDetails, onAssign }) => {
  const statusColor = worker.workerDetails?.status === 'active'
    ? 'bg-green-500/10 text-green-500'
    : worker.workerDetails?.status === 'on_leave'
      ? 'bg-amber-500/10 text-amber-500'
      : 'bg-gray-500/10 text-gray-500';

  const statusLabel = worker.workerDetails?.status || worker.status || 'inactive';

  const skills = worker.workerDetails?.skills?.map(s => s.name || s) ||
    worker.skills || [];

  const designation = worker.workerDetails?.designation || worker.designation;
  const category    = worker.workerDetails?.category    || worker.category;
  const salary      = worker.workerDetails?.salary      || worker.salary;
  const managerName = worker.workerDetails?.manager?.name || worker.managerName;

  return (
    <div className="rounded-2xl px-5 py-5 w-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        boxShadow: 'var(--shadow-sm)',
      }}>

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-bluelogo/10 text-bluelogo flex items-center justify-center font-bold text-base shrink-0">
            {worker.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>{worker.name}</h3>
            <p className="text-[11px] capitalize mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{worker.role}</p>
          </div>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shrink-0 ${statusColor}`}>
          {statusLabel.replace('_', ' ')}
        </span>
      </div>

      {/* Contact */}
      <div className="mt-4 space-y-1.5">
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <Icon icon="mdi:email-outline" width={13} className="shrink-0 text-gray-400" />
          <span className="truncate">{worker.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <Icon icon="mdi:phone-outline" width={13} className="shrink-0 text-gray-400" />
          <span>{worker.phoneNumber || worker.phone || 'Not set'}</span>
        </div>
        {(worker.location || worker.workerDetails?.location) && (
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Icon icon="mdi:map-marker-outline" width={13} className="shrink-0 text-gray-400" />
            <span className="truncate">{worker.location || worker.workerDetails?.location}</span>
          </div>
        )}
      </div>

      {/* Worker Details */}
      {(designation || category || salary || managerName) && (
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {designation && (
            <div className="px-2 py-1.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Designation</p>
              <p className="text-xs font-semibold mt-0.5 truncate" style={{ color: 'var(--text-primary)' }}>{designation}</p>
            </div>
          )}
          {category && (
            <div className="px-2 py-1.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Category</p>
              <p className="text-xs font-semibold mt-0.5 truncate" style={{ color: 'var(--text-primary)' }}>{category}</p>
            </div>
          )}
          {salary && (
            <div className="px-2 py-1.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Rate</p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>${salary}/hr</p>
            </div>
          )}
          {managerName && (
            <div className="px-2 py-1.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Manager</p>
              <p className="text-xs font-semibold mt-0.5 truncate" style={{ color: 'var(--text-primary)' }}>{managerName}</p>
            </div>
          )}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {skills.slice(0, 4).map((skill, i) => (
            <span key={i} className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-tertiary)', border: '1px solid var(--border-primary)' }}>
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-bluelogo/10 text-bluelogo">
              +{skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-secondary)' }}>
        <button
          onClick={onViewDetails}
          className="flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:shadow-md flex items-center justify-center gap-1"
          style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}>
          <Icon icon="mdi:eye-outline" width={14} />
          Details
        </button>
        {onRemove ? (
          <button onClick={onRemove}
            className="flex-1 bg-red-500/10 text-red-500 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:bg-red-500 hover:text-white flex items-center justify-center gap-1">
            <Icon icon="mdi:account-remove-outline" width={14} />
            Remove
          </button>
        ) : onAssign ? (
          <button onClick={onAssign}
            className="flex-1 bg-bluelogo text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-1">
            <Icon icon="mdi:account-plus-outline" width={14} />
            Assign
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default WorkerCard;