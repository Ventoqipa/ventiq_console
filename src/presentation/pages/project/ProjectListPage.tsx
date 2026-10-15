import React, { useEffect, useState, useCallback } from 'react'
import { Project, ProjectStatus } from '../../../domain/project/project'
import { HttpProjectRepository } from '../../../infrastructure/repositories/httpProjectRepository'
import { HttpCustomerRepository } from '../../../infrastructure/repositories/httpCustomerRepository'
import { GetProjectsUseCase } from '../../../application/useCases/project/getProjects.usecase'
import { DeleteProjectUseCase } from '../../../application/useCases/project/deleteProject.usecase'
import { GetCustomersUseCase } from '../../../application/useCases/customer/getCustomers.usecase'
import { DeleteProjectModal } from '../../components/project/DeleteProjectModal'
import { useToast } from '../../context'
import { Customer } from '../../../domain/customer/customer'

const projectRepository = new HttpProjectRepository()
const customerRepository = new HttpCustomerRepository()

const getProjectsUseCase = new GetProjectsUseCase(projectRepository)
const deleteProjectUseCase = new DeleteProjectUseCase(projectRepository)
const getCustomersUseCase = new GetCustomersUseCase(customerRepository)

export const ProjectListPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [customerFilter, setCustomerFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL')

  // Modal State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)

  const { showToast } = useToast()

  const fetchCustomers = useCallback(async () => {
    try {
      const data = await getCustomersUseCase.execute()
      setCustomers(data)
    } catch {
      // Ignore errors for customers fetch, as it's not critical for the main functionality
    }
  }, [])

  const fetchProjects = useCallback(() => {
    setLoading(true)
    getProjectsUseCase
      .execute({
        searchTerm,
        customerId: customerFilter !== 'ALL' ? customerFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      })
      .then((data) => setProjects(data))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Failed to load projects.'
        showToast(msg, 'error')
        setProjects([])
      })
      .finally(() => setLoading(false))
  }, [searchTerm, customerFilter, statusFilter, showToast])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedProject) return
    setDeleting(true)
    try {
      await deleteProjectUseCase.execute(selectedProject.id)
      showToast(`Project "${selectedProject.name}" deleted successfully.`, 'success')
      setIsDeleteModalOpen(false)
      setSelectedProject(null)
      fetchProjects()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete project.'
      showToast(msg, 'error')
    } finally {
      setDeleting(false)
    }
  }

  const hasActiveFilters = searchTerm !== '' || customerFilter !== 'ALL' || statusFilter !== 'ALL'

  const handleResetFilters = () => {
    setSearchTerm('')
    setCustomerFilter('ALL')
    setStatusFilter('ALL')
  }

  const renderStatusBadge = (status: ProjectStatus) => {
    const isSuspended = status === 'SUSPENDED'
    return (
      <span
        style={{
          display: 'inline-block',
          padding: '0.2rem 0.55rem',
          borderRadius: '9999px',
          fontSize: '0.725rem',
          fontWeight: 600,
          backgroundColor: isSuspended ? '#fef2f2' : '#ecfdf5',
          color: isSuspended ? '#dc2626' : '#059669',
        }}
      >
        {status}
      </span>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#18181b', margin: 0 }}>Projects</h2>
      </div>

      {/* Control Bar: Search and Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          role="searchbox"
          aria-label="Search projects by name"
          placeholder="Search by project name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid #d4d4d8',
            fontSize: '0.85rem',
            minWidth: '240px',
          }}
        />

        <select
          role="combobox"
          aria-label="Filter by Customer Owner"
          value={customerFilter}
          onChange={(e) => setCustomerFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid #d4d4d8',
            fontSize: '0.85rem',
            backgroundColor: '#ffffff',
          }}
        >
          <option value="ALL">All Customers</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter projects by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'ALL')}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid #d4d4d8',
            fontSize: '0.85rem',
            backgroundColor: '#ffffff',
          }}
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="SUSPENDED">SUSPENDED</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid #d4d4d8',
              backgroundColor: '#f4f4f5',
              color: '#3f3f46',
              fontSize: '0.825rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Projects Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e4e4e7', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e4e4e7', backgroundColor: '#fafafa' }}>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 600, color: '#71717a' }}>PROJECT NAME</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 600, color: '#71717a' }}>CUSTOMER OWNER</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 600, color: '#71717a' }}>STATUS</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 600, color: '#71717a' }}>CREATED AT</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 600, color: '#71717a', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '2.5rem', textAlign: 'center', color: '#71717a' }}>
                  Loading projects...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '3rem 1rem', textAlign: 'center', color: '#71717a' }}>
                  No projects found matching the criteria.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#18181b' }}>{p.name}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#52525b' }}>{p.customerName}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>{renderStatusBadge(p.status)}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#52525b', fontSize: '0.8rem' }}>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteClick(p)}
                      aria-label={`Delete project ${p.name}`}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        borderRadius: '4px',
                        padding: '0.3rem 0.6rem',
                        fontSize: '0.775rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedProject && (
        <DeleteProjectModal
          isOpen={isDeleteModalOpen}
          projectName={selectedProject.name}
          loading={deleting}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}