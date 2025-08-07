export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string
  const state = query.state as string
  const error = query.error as string

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `eBay OAuth Error: ${error}`
    })
  }

  if (!code || !state) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing authorization code or state'
    })
  }

  try {
    // Decode state to get user ID
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'))
    const userId = stateData.userId

    const config = useRuntimeConfig()
    
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${config.ebayClientId}:${config.ebayClientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: config.ebayOauthRedirectUri
      })
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenData.error_description}`)
    }

    // Store tokens in database (we'll implement this in Phase 1)
    // For now, we'll store in a temporary way
    const ebayConnection = {
      userId: userId,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      tokenType: tokenData.token_type,
      connectedAt: new Date().toISOString()
    }

    // TODO: Save to database
    console.log('eBay connection established:', ebayConnection)

    // Redirect back to the app with success message
    return sendRedirect(event, `/?ebay_connected=success&user=${userId}`)
    
  } catch (error) {
    console.error('eBay OAuth callback error:', error)
    return sendRedirect(event, `/?ebay_connected=error&message=${encodeURIComponent(error.message)}`)
  }
})