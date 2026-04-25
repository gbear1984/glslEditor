export default function FileInspector({ assets, selectedAsset, onSelectAsset }) {
  return (
    <section style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, overflow: 'auto' }}>
      <h3>File Inspector</h3>
      <div>
        <strong>Scanned Files ({assets.length})</strong>
        <ul style={{ maxHeight: 280, overflow: 'auto' }}>
          {assets.map((asset) => (
            <li key={asset.path}>
              <button onClick={() => onSelectAsset(asset)} style={{ textAlign: 'left' }}>
                {asset.relative_path}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedAsset && (
        <div style={{ marginTop: 12 }}>
          <h4>Selected Asset</h4>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(selectedAsset, null, 2)}</pre>
        </div>
      )}
    </section>
  )
}
