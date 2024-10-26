class MusicSnitch extends HTMLElement {
  constructor () {
    super()
  }

  connectedCallback(e) {
    const username = this.getAttribute("data-username")
    const key = this.getAttribute("data-key")
    const URL = `//ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${key}&limit=1&format=json&extended=1`

    fetch(URL).then(response => response.json()).then((data) => {
      const track = data.recenttracks.track[0]

      if (track) {
        const isPlaying = track['@attr'] && track['@attr'].nowplaying ? true : false
        this.render(track.name, track.artist, track.url, isPlaying)
      }
    })
  }

  render (name, artist, URL, isPlaying = false) {

    const title = document.createElement('span')
    title.textContent = isPlaying ? '♪ now playing: ' : '♪ recently played: '
    title.part = 'title'

    const trackLink = document.createElement('a')
    trackLink.href = URL
    trackLink.textContent = name
    trackLink.target = '_blank'
    trackLink.part = 'a'

    const by = document.createElement('span')
    by.textContent = ' by '
    by.part = 'title'

    const artistLink = document.createElement('a')
    artistLink.href = artist.url
    artistLink.textContent = artist.name
    artistLink.target = '_blank'
    artistLink.part = 'a'

    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(title)
    shadow.appendChild(trackLink)
    shadow.appendChild(by)
    shadow.appendChild(artistLink)

    if (isPlaying) {
      this.classList.add('is-playing')
    }
  }
}

customElements.define('music-snitch', MusicSnitch)
