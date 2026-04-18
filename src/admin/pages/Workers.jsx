import React, { useState } from 'react'
import SummaryCard from '../../components/SummaryCard'
import IconTextButton from '../../components/IconTextButton'
import WorkerList from '../../components/ui/WorkerList'
const Workers = () => {

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  const workers = [
    {
      id: 1,
      name: "Mike Johnson",
      role: "technician",
      status: "on-site",
      statusColor: "bg-blue-100 text-blue-600",
      email: "mike.johnson@company.com",
      phone: "+1 (555) 123-4567",
      location: "Downtown Office",
      activeJobs: 2,
      completed: 45,
      rating: 4.8,
      skills: ["Networking", "Installation", "Troubleshooting"],
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "technician",
      status: "en-route",
      statusColor: "bg-purple-100 text-purple-600",
      email: "sarah.williams@company.com",
      phone: "+1 (555) 234-5678",
      location: "Tech Park",
      activeJobs: 1,
      completed: 52,
      rating: 4.9,
      skills: ["Maintenance", "HVAC", "Electrical"],
    },
    {
      id: 3,
      name: "David Chen",
      role: "technician",
      status: "available",
      statusColor: "bg-green-100 text-green-600",
      email: "david.chen@company.com",
      phone: "+1 (555) 345-6789",
      location: "Branch Office",
      activeJobs: 3,
      completed: 38,
      rating: 4.7,
      skills: ["Security Systems", "Networking", "Cabling"],
    },
    {
      id: 4,
      name: "Emma Rodriguez",
      role: "contractor",
      status: "on-site",
      statusColor: "bg-blue-100 text-blue-600",
      email: "emma.rodriguez@company.com",
      phone: "+1 (555) 456-7890",
      location: "Industrial Zone",
      activeJobs: 2,
      completed: 29,
      rating: 4.6,
      skills: ["Electrical", "Wiring", "Inspection"],
    },
    {
      id: 5,
      name: "Ali Khan",
      role: "contractor",
      status: "available",
      statusColor: "bg-green-100 text-green-600",
      email: "ali.khan@company.com",
      phone: "+92 300 1234567",
      location: "Lahore Office",
      activeJobs: 0,
      completed: 21,
      rating: 4.5,
      skills: ["HVAC", "Maintenance", "Repair"],
    },
  ];

    const filteredWorkers=workers.filter((worker) => {
      return (worker.name.toLowerCase().includes(search.toLocaleLowerCase()) || worker.email.toLowerCase().includes(search.toLocaleLowerCase())) && worker.role.toLocaleLowerCase().includes(roleFilter.toLocaleLowerCase())
    })


  return (
    <div className='w-full px-8'>
      <div className='flex justify-between pt-4 pb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Workers</h1>
          <p className='text-sm text-gray-500'>Manage and track all workers</p>
        </div>
        <div>
          <IconTextButton text={"Add Worker"} icon="material-symbols:add-rounded" onClickHandler={() => { }} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <SummaryCard
          name="Total Workers"
          count={40}
          icon="mdi:account-group"
          message="All registered workers"
          iconColor="#2563EB"
          bgColor="#DBEAFE"
        />

        <SummaryCard
          name="Technicians"
          count={18}
          icon="mdi:tools"
          message="Skilled technical staff"
          iconColor="#F59E0B"
          bgColor="#FEF3C7"
        />

        <SummaryCard
          name="Contractors"
          count={10}
          icon="mdi:briefcase-account"
          message="External contractors"
          iconColor="#7C3AED"
          bgColor="#EDE9FE"
        />

        <SummaryCard
          name="Currently Active"
          count={22}
          icon="mdi:account-check"
          message="Working right now"
          iconColor="#16A34A"
          bgColor="#DCFCE7"
        />
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-6">

        <input
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search workers..."
          className="w-full  px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm" onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="Contractor">Contractors</option>
          <option value="Technician">Technicians</option>
        </select>
      </div>
      <div className='my-4'>
        <WorkerList workers={filteredWorkers} />
      </div>

    </div>
  )
}

export default Workers
