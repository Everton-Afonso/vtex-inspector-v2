import { useEffect, useState } from 'react'

import { decodeJwt } from '../../../utils/decodeJwt'
import { formatDate } from '../../../utils/formatDate'

import { useCopyClipboard } from '../../../hooks/useCopyClipboard'

import { getCookies } from '../../../services/getCookies'

import { ActionButton } from '../../../ui/ActionButton'

import './styles.css'

interface TokenData {
    name: string
    token: string
    account?: string
    type?: string
    expires?: string
}

export function Tokens() {
    const [tokens, setTokens] = useState<TokenData[]>([])
    const [visibleTokens, setVisibleTokens] = useState<Record<string, boolean>>({})
    const { copy, isCopied } = useCopyClipboard()

    useEffect(() => {
        async function loadTokens() {
            const cookies = await getCookies()

            const vtexTokens = cookies
                .filter(cookie =>
                    cookie.name.includes('VtexIdclientAutCookie') ||
                    cookie.name === 'vtex_session'
                )
                .map(cookie => {
                    const payload = decodeJwt(cookie.value)

                    return {
                        name: cookie.name,
                        token: cookie.value,
                        account: payload?.account,
                        type: payload?.audience ?? payload?.sub,
                        expires: payload?.exp
                            ? formatDate(payload.exp)
                            : undefined,
                    }
                })

            setTokens(vtexTokens)
        }

        loadTokens()
    }, [])

    function toggleToken(name: string) {
        setVisibleTokens(prev => ({
            ...prev,
            [name]: !prev[name],
        }))
    }

    function getTokenTitle(type?: string) {
        if (type === 'admin') return 'Admin'

        if (type === 'webstore') return 'Storefront'

        if (type === 'session') return 'Session'

        return 'Token'
    }

    return (
        <div className="tokens-container">
            {tokens.map(token => (
                <div className="token-card" key={token.name}>
                    <h3>
                        {getTokenTitle(token.type)}
                    </h3>

                    <div className="divider" />

                    <p>
                        <strong>Account:</strong>
                        <span>{token.account}</span>
                    </p>

                    <p>
                        <strong>Name:</strong>
                        <span>{token.name}</span>
                    </p>

                    <p>
                        <strong>Type:</strong>
                        <span>{token.type}</span>
                    </p>

                    <p>
                        <strong>Expires:</strong>
                        <span>{token.expires}</span>
                    </p>

                    <div className="token-actions">
                        <ActionButton
                            onClick={() => toggleToken(token.name)}
                        >
                            {visibleTokens[token.name] ? 'Hide token' : 'Show token'}
                        </ActionButton>

                        <ActionButton
                            onClick={() => copy(token.name, token.token)}
                        >
                            {isCopied(token.name) ? '✔ Copied' : 'Copy'}
                        </ActionButton>
                    </div>

                    {visibleTokens[token.name] && (
                        <textarea
                            readOnly
                            value={token.token}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}