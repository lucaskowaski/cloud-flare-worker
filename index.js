addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const newUrl = new URL(request.url)
  // Change the hostname to the new domain
  newUrl.hostname = 'visora-api.bptecnologia.com' // Replace with your target domain

  // Create a new request with the original method, headers, and body
  const newRequest = new Request(newUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body, // This preserves POST/PUT body
    redirect: 'follow' // Follow redirects if the new domain issues its own
  })

  // Fetch the new URL with the original request details
  return fetch(newRequest)
}