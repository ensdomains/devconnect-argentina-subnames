// https://pod.org/z-api/ticket-proofs#verifying-a-ticket-proof
import {
  DefaultCircuitFamily,
  GPCBoundConfig,
  GPCProof,
  GPCRevealedClaims,
  gpcVerify,
} from '@pcd/gpc'
import { getCurveFromName } from 'ffjavascript'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import path from 'node:path'
import superjson from 'superjson'

import {
  IRON_SESSION_COOKIE_NAME,
  IRON_SESSION_PASSWORD,
  ZUPASS_PROOF_REQUEST,
} from './constants'
import { SessionData } from './types'

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

  const session = await getIronSession<SessionData>(await cookies(), {
    password: IRON_SESSION_PASSWORD,
    cookieName: IRON_SESSION_COOKIE_NAME,
  })
  session.asdf = 'asdf'
  await session.save()

  return Response.json(
    {
      message: 'Proof verified',
    },
    { status: 200 }
  )
}

export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), {
    password: IRON_SESSION_PASSWORD,
    cookieName: IRON_SESSION_COOKIE_NAME,
  })
  return Response.json(session)
}
