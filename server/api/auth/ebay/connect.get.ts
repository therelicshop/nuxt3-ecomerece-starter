export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string
  
  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  const config = useRuntimeConfig()
  
  // eBay OAuth 2.0 configuration
  const ebayAuthUrl = 'https://auth.ebay.com/oauth2/authorize'
  const clientId = config.ebayClientId || 'RyDurham-relic-PRD-a0be0d98a-2d7a9c8b'
  const redirectUri = config.ebayOauthRedirectUri || 'http://localhost:3000/api/auth/ebay/callback'
  const scope = 'https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account'
  
  // Encode user state
  const state = Buffer.from(JSON.stringify({ userId, timestamp: Date.now() })).toString('base64')
  
  const authUrl = `${ebayAuthUrl}?` + new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scope,
    state: state
  }).toString()

  return sendRedirect(event, authUrl)
})