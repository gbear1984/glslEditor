import ReactFlow, { Background, Controls } from 'reactflow'
import 'reactflow/dist/style.css'

export default function ProjectGraph({ folders }) {
  const nodes = folders.map((folder, index) => ({
    id: folder,
    position: { x: 80 + (index % 3) * 200, y: 50 + Math.floor(index / 3) * 110 },
    data: { label: folder }
  }))

  const edges = folders.slice(1).map((folder) => ({
    id: `e-root-${folder}`,
    source: folders[0],
    target: folder
  }))

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </section>
  )
}
