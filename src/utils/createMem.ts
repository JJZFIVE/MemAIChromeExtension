const createMem = async (
  memClient: any,
  tags: string[],
  title: string,
  url: string,
  description: string
) => {
  if (!memClient) {
    throw new Error("No memClient provided");
  }

  let expandedTags = tags.map((tag) => tag.replace(/ /g, "_")).join(" ");
  let tagSentence =
    expandedTags.length > 0 ? `### Tags: ${expandedTags} \n\n` : "";

  let content = `# ${title} \n\n${url} \n\n${tagSentence}${description}`;

  memClient.createMem({
    content: content,
  });
};

export default createMem;
