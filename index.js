// ES modules syntax — required for modern Cloudflare Workers runtime
export default {
  async fetch(request, env, ctx) {
    const TARGET_DOMAIN = 'visora-api.bptecnologia.com'

    const url = new URL(request.url)
    url.hostname = TARGET_DOMAIN

    console.log(`[Request] ${request.method} ${request.url} -> ${url.toString()}`)

    // Copy all incoming headers but drop 'host' so the runtime sets it
    // correctly for the target domain — forwarding the original host would
    // cause the target server to reject the request.
    const headers = new Headers(request.headers)
    headers.delete('host')

    // GET and HEAD must NOT carry a body (Fetch spec + Cloudflare runtime).
    // POST, PUT, PATCH, DELETE etc. all pass the body through unchanged.
    const methodAllowsBody = request.method !== 'GET' && request.method !== 'HEAD'

    const proxyRequest = new Request(url.toString(), {
      method: request.method,
      headers,
      body: methodAllowsBody ? request.body : null,
      // 'follow' forwards any redirects the target server may issue.
      // Note: all headers (including Authorization) are forwarded to the
      // redirect destination. Switch to 'manual' if that is undesirable.
      redirect: 'follow',
    })

    const response = await fetch(proxyRequest)

    console.log(`[Response] ${response.status} ${response.statusText} from ${url.toString()}`)

    return response
  },
}