// https://pod.org/z-api/ticket-proofs#verifying-a-ticket-proof
import {
  GPCBoundConfig,
  GPCProof,
  GPCRevealedClaims,
  gpcPreVerify,
  gpcVerify,
} from '@pcd/gpc'
import path from 'node:path'
import superjson from 'superjson'

import { ZUPASS_PROOF_REQUEST } from './constants'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = superjson.parse<{
    boundConfig: GPCBoundConfig
    proof: GPCProof
    revealedClaims: GPCRevealedClaims
  }>(await req.text())

  const { revealedClaims, boundConfig, proof } = body

  const { membershipLists, watermark, externalNullifier } =
    ZUPASS_PROOF_REQUEST.getProofRequest()

  // These changes ensure that the revealed claims say what they are supposed to
  // revealedClaims.membershipLists = membershipLists
  // revealedClaims.watermark = watermark
  // if (revealedClaims.owner && externalNullifier) {
  //   revealedClaims.owner.externalNullifier = externalNullifier
  // }

  const gpcArtifactsPath = path.join(process.cwd(), 'src', 'lib', 'artifacts')

  const isVerified = await gpcVerify(
    proof,
    boundConfig,
    revealedClaims,
    gpcArtifactsPath
  )

  if (!isVerified) {
    return Response.json(
      {
        message: 'Proof verification failed',
      },
      { status: 401 }
    )
  }

  return Response.json(
    {
      message: 'Proof verified',
    },
    { status: 200 }
  )
}
