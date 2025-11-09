// https://pod.org/z-api/ticket-proofs#verifying-a-ticket-proof
import {
  DefaultCircuitFamily,
  GPCBoundConfig,
  GPCProof,
  GPCRevealedClaims,
  gpcVerify,
} from '@pcd/gpc'
import { getCurveFromName } from 'ffjavascript'
import path from 'node:path'
import superjson from 'superjson'

import { ZUPASS_PROOF_REQUEST } from './constants'
import { getSession } from './shared'

export async function POST(req: Request) {
  const body = superjson.parse<{
    boundConfig: GPCBoundConfig
    proof: GPCProof
    revealedClaims: GPCRevealedClaims
  }>(await req.text())

  const { revealedClaims, boundConfig, proof } = body
  const proofRequest = ZUPASS_PROOF_REQUEST.getProofRequest()

  // Multi-threaded verification is broken in NextJS, so we need to initialize the curve in single-threaded mode
  // https://github.com/robknight/zupass-discount-codes/blob/main/src/app/api/verify/route.ts
  // @ts-ignore
  if (!globalThis.curve_bn128) {
    // @ts-ignore
    globalThis.curve_bn128 = getCurveFromName('bn128', { singleThread: true })
  }

  // These changes ensure that the revealed claims say what they are supposed to
  revealedClaims.membershipLists = proofRequest.membershipLists
  revealedClaims.watermark = proofRequest.watermark
  if (revealedClaims.owner && proofRequest.externalNullifier) {
    revealedClaims.owner.externalNullifier = proofRequest.externalNullifier
  }

  const gpcArtifactsPath = path.join(
    process.cwd(),
    'public',
    'zupass-artifacts'
  )

  const isVerified = await gpcVerify(
    proof,
    boundConfig,
    revealedClaims,
    gpcArtifactsPath,
    // TODO: Filter the circuit family to only the ones that are needed
    DefaultCircuitFamily
  )

  if (!isVerified) {
    return Response.json(
      {
        message: 'Proof verification failed',
      },
      { status: 401 }
    )
  }

  if (!revealedClaims.owner?.nullifierHashV4) {
    // This should be unreachable and is just for type safety
    throw new Error('NullifierHashV4 is empty')
  }

  const session = await getSession()
  revealedClaims.owner
  session.nullifierHashV4 = revealedClaims.owner.nullifierHashV4.toString()
  await session.save()

  return Response.json({ message: 'Proof verified' }, { status: 200 })
}

export async function GET() {
  const session = await getSession()
  return Response.json(session)
}
