import { prisma } from '@/lib/db';
import { mapDbTeamMemberToTpl } from '@/lib/cms/mappers';

export async function getPublishedTeamMembers() {
  try {
    const members = await prisma.cmsTeamMember.findMany({
      where: { status: 'published' },
      orderBy: { sortIndex: 'asc' },
    });
    return members.map(mapDbTeamMemberToTpl);
  } catch {
    return [];
  }
}
