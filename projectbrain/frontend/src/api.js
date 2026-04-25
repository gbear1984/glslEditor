const API_BASE = 'http://127.0.0.1:8000'

async function handleResponse(response) {
  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload.detail || 'Request failed')
  }
  return payload
}

export async function createProject(data) {
  const response = await fetch(`${API_BASE}/projects/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return handleResponse(response)
}

export async function scanProject(project_path) {
  const response = await fetch(`${API_BASE}/projects/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project_path })
  })
  return handleResponse(response)
}
