import { ticketProofRequest } from '@parcnet-js/ticket-spec'

const ZUPASS_SIGNER = 'YwahfUdUYehkGMaWh0+q3F8itx2h8mybjPmt8CmTJSs'

const ZUPASS_EVENT_ID = '1f36ddce-e538-4c7a-9f31-6a4b2221ecac'

const ZUPASS_NULLIFIER = 'ENS_DEVCONNECT_ARG_2025'

export const ZUPASS_PROOF_REQUEST = ticketProofRequest({
  classificationTuples: [
    {
      signerPublicKey: ZUPASS_SIGNER,
      eventId: ZUPASS_EVENT_ID,
    },
  ],
  fieldsToReveal: {},
  externalNullifier: {
    type: 'string',
    value: ZUPASS_NULLIFIER,
  },
})

export const IRON_SESSION_COOKIE_NAME = 'zupass-session'

export const IRON_SESSION_PASSWORD = process.env.IRON_SESSION_PASSWORD!

if (!IRON_SESSION_PASSWORD || IRON_SESSION_PASSWORD.length < 32) {
  throw new Error('IRON_SESSION_PASSWORD is not set or is too short')
}
