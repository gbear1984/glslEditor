import { useState } from 'react'
import { createProject, scanProject } from '../api'

export default function ProjectDashboard({ project, onProjectCreated, onAssetsScanned, onClearSelection }) {
  const [name, setName] = useState('TestProject')
  const [rootPath, setRootPath] = useState('./projectbrain_dev_projects')
  const [template, setTemplate] = useState('vfx')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('Ready')

  async function handleCreate(event) {
    event.preventDefault()
    setError('')
    try {
      const result = await createProject({ name, root_path: rootPath, template })
      setStatus(`Created project at ${result.project_path}`)
      onProjectCreated(result)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleScan() {
    if (!project?.project_path) {
      setError('Create a project first.')
      return
    }

    setError('')
    try {
      const result = await scanProject(project.project_path)
      setStatus(`Scanned ${result.asset_count} files`)
      onAssetsScanned(result.assets)
      onClearSelection()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <h2>ProjectBrain</h2>
      <form onSubmit={handleCreate}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%' }} />
        </label>
        <label>
          Root Path
          <input value={rootPath} onChange={(e) => setRootPath(e.target.value)} style={{ width: '100%' }} />
        </label>
        <label>
          Template
          <select value={template} onChange={(e) => setTemplate(e.target.value)} style={{ width: '100%' }}>
            <option value="vfx">VFX</option>
            <option value="jewelry">Jewelry</option>
            <option value="music">Music</option>
          </select>
        </label>
        <button type="submit" style={{ marginTop: 10 }}>Create Project</button>
      </form>

      <button onClick={handleScan} style={{ marginTop: 10 }}>Scan Project</button>

      <p><strong>Status:</strong> {status}</p>
      {project && <p><strong>Current Project:</strong> {project.project_path}</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </section>
  )
}
