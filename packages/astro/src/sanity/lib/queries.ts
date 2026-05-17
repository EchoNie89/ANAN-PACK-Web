export const showcaseGroupsQuery = `
  *[_type == "product" && slug == "labels"][0]{
    showcaseGroups[]{
      title,
      description,
      cards[]{
        title,
        image,
        alt,
        description
      }
    }
  }
`;
