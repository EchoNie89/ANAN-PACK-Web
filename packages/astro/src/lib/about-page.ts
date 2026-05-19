import { aboutTeam as fallbackAboutTeam } from "../data/company";
import type { SiteImageSource } from "./local-images";
import { sanityClient } from "./sanity";
import type { SanityImageSource } from "./sanity";

export interface AboutTeamMember {
  name: string;
  description: string;
  image: SiteImageSource;
  imageAlt: string;
  sanityKey: string;
  sanitySource?: SanityImageSource;
  width?: number;
  height?: number;
  imageClass?: string;
}

interface AboutPageTeamMemberDocument {
  name?: string | null;
  description?: string | null;
  imageAlt?: string | null;
  image?: SanityImageSource | null;
}

interface AboutPageDocument {
  teamMembers?: AboutPageTeamMemberDocument[] | null;
}

const ABOUT_PAGE_QUERY = `
  *[_type == "aboutPage" && _id == $documentId][0]{
    teamMembers[]{
      name,
      description,
      imageAlt,
      "image": image{
        _type,
        asset,
        "dimensions": asset->metadata.dimensions
      }
    }
  }
`;

export const DEFAULT_ABOUT_TEAM_MEMBERS: AboutTeamMember[] = fallbackAboutTeam.map(
  (member, index) => ({
    ...member,
    sanityKey: `aboutPage.teamMembers.${index}`,
  }),
);

const ABOUT_PAGE_FETCH_TIMEOUT_MS = 5000;

function isNonEmptyString(value?: string | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeAboutTeamMembers(
  source?: AboutPageTeamMemberDocument[] | null,
): AboutTeamMember[] | null {
  if (!Array.isArray(source) || source.length !== DEFAULT_ABOUT_TEAM_MEMBERS.length) {
    return null;
  }

  const normalizedMembers = source.map((member, index) => {
    if (
      !isNonEmptyString(member?.name) ||
      !isNonEmptyString(member?.description) ||
      !isNonEmptyString(member?.image?.asset?._ref)
    ) {
      return null;
    }

    return {
      name: member.name.trim(),
      description: member.description.trim(),
      image: "",
      imageAlt: member?.imageAlt?.trim() ?? "",
      sanityKey: `aboutPage.teamMembers.${index}`,
      sanitySource: member.image,
      width: member.image?.dimensions?.width,
      height: member.image?.dimensions?.height,
    } satisfies AboutTeamMember;
  });

  return normalizedMembers.every(Boolean)
    ? (normalizedMembers as AboutTeamMember[])
    : null;
}

export async function getAboutTeamMembers(): Promise<AboutTeamMember[]> {
  if (!import.meta.env.SANITY_PROJECT_ID) {
    return DEFAULT_ABOUT_TEAM_MEMBERS;
  }

  try {
    const document = await Promise.race([
      sanityClient.fetch<AboutPageDocument | null>(ABOUT_PAGE_QUERY, {
        documentId: "aboutPage",
      }),
      new Promise<null>((_, reject) =>
        setTimeout(
          () => reject(new Error("Timed out fetching aboutPage team members")),
          ABOUT_PAGE_FETCH_TIMEOUT_MS,
        ),
      ),
    ]);
    const teamMembers = normalizeAboutTeamMembers(document?.teamMembers);

    return teamMembers ?? DEFAULT_ABOUT_TEAM_MEMBERS;
  } catch {
    return DEFAULT_ABOUT_TEAM_MEMBERS;
  }
}
