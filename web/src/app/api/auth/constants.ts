import { ticketProofRequest } from '@parcnet-js/ticket-spec'

export const ZUPASS_SIGNER = 'YwahfUdUYehkGMaWh0+q3F8itx2h8mybjPmt8CmTJSs'

export const ZUPASS_EVENT_ID = '1f36ddce-e538-4c7a-9f31-6a4b2221ecac'

export const ZUPASS_NULLIFIER = 'ENS_DEVCONNECT_ARG_2025'

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
