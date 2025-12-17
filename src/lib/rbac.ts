import { getCurrentUserRole } from './auth'

export async function isAdmin(){
  const r = await getCurrentUserRole()
  return r === 'admin'
}

export async function isModerator(){
  const r = await getCurrentUserRole()
  return r === 'moderator' || r === 'admin'
}

export async function canEditPost(postAuthorId?: string){
  // allow if user is owner or moderator/admin
  // this function must be used client-side only
  // Simplified: owner check omitted due to limited auth context here
  return await isModerator()
}
