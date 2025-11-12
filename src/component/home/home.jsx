import './home.css'

function HomeGallery({ items }) {
  const handleOpen = (url) => {
    if (typeof window === 'undefined') return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (items.length === 0) {
    return (
      <div className="home home-empty">
        <div className="home-hero">
          <h2>Create your first spotlight</h2>
          <p>Add a video inside the admin tab to see it here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="home">
      <div className="home-hero">
        <h2>Featured inspiration</h2>
        <p>Click any video card to open the full experience in a new tab.</p>
      </div>
      <div className="video-grid">
        {items.map((item) => (
          <article key={item.id} className="video-card">
            <div className="video-art">
              <img src={item.imageUrl} alt={item.title} loading="lazy" onError={(event) => { event.currentTarget.src = 'https://via.placeholder.com/420x240?text=Preview' }} />
              <div className="video-overlay">
                <button type="button" className="watch-button" onClick={() => handleOpen(item.videoUrl)}>Watch now</button>
              </div>
            </div>
            <div className="video-body">
              <h3>{item.title}</h3>
              <button type="button" className="outline-button" onClick={() => handleOpen(item.videoUrl)}>Open video</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default HomeGallery
