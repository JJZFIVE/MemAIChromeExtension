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

  let expandedTags = tags.join(" ");

  let content = `# ${title} \n\n##${url} \n\n###Tags: ${expandedTags} \n\n${description}`;

  memClient.createMem({
    content: content,
  });
};

export default createMem;
