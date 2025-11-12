import { useState } from 'react'
import './admin.css'

const emptyValues = { title: '', videoUrl: '', imageUrl: '' }

function AdminPanel({ items, onAdd, onUpdate, onDelete }) {
  const [formValues, setFormValues] = useState(emptyValues)
  const [editId, setEditId] = useState(null)
  const [editValues, setEditValues] = useState(emptyValues)
  const [status, setStatus] = useState({ variant: '', message: '' })

  const showStatus = (variant, message) => {
    setStatus({ variant, message })
  }

  const handleFormChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleEditChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }))
  }

  const validateValues = (values) => values.title.trim() && values.videoUrl.trim() && values.imageUrl.trim()

  const handleAdd = (event) => {
    event.preventDefault()
    if (!validateValues(formValues)) {
      showStatus('error', 'Please fill in every field before adding a new link.')
      return
    }
    const payload = {
      title: formValues.title.trim(),
      videoUrl: formValues.videoUrl.trim(),
      imageUrl: formValues.imageUrl.trim(),
    }
    onAdd(payload)
    setFormValues(emptyValues)
    showStatus('success', 'Video link saved successfully.')
  }

  const beginEdit = (item) => {
    setEditId(item.id)
    setEditValues({ title: item.title, videoUrl: item.videoUrl, imageUrl: item.imageUrl })
    setStatus({ variant: '', message: '' })
  }

  const handleSave = () => {
    if (!validateValues(editValues)) {
      showStatus('error', 'All fields are required when updating a link.')
      return
    }
    const payload = {
      title: editValues.title.trim(),
      videoUrl: editValues.videoUrl.trim(),
      imageUrl: editValues.imageUrl.trim(),
    }
    onUpdate(editId, payload)
    setEditId(null)
    setEditValues(emptyValues)
    showStatus('success', 'Video link updated.')
  }

  const handleCancel = () => {
    setEditId(null)
    setEditValues(emptyValues)
  }

  const handleDelete = (id) => {
    onDelete(id)
    if (editId === id) {
      setEditId(null)
      setEditValues(emptyValues)
    }
    showStatus('success', 'Video link removed.')
  }

  return (
    <div className="admin-panel">
      <section className="admin-card">
        <h2 className="admin-heading">Add a new video</h2>
        {status.message && (
          <div className={`status-banner ${status.variant}`}>{status.message}</div>
        )}
        <form className="admin-form" onSubmit={handleAdd}>
          <label className="form-field">
            <span>Title</span>
            <input
              type="text"
              value={formValues.title}
              onChange={(event) => handleFormChange('title', event.target.value)}
              placeholder="Motivation Monday"
            />
          </label>
          <label className="form-field">
            <span>Video link</span>
            <input
              type="url"
              value={formValues.videoUrl}
              onChange={(event) => handleFormChange('videoUrl', event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </label>
          <label className="form-field">
            <span>Image link</span>
            <input
              type="url"
              value={formValues.imageUrl}
              onChange={(event) => handleFormChange('imageUrl', event.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </label>
          <button className="primary-action" type="submit">Save video</button>
        </form>
      </section>
      <section className="admin-card">
        <h2 className="admin-heading">Manage videos</h2>
        {items.length === 0 ? (
          <p className="empty-state">No videos yet. Add your first showcase above.</p>
        ) : (
          <ul className="admin-list">
            {items.map((item) => (
              <li key={item.id} className="admin-list-item">
                {editId === item.id ? (
                  <div className="admin-editor">
                    <div className="editor-fields">
                      <input
                        type="text"
                        value={editValues.title}
                        onChange={(event) => handleEditChange('title', event.target.value)}
                      />
                      <input
                        type="url"
                        value={editValues.videoUrl}
                        onChange={(event) => handleEditChange('videoUrl', event.target.value)}
                      />
                      <input
                        type="url"
                        value={editValues.imageUrl}
                        onChange={(event) => handleEditChange('imageUrl', event.target.value)}
                      />
                    </div>
                    <div className="editor-actions">
                      <button className="primary-action" type="button" onClick={handleSave}>Update</button>
                      <button className="ghost-action" type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="admin-item">
                    <div className="item-visual">
                      <img src={item.imageUrl} alt={item.title} loading="lazy" onError={(event) => { event.currentTarget.src = 'https://via.placeholder.com/160x100?text=Preview' }} />
                    </div>
                    <div className="item-copy">
                      <h3>{item.title}</h3>
                      <a className="item-link" href={item.videoUrl} target="_blank" rel="noreferrer">{item.videoUrl}</a>
                      <div className="item-actions">
                        <button className="ghost-action" type="button" onClick={() => beginEdit(item)}>Rename or edit</button>
                        <button className="danger-action" type="button" onClick={() => handleDelete(item.id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default AdminPanel
