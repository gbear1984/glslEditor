import { useMemo, useState } from 'react'
import ProjectDashboard from './components/ProjectDashboard'
import ProjectGraph from './components/ProjectGraph'
import FileInspector from './components/FileInspector'

const layout = {
  display: 'grid',
  gridTemplateColumns: '360px 1fr 360px',
  gap: '12px',
  height: '100vh',
  padding: '12px',
  boxSizing: 'border-box',
  fontFamily: 'Inter, system-ui, Arial, sans-serif'
}

export default function App() {
  const [project, setProject] = useState(null)
  const [assets, setAssets] = useState([])
  const [selectedAsset, setSelectedAsset] = useState(null)

  const topLevelFolders = useMemo(() => project?.created_folders ?? [], [project])

  return (
    <div style={layout}>
      <ProjectDashboard
        project={project}
        onProjectCreated={setProject}
        onAssetsScanned={setAssets}
        onClearSelection={() => setSelectedAsset(null)}
      />
      <ProjectGraph folders={topLevelFolders} />
      <FileInspector assets={assets} selectedAsset={selectedAsset} onSelectAsset={setSelectedAsset} />
    </div>
  )
}
